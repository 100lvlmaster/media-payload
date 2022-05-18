import { UploadedFile } from 'express-fileupload';
import { PayloadRequest } from 'payload/dist/express/types';
import sharp, { Sharp, OutputInfo } from 'sharp';
import { getBucketName, getCurrentS3Instance } from '../s3-instance';
import { MediaDoc } from '../../../types';
import { isAudio, isImage, isVideo } from '../../../utils';
import { encode } from 'blurhash';
import mongoose from 'mongoose';
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';
import { Readable } from 'stream';
// const FFPROBE_PATH = require('ffmpeg-static').path;
const ffmpegPath = process.env.FFMPEG_PATH || require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const FFPROBE_PATH =
  process.env.FFPROBE_PATH || require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfprobePath(FFPROBE_PATH);

interface PayloadRequestWithFiles extends PayloadRequest {
  files: {
    // file: UploadedFile[] | UploadedFile;
    file: UploadedFile;
  };
}

function isUploadedFile(object: unknown): object is UploadedFile {
  if (typeof object === 'object') {
    return 'data' in object;
  }

  return false;
}

const createStream = (body: Buffer): Readable => {
  const stream = new Readable();
  stream._read = () => {};
  stream.push(body);
  stream.push(null);
  return stream;
};

const getMetaData = async (body: Buffer): Promise<FfprobeData> => {
  const stream = createStream(body);
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(stream as any as string, (err, meta) => {
      if (err) {
        reject(err);
      } else {
        resolve(meta);
      }
    });
  });
};

type Size = { width: number; height: number; key: string };
type ComposeFileName = (args: {
  filename: string;
  id: string;
  size?: Size;
  extension?: string;
}) => string;
const composeFileName: ComposeFileName = ({
  filename,
  id,
  size,
  extension,
}) => {
  const parts = filename.split('.');
  if (extension) {
    parts[parts.length - 1] = extension;
  }
  parts.splice(-1, 0, id);
  if (size) {
    parts.splice(-1, 0, size.key, `${size.width}x${size.height}`);
  }
  return parts.join('.');
};

const getName = (filename: string): string => {
  const parts = filename.split('.');
  parts.splice(-1, 1);
  return parts.join('.');
};

type UploadToS3 = (args: {
  body: Buffer;
  filename: string;
  mimeType: string;
}) => Promise<void>;
const uploadToS3: UploadToS3 = async ({
  body: Body,
  filename: Key,
  mimeType: ContentType,
}) => {
  const s3 = getCurrentS3Instance();
  const Bucket = getBucketName();
  await s3
    .putObject({ Bucket, Key, Body, ACL: 'public-read', ContentType })
    .promise();
};

type ProcessImage = (args: {
  data: MediaDoc;
  body: Buffer;
  mimeType: string;
}) => Promise<void>;
const processImage: ProcessImage = async ({ data, body, mimeType }) => {
  const sharpData = sharp(body);
  const { _id: id, filename } = data as any;
  const { height, width } = await sharpData.metadata();
  data.blurHash = await encodeImageToBlurhash(sharpData);

  if (data.sizes) {
    for (const key in data.sizes) {
      const sizeData = data.sizes[key];
      sizeData.mimeType = mimeType;
      const { width, height, crop } = sizeData;
      const resizedSharpData = await sharpData.resize(width, height, {
        fit: 'inside' /*position: crop || 'centre'*/,
      });
      let extension: string;
      let result: { data: Buffer; info: OutputInfo };

      if (key === 'thumbnail') {
        extension = 'webp';
        result = await resizedSharpData
          .webp({ quality: 95 })
          .toBuffer({ resolveWithObject: true });
        sizeData.mimeType = 'image/webp';
      } else {
        result = await resizedSharpData.toBuffer({ resolveWithObject: true });
      }

      const sizeBody = result.data;
      sizeData.filesize = result.info.size;

      const sizeMimetype = sizeData.mimeType;
      sizeData.filename = composeFileName({
        filename,
        id,
        size: { width, height, key },
        extension,
      });

      await uploadToS3({
        filename: sizeData.filename,
        body: sizeBody,
        mimeType: sizeMimetype,
      });
    }
  }
};

const processVideo = async ({ data, body, mimeType }): Promise<void> => {
  const videoParams = await getMetaData(body);
  const videoStream = videoParams.streams.find((s) => s.codec_type === 'video');
  if (videoStream) {
    data.height = videoStream.height;
    data.width = videoStream.width;
    const duration = parseFloat(videoStream.duration);
    data.duration = isNaN(duration) ? 0 : Math.floor(duration);
  }
};

const processAudio = async (data: MediaDoc, body: Buffer): Promise<void> => {
  const audioParams = await getMetaData(body);
  const audioStream = audioParams.streams.find((s) => s.codec_type === 'audio');
  if (audioStream) {
    data.duration = Math.floor(+audioStream.duration);
  }
};

const encodeImageToBlurhash = (sharpData: Sharp): Promise<string> =>
  new Promise((resolve, reject) => {
    sharpData
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: 'inside' })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });

type CollectionBeforeChangeHookWithFiles = (args: {
  data: MediaDoc;
  req: PayloadRequestWithFiles;
  operation: 'create' | 'update';
  originalDoc?: any;
}) => any;
const beforeChangeUploadToS3: CollectionBeforeChangeHookWithFiles = async ({
  data,
  req,
}) => {
  if (req.files.file) {
    const id = new mongoose.Types.ObjectId().toHexString();
    const uploadedFile: UploadedFile = isUploadedFile(req.files.file)
      ? req.files.file
      : req.files.file[0];
    const { data: body, mimetype: mimeType } = uploadedFile;
    const s3 = getCurrentS3Instance();
    const bucket = getBucketName();
    const { region } = s3.config;

    (data as any)._id = id;
    data.s3 = {
      ...data.s3,
      bucket,
      region,
    };

    if (isImage(mimeType)) {
      await processImage({
        data,
        body,
        mimeType,
      });
    }

    if (isVideo(mimeType)) {
      await processVideo({ data, body, mimeType });
    }

    if (isAudio(mimeType)) {
      await processAudio(data, body);
    }

    const { filename } = data;
    data.name = getName(filename);
    data.filename = composeFileName({ filename, id });
    await uploadToS3({
      filename: data.filename,
      body,
      mimeType: mimeType,
    });
  }
  delete data.dimensions;
  return data;
};

export default beforeChangeUploadToS3;
