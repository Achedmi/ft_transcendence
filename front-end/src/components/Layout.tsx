import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import { useUserStore } from "../user/userStore";
import { useQuery } from "react-query";
import { useEffect } from "react";
import SyncLoader from "react-spinners/SyncLoader";


function Layout() {
  const location = useLocation();
  const userStore = useUserStore();

  const { data: isLoggedIn, refetch, isLoading } = useQuery(
    "profile",
    userStore.fetchUserProfile
  );

  useEffect(() => {
    refetch();
  }, [location.pathname]);
  

  return (
    <>
      {isLoading&& (
        <div className="flex justify-center items-center h-screen bg-opacity-75 bg-dark-cl absolute top-0 left-0 w-full z-50">
          <SyncLoader color="#ffffff" />
        </div>
      )}

      {!isLoading && isLoggedIn &&(
        <div className="flex flex-col p-3 gap-4 h-screen font-Baloo font-bold z-0">
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
