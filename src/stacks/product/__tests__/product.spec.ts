import { Handler } from 'aws-lambda'
import { invokeHandler, generateMockCallback } from 'lambda-utilities'
import { generateDummyAPIGatewayEvent } from 'lamprox'
import { v4 } from 'uuid'

import { createProduct, getProduct, getListProduct, updateProduct, deleteProduct } from '../handler'
import { Response } from '../../../common/utils/response'
import dynamoDb, { TABLE } from '../databases'

describe('Product management', () => {
  const dummyProduct = {
    productId: `test-${v4()}`,
    name: 'Product Test',
    owner: 'user-default'
  }

  afterAll((done) => {
    dynamoDb.delete({TableName: TABLE, Key: {id: dummyProduct.productId}}).promise()
    .then(() => {})
    .catch(() => {})
    .finally(() => done());
  })

  describe('Create product', () => {
    it('Should return response.', done => {
      const event = generateDummyAPIGatewayEvent({ body: JSON.stringify(dummyProduct)})
      const callback = generateMockCallback((error, result: any) => {
        callback.once()
        const body = JSON.parse(result.body) as Response
        expect(body.statusCode).toBe(200)
        expect(body.data?.productId).toBe(dummyProduct.productId)
        expect(body.data?.name).toBe(dummyProduct.name)
        expect(callback.verify()).toBe(true)

        done()
      })

      invokeHandler(createProduct as Handler, { event, callback })
    })
  })

  describe('Get product list', () => {
    it('Should return response.', done => {
      const event = generateDummyAPIGatewayEvent()
      const callback = generateMockCallback((error, result: any) => {
        callback.once()
        const body = JSON.parse(result.body) as Response
        expect(body.statusCode).toBe(200)
        expect(Array.isArray(body.data)).toBe(true)
        expect(callback.verify()).toBe(true)

        done()
      })

      invokeHandler(getListProduct as Handler, { event, callback })
    })
  })

  describe('Get product', () => {
    it('Should return response.', done => {
      const event = generateDummyAPIGatewayEvent({ pathParameters: { "id": dummyProduct.productId }})
      const callback = generateMockCallback((error, result: any) => {
        callback.once()
        const body = JSON.parse(result.body) as Response
        expect(body.statusCode).toBe(200)
        expect(body.data?.productId).toBe(dummyProduct.productId)
        expect(body.data?.name).toBe(dummyProduct.name)
        expect(callback.verify()).toBe(true)

        done()
      })

      invokeHandler(getProduct as Handler, { event, callback })
    })
  })

  describe('Update product', () => {
    const updatePayload = {
      name: 'New Product Name',
      owner: 'user-002'
    }

    it('Should return response.', done => {
      const event = generateDummyAPIGatewayEvent({ pathParameters: { "id": dummyProduct.productId }, body: JSON.stringify(updatePayload)})
      const callback = generateMockCallback((error, result: any) => {
        callback.once()
        const body = JSON.parse(result.body) as Response
        expect(body.statusCode).toBe(200)
        expect(body.data?.productId).toBe(dummyProduct.productId)
        expect(body.data?.name).toBe(updatePayload.name)
        expect(body.data?.owner).toBe(updatePayload.owner)
        expect(body.data?.updatedAt).toBeGreaterThan(body.data?.createdAt)
        expect(callback.verify()).toBe(true)

        done()
      })

      invokeHandler(updateProduct as Handler, { event, callback })
    })
  })

  describe('Delete product', () => {
    it('Should return response.', done => {
      const event = generateDummyAPIGatewayEvent({ pathParameters: { "id": dummyProduct.productId }})
      const callback = generateMockCallback((error, result: any) => {
        callback.once()
        const body = JSON.parse(result.body) as Response
        expect(body.statusCode).toBe(200)
        expect(body.message).toBe('Product deleted successfully.')
        expect(callback.verify()).toBe(true)

        done()
      })

      invokeHandler(deleteProduct as Handler, { event, callback })
    })
  })
})
