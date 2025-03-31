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
import ProtectedRoute from './Project/ProtectedRoute';
import Unauthorized from './Project/Unauthorized';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditTeacher from "./Project/Admin/ManageTeacher/EditTeacher";
import EditStudent from "./Project/Admin/ManageStudent/EditStudent";
function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manage-students" element={<ManageStudents />} />
          <Route path="/create-student" element={<CreateStudents />} />
          <Route path="/create-teacher" element={<CreateTeacher />} />
          <Route path="/manage-teacher" element={<ManageTeachers />} />
          <Route path="/edit-teacher/:teacherId" element={<EditTeacher />} />
          <Route path="/edit-student/:studentId" element={<EditStudent />} />



        </Route>

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student" element={<StudentDashboard />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;