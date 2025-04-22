const { log } = require('./logger');

class Response {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    const response = {
      success: true,
      message,
      ...(data !== null && { data })
    };

    log.info('API Response', {
      statusCode,
      message,
      path: res.req.path,
      method: res.req.method
    });

    return res.status(statusCode).json(response);
  }

  static error(res, message = 'Error occurred', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
      ...(errors !== null && { errors })
    };

    log.error('API Error Response', {
      statusCode,
      message,
      errors,
      path: res.req.path,
      method: res.req.method
    });

    return res.status(statusCode).json(response);
  }

  static validationError(res, errors) {
    return this.error(res, 'Validation Error', 400, errors);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Access forbidden') {
    return this.error(res, message, 403);
  }

  static conflict(res, message = 'Resource already exists') {
    return this.error(res, message, 409);
  }

  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  static noContent(res, message = 'Operation completed successfully') {
    return this.success(res, null, message, 204);
  }

  static badRequest(res, message = 'Bad request', errors = null) {
    return this.error(res, message, 400, errors);
  }

  static serverError(res, message = 'Internal server error') {
    return this.error(res, message, 500);
  }

  static serviceUnavailable(res, message = 'Service temporarily unavailable') {
    return this.error(res, message, 503);
  }

  static tooManyRequests(res, message = 'Too many requests') {
    return this.error(res, message, 429);
  }
}

module.exports = Response; 