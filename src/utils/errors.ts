export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleError = (err: any, res: any) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server failure';
  
  return res.status(statusCode).json({
    status: 'error',
    message: message
  });
};
