import instance from "./axios";

export const fetchDepartments = async () => {
  const res = await instance.get("/departments");
  return res.data;
};

export const createDepartment = async (data) => {
  const res = await instance.post("/departments/create", data);
  return res.data;
};

export const deleteDepartment = async (id) => {
  const res = await instance.delete(`/departments/${id}`);
  return res.data;
};


export const updateDepartment = async (id, data) => {
  const res = await instance.patch(`/departments/${id}`, data);
  return res.data;
}