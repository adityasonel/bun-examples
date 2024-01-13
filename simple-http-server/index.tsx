import Bun from "bun";

const server = Bun.serve({
  port: process.env.port || 3000,
  fetch() {
    return new Response("Welcome to Bun 👋");
  },
});

console.log(`Listening on localhost:${server.port}`);
