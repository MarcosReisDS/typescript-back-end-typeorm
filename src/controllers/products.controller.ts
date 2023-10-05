import { Request, Response, response } from "express"
import { validate } from "class-validator"

import AppDataSource from "../connection"
import { Product } from "../entities/product.entity"
import { Repository } from "typeorm"

class ProductController {
  private productRepository: Repository<Product>

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product)
  }
  async findAll(request: Request, response: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product)

    const products = await productRepository.find()

    return response.status(200).send({
      data: products
    })
  }

  async findOne(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id

    const productRepository = AppDataSource.getRepository(Product)
    const product = await productRepository.findOneBy({ id })

    if (!product) {
      return response.status(404).send({
        error: "Produto não encontrado"
      })
    }

    return response.status(200).send({
      data: product
    })
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name, description, weight } = request.body

    const productRepository = AppDataSource.getRepository(Product)

    const product = new Product
    product.name = name
    product.weight = weight
    product.description = description

    const errors = await validate(product)
    if (errors.length > 0) {
      return response.status(422).send({
        errors
      })
    }

    const productDb = await productRepository.save(product)

    return response.status(201).send({
      data: productDb
    })
  }

  async update(request: Request, response: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product)

    const id: string = request.params.id
    const { name, description, weight } = request.body

    let product
    try {
      product = await productRepository.findOneByOrFail({ id })
    } catch (error) {
      return response.status(404).send({
        error: "Produto não encontrado"
      })
    }

    product.name = name
    product.description = description
    product.weight = weight

    const errors = await validate(product)
    if (errors.length > 0) {
      return response.status(422).send({
        errors
      })
    }

    try {
      const productDb = await productRepository.save(product)

      return response.status(200).send({
        data: productDb
      })
    } catch (error) {
      return response.status(500).send({
        error: "Error interno"
      })
    }
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id

    const productRepository = AppDataSource.getRepository(Product)

    try {
      await productRepository.delete(id)

      return response.status(204).send({})
    } catch (error) {
      return response.status(400).send({
        error: "Error ao deletar produto"
      })
    }
  }
}

export default new ProductController
