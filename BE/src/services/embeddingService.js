const axios = require("axios");

async function runPythonSearch(keyword) {
  const res = await axios.get("http://localhost:8000/search", {
    params: { keyword },
  });
  return res.data;
}

module.exports = { runPythonSearch };
