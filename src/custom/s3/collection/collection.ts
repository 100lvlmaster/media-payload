import AWS from 'aws-sdk';
import { CollectionConfig } from 'payload/types';
import beforeChangeUploadToS3 from '../hooks/upload-to-s3';
import { FileOptions, init } from '../s3-instance';
import deleteFromS3 from '../hooks/delete-from-s3';
import { IncomingUploadType } from 'payload/dist/uploads/types';
import { MediaDoc } from '../../../types';
import composeS3Urls from '../hooks/compose-s3-urls';
import { s3collectionFields } from '.';

export function collectionWithS3Storage(
  s3Configuration: AWS.S3.ClientConfiguration,
  fileOptions: FileOptions,
  collection: CollectionConfig
): CollectionConfig {
  init(s3Configuration, fileOptions);

  collection.admin = {
    ...collection.admin,
    useAsTitle: 'name',
  };

  collection.upload = {
    ...(collection.upload as IncomingUploadType),
    adminThumbnail: ({ doc }: { doc: MediaDoc }) => {
      return doc?.sizes?.thumbnail?.s3?.url || doc?.s3?.url;
    },
    // TODO using this gives errors in console when viewing media item
    staticDir: '../tmp_s3_media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 180,
        height: 180,
      },
    ],
    disableLocalStorage: true,
  };

  collection.fields = [...s3collectionFields, ...collection.fields];

  const {
    beforeOperation = [],
    beforeChange = [],
    // afterChange = [],
    afterDelete = [],
    afterRead = [],
    ...rest
  } = collection.hooks || {};

  collection.hooks = {
    beforeOperation: [
      ({ args, operation }) => {
        if (operation === 'read' && !args.id) {
          //   args.limit = 30;
        }
        return args;
      },
      ...beforeOperation,
    ],
    beforeChange: [beforeChangeUploadToS3, ...beforeChange],
    // afterChange: [
    //   ...afterChange,
    // ],
    afterDelete: [deleteFromS3, ...afterDelete],
    afterRead: [composeS3Urls, ...afterRead],
    ...rest,
  };

  return collection;
}
