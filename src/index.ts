import "module-alias/register"
import bodyParser from "body-parser"
import express from "express"
import dotenv from "dotenv"
dotenv.config()

import "./connection"
import productsController from "@/controllers/products.controller"
import cors from "cors"

const PORT = process.env.PORT || 8080

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get("/api/products", productsController.findAll)
app.get("/api/products/:id", productsController.findOne)

app.post("/api/products", productsController.create)

app.put("/api/products/:id", productsController.update)

app.delete("/api/products/:id", productsController.delete)

app.get("/", (req, res) => {
  res.send("Tudo nosso!")
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
