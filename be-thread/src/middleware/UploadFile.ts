import { NextFunction, Request, Response } from "express";
import * as multer from "multer";

export default new (class UploadFile {
  upload(fieldName: string) {
    // buffer file
    const storage = multer.diskStorage({
      destination(req, file, cb) {
        cb(null, "src/uploads");
      },
      filename(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".png");
      },
    });

    // save to uploads folder
    const uploadfile = multer({
      storage,
    });

    return (req: Request, res: Response, next: NextFunction) => {
      uploadfile.single(fieldName)(req, res, (err: any) => {
        if (req.file || req.files) {
          if (err)
            return res.status(400).json({
              message: err.message,
            });

          res.locals.filename = req.file.filename;
        }
        next();
      });
    };
  }
})();
