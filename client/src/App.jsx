import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Loading } from "./components/ui.jsx";
import Home from "./pages/Home.jsx";

// Las páginas se cargan bajo demanda para que la portada abra rápido.
const Roadmap = lazy(() => import("./pages/Roadmap.jsx"));
const StagePage = lazy(() => import("./pages/StagePage.jsx"));
const Specializations = lazy(() => import("./pages/Specializations.jsx"));
const SpecializationPage = lazy(() => import("./pages/SpecializationPage.jsx"));
const Modules = lazy(() => import("./pages/Modules.jsx"));
const ModulePage = lazy(() => import("./pages/ModulePage.jsx"));
const LessonPage = lazy(() => import("./pages/LessonPage.jsx"));
const QuizPage = lazy(() => import("./pages/QuizPage.jsx"));
const Projects = lazy(() => import("./pages/Projects.jsx"));
const ProjectPage = lazy(() => import("./pages/ProjectPage.jsx"));
const Resources = lazy(() => import("./pages/Resources.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Admin = lazy(() => import("./pages/admin/Admin.jsx"));
const Privacy = lazy(() => import("./pages/static/Privacy.jsx"));
const Contact = lazy(() => import("./pages/static/Contact.jsx"));
const NotFound = lazy(() => import("./pages/static/NotFound.jsx"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ruta" element={<Roadmap />} />
          <Route path="etapas/:slug" element={<StagePage />} />
          <Route path="especializaciones" element={<Specializations />} />
          <Route path="especializaciones/:slug" element={<SpecializationPage />} />
          <Route path="modulos" element={<Modules />} />
          <Route path="modulos/:slug" element={<ModulePage />} />
          <Route path="modulos/:slug/quiz" element={<QuizPage />} />
          <Route path="lecciones/:slug" element={<LessonPage />} />
          <Route path="proyectos" element={<Projects />} />
          <Route path="proyectos/:slug" element={<ProjectPage />} />
          <Route path="recursos" element={<Resources />} />
          <Route path="ingresar" element={<Login />} />
          <Route path="registro" element={<Register />} />
          <Route path="recuperar" element={<ForgotPassword />} />
          <Route path="restablecer" element={<ResetPassword />} />
          <Route path="panel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
          <Route path="privacidad" element={<Privacy />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
