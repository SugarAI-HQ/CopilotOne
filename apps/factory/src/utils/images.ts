export interface FileObject {
  base64: string;
  fileList:
    | FileList
    | {
        name: string;
        size: number;
        type: string;
      }[]
    | null;
}

export async function url2ImageBase64Url(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const base64String = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    const fileObject: FileObject = {
      base64: base64String,
      fileList: [
        {
          name: imageUrl.substring(imageUrl.lastIndexOf("/") + 1),
          size: blob.size,
          type: blob.type,
        },
      ],
    };
    return fileObject;
  } catch (error) {
    console.error("Error fetching or converting image to base64:", error);
  }
}
