import omitEmpty from 'omit-empty'

export abstract class Response {
  statusCode?: number
  message?: string
  data: unknown
  protected headers: object

  constructor(statusCode, message?: string, data?: string | object, headers?: object) {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.headers = omitEmpty({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      ...headers
    })
  }
}

export class Success extends Response {
  constructor(message?: string, data?: string | object) {
    super(200, message || 'Success.', data)
  }
}

export class Redirect extends Response {
  constructor(url: string) {
    super(302, undefined, undefined, { Location: url })
  }
}

export class ServerError extends Response {
  constructor(message?: string) {
    super(500, message || 'Server error.')
  }
}

export class ValidationError extends Response {
  constructor(message?: string, details?: object) {
    super(422, message, details)
  }
}

export class NotfoundError extends Response {
  constructor(message?: string) {
    super(404, message || 'Not found.')
  }
}

export class ConflictError extends Response {
  constructor(message?: string) {
    super(409, message || 'Conflict.')
  }
}
