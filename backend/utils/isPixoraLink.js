/**
 * Checks if a given URL is already a Pixora-hosted universal link
 * by verifying it matches the Cloudinary cloud name + pixora-uploads folder.
 */
const isPixoraLink = (url) => {
  if (!url || typeof url !== 'string') return false;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return false;

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    const isCloudinaryDomain = hostname === 'res.cloudinary.com' || hostname.endsWith('.res.cloudinary.com');

    if (!isCloudinaryDomain) return false;

    const pathContainsCloudName = parsed.pathname.includes(`/${cloudName}/`);
    const pathContainsPixoraFolder = parsed.pathname.includes('/pixora-uploads/');

    return pathContainsCloudName && pathContainsPixoraFolder;
  } catch {
    return false;
  }
};

module.exports = { isPixoraLink };
