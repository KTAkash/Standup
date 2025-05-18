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
import CreateAssignment from './Project/Teacher/CreateAssignment';
import AssignmentView from './Project/Teacher/AssignmentView';
import SubmitCredits from './Project/Teacher/SubmitCredit';
import StudentsWithCredits from './Project/Teacher/StudentWithCredits';
import ModuleDetails from './Project/Student/ModuleDetails';

// Admin - Modules
import CreateModule from './Project/Admin/ManageModule/CreateModule';
import EditModule from './Project/Admin/ManageModule/EditModule';
import ManageModule from './Project/Admin/ManageModule/ManageModule';

// Admin - Topics
import CreateTopic from './Project/Admin/ManageTopic/CreateTopic';
import EditTopic from './Project/Admin/ManageTopic/EditTopic';
import ManageTopic from './Project/Admin/ManageTopic/ManageTopic';
import SelectModuleForTopics from './Project/Admin/ManageTopic/SelectModuleForTopics';

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
          
          {/* Students */}
          <Route path="/manage-students" element={<ManageStudents />} />
          <Route path="/create-student" element={<CreateStudents />} />
          <Route path="/edit-student/:studentId" element={<EditStudent />} />

          {/* Teachers */}
          <Route path="/create-teacher" element={<CreateTeacher />} />
          <Route path="/manage-teacher" element={<ManageTeachers />} />
          <Route path="/edit-teacher/:teacherId" element={<EditTeacher />} />

          {/* Modules */}
          <Route path="/manage-modules" element={<ManageModule />} />
          <Route path="/create-module" element={<CreateModule />} />
          <Route path="/edit-module/:moduleId" element={<EditModule />} />

          {/* Topics */}
          <Route path="/manage-topics/:moduleId" element={<ManageTopic />} />
          <Route path="/create-topic/:moduleId" element={<CreateTopic />} />
          <Route path="/edit-topic/:topicId" element={<EditTopic />} />
          <Route path="/manage-topics" element={<SelectModuleForTopics />} />
        </Route>

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/modules/:moduleId/create-assignment" element={<CreateAssignment />} />
          <Route path="/teacher/modules/:moduleId/assignments" element={<AssignmentView />} />
          <Route path="/teacher/modules/:moduleId/assignments/:assignmentId/students/:studentId/credits" element={<SubmitCredits />} />
          <Route path="/teacher/modules/:moduleId/students-with-credits" element={<StudentsWithCredits />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/mode" element={<ModuleDetails />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default App;
