import React from 'react';
import PropTypes from 'prop-types';

import { FileIcon, defaultStyles } from 'react-file-icon';
import fileHelpers from '@/utils/fileHelpers';
import { Download, Share2 } from 'lucide-react';

FileItem.propTypes = {
  file: PropTypes.object.isRequired,
  inArchive: PropTypes.bool,
};

FileItem.defaultProps = {
  inArchive: false,
};

function FileItem({ file, inArchive }) {
  const handleOnClickDownLoad = () => {
    window.open(file.content, '_blank');
  };

  const handleOnClickShare = () => {};

  const fileName = fileHelpers.getFileName(file.content);
  const fileExtension = fileHelpers.getFileExtension(fileName);

  return (
    <div
      className="item-file"
    >
      <div className="item-file--icon">
        <FileIcon extension={fileExtension} {...defaultStyles[fileExtension]} />
      </div>

      <div className="item-file--name">{fileName}</div>

      <div className="item-file--interact">
        <div
          className="item-file_button item-file_button--mg-right"
          onClick={handleOnClickShare}
        >
          <Share2 className="w-4 h-4" />
        </div>

        <div className="item-file_button" onClick={handleOnClickDownLoad}>
          <Download className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

export default FileItem;
