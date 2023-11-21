import axios from "axios";

export const getUser = async (setLoggedIn: any, setImage: any) => {
  try {
    const response = await axios.get("http://localhost:9696/user/whoami", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setLoggedIn(true);
    setImage(response.data.avatar);
    return response.data;
  } catch (error) {
    setLoggedIn(false);
  }
};
