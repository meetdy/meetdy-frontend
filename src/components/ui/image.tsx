import { useState, useMemo } from 'react';

const fallbackStyles = [
  // 1. Glass card
  'bg-white/10 backdrop-blur-xl shadow-lg',

  // 2. Neon gradient
  'bg-gradient-to-br from-pink-500/40 to-purple-600/40 shadow-[0_0_30px_10px_rgba(255,0,150,0.3)]',

  // 3. Soft gradient
  'bg-gradient-to-br from-blue-300/40 to-teal-300/40',

  // 4. Dark glass
  'bg-black/20 backdrop-blur-2xl shadow-xl',

  // 5. Blob-like glow
  'bg-purple-400/40 blur-sm shadow-[0_0_50px_20px_rgba(150,100,255,0.25)]',
];

export default function Image({
  src,
  alt = '',
  className = '',
  fallbackClassName = '',
  ...props
}) {
  const [hasError, setHasError] = useState(false);

  // random style mỗi lần mount
  const randomStyle = useMemo(() => {
    const index = Math.floor(Math.random() * fallbackStyles.length);
    return fallbackStyles[index];
  }, []);

  const isValidSrc = typeof src === 'string' && src.trim() !== '';

  if (!isValidSrc || hasError) {
    return (
      <div
        className={`flex items-center justify-center text-white text-sm font-medium ${randomStyle} ${fallbackClassName} ${className}`}
        {...props}
      >
        No Image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
