import { FileData, FileSize } from "payload/dist/uploads/types";

type S3Data = {
  bucket: string;
  region: string;
  url: string;
}

type MediaCommon = {
  s3: S3Data;
}

export type MediaResized = FileSize & MediaCommon;

export type MediaDoc = FileData & MediaCommon & {
  id: string;
  name: string;
  sizes: {
    [sizeName: string]: MediaResized,
  };
  createdAt: string;
  duration: number;
  blurHash: string;
  dimensions: string;
}

