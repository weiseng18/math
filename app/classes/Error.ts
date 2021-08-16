class HttpException {
  code: number
  message: string
  constructor(code: number, message: string) {
    this.code = code
    this.message = message
  }
}

class BadRequest extends HttpException {
  constructor(message: string) {
    super(400, message)
  }
}

export { HttpException, BadRequest }
