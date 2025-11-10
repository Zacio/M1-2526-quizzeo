import type { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"


export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    // old code not using jwt
    //    if(!req.session.user){
    //        next(StatusCodes.UNAUTHORIZED)
    //        return
    //    }
    const tokenString = req.cookies.auth_token;
    if (!tokenString) {
        next(StatusCodes.UNAUTHORIZED);
    }
    console.log("Verifying JWT:", tokenString);
    try {
        const token = jwt.verify(tokenString!, process.env.JWT_SECRET!);
        next();
    } catch (error) {
        console.log("JWT verification error:", error);
        const err = createHttpError(StatusCodes.UNAUTHORIZED, "Invalid auth token");
        next(err);
    }
}
