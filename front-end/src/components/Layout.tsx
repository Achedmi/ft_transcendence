
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";



function Layout () {

	return (
			<div className="flex flex-col p-3 gap-4 h-screen font-Baloo font-bold">
				<NavBar/>
				<div className="outlet bg-[#D9D9D9] border-solid border-dark-cl border-[4px] rounded-2xl h-full w-full">
					<Outlet/>
				</div>
			</div>
	);
}
export default Layout;
