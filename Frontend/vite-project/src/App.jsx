import { Routes, Route } from 'react-router-dom';
import HomePage from './Project/Home';
import LoginPage from './Project/Login';
import AdminDashboard from './Project/Admin/AdminDashboard';
import StudentDashboard from './Project/Student/StudentDashboard';
import TeacherDashboard from './Project/Teacher/TeacherDashboard';
import ManageStudents from './Project/Admin/ManageStudent/ManageStudents';
import CreateStudents from './Project/Admin/ManageStudent/CreateStudent';
import CreateTeacher from './Project/Admin/ManageTeacher/CreateTeacher';
import ManageTeachers from './Project/Admin/ManageTeacher/ManageTeacher';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/manage-students" element={<ManageStudents />} />
      <Route path="/create-student" element={<CreateStudents />} />
      <Route path="/create-teacher" element={<CreateTeacher />} />
      <Route path="/manage-teacher" element={<ManageTeachers />} />







    </Routes>
  );
}

export default App;
