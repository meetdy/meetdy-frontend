import StickerItem from './StickerItem';


function ListSticker({ data = [], onClose = null, onScroll = null }) {
  return (
    <div className="p-4 max-h-96 overflow-y-auto">
      {data.map((ele, index) => (
        <StickerItem
          key={index}
          data={ele}
          onClose={onClose}
          onScroll={onScroll}
        />
      ))}
    </div>
  );
}

export default ListSticker;
