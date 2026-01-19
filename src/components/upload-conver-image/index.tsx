import React, { JSX, useEffect, useState } from 'react';
import { Edit3 } from 'lucide-react';

type Props = {
  coverImg?: string;
  getFile?: (file: File) => void;
  isClear?: boolean;
};

export default function UploadCoverImage({
  coverImg = '',
  getFile,
  isClear = false,
}: Props): JSX.Element {
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (isClear) {
      setImagePreview('');
    }
  }, [isClear]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileImage = files[0];
    if (!fileImage.type.match('image.*')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(String(reader.result || ''));
    };
    reader.readAsDataURL(fileImage);
    if (getFile) getFile(fileImage);
  };

  return (
    <div className="w-full">
      <div className="relative rounded-md overflow-hidden bg-neutral-100 h-56 flex items-center justify-center">
        {coverImg || imagePreview ? (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            src={imagePreview || coverImg}
            alt="cover image"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm text-neutral-500">Chọn hình ảnh</span>
        )}

        <div className="absolute right-3 bottom-3">
          <label
            htmlFor="upload-cover_custom"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-md shadow-sm cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-gray-700" />
            <span className="text-sm text-gray-700">Chọn</span>
          </label>
        </div>
      </div>

      <input
        id="upload-cover_custom"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleOnChange}
      />
    </div>
  );
}
