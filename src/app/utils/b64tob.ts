// convert base64 to Blob
export const b64tob = (dBase64: string, mimetype = "", sliceSize = 1024) => {
  const parts = [];
  for (
    let offset = 0, bytesStr = atob(dBase64), len = bytesStr.length;
    offset < len;
    offset += sliceSize
  ) {
    const end = Math.min(offset + sliceSize, len);
    const chunk = new Uint8Array(end - offset);
    for (let i = offset, j = 0; i < end; i++, j++) {
      chunk[j] = bytesStr.charCodeAt(i) & 0xff;
    }
    parts.push(chunk);
  }

  return new Blob(parts, { type: mimetype });
};
// @@usage
// // Convert base64 string to a Blob
// const pdfBlob = b64tob(base64PDF, "application/pdf");
// // Create a URL for the Blob
// const pdfUrl = URL.createObjectURL(pdfBlob);
