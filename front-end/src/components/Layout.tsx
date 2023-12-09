import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useUserStore } from "../user/userStore";
import { useQuery } from "react-query";
import { useEffect } from "react";

function Layout() {
	const location = useLocation();
	const navigate = useNavigate();
	const userStore = useUserStore();
	const {
		data: isLoggedIn,
		isLoading,
		refetch,
	} = useQuery("profile", userStore.fetchUserProfile);

	useEffect(() => {
		refetch();
	}, [location.pathname]);

	useEffect(() => {
		if (!isLoading && isLoggedIn === false) {
			navigate("/login");
		}
	}, [isLoading, isLoggedIn]);

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
