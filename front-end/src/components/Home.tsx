import { BrowserRouter, Routes, Route, Router, useLocation, Outlet } from "react-router-dom";
import NavBar from "./NavBar";



function Home () {

	return (
				<div className="flex flex-col">
					<NavBar/>
					
					<Outlet/>
				</div>
	);
}
export default Home;
