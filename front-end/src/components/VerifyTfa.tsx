import { useState } from "react";
import axios, { AxiosError } from "axios";

function VerifyTfa() {
  const [code, setCode] = useState("");
  const handleVerify = async () => {
    try {
      await axios.post(
        "http://localhost:9696/auth/verifyTFAcode",
        { TFAcode: code },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      window.location.replace("http://localhost:6969/");
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        // alert("invalid code");
        console.log(error.request);
      }
    }
  };
  return (
    <div className="bg-white w-screen h-screen flex justify-center items-center">
      <div className="border-2 border-solid border-dark-cl h-72 w-72 bg-[#D9D9D9] flex flex-col p-6">
        <input
          type="text"
          placeholder="XXXXXX"
          onChange={(e) => {
            console.log("target is ", e.target.value);
            return setCode(e.target.value);
          }}
        ></input>
        <button
          className="bg-red-300 border-2 border-solid border-dark-cl "
          type="submit"
          onClick={handleVerify}
        >
          verify
        </button>
      </div>
    </div>
  );
}

export default VerifyTfa;
