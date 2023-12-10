import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

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
				toast.error("invalid code");
				console.log(error.request);
			}
		}
	};
	return (
		<div className="bg-white w-screen h-screen flex justify-center items-center font-bold text-dark-cl">
			<div className="border-4 rounded-xl border-solid border-dark-cl h-96 w-[30rem] bg-[#D9D9D9] flex flex-col p-6">
				<div className="flex flex-col ">
					<h1 className="text-2xl font-bold">Verify TFA</h1>
					<p className="text-sm">
						Enter the code from your authenticator app
					</p>
				</div>
				<div className="flex flex-col">
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
		</div>
	);
}

export default VerifyTfa;
