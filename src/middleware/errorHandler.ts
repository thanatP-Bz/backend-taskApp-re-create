import type { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "something went wrong";

  res.status(statusCode).json({
    status: false,
    message,
    //this will help track the source of error file
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
