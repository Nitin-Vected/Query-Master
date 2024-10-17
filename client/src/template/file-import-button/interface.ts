export interface FileImportButtonProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}
