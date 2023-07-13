/* Magic for the vbmeta image header. */
const AVB_MAGIC = 'AVB0';
const AVB_MAGIC_LEN = 4;

/* Information about the verification flags */
const FLAGS_OFFSET = 123;
const FLAG_DISABLE_VERITY = 0x01;
const FLAG_DISABLE_VERIFICATION = 0x02;

async function disableVerifyVbmeta(file) {
  const fileData = await readFileAsync(file);
  let magic = new TextDecoder().decode(fileData.slice(0, AVB_MAGIC_LEN));
  console.log(magic);
  if (magic !== AVB_MAGIC) {
    throw new Error('Error: The provided image is not a valid vbmeta image.');
  }

  const dataView = new DataView(fileData.buffer);
  const flagsOffset = FLAGS_OFFSET;
  let flags = dataView.getUint8(flagsOffset);
  flags |= FLAG_DISABLE_VERITY | FLAG_DISABLE_VERIFICATION;
  dataView.setUint8(flagsOffset, flags);

  const patchedFile = new File([fileData], file.name, { type: file.type });
  return patchedFile;
}

async function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

export default disableVerifyVbmeta;