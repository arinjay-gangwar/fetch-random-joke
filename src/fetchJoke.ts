import axios from "axios";

interface ApiResponse {
  id: string;
  joke: string;
  status: number;
}

async function fetchJoke(): Promise<void> {
  try {
    const response = await axios.get<ApiResponse>(
      "https://icanhazdadjoke.com/",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    console.log(response.data.joke);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error encountered: ", error.response?.data);
    } else {
      console.log("Error encountered: ", error);
    }
  }
}

fetchJoke();
