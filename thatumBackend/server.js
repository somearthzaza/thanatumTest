const express = require("express");
const user = require("./routes/user");
const cors = require("cors");
const dbConfig = require("./config/app.conf");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", user);

app.listen(dbConfig.development.appPort, () => {
  console.log(`Server is running on port ${dbConfig.development.appPort}`);
});
