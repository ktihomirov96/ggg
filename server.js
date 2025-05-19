
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/ask', async (req, res) => {
  try {
    const question = req.body.question || "";
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: question }],
    });
    const reply = completion.data.choices[0].message.content;
    res.json({ answer: reply });
  } catch (err) {
    res.status(500).json({ answer: "Грешка при заявката." });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log("Сървърът работи на порт " + PORT));
