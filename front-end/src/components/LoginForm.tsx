import FtIcon from "../assets/fticon.svg?react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function LoginForm() {
  const handleLoginClick = () => {
    window.location.href = "http://localhost:9696/auth/intra/login";
  };

  return (
    <div className="font-Baloo font-bold text-dark-cl bg-gray-cl border-solid border-4 border-dark-cl rounded-lg m-3 p-6  flex flex-col  items-center max-h-[600px] transition-shadow max-w-[500px]">
      <div className="w-[90%]">
        <div className="text-5xl my-5 truncate">Login</div>
        <div className="text-2xl opacity-75 ">
          Welcome to Pong! Sign in to have fun
        </div>
      </div>

      <motion.div className="w-full flex items-center justify-center"
      whileHover={{ scale: 1.1 }}
      >
        <Link
          to="/"
          className="flex  items-center justify-center bg-dark-cl m-3 h-16 rounded-lg border-[3px] border-solid gap-5 w-full"
        >
          <FtIcon className="w-9 h-9" />
          <button className="text-white text-2xl max-[375px]:hidden "
            onClick={handleLoginClick}
          >
            Sign in with the intra
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

export default LoginForm;
