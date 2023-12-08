import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { getUser } from "../user/fetchUser";
import { useUserStore } from "../user/userStore";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";

function Layout() {
  const { loggedIn, setLoggedIn } = useUserStore();
  const { isLoading } = useQuery("profile", () => getUser(setLoggedIn));

  console.log("layouuuuut");

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {!isLoading && (
        <div className="flex flex-col p-3 gap-4 h-screen font-Baloo font-bold ">
          <NavBar />
          <div className="outlet  h-full w-full min-w-[300px]">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}
export default Layout;
