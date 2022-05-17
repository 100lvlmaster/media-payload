// from src/admin/components/elements/FileDetails/Meta/index.tsx

import React from 'react';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import CopyToClipboard from 'payload/dist/admin/components/elements/CopyToClipboard';
import formatFilesize from 'payload/dist/uploads/formatFilesize';
import { Props as OriginalProps } from 'payload/dist/admin/components/elements/FileDetails/Meta/types';

import 'payload/dist/admin/components/elements/FileDetails/Meta/index.scss';

type Props = OriginalProps & {
  fileURL?: string;
}

const baseClass = 'file-meta';

const Meta: React.FC<Props> = (props) => {
  const { filename, filesize, width, height, mimeType, staticURL, url } = props;

  const { serverURL } = useConfig();

  const fileURL = props.fileURL || `${serverURL}${staticURL}/${filename}`;
  return (
    <div className={baseClass}>
      <div className={`${baseClass}__url`}>
        <a
          href={fileURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {filename}
        </a>
        <CopyToClipboard
          value={fileURL}
          defaultMessage="Copy URL"
        />
      </div>
      <div className={`${baseClass}__size-type`}>
        {formatFilesize(filesize)}
        {(width && height) && (
          <React.Fragment>
            &nbsp;-&nbsp;
            {width}
            x
            {height}
          </React.Fragment>
        )}
        {mimeType && (
          <React.Fragment>
            &nbsp;-&nbsp;
            {mimeType}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Meta;
