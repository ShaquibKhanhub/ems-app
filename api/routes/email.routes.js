import express from "express";
import {
  sendToSingle,
  sendToAllEmployees,
} from "../controllers/email.controller.js";

const router = express.Router();

router.post("/send-one", sendToSingle);
router.post("/send-all", sendToAllEmployees);

export default router;
