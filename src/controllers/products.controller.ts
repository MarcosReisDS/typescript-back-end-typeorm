import { Request, Response, response } from "express"
import { validate } from "class-validator"
import { ProductRepository } from "@/repositories/product.repository"
import { CreateProductDTO, UpdateProductDTO } from "@/dto/product.dto"

class ProductController {
  private productRepository: ProductRepository
  constructor() {
    this.productRepository = new ProductRepository
  }

  findAll = async (request: Request, response: Response): Promise<Response> => {
    const products = await this.productRepository.getAll()

    return response.status(200).send({
      data: products
    })
  }

  findOne = async (request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id

    const product = await this.productRepository.find(id)

    if (!product) {
      return response.status(404).send({
        error: "Produto não encontrado"
      })
    }

    return response.status(200).send({
      data: product
    })
  }

  create = async (request: Request, response: Response): Promise<Response> => {
    const { name, description, weight } = request.body

    const createProductDTO = new CreateProductDTO

    createProductDTO.name = name
    createProductDTO.description = description
    createProductDTO.weight = weight

    const errors = await validate(createProductDTO)
    if (errors.length > 0) {
      return response.status(422).send({
        errors
      })
    }

    const productDb = await this.productRepository.create(createProductDTO)

    return response.status(201).send({
      data: productDb
    })
  }

  update = async (request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id
    const { name, description, weight } = request.body

    const updateDto = new UpdateProductDTO
    updateDto.id = id
    updateDto.name = name
    updateDto.description = description
    updateDto.weight = weight

    const errors = await validate(updateDto)
    if (errors.length > 0) {
      return response.status(422).send({
        errors
      })
    }

    try {
      const productDb = await this.productRepository.update(updateDto)
      if (!productDb) {
        return response.status(404).send({
          error: "Produto não encontrado"
        })
      }

      return response.status(200).send({
        data: productDb
      })
    } catch (error) {
      return response.status(500).send({
        error: "Error interno"
      })
    }
  }

  delete = async (request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id

    try {
      await this.productRepository.delete(id)

      return response.status(204).send({})
    } catch (error) {
      return response.status(400).send({
        error: "Error ao deletar produto"
      })
    }
  }
}

export default new ProductController
