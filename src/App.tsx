import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { UserProfile } from './components/features/UserProfile';
import { LeaveRequestForm } from './components/features/LeaveRequestForm';
import { LeaveStatistics } from './components/features/LeaveStatistics';
import { ManagerDashboard } from './components/features/ManagerDashboard';
import { ProjectAssignment } from './components/features/ProjectAssignment';
import { Button } from './components/ui/button';
import { Layout } from './components/layout/Layout';
import CalendarPage from './components/features/CalendarPage';

const App = () => {
  const { instance } = useMsal();

  return (
    <Router>
      <AuthenticatedTemplate>
        <Layout>
          <Routes>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/leave-request" element={<LeaveRequestForm />} />
            <Route path="/leave-statistics" element={<LeaveStatistics />} />
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/projects" element={<ProjectAssignment />} />
            <Route path="/calender" element={<CalendarPage />} />
            <Route path="/" element={<Navigate to="/profile" replace />} />
          </Routes>
        </Layout>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to Leave Management</h1>
            <Button onClick={() => instance.loginPopup()}>
              Sign in with Microsoft 365
            </Button>
          </div>
        </div>
      </UnauthenticatedTemplate>
    </Router>
  );
};

export default App;