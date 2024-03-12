const en = require('../../locale/en');
const FileUploadException = require('../errors/file-upload-exception');
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const config = require('config');
const cloudinaryConfig = config.get('cloudinary');
const ONE_MB = 2 * 1024 * 1024;

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
});

class FileService {
  async UploadFile(req, business) {
    const form = formidable({
      maxFiles: 1,
      maxFileSize: ONE_MB,
      maxFields: 1,
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        try {
          if (err) {
            console.log(err);
            throw err;
          }

          const isAccepted = await this.AcceptedFile(files);
          if (isAccepted) {
            const resourceType = 'image';
            const result = await cloudinary.uploader.upload(
              files.file.filepath,
              {
                folder: `Kota/${business}`,
                resource_type: resourceType,
                chunk_size: 6000000,
              },
            );
            return resolve(result);
          }

          throw new Error(en['file-not-supported']);
        } catch (error) {
          reject(new FileUploadException([error]));
        }
      });
    });
  }

  async AcceptedFile(files) {
    const { mimetype } = files.file;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return allowedTypes.includes(mimetype);
  }
}

module.exports = { FileService };
