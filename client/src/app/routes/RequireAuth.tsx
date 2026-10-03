import { Navigate, Outlet } from "react-router";
import { useUserInfoQuery } from "../../features/account/accountApi";

export default function RequireAuth() {
  const { data: user, isLoading } = useUserInfoQuery();

  if (isLoading) return <div>Loading</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
