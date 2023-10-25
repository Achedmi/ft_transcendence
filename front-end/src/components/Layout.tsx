
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";



function Layout () {

	return (
    <div className="flex flex-col p-3 gap-4 h-screen font-Baloo font-bold ">
      <NavBar />
      <div className="outlet  h-full w-full">
        <Outlet />
      </div>
    </div>
  );
}
export default Layout;
