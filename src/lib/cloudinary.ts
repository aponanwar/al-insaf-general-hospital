import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export { cloudinary };

/**
 * Upload an image buffer or base64 string to Cloudinary
 */
export async function uploadToCloudinary(
  fileBase64OrUrl: string,
  folder = 'hospital/doctors'
): Promise<{ url: string; publicId: string }> {
  // If Cloudinary credentials are missing, return the provided URL directly
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name') {
    return {
      url: fileBase64OrUrl,
      publicId: `sample_${Date.now()}`,
    };
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileBase64OrUrl, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload image to Cloudinary.');
  }
}

/**
 * Delete an image from Cloudinary by public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || publicId.startsWith('sample_')) {
    return true;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    return false;
  }
}
