// from src/admin/components/elements/FileDetails/index.tsx

import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import Thumbnail from 'payload/dist/admin/components/elements/Thumbnail';
import Button from 'payload/dist/admin/components/elements/Button';
import Meta from './meta';
import { Props as OriginalProps } from 'payload/dist/admin/components/elements/FileDetails/types';

import Chevron from 'payload/dist/admin/components/icons/Chevron';

import 'payload/dist/admin/components/elements/FileDetails/index.scss';
import { MediaDoc } from '../../types';

const baseClass = 'file-details';

type Props = OriginalProps & {
  doc: MediaDoc;
};

const FileDetails: React.FC<Props> = (props) => {
  const { doc, collection, handleRemove } = props;

  const {
    upload: { staticURL },
  } = collection;

  const { filename, filesize, width, height, mimeType, sizes } = doc;

  const [moreInfoOpen, setMoreInfoOpen] = useState(false);

  const hasSizes = sizes && Object.keys(sizes)?.length > 0;

  return (
    <div className={baseClass}>
      <header>
        <Thumbnail doc={doc} collection={collection} />
        <div className={`${baseClass}__main-detail`}>
          <Meta
            staticURL={staticURL}
            filename={filename as string}
            filesize={filesize as number}
            fileURL={props.doc.s3.url}
            width={width as number}
            height={height as number}
            mimeType={mimeType as string}
          />
          {hasSizes && (
            <Button
              className={`${baseClass}__toggle-more-info${
                moreInfoOpen ? ' open' : ''
              }`}
              buttonStyle="none"
              onClick={() => setMoreInfoOpen(!moreInfoOpen)}
            >
              {!moreInfoOpen && (
                <React.Fragment>
                  More info
                  <Chevron />
                </React.Fragment>
              )}
              {moreInfoOpen && (
                <React.Fragment>
                  Less info
                  <Chevron />
                </React.Fragment>
              )}
            </Button>
          )}
        </div>
        {handleRemove && (
          <Button
            icon="x"
            round
            buttonStyle="icon-label"
            iconStyle="with-border"
            onClick={handleRemove}
            className={`${baseClass}__remove`}
          />
        )}
      </header>
      {hasSizes && (
        <AnimateHeight
          className={`${baseClass}__more-info`}
          height={moreInfoOpen ? 'auto' : 0}
        >
          <ul className={`${baseClass}__sizes`}>
            {Object.entries(sizes).map(([key, val]) => (
              <li key={key}>
                <div className={`${baseClass}__size-label`}>{key}</div>
                <Meta
                  {...val}
                  fileURL={val.s3.url}
                  mimeType={val.mimeType} // modified
                  staticURL={staticURL}
                />
              </li>
            ))}
          </ul>
        </AnimateHeight>
      )}
    </div>
  );
};

export default FileDetails;
