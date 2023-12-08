import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { getUser } from "../user/fetchUser";
import { useUserStore } from "../user/userStore";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

function Layout() {
  const { userData, setUserData } = useUserStore();
  const { data, isLoading } = useQuery("profile", async () => await getUser());

  console.log(isLoading, data?.user);

  // console.log("daaaaataaa:", data?.user);

  console.log("userData", userData);
  if (!isLoading && userData.loggedIn == false) {
    setUserData({ ...data?.user, loggedIn: true });
  }


  if (isLoading) return <></>;

  if (!data?.user) {
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

// function Layout() {
//   const { userData, setUserData } = useUserStore();
//   const { data, isLoading } = useQuery("profile", getUser);

//   useEffect(() => {
//     if (!isLoading && userData.loggedIn === false && data?.user) {
//       setUserData({ ...data.user, loggedIn: true });
//     }

//   }, [data, isLoading, userData.loggedIn, setUserData]);

//   console.log("after data", userData);

//   if (!userData.loggedIn) {
//     return <Navigate to="/login" />;
//   }

//   return (
//     <>
//       {!isLoading && (
//         <div className="flex flex-col p-3 gap-4 h-screen font-Baloo font-bold">
//           <NavBar />
//           <div className="outlet h-full w-full min-w-[300px]">
//             <Outlet />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

export default Layout;
