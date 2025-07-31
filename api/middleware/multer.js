import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ems-app", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "pdf"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

export default upload;
