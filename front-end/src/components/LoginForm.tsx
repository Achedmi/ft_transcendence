import React, { useState } from "react";
import UserIcon from "../assets/usericon.svg?react";
import LockIcon from "../assets/lockicon.svg?react";
import FtIcon from "../assets/fticon.svg?react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  username: string;
  password: string;
};

function LoginForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) =>
    alert(JSON.stringify(data));

  console.log(watch("username")); // watch input value by passing the name of it

  return (
    <form
      className="font-Baloo font-bold text-dark-cl bg-gray-cl border-solid border-4 border-dark-cl rounded-lg m-3 p-6  flex flex-col  items-center max-h-[600px] hover:shadow-[4px_4px_0px_0px_rgba(67,54,80,1)] transition-shadow max-w-[500px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-[90%]">
        <div className="text-5xl my-5 truncate">Login</div>
        <div className="text-2xl opacity-75 ">
          Welcome to Pong! Sign in to have fun
        </div>
      </div>
      <div className="flex flex-col items-center m-3 gap-2 w-[90%] h-full truncate">
        <div
          className={
            errors.username
              ? "relative flex bg-light-gray-cl items-center border-solid border-[3px] border-red-cl m-3 rounded-lg justify-start gap-2 h-16 w-full "
              : "relative flex bg-light-gray-cl items-center border-solid border-[3px] border-dark-cl m-3 rounded-lg justify-start gap-2 h-16 w-full"
          }
        >
          <UserIcon className="w-7 h-7 ml-1" />
          <input
            className=" border-none bg-transparent text-2xl placeholder-dark-cl placeholder-opacity-50 focus:outline-none w-full"
            type="text"
            placeholder="username"
            {...register("username", {
              required: true,
              maxLength: 20,
              minLength: 3,
              pattern: /^[a-zA-Z0-9]+$/,
            })}
          />
          {errors.username && (
            <span className="text-red-cl absolute -bottom-7 ">
              {errors.username.type === "required"
                ? "Username is required"
                : errors.username.type === "maxLength"
                ? "Username is too long"
                : errors.username.type === "minLength"
                ? "Username is too short"
                : errors.username.type === "pattern"
                ? "Username must be alphanumeric"
                : ""}
            </span>
          )}
        </div>
        <div className="relative flex bg-light-gray-cl items-center border-solid border-[3px] border-dark-cl m-3 rounded-lg justify-start gap-2 h-16 w-full">
          <LockIcon className="w-6 h-6 ml-1" />
          <input
            className="border-none bg-transparent text-2xl placeholder-dark-cl placeholder-opacity-50 focus:outline-none w-full"
            type="password"
            placeholder="password"
            {...register("password", { required: true, minLength: 8 })}
          />
          {errors.password && (
            <span className="text-red-cl absolute -bottom-7">
              {errors.password.type === "required"
                ? "Password is required"
                : errors.password.type === "minLength"
                ? "Password is too short"
                : ""}
            </span>
          )}
        </div>
        <motion.div className="bg-dark-cl m-3 h-16 rounded-lg w-full mt-12">
          <button type="submit" className="text-2xl text-white w-full h-full">
            sign in
          </button>
        </motion.div>
        <Link
          to="/"
          className="flex  items-center justify-center bg-blue-cl m-3 h-16 rounded-lg border-[3px] border-solid gap-5 w-full"
        >
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
