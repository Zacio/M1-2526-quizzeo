import { StatusCodes } from "http-status-codes"

export const checkAuth = (req,res,next)=>{
        if(!req.session.user){
            next(StatusCodes.UNAUTHORIZED)
            return
        }
        next()
    }
