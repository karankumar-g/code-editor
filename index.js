const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const qs = require("qs");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post("/run-code", async (req, res) => {
  const { code, language, input } = req.body;

  const data = qs.stringify({
    code: code,
    language: language,
    input: input || "",
  });

  try {
    const response = await axios.post("https://api.codex.jaagrav.in", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
