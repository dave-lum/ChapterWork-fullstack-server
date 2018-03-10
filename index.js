const express = require("express");

const app = express();

app.get("/", (request, result) => {
  result.send({ hi: "there" });
});

const PORT = process.env.PORT || 65000;
console.log(`Listening to port ${PORT}...`);
app.listen(PORT);
