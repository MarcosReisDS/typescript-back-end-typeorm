import { Request, Response, Router } from "express"
import productsController from "@/controllers/products.controller"

const routes = Router()

routes.get("/api/products", productsController.findAll)
routes.get("/api/products/:id", productsController.findOne)

routes.post("/api/products", productsController.create)

routes.put("/api/products/:id", productsController.update)

routes.delete("/api/products/:id", productsController.delete)

routes.get("/", (_: Request, response: Response) => {
  response.status(200).send({
    success: true
  })
})

routes.get("*", (_: Request, response: Response) => {
  response.status(404).send({
    error: "Não definido"
  })
})

export default routes
