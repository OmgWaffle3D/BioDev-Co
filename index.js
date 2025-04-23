import express from "express";

const app = express();

app.use(express.static("public"));

const port = 4000;

app.listen(port, console.log("http://localhost:" + port));