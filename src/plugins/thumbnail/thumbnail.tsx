// from src/admin/components/elements/Thumbnail/index.tsx

import React from 'react';
import { Props as OriginalProps } from 'payload/dist/admin/components/elements/Thumbnail/types';
import FileGraphic from 'payload/dist/admin/components/graphics/File';
import useThumbnail from './useThumbnail';

import './thumbnail.scss';
import { MediaDoc } from '../../types/media';

const baseClass = 'thumbnail';

type Props = OriginalProps & {
  doc: MediaDoc,
}

const Thumbnail: React.FC<Props> = (props) => {
  const {
    doc,
    doc: {
      filename,
    },
    collection,
    size,
  } = props;

  const thumbnail = useThumbnail(collection, doc);

  const classes = [
    baseClass,
    `${baseClass}--size-${size || 'medium'}`,
  ].join(' ');

  let thumbnailComponent;
  if (thumbnail) {
    switch (thumbnail.type) {
      case 'image':
        thumbnailComponent = <img src={thumbnail.src} alt={filename as string}/>
        break;
      case 'video':
        thumbnailComponent = <video src={thumbnail.src} controls/>
        break;
      case 'audio':
        thumbnailComponent = <video src={thumbnail.src} controls poster="/public/icon/audio.svg"/>
        break;
      default:
        break;
    }
  } else {
    thumbnailComponent = <FileGraphic />
  }

  return (
    <div className={classes}>
      {thumbnailComponent}
    </div>
  );
};
export default Thumbnail;
