import { APIError } from 'payload/errors';
import AWS from 'aws-sdk';

export type FileOptions = {
  bucket: string;
  acl?: 'private' | 'public-read';
}

const options: FileOptions = {
  bucket: null,
  acl: 'private',
}

export const getBucketName = (): string => {
  if (options.bucket === null) {
    throw new APIError("Bucket name has not been initialized. Ensure you're calling `init()` with your S3 credentials and file options before using these hooks.")
  }
  return options.bucket
}

let instance: AWS.S3 = null
export const getCurrentS3Instance = (): AWS.S3 => {
  if (instance === null) {
    throw new APIError("S3 has not been initialized. Ensure you're calling `init()` with your S3 credentials before using these hooks.")
  }
  return instance
}

export function init (s3Configuration: AWS.S3.ClientConfiguration, fileOptions: FileOptions): void {
  instance = new AWS.S3(s3Configuration)
  options.bucket = fileOptions.bucket

  if (fileOptions.acl) {
    options.acl = fileOptions.acl
  }
}