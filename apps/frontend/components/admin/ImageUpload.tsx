'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  images: (File | { url: string; id?: number })[];
  onImagesChange: (images: (File | { url: string; id?: number })[]) => void;
  multiple?: boolean;
  maxImages?: number;
  primaryIndex?: number;
  onPrimaryChange?: (index: number) => void;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images = [],
  onImagesChange,
  multiple = true,
  maxImages = 5,
  primaryIndex = 0,
  onPrimaryChange,
  disabled = false,
  label,
  required = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Only image files are allowed';
    }
    // Check file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return 'Image size must be less than 2MB';
    }
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, JPG, GIF, and WEBP formats are allowed';
    }
    return null;
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || disabled) return;

    setError('');
    const newImages = [...images];
    const filesArray = Array.from(files);

    // Check max images limit
    if (newImages.length + filesArray.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate and add files
    for (const file of filesArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      newImages.push(file);
    }

    onImagesChange(newImages);
  }, [images, onImagesChange, maxImages, disabled]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles, disabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);

    // Update primary index if needed
    if (onPrimaryChange && primaryIndex >= newImages.length) {
      onPrimaryChange(Math.max(0, newImages.length - 1));
    } else if (onPrimaryChange && primaryIndex === index) {
      onPrimaryChange(0);
    } else if (onPrimaryChange && primaryIndex > index) {
      onPrimaryChange(primaryIndex - 1);
    }
  };

  const setAsPrimary = (index: number) => {
    if (onPrimaryChange) {
      onPrimaryChange(index);
    }
  };

  const getImageUrl = (image: File | { url: string; id?: number }): string => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image.url;
  };

  const getImageId = (image: File | { url: string; id?: number }): number | undefined => {
    if (typeof image === 'object' && 'id' in image) {
      return image.id;
    }
    return undefined;
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors z-0 ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          className="hidden"
          accept="image/*"
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
        />
        <label
          htmlFor="image-upload"
          className={`flex flex-col items-center justify-center space-y-2 cursor-pointer pointer-events-auto ${
            disabled ? 'pointer-events-none' : ''
          }`}
        >
          {disabled ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Click to upload</span> or drag
                and drop
              </div>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF, WEBP up to 2MB each (max {maxImages} images)
              </p>
            </>
          )}
        </label>
      </div>

      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-0">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              <Image
                src={getImageUrl(image)}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              {!disabled && (
                <>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {multiple && onPrimaryChange && (
                    <button
                      type="button"
                      onClick={() => setAsPrimary(index)}
                      className={`absolute bottom-2 left-2 right-2 py-1 px-2 rounded text-xs font-medium transition-colors ${
                        primaryIndex === index
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background/80 text-foreground hover:bg-background'
                      }`}
                    >
                      {primaryIndex === index ? '★ Primary' : 'Set as Primary'}
                    </button>
                  )}
                </>
              )}
              {primaryIndex === index && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && required && (
        <p className="text-sm text-destructive">At least one image is required</p>
      )}
    </div>
  );
};

export default ImageUpload;
