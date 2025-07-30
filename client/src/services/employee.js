import instance from "../services/axios";

export const fetchEmployees = async () => {
  const res = await instance.get("/employees");
  console.log("Fetched employees:", res.data);
  return res.data;

};

export const deleteEmployee = async (id) => {
  const res = await instance.delete(`/employees/${id}`);
  return res.data;
};

export const updateEmployee = async (id, data) => {
  const res = await instance.patch(`/employees/${id}`, data);
  return res.data;
};