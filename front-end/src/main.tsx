import ReactDOM from "react-dom/client";
import Login from "./components/pages/login/Login.tsx";
import Layout from "./components/Layout.tsx";
import Ranking from "./components/pages/Ranking.tsx";
import Home from "./components/pages/Home.tsx";
import Profile from "./components/pages/Profile/Profile.tsx";
import { Play } from "./components/pages/Play.tsx";
import VerifyTfa from "./components/2fa/VerifyTfa.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Users from "./components/pages/Users.tsx";
import { Stats } from "./components/Stats.tsx";
import Friends from "./components/pages/Profile/Friends.tsx";
import React from "react";
import NotFound404 from "./components/pages/errorPages/NotFound404.tsx";

const queryClient = new QueryClient();

function App() {
	return (
		<Routes>
			<Route path="/stats" element={<Stats />}>
				<Route index element={<div>Stats</div>} />
				<Route path="friends" element={<Friends />} />
				<Route path="ranking" element={<div>Ranking</div>} />
			</Route>
			<Route path="/login" element={<Login />} />
			<Route path="tfa" element={<VerifyTfa />} />
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="play" element={<Play />}></Route>
				<Route path="ranking" element={<Ranking />} />
				<Route path="profile" element={<Profile />} />
				<Route path="user/:username" element={<Users />} />
			</Route>
			<Route path="*" element={<NotFound404/>} />
		</Routes>
	);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Router>
				<ToastContainer />
				<App />
			</Router>
		</QueryClientProvider>
	</React.StrictMode>
);
