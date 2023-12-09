import { Link, Outlet, useLocation } from "react-router-dom";

function SubNavBar() {
	const location = useLocation();
	return (
		<div className="text-lg sm:text-base sm:gap-6 min-w-[300px] flex  justify-around items-center bg-[#D9D9D9] text-dark-cl font-Baloo font-bold h-12   ">
			<Link
				to=""
				className={
					location.pathname.endsWith("/stats")
						? "p-2"
						: "p-2 opacity-50 hover:opacity-100"
				}
			>
				Stats
			</Link>
			<Link
				to="friends"
				className={
					location.pathname.startsWith("/stats/friends")
						? "p-2"
						: "p-2 opacity-50 hover:opacity-100"
				}
			>
				Friends
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
