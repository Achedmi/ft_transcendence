import axios, { AxiosError } from "axios";

export const getUser = async (): Promise<{ user: any; loggedIn: boolean }> => {
  try {
    const response = await axios.get("http://localhost:9696/user/me", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // if (setUserData) {
    //   setLoggedIn(true);
    //   setImage(response.data.avatar);
    // }

    return { user: response.data, loggedIn: true };
  } catch (error) {
    // if (error instanceof AxiosError && error.response?.status == 403) {
    //   window.location.replace("http://localhost:6969/tfa");
    // } else setLoggedIn(false);
    console.log("faiiiiiiiled");
    return { user: undefined, loggedIn: false };
  }
};
