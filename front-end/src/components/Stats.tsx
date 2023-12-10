import { Link, Outlet, useLocation } from "react-router-dom";

export function SubNavBar() {
	const location = useLocation();
	return (
		<div className="text-lg sm:text-base   flex  justify-around items-center  font-Baloo font-bold h-11 border-solid border-b-[4px] border-dark-cl ">
			<Link
				to=""
				className={`flex justify-center items-center w-1/2 h-full  ${
					location.pathname.endsWith("/profile")
						? "bg-dark-cl text-white"
						: " opacity-50 hover:opacity-100"
				}`}
			>
				<p>Match History</p>
			</Link>
			<Link
				className={`flex justify-center items-center w-1/2 h-full ${
					location.pathname.startsWith("/profile/friends")
						? "bg-dark-cl text-white"
						: " opacity-50 hover:opacity-100"
				}`}
				to="friends"
			>
				<p>Friends</p>
			</Link>
		</div>
	);
}

export function Stats() {
	return (
		<div className=" h-screen font-Baloo font-bold text-white">
			<SubNavBar />
			<Outlet />
		</div>
	);
}
