import "module-alias/register"
import bodyParser from "body-parser"
import express from "express"
import dotenv from "dotenv"
dotenv.config()

import "@/database/connection"
import cors from "cors"
import routes from "@/routes"

const PORT = process.env.PORT || 8080

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(routes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
