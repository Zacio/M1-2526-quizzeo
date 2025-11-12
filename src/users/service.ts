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

export async function getUserRunnedQuizzesFromDb(userId: number) {
    const runnedQuizzes =  await db!.query(`SELECT * FROM RUNNED_QUIZZES WHERE userId = ?`, [userId]);
    return runnedQuizzes;
}

export async function getDbRunnedQuizzById(runnedQuizzId: number) {
    try {
        const runnedQuizz = await db!.query(`SELECT * FROM RUNNED_QUIZZES WHERE id = ?`, [runnedQuizzId]);
            if(runnedQuizz.length == 0){
                throw createHttpError(StatusCodes.NOT_FOUND, "Runned quizz not found")
            }
        return runnedQuizz[0];
    } catch (error) {
        throw createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Could not get runned quizz")
    }
}

export async function insertUserRunnedQuizzesInDb(quizzId: number, userId: number, totalQuestions: number) {
    try {
        await db!.execute(`
            INSERT INTO RUNNED_QUIZZES (quizzId, userId, totalQuestions) 
            VALUES (?, ?, ?)`, [ quizzId, userId, totalQuestions]);
        return;
    } catch (error) {
        throw createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Could not insert runned quizz")
    }
    
}

export async function updateUserRunnedQuizzesAnswerInDb(runnedQuizzId: number, isCorrect: boolean, timeTaken: Date){
    try{
        const runnedQuizz = await getDbRunnedQuizzById(runnedQuizzId);
        console.log(runnedQuizz);
        let correctAnswers = runnedQuizz.correctAnswers;
        let questionsAnswered = runnedQuizz.questionsAnswered;
        let questionsTimed = JSON.parse(runnedQuizz.questionsTimed);
        questionsAnswered += 1;
        if(isCorrect){
            correctAnswers += 1;
        }
        questionsTimed[questionsAnswered] = timeTaken;
console.log(correctAnswers)
console.log(questionsAnswered)
        console.log(questionsTimed)
        await db!.execute(`
            UPDATE RUNNED_QUIZZES 
            SET correctAnswers = ?, questionsAnswered = ?, questionsTimed = ? 
            WHERE id = ?`, 
            [correctAnswers, questionsAnswered, JSON.stringify(questionsTimed), runnedQuizzId]);
        return;

    }catch(error){
        console.log('error : ',error);
        throw createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Could not update runned quizz")
    }
}