const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PIXORA_FOLDER = 'pixora-uploads';

const uploadToCloudinary = async (filePathOrBuffer, options = {}) => {
  const uploadOptions = {
    folder: PIXORA_FOLDER,
    resource_type: 'image',
    ...options
  };
  const result = await cloudinary.uploader.upload(filePathOrBuffer, uploadOptions);
  return result;
};

const uploadBufferToCloudinary = async (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: PIXORA_FOLDER,
        resource_type: 'image',
        ...options
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const getCloudinaryConfig = () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  folder: PIXORA_FOLDER
});

module.exports = { cloudinary, uploadToCloudinary, uploadBufferToCloudinary, getCloudinaryConfig, PIXORA_FOLDER };
