export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Não autenticado") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Sem permissão para este recurso") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}
