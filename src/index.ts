import express from "express"
import dotenv from "dotenv"
dotenv.config()

import "./connection"

const PORT = process.env.PORT || 8080

const app = express()

app.get("/", (req, res) => {
  res.send("Tudo nosso!")
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
