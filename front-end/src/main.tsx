import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./components/Login.tsx";
import Layout from "./components/Layout.tsx";
import Ranking from "./components/Ranking";
import Home from "./components/Home.tsx";
import Profile from "./components/Profile.tsx";
import { Play } from "./components/Play";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Router>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="play" element={<Play />}></Route>
						<Route path="ranking" element={<Ranking />} />
						<Route path="profile" element={<Profile />} />
					</Route>
				</Routes>
			</Router>
		</QueryClientProvider>
	</React.StrictMode>
);
