import sharp from "sharp";

export async function resizeBase64Image(
  base64Image: string,
  width: number = 300,
  height: number = 300,
  quality: number = 50,
): Promise<string> {
  // Convert base64 to buffer

  const pieces = base64Image.split(",");
  const b64Img = pieces[pieces.length - 1] as string;

  const buffer = Buffer.from(b64Img, "base64");

  // Resize the image using sharp
  const resizedBuffer = await sharp(buffer)
    .resize({ width: width, height: height }) // Set your desired dimensions
    .png({ quality: quality })
    .toBuffer();

  console.log(
    `Reduce to size(${width}x${height}) from ${buffer.length} to ${
      resizedBuffer.length
    }:  ${(resizedBuffer.length * 100) / buffer.length}`,
  );

  return resizedBuffer.toString("base64");
}
