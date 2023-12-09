import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import { useUserStore } from "../user/userStore";
import { useQuery } from "react-query";
import { useEffect } from "react";

function Layout() {
	const location = useLocation();
	const userStore = useUserStore();
	const { data: isLoggedIn, refetch } = useQuery(
		"profile",
		userStore.fetchUserProfile
	);

	useEffect(() => {
		refetch();
	}, [location.pathname]);

	return (
		<>
			{isLoggedIn && (
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
