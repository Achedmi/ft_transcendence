import LoginForm from "./LoginForm";
import Drawing from "../assets/art.svg?react";


function Login() {
  return (
          <div className="flex flex-start bg-light-gray-cl h-screen justify-center items-center gap-9 ">
            <LoginForm />
            <Drawing className="min-h-screen hidden lg:block "/>
          </div>
  ); 
}

export default Login;
