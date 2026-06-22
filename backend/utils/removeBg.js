const axios = require('axios');
const FormData = require('form-data');

const removeBackgroundFromUrl = async (imageUrl) => {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey) {
    throw Object.assign(new Error('Background removal is temporarily unavailable. Please try again later.'), { statusCode: 503 });
  }

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: { image_url: imageUrl, size: 'auto' },
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });

    return Buffer.from(response.data);
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status === 402) {
        throw Object.assign(new Error('Background removal is temporarily unavailable. Please try again later.'), { statusCode: 503 });
      }

      if (status === 403) {
        throw Object.assign(new Error('Background removal is temporarily unavailable. Please try again later.'), { statusCode: 503 });
      }

      const errorBody = error.response.data;
      if (errorBody) {
        const errorText = Buffer.isBuffer(errorBody) ? errorBody.toString() : String(errorBody);
        throw Object.assign(new Error(errorText || 'Background removal failed'), { statusCode: status });
      }
    }
    throw Object.assign(new Error('Background removal failed. Please try again.'), { statusCode: 500 });
  }
};

const removeBackgroundFromBuffer = async (buffer, originalFilename) => {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey) {
    throw Object.assign(new Error('Background removal is temporarily unavailable. Please try again later.'), { statusCode: 503 });
  }

  try {
    const form = new FormData();
    form.append('image_file', buffer, originalFilename || 'image.png');
    form.append('size', 'auto');

    const response = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: form,
      headers: {
        'X-Api-Key': apiKey,
        ...form.getHeaders()
      },
      responseType: 'arraybuffer'
    });

    return Buffer.from(response.data);
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 402 || status === 403) {
        throw Object.assign(new Error('Background removal is temporarily unavailable. Please try again later.'), { statusCode: 503 });
      }
      const errorBody = error.response.data;
      if (errorBody) {
        const errorText = Buffer.isBuffer(errorBody) ? errorBody.toString() : String(errorBody);
        throw Object.assign(new Error(errorText || 'Background removal failed'), { statusCode: status });
      }
    }
    throw Object.assign(new Error('Background removal failed. Please try again.'), { statusCode: 500 });
  }
};

module.exports = { removeBackgroundFromUrl, removeBackgroundFromBuffer };
