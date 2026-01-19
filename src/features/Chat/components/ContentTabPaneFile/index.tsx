import FileItem from '@/components/file-item';
import PropTypes from 'prop-types';
import React from 'react';

ContentTabPaneFile.propTypes = {
  items: PropTypes.array,
};

ContentTabPaneFile.defaultProps = {
  items: [],
};

function ContentTabPaneFile(props) {
  const { items } = props;

  return (
    <div id="conten-tabpane-file">
      {items.map((itemEle, index) => (
        <FileItem key={index} file={itemEle} inArchive={true} />
      ))}
    </div>
  );
}

export default ContentTabPaneFile;
