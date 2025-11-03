import { Router} from "express"
import { z } from "zod"
import { StatusCodes } from "http-status-codes"
import { hash, compare } from "bcrypt"

export type User = {
    email: string,
    pwdHash: string
}

const users : User[] = []

const signupSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
})

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

export function createAuthRoutes() {
    const router = Router()

    router.post('/signup', async (req, res) => {
        const body = req.body
        
        try {
            const signupData = signupSchema.parse(body)
            if(signupData.password != signupData.confirmPassword){
                res.sendStatus(StatusCodes.BAD_REQUEST)
                return
            }

            users.push({
                email: signupData.email,
                pwdHash: await hash(signupData.password,10)
            })

            res.sendStatus(StatusCodes.OK)
            return
        } catch (error) {
            console.log(error);
            res.sendStatus(StatusCodes.BAD_REQUEST)
            return
        }
    })

    router.post('/login', async (req, res) => {
        const body = req.body
        try {
            const loginData = loginSchema.parse(body)
            const user = users.find(user => user.email == loginData.email)
            
            if(!user){
                res.sendStatus(StatusCodes.UNAUTHORIZED)
                return
            }
            
            if(! (await compare(loginData.password,user.pwdHash))){
                res.sendStatus(StatusCodes.UNAUTHORIZED)
                return
            }
            
            req.session.user = user
            res.sendStatus(StatusCodes.OK)
            
        } catch (error) {
            console.log(error);
            res.sendStatus(StatusCodes.BAD_REQUEST)
            return
        }
    })

    router.post('/logout', (req, res) => {
        req.session.user = null
        console.log("route logout!");
    })

    return router
}