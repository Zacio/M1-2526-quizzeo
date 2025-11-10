import express from 'express';
import type { NextFunction } from 'express';
import session from 'express-session';
import { StatusCodes } from 'http-status-codes';
import { checkAuth } from '../auth/middlewares.ts';
import { getUser, getUserQuizzes } from './controller.ts';

export function usersRoutes() {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(session({
        secret: process.env.SESSION_SECRET!,
        resave: true,
        saveUninitialized: false
    }))

    app.get('/:id',checkAuth, getUser);

    app.get('/:id/quizzes', checkAuth, getUserQuizzes);



    return app;
}