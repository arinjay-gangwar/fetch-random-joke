# Simple CLI API Client for Fetching Random Jokes

This is a simple API client that runs in the CLI and fetches random jokes.  

It uses the public API at [https://icanhazdadjoke.com/](https://icanhazdadjoke.com/) and `axios` to retrieve the response.

---

## Steps to Set Up

```bash
npm init -y
npm install typescript ts-node @types/node --save-dev
npm install axios
npx tsc --init
```


## Run the Script

```bash
npx ts-node ./src/fetchJoke.ts
```