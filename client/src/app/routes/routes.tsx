import { createBrowserRouter } from "react-router";
import CategoryPage from "../../features/categories/CategoryPage";
import RequireAuth from "./RequireAuth";
import LoginPage from "../../features/account/LoginPage";
import RegisterPage from "../../features/account/RegisterPage";
import CompanyPage from "../../features/company/CompanyPage";
import HomePage from "../../features/home/HomePage";
import JobsPage from "../../features/job/JobsPage";
import JobDetailPage from "../../features/job/JobDetailPage";
import ManageJobsPage from "../../features/job/ManageJobsPage";
import ApplySuccessPage from "../../features/applications/ApplySuccessPage";
import ApplyJobPage from "../../features/applications/ApplyJobPage";
import MyApplicationsPage from "../../features/applications/MyApplicationsPage";
import MyApplicationDetailPage from "../../features/applications/MyApplicationDetailPage";
import CandidatesPage from "../../features/applications/CandidatesPage";
import ProfilePage from "../../features/profile/ProfilePage";
import AboutPage from "../../features/home/AboutPage";
import BookmarksPage from "../../features/bookmarks/BookmarksPage";
import ContactPage from "../../features/contact/ContactPage";
import App from "../layout/App";
import SuperAdminContactPage from "../../features/contact/SuperAdminContactPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/jobs", element: <JobsPage /> },
      { path: "/search/jobs", element: <JobsPage /> },
      { path: "/jobs/:slug", element: <JobDetailPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: "/apply/success", element: <ApplySuccessPage /> },
          { path: "/jobs/:slug/apply", element: <ApplyJobPage /> },
          { path: "/categories", element: <CategoryPage /> },
          { path: "/company", element: <CompanyPage /> },
          { path: "/manage/jobs", element: <ManageJobsPage /> },
          { path: "/applications", element: <MyApplicationsPage /> },
          { path: "/applications/:id", element: <MyApplicationDetailPage /> },
          { path: "/candidates/:jobId", element: <CandidatesPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/bookmarks", element: <BookmarksPage /> },
          { path: "//admin/contacts", element: <SuperAdminContactPage /> },
        ],
      },
    ],
  },
]);
