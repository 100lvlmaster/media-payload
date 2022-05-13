import { AfterReadHook } from 'payload/dist/collections/config/types';
import { MediaDoc } from '../../../types';
import { isImage } from '../../../utils';

const cdnUrl = process.env.MEDIA_CDN_URL;

const composeUrl = (doc: MediaDoc, filename: string): string => {
  if (cdnUrl) {
    return `${cdnUrl}/${filename}`;
  } else {
    return `https://${doc.s3.bucket}.${doc.s3.region}.digitaloceanspaces.com/${filename}`;
  }
};

const composeS3Urls: AfterReadHook = ({ doc }: { doc: MediaDoc }): MediaDoc => {
  if (doc.s3) {
    doc.s3.url = composeUrl(doc, doc.filename);
    for (const sizeName in doc.sizes) {
      const size = doc.sizes[sizeName];
      size.s3 = {
        ...doc.s3,
        url: composeUrl(doc, size.filename),
      };
    }
  }
  doc.dimensions =
    doc.width && doc.height ? `${doc.width}x${doc.height}` : undefined;
  if (!isImage(doc.mimeType)) {
    delete doc.sizes;
  }
  return doc;
};

export default composeS3Urls;
