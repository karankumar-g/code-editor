const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post("/run-code", async (req, res) => {
  console.log("Received request:", req.body);

  const { code, language, input, args } = req.body;

  const languageVersionMap = {
    py: "3.10.0",
    javascript: "18.15.0",
    java: "15.0.2",
    cpp: "10.2.0",
    c: "10.2.0",
    go: "1.16.2",
    cs: "6.12.0",
  };

  const version = languageVersionMap[language] || "latest";

  const requestBody = {
    language,
    version,
    files: [
      {
        name: `main.${language === "py" ? "py" : language}`,
        content: code,
      },
    ],
    stdin: input || "",
    args: args || [],
    compile_timeout: 10000,
    run_timeout: 3000,
    compile_memory_limit: -1,
    run_memory_limit: -1,
  };

  try {
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      requestBody
    );
    console.log("Response from API:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error executing code:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
