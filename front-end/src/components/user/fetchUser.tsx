import axios, { AxiosError } from "axios";

export const getUser = async (setLoggedIn: any, setImage: any) => {
  try {
    const response = await axios.get("http://localhost:9696/user/me", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setLoggedIn(true);
    setImage(response.data.avatar);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status == 403) {
      window.location.replace("http://localhost:6969/tfa");
    } else 
    setLoggedIn(false);
  }
};
