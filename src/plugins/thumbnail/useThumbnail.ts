// from src/admin/hooks/useThumbnail.ts

import { useConfig } from '@payloadcms/config-provider';
import { CollectionConfig } from 'payload/dist/collections/config/types';
import isImage from 'payload/dist/uploads/isImage';
import { IncomingUploadType } from 'payload/dist/uploads/types';
import {isAudio, isVideo} from '../../utils';

const absoluteURLPattern = new RegExp('^(?:[a-z]+:)?//', 'i');

type MediaType = 'image' | 'video' | 'audio';

type UseThumbnail = (
  collection: CollectionConfig,
  doc: {
    mimeType: string;
    filename: string;
    sizes: unknown;
  }
) => false | {
  src: string;
  type: MediaType;
}

const useThumbnail: UseThumbnail = (collection, doc) => {
  const {
    upload: {
      staticURL,
      adminThumbnail,
    },
  } = collection as { upload: IncomingUploadType };

  const {
    mimeType,
    sizes,
    filename,
  } = doc;

  const { serverURL } = useConfig();

  let type: MediaType;
  if (isImage(mimeType)) {
    type = 'image';
  } else if (isVideo(mimeType)) {
    type = 'video';
  } else if (isAudio(mimeType)) {
    type = 'audio';
  }

  if (type) {
    if (typeof adminThumbnail === 'function') {
      const thumbnailURL = adminThumbnail({ doc });

      if (absoluteURLPattern.test(thumbnailURL)) {
        return {src: thumbnailURL, type};
      }

      return {src: `${serverURL}${thumbnailURL}`, type};
    }

    if (sizes?.[adminThumbnail]?.filename) {
      return {src: `${serverURL}${staticURL}/${sizes[adminThumbnail].filename}`, type};
    }

    return {src: `${serverURL}${staticURL}/${filename}`, type};
  }

  return false;
};

export default useThumbnail;
