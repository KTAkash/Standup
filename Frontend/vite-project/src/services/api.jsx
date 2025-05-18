import axios from "axios";

const API_BASE_URL = "http://localhost:8000/su"; // Change this for deployment

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set JWT token in header
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// =========================
// Authentication APIs
// =========================
export const login = (credentials) => api.post("/login", credentials);
export const register = (userData) => api.post("/register", userData);
export const createAdmin = (adminData) => api.post("/create-admin", adminData);

// =========================
// Student APIs
// =========================
export const getAllStudents = () => api.get("/students");
export const getStudentById = (id) => api.get(`/student/${id}`);
export const createStudent = (studentData) => api.post("/create-student", studentData);
export const updateStudent = (id, studentData) => api.put(`/update-student/${id}`, studentData);
export const deleteStudent = (id) => api.delete(`/delete-student/${id}`);

// =========================
// Teacher APIs
// =========================
export const getAllTeachers = () => api.get("/teachers");
export const getTeacherById = (id) => api.get(`/teacher/${id}`);
export const createTeacher = (teacherData) => api.post("/create-teacher", teacherData);
export const updateTeacher = (id, teacherData) => api.put(`/update-teacher/${id}`, teacherData);
export const deleteTeacher = (id) => api.delete(`/delete-teacher/${id}`);

// =========================
// Module APIs
// =========================
export const getAllModules = () => api.get("/modules");
export const getModuleById = (id) => api.get(`/module/${id}`);
export const createModule = (moduleData) => api.post("/create-module", moduleData);
export const updateModule = (id, moduleData) => api.put(`/update-module/${id}`, moduleData);
export const deleteModule = (id) => api.delete(`/delete-module/${id}`);

// =========================
// Topic APIs
// =========================
export const getTopicsByModule = (moduleId) => api.get(`/topics/module/${moduleId}`);
export const getTopicById = (id) => api.get(`/topics/${id}`);
export const createTopic = (moduleId, topicData) => api.post(`/topics/module/${moduleId}`, topicData);
export const updateTopic = (id, topicData) => api.put(`/topics/${id}`, topicData);
export const deleteTopic = (id) => api.delete(`/topics/${id}`);

// =========================
// Assignment APIs
// =========================
export const assignModulesToTeacher = (teacherId, modules) =>
  api.put(`/assign-modules/${teacherId}`, modules);
export const assignModulesToStudent = (studentId, modules) =>
  api.put(`/assign-modules/${studentId}`, modules);

export default api;
