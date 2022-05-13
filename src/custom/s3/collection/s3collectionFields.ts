import { Field } from 'payload/types';
import { MediaDoc } from '../../../types';
import { isAudio, isVideo } from '../../../utils';

export const s3collectionFields: Field[] = [
  {
    name: 'name',
    type: 'text',
    admin: {
      condition: (data: MediaDoc) => !!data?.s3?.url,
    },
    required: true,
  },
  {
    label: 'MIME Type',
    name: 'mimeType',
    type: 'text',
    admin: {
      //   hidden: true,
      readOnly: true,
      disabled: true,
    },
  },
  // Format-specific
  {
    name: 'waveformData',
    type: 'array',
    hidden: true, // TODO hide until implemented
    fields: [
      {
        name: 'point',
        type: 'number',
      },
    ],
  },
  {
    name: 'duration',
    type: 'number',
    admin: {
      readOnly: true,
      condition: (data) => {
        const mimeType = data?.mimeType as string;
        if (mimeType && (isVideo(mimeType) || isAudio(mimeType))) {
          return true;
        }
      },
    },
  },
  {
    // Exclusive to images
    name: 'blurHash',
    type: 'text',
    admin: {
      readOnly: true,
      hidden: true,
      // condition: (data) => {
      //   const mimeType = data?.mimeType as String;
      //   if (mimeType && mimeType.startsWith('image/')) {
      //     return true;
      //   }
      // }
    },
  },
  {
    name: 's3',
    type: 'group',
    admin: {
      readOnly: true,
      hidden: true,
    },
    defaultValue: {
      bucket: '',
      region: '',
    },
    fields: [
      {
        name: 'bucket',
        type: 'text',
      },
      {
        name: 'region',
        type: 'text',
      },
      {
        name: 'url',
        type: 'text',
        hooks: {
          beforeChange: [(): undefined => undefined],
        },
      },
    ],
  },
  {
    name: 'dimensions',
    type: 'text',
    admin: {
      readOnly: true,
      position: 'sidebar',
      condition: (data: MediaDoc) => !!data?.dimensions,
    },
  },
];
