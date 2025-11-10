import { db } from '../database.ts';
import { StatusCodes } from "http-status-codes"
import createHttpError from "http-errors"
import type { Question } from './controller.ts';




export async function getDbQuizzes(pageSize: number, offset: number) {
    const quizzes = await db!.query(`SELECT * FROM QUIZZES LIMIT ? OFFSET ?`,
        [pageSize, offset]
    )
    if (quizzes.length == 0) {
        throw createHttpError(StatusCodes.NOT_FOUND)
    }
    return quizzes;
}

export async function getDbQuizById(quizId: number) {
    const quiz = await db!.query(`SELECT title FROM QUIZZES WHERE QUIZZES.id = ?`,
        [quizId])
    if (quiz.length == 0) {
        throw createHttpError(StatusCodes.NOT_FOUND)
    }
    return quiz;
}

export async function getDbQuizQuestionByQuizId(quizId: number) {
    const question = await db!.query(`SELECT title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3 FROM QUESTIONS WHERE QUESTIONS.quizId = ?`,
        [quizId]
    )
    if (question.length == 0) {
        throw createHttpError(StatusCodes.NOT_FOUND)
    }
    return question;
}

export async function getDbQuizQuestionById(questionId: number) {
    try {
        const question = await db!.query(`SELECT title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3 FROM QUESTIONS WHERE QUESTIONS.id = ?`,
            [questionId]
        )
        if (question.length == 0) {
            throw createHttpError(StatusCodes.NOT_FOUND)
        }
        return question;

    } catch (error) {
        throw createHttpError(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function insertQuizDb(title: string, autor: number, question: any) {
    try {
        const result = await db!.query(`INSERT INTO QUIZZES (title, autor) VALUES (?, ?)`,
            [title, autor]
        )
        return result;
    } catch (error) {
        throw createHttpError(StatusCodes.INTERNAL_SERVER_ERROR)
    }
   return question;
}

export async function insertQuestionDb(quizId: number, question: Question) {
    try{
        const result = await db!.query(`INSERT INTO QUESTIONS (quizId, title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3) VALUES (?, ?, ?, ?, ?, ?)`,
        [quizId, question.title, question.correctAnswer, question.incorrectAnswer1, question.incorrectAnswer2, question.incorrectAnswer3]
        )
        return result;
    } catch (error) {
        throw createHttpError(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}