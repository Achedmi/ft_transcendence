import { motion } from "framer-motion";
import { Close, Tfa } from "./icons/icons";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";

interface HandleTfaProps {
  showTfa: boolean;
  setShowTfa: Dispatch<SetStateAction<boolean>>;
}

function HandleTfa(props: HandleTfaProps) {
  const [closeHovered, setCloseHovered] = useState(false);

  return (
    <motion.div className="flex flex-col items-center mt-1 w-full h-full">
      <div className="w-full flex justify-between items-center px-1 pb-2 border-b-2 border-solid border-dark-cl">
        <Tfa size="38" />
        <h1 className="mt-2 text-xl">Setup authenticator app</h1>
        <motion.div
          className="hover:cursor-pointer"
          onHoverStart={() => setCloseHovered(true)}
          onHoverEnd={() => setCloseHovered(false)}
          onClick={() => props.setShowTfa(false)}
        >
          <Close size="38" fillColor={!closeHovered ? "#433650" : "#C84D46"} />
        </motion.div>
      </div>

      <div className="info">
        <p className="text-center mt-4">
          Use a phone app like 1Password, Authy, LastPass Authenticator, or
          Microsoft Authenticator, etc, to get 2FA codes when prompted during
          sign-in.
        </p>
      </div>

      <div className="flex justify-center items-center pt-4 pb-2 w-52  ">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png"
          alt="QR code"
          className="h-52 w-full"
        />
      </div>
      <div className="p-3">
        <span>verify the code from the app</span>
      </div>
      <div className="form w-52 flex flex-col mb-4 gap-4">
        <input
          type="text"
          className=" border-solid border-2 border-dark-cl rounded-full px-4  w-full h-10"
          placeholder="XXXXXX"
          required
        />
        <motion.div className="bg-blue-cl rounded-full text-white hover:cursor-pointer h-10 border-solid border-2 border-dark-cl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        >
          <button className="w-full h-full">Continue</button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HandleTfa;
