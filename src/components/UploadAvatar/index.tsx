import React, { JSX, useEffect, useState } from 'react';
import { Camera } from 'lucide-react';

type Props = {
  avatar?: string;
  getFile?: (file: File) => void;
  isClear?: boolean;
};

export default function UploadAvatar({
  avatar = '',
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
    if (fileImage && fileImage.type.match('image.*')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(String(reader.result || ''));
      };
      reader.readAsDataURL(fileImage);
      if (getFile) getFile(fileImage);
    }
  };

  return (
    <div className="upload-avatar">
      <div className="relative inline-flex items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
          {avatar || imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagePreview || avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm text-neutral-500">Chọn hình ảnh</span>
          )}
        </div>

        <label
          htmlFor="upload-photo_custom"
          className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-sm border cursor-pointer"
        >
          <Camera className="w-4 h-4 text-gray-700" />
        </label>

        <input
          id="upload-photo_custom"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleOnChange}
        />
      </div>
    </div>
  );
}
