import { StatusCodes } from "http-status-codes"
import createHttpError from "http-errors"
import { db } from '../database.ts';


export async function getUserById(id: number) {
    const user = await db!.query(`SELECT * FROM USERS WHERE id = ?`, [id]);
    if(user.length == 0){
        throw createHttpError(StatusCodes.NOT_FOUND)
    }
    delete user[0].password;
    return user[0];
}

export async function getUserQuizzesFromDb(userId: number) {
    const quizzes =  await db!.query(`SELECT * FROM QUIZZES WHERE autor = ?`, [userId]);
    return quizzes;
}