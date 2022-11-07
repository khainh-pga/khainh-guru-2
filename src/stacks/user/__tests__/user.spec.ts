import { Handler } from 'aws-lambda'
import { invokeHandler, generateMockCallback } from 'lambda-utilities'
import { generateDummyAPIGatewayEvent, generateProcessAmbience } from 'lamprox'
import { v4 } from 'uuid'

import { createUser, getUser, getListUser, updateUser, deleteUser } from '../handler'
import { Response } from '../../../common/utils/response'

describe('User management', () => {
  const dummyUser = {
    userId: `test-${v4()}`,
    name: 'User Test'
  }

  afterAll((done) => {
    const event = generateDummyAPIGatewayEvent({ pathParameters: { "id": dummyUser.userId }})
    const callback = generateMockCallback((error, result: any) => {
      callback.once()
      // console.log('Dummy user deleted successfuly.')
    })

    invokeHandler(deleteUser as Handler, { event, callback })
    done()
  })

  describe('Create user', () => {
    it('Should return response.', done => {
      const event = generateDummyAPIGatewayEvent({ body: JSON.stringify(dummyUser)})
      const callback = generateMockCallback((error, result: any) => {
        callback.once()
        const body = JSON.parse(result.body) as Response
        expect(body.statusCode).toBe(200)
        expect(body.data?.userId).toBe(dummyUser.userId)
        expect(body.data?.name).toBe(dummyUser.name)
        expect(callback.verify()).toBe(true)

        done()
      })

      invokeHandler(createUser as Handler, { event, callback })
    })
  })

  describe('Get user list', () => {
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

      invokeHandler(getListUser as Handler, { event, callback })
    })
  })

  describe('Get user', () => {
    it('Should return response.', done => {
      const event = generateDummyAPIGatewayEvent({ pathParameters: { "id": dummyUser.userId }})
      const callback = generateMockCallback((error, result: any) => {
        callback.once()
        const body = JSON.parse(result.body) as Response
        expect(body.statusCode).toBe(200)
        expect(body.data?.userId).toBe(dummyUser.userId)
        expect(body.data?.name).toBe(dummyUser.name)
        expect(callback.verify()).toBe(true)

        done()
      })

      invokeHandler(getUser as Handler, { event, callback })
    })
  })

  describe('Update user', () => {
    const updatePayload = {
      name: 'New User Name'
    }

    it('Should return response.', done => {
      const event = generateDummyAPIGatewayEvent({ pathParameters: { "id": dummyUser.userId }, body: JSON.stringify(updatePayload)})
      const callback = generateMockCallback((error, result: any) => {
        callback.once()
        const body = JSON.parse(result.body) as Response
        expect(body.statusCode).toBe(200)
        expect(body.data?.userId).toBe(dummyUser.userId)
        expect(body.data?.name).toBe(updatePayload.name)
        expect(body.data?.updatedAt).toBeGreaterThan(body.data?.createdAt)
        expect(callback.verify()).toBe(true)

        done()
      })

      invokeHandler(updateUser as Handler, { event, callback })
    })
  })

  describe('Delete user', () => {
    it('Should return response.', done => {
      const event = generateDummyAPIGatewayEvent({ pathParameters: { "id": dummyUser.userId }})
      const callback = generateMockCallback((error, result: any) => {
        callback.once()
        const body = JSON.parse(result.body) as Response
        expect(body.statusCode).toBe(200)
        expect(body.message).toBe('User deleted successfully.')
        expect(callback.verify()).toBe(true)

        done()
      })

      invokeHandler(deleteUser as Handler, { event, callback })
    })
  })
})
