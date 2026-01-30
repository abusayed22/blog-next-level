import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../../generated/prisma/client";


function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {

  let statusCode = 500;
  let errorMessage = "Internal server error!";
  let errorDetails = err;

  // PrismaClientValidationError
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 422;
    errorMessage = "You provided incorrect field or missing field!"
    // PrismaClientKnownRequestError
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 404
      errorMessage = "No data was found for a query."
    } else if (err.code === "P1008") {
      statusCode = 408
      errorMessage = "Operations timed out after {time}"
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 400
    errorMessage = "a non-recoverable error or an unexpected internal panic has occurred in the Prisma Query Engine"
  }
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401
      errorMessage = "Authentication failed against database server at {database_host}, the provided database credentials for {database_user} are not valid. Please make sure to provide valid database credentials for the database server at {database_host}."
    } else if (err.errorCode === "P1001") {
      statusCode = 401;
      errorMessage = "Can't reach database server at {database_host}:{database_port} Please make sure your database server is running at {database_host}:{database_port}."
    } else if (err.errorCode === "P1012") {
      statusCode = 401;
      errorMessage = "Argument {} is missing."
    }
  }


  res.status(statusCode)
  res.json({
    message: errorMessage,
    err: errorDetails
  })
  // res.render('error from error handler:', { error: err })
}



export default errorHandler;
