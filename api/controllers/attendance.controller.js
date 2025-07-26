import Attendance from "../models/attendance.model.js";
import moment from "moment";

// 1. Clock In
export const clockIn = async (req, res) => {
  const { employeeId } = req.body;
  const today = moment().startOf("day").toDate();

  const existing = await Attendance.findOne({
    employeeId,
    date: { $gte: today },
  });

  if (existing)
    return res.status(400).json({ message: "Already clocked in today." });

  const attendance = await Attendance.create({
    employeeId,
    date: new Date(),
    clockIn: new Date(),
  });
  res.status(201).json(attendance);
};

// 2. Clock Out
export const clockOut = async (req, res) => {
  const { employeeId } = req.body;
  const today = moment().startOf("day").toDate();

  const attendance = await Attendance.findOne({
    employeeId,
    date: { $gte: today },
  });

  if (!attendance)
    return res.status(404).json({ message: "No clock-in found for today." });

  attendance.clockOut = new Date();
  await attendance.save();

  res.json(attendance);
};

// 3. Attendance by date (e.g. ?date=YYYY-MM-DD)
export const getAttendanceByDate = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  const start = moment(date).startOf("day").toDate();
  const end = moment(date).endOf("day").toDate();

  const records = await Attendance.find({
    employeeId: id,
    date: { $gte: start, $lte: end },
  });

  res.json(records);
};

// 4. Calendar View
export const getCalendarView = async (req, res) => {
  const { id } = req.params;
  const records = await Attendance.find({ employeeId: id }).sort({ date: 1 });
  res.json(records);
};

// 5. Filter by admin (e.g. date/role/type)
export const filterAttendance = async (req, res) => {
  const { date, role, type } = req.query;

  let filter = {};

  if (date) {
    const start = moment(date).startOf("day").toDate();
    const end = moment(date).endOf("day").toDate();
    filter.date = { $gte: start, $lte: end };
  }

  if (role) filter.role = role;
  if (type) filter.workType = type;

  const records = await Attendance.find(filter).populate("employeeId");
  res.json(records);
};
export const markAttendance = async (req, res) => {
  const attendance = await Attendance.create(req.body);
  res.status(201).json(attendance);
};

export const getEmployeeAttendance = async (req, res) => {
  const attendance = await Attendance.find({ employeeId: req.params.id });
  res.json(attendance);
};

export const getAllAttendance = async (req, res) => {
  const records = await Attendance.find().populate("employeeId");
  res.json(records);
};
