export const getPublicIdFromUrl = (url: string) => {
  const parts = url.split('/');
  const fileWithFolder = parts.slice(-2).join('/');
  const [publicId] = fileWithFolder.split('.');
  return publicId;
};
