import { Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import FeedPage from "@/features/feed/pages/FeedPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import ConnectionsPage from "@/features/connections/pages/ConnectionsPage";
import RequestsPage from "@/features/requests/pages/RequestsPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<FeedPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="connections" element={<ConnectionsPage />} />
        <Route path="requests" element={<RequestsPage />} />
        {/* Fallback route */}
        <Route path="*" element={<FeedPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
