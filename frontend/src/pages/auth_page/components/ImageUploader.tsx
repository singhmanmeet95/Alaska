import { useDropzone } from "react-dropzone";

type ImageUploaderProps = {
  imageUrl?: string;
  onImageUpload: (file: File) => Promise<void>;
  className?: string;
};

export default function ImageUploader({
  imageUrl,
  onImageUpload,
  className = "",
}: ImageUploaderProps) {
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      await onImageUpload(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div
      className={`border-2 border-dashed border-gray-400 p-4 rounded-xl text-center flex items-center justify-center ${className}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {imageUrl ? (
        <p className="text-xs xl:text-sm font-medium text-gray-400">Done</p>
      ) : (
        <p className="text-[10px] lg:text-xs xl:text-sm">
          please select a profile image
        </p>
      )}
    </div>
  );
}
