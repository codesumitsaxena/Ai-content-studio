const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const save_base64_image = async (base64_data) => {
  try {
    const matches = base64_data.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image format');
    }

    const image_extension = matches[1];
    const image_buffer = Buffer.from(matches[2], 'base64');
    
    // Generate timestamp-based filename with random suffix
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random_suffix = Math.floor(Math.random() * 1000); // 0-999
    
    const unique_filename = `AI_Image_${day}${month}${year}_${hours}_${minutes}_${seconds}_${random_suffix}.${image_extension}`;
    
    const upload_dir = path.join(process.cwd(), process.env.UPLOAD_DIR);
    
    await fs.mkdir(upload_dir, { recursive: true });
    
    const file_path = path.join(upload_dir, unique_filename);
    await fs.writeFile(file_path, image_buffer);
    
    return {
      image_name: unique_filename,
      image_path: path.join(process.env.UPLOAD_DIR, unique_filename)
    };
  } catch (error) {
    throw new Error(`Failed to save image: ${error.message}`);
  }
};

const delete_image = async (image_path) => {
  try {
    const full_path = path.join(process.cwd(), image_path);
    await fs.unlink(full_path);
  } catch (error) {
    console.error(`Failed to delete image: ${error.message}`);
  }
};

module.exports = { save_base64_image, delete_image };