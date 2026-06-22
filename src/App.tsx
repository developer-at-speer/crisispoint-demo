import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CaseProvider } from "./context/CaseContext";
import { AppLayout } from "./layouts/AppLayout";
import { ActivityHistoryPage } from "./pages/ActivityHistoryPage";
import { AgenciesPage } from "./pages/AgenciesPage";
import { AttachmentsPage } from "./pages/AttachmentsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { IntakePage } from "./pages/IntakePage";
import { LoginPage } from "./pages/LoginPage";
import { MessagesPage } from "./pages/MessagesPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ResourceMapPage } from "./pages/ResourceMapPage";
import { CASE_NUMBER } from "./data/constants";

export default function App() {
  return (
    <AuthProvider>
      <CaseProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                path="/"
                element={
                  <Navigate to={`/case/${CASE_NUMBER}/intake`} replace />
                }
              />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/case/:caseId/intake" element={<IntakePage />} />
              <Route path="/agencies" element={<AgenciesPage />} />
              <Route path="/case/:caseId/privacy" element={<PrivacyPage />} />
              <Route
                path="/case/:caseId/history"
                element={<ActivityHistoryPage />}
              />
              <Route path="/resources/map" element={<ResourceMapPage />} />
              <Route path="/case/:caseId/messages" element={<MessagesPage />} />
              <Route
                path="/case/:caseId/attachments"
                element={<AttachmentsPage />}
              />
            </Route>
          </Route>
        </Routes>
      </CaseProvider>
    </AuthProvider>
  );
}
