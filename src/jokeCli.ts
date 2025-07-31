import axios from "axios";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { appendFileSync, existsSync, readFileSync } from "fs";

interface SingleJokeResponse {
  id: string;
  joke: string;
  status: number;
}

interface SearchResponse {
  results: Array<{ joke: string }>;
}

const API_URL = "https://icanhazdadjoke.com/";
const filePath = "Joke.txt";

async function fetchJoke(): Promise<void> {
  try {
    const response = await axios.get<SingleJokeResponse>(API_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    const joke = response.data.joke;
    console.log("Joke 😂: ", joke);

    const time = new Date().toLocaleString();
    const entry = `- ${joke} - Saved at: ${time}\n`;
    appendFileSync(filePath, entry);
    console.log("Joke saved to Joke.txt");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error encountered: ", error.response?.data);
    } else {
      console.log("Error encountered: ", error);
    }
    process.exit(1);
  }
}

function readJokes(): void {
  if (!existsSync(filePath)) {
    console.log("No Joke saved yet");
  } else {
    const content = readFileSync(filePath, "utf-8");
    // const count = content.trim().split("\n").length;
    const count = content.trim() ? content.trim().split("\n").length : 0;
    console.log(`📄 You have saved ${count} joke(s):\n`, content);
  }
}

async function fetchWithSearchTerm(term: string): Promise<void> {
  try {
    const response = await axios.get<SearchResponse>(
      `${API_URL}/search?term=${encodeURIComponent(term)}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const jokes = response.data.results;
    if (jokes && jokes.length > 0) {
      const time = new Date().toLocaleString();
      const entry = `- ${jokes[0].joke} - Saved at: ${time}\n`;
      appendFileSync(filePath, entry);
      console.log(
        `Saved the first joke found and The total Jokes found are: ${jokes.length}`
      );
      // jokes.forEach((j: { joke: string }, idx: number) => {
      //   console.log(`${idx + 1}. ${j.joke}`);
      // });
    } else {
      console.log("No jokes found for your search term.");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error encountered: ", error.response?.data);
    } else {
      console.log("Error encountered: ", error);
    }
    process.exit(1);
  }
}

async function fetchCli() {
  const argv = await yargs(hideBin(process.argv))
    .usage("Usage: $0 [--save | --read | --search <term>]")
    .option("save", {
      alias: "s",
      describe: "Run fetchJoke to save Jokes",
      type: "boolean",
      demandOption: false,
      conflicts: "read",
    })
    .option("read", {
      alias: "r",
      describe: "Run readJokes to fetch saved Jokes",
      type: "boolean",
      demandOption: false,
      conflicts: "save",
    })
    .option("search", {
      alias: "search",
      describe: "Search for a joke by keyword",
      type: "string",
      conflicts: ["save", "read"],
    })
    .help().argv;

  if (argv.save) {
    await fetchJoke();
  } else if (argv.read) {
    readJokes();
  } else if (argv.search) {
    const term = argv.search;
    if (!term) {
      console.log("Please provide a search term after --search.");
    } else {
      await fetchWithSearchTerm(term);
    }
  } else {
    console.log("Please provide a valid flag (--save, --read, or --search.)");
    process.exit(1);
  }
}

fetchCli();
