const express = require("express");

const app = express();

app.use("/about", (req, res) => {
  res.send("Hello World!");
});

const PORT = 7777;
app.listen(PORT, () => {
  console.log(`Server is successfully listening on port ${PORT}...`);
});

module.exports = app;
