import { checkUserRoles } from './../utils/access';
import AWS from 'aws-sdk';
import { CollectionConfig } from 'payload/types';
import { collectionWithS3Storage } from '../custom/s3/collection';

export type SizeDetails = {
  filename: string;
  width: number;
  height: number;
};

export type Type = {
  filename: string;
  alt: string;
  mimeType: string;
  sizes: {
    thumbnail?: SizeDetails;
  };
};

const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: (): boolean => true,
    delete: () => true,
    // Everyone can read Media
  },
  admin: {
    useAsTitle: 'filename',
  },
  upload: {
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 256,
        height: 256,
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: true,
    },
  ],
};

export default collectionWithS3Storage(
  {
    endpoint: new AWS.Endpoint(
      `${process.env.SPACES_REGION}.digitaloceanspaces.com`
    ),
    region: process.env.SPACES_REGION,
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
  {
    bucket: process.env.SPACES_BUCKET,
  },
  Media
);
