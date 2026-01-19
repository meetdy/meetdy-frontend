import FileItem from '@/components/file-item';

function ContentTabPaneFile(props) {
    const { items = [] } = props;

    return (
        <div id="conten-tabpane-file">
            {items.map((itemEle, index) => (
                <FileItem key={index} file={itemEle} inArchived={true} />
            ))}
        </div>
    );
}

export default ContentTabPaneFile;
