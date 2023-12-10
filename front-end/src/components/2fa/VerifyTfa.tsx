import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../utils/axios";

function VerifyTfa() {
	const [code, setCode] = useState("");

	const handleVerify = useCallback(async () => {
		try {
			await axios.post("/auth/verifyTFAcode", { TFAcode: code });
			window.location.replace("http://localhost:6969/");
		} catch (error) {
			toast.error("invalid code");
		}
	}, [code]);

	return (
		<div className="bg-white w-screen h-screen flex justify-center items-center font-bold text-dark-cl font-Baloo">
			<div className="border-4 rounded-xl border-solid border-dark-cl h-72 w-[30rem] bg-[#D9D9D9] flex flex-col p-6 ">
				<div className="flex flex-col h-full justify-evenly">
					<p className="text-5xl font-bold">Verify 2FA</p>
					<p className="text-xl opacity-75">
						Enter the code from your authenticator app
					</p>
					<input
						className="border-2 border-solid border-dark-cl rounded-md p-2"
						type="text"
						maxLength={6}
						placeholder="XXXXXX"
						onChange={(e) => {
							console.log("target is ", e.target.value);
							return setCode(e.target.value);
						}}
					></input>
					<button
						className="bg-blue-cl border-2 border-solid border-dark-cl  text-white rounded-md h-10 text-2xl"
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
