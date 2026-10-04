import { Outlet } from "react-router";
import { useUserInfoQuery } from "../../features/account/accountApi";
import AppHeader from "./AppHeader";

export default function App() {
  const { isLoading } = useUserInfoQuery();

  if (isLoading) {
    return null;
  }

  return (
    <>
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
}
