// @ts-nocheck
import React from 'react';

const ImageDisplayInline = ({ block, isSelected, onClick }) => {
  const { imageUrl = "", imageAlt = "Image" } = block?.properties || {};
  
  return (
    <div className={isSelected ? 'ring-2 ring-primary' : ''} onClick={onClick}>
      {imageUrl ? (
        <img src={imageUrl} alt={imageAlt} className="w-full rounded" />
      ) : (
        <div className="w-full h-32 bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center">
          <span className="text-gray-500">Click to add image</span>
        </div>
      )}
    </div>
  );
};

export default ImageDisplayInline;