import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// route test
app.get("/", (req, res) => {
  res.send("Backend chatbot OK 🚀");
});

app.listen(3000, () => {
  console.log("Serveur backend lancé sur http://localhost:3000");
});

