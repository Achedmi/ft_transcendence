import React, { useState } from "react";
import UserIcon from "../assets/usericon.svg?react";
import LockIcon from "../assets/lockicon.svg?react";
import FtIcon from "../assets/fticon.svg?react";
import { Link } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    username!= "" && password!="" && alert(`${username} ${password}`) ;
  };
  // const intraLogin = () => {
  //   alert("intra auth");
  // };

  return (
    <form
      className="font-Baloo font-bold text-dark-cl bg-gray-cl border-solid border-4 border-dark-cl rounded-lg m-3 p-6  flex flex-col  items-center max-h-[600px] hover:shadow-[4px_4px_0px_0px_rgba(67,54,80,1)] transition-shadow max-w-[500px]"
      onSubmit={handleSubmit}
    >
      <div className="w-[90%]">
        <div className="text-5xl my-5 truncate">Login</div>
        <div className="text-2xl opacity-75 ">
          Welcome to Pong! Sign in to have fun
        </div>
      </div>
      <div className="flex flex-col items-center m-3 gap-2 w-[90%] h-full truncate">
        <div className="flex bg-light-gray-cl items-center border-solid border-[3px] border-dark-cl m-3 rounded-lg justify-start gap-2 h-16 my-5 w-full">
          <UserIcon className="w-7 h-7 ml-1" />{" "}
          <input
            className="border-none bg-transparent text-2xl placeholder-dark-cl placeholder-opacity-50 focus:outline-none w-full"
            type="text"
            id="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex bg-light-gray-cl items-center border-solid border-[3px] border-dark-cl m-3 rounded-lg justify-start gap-2 h-16 w-full">
          <LockIcon className="w-6 h-6 ml-1" />
          <input
            className="border-none bg-transparent text-2xl placeholder-dark-cl placeholder-opacity-50 focus:outline-none w-full"
            type="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="bg-dark-cl m-3 h-16 rounded-lg w-full">
          <button type="submit" className="text-2xl text-white w-full h-full">
            sign in
          </button>
        </div>
        <Link to="/home"  className="flex  items-center justify-center bg-blue-cl m-3 h-16 rounded-lg border-[3px] border-solid gap-5 w-full">
            <FtIcon className="w-9 h-9" />
            <span className="text-white text-2xl max-[375px]:hidden ">
            Sign in with the intra
            </span>
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;
