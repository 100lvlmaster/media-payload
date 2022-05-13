/* eslint-disable jsx-a11y/click-events-have-key-events */

// from payload/dist/admin/components/elements/UploadCard/index.tsx

import React from 'react';
import { Props } from 'payload/dist/admin/components/elements/UploadCard/types';
import Thumbnail from 'payload/dist/admin/components/elements/Thumbnail';

import 'payload/dist/admin/components/elements/UploadCard/index.scss';

const baseClass = 'upload-card';

const UploadCard: React.FC<Props> = (props) => {
  const {
    onClick,
    doc,
    collection,
  } = props;

  const classes = [
    baseClass,
    typeof onClick === 'function' && `${baseClass}--has-on-click`,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={typeof onClick === 'function' ? onClick : undefined}
    >
      <Thumbnail
        size="expand"
        doc={doc}
        collection={collection}
      />
      <div className={`${baseClass}__filename`}>
        {doc?.name || doc?.filename /* modified */}
      </div>
    </div>
  );
};

export default UploadCard;
