import { StatusCodes } from 'http-status-codes';
import { db } from '../database.ts';
import { shuffleArray } from '../global.ts';
import { getDbQuizById, getDbQuizQuestionById, getDbQuizQuestionByQuizId, getDbQuizzes, insertQuestionDb, insertQuizDb } from './service.ts';

export type Question = {
    title: string,
    correctAnswer: string,
    incorrectAnswer1: string,
    incorrectAnswer2: string,
    incorrectAnswer3: string
}

export const getQuizzes = async (req: any, res: any) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    const offset = (page - 1) * pageSize;
    const quizzes = await getDbQuizzes(pageSize, offset);
    res.send(quizzes);
    return;
}

export const getQuizById = async (req: any, res: any) => {
    const quizId = req.params.id;
    const quiz = await getDbQuizById(quizId);
    const questions = await getDbQuizQuestionByQuizId(quizId);

    if (quiz.length == 0 || questions.length == 0) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }
    const quizWithQuestions = {
        ...quiz[0],
        questions: questions
    }
    res.send(quizWithQuestions);
    return;
}

export const getQuizQuestionDuo = async (req: any, res: any) => {
    const quizId = req.params.id;
    const questionId = req.params.questionId;
    const quiz = await getDbQuizById(quizId);
    const questions = await getDbQuizQuestionByQuizId(quizId);
    if (quiz.length == 0 || questions.length == 0) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }
    const answerRand = Math.random() * 3;
    const questionDuo = {
        title: quiz[0].title,
        quizId: quiz[0].id,
        mode: "duo",
        questionTitle: questions[0].title,
        correctAnswer: questions[0].correctAnswer,
        answer: shuffleArray([questions[0].correctAnswer,
        answerRand < 1 ? questions[0].incorrectAnswer1 : answerRand < 2 ? questions[0].incorrectAnswer2 : questions[0].incorrectAnswer3])
    }
    res.send(questionDuo);
    return;
}

export const getQuizQuestion = async (req: any, res: any) => {
    const quizId = req.params.id;
    const questionId = req.params.questionId;
    const quiz = await getDbQuizById(quizId);
    const questions = await getDbQuizQuestionById(questionId);
    if (quiz.length == 0 || questions.length == 0) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }
    const allAnswers = [
        questions[0].correctAnswer,
        questions[0].incorrectAnswer1,
        questions[0].incorrectAnswer2,
        questions[0].incorrectAnswer3
    ];
    const shuffleAnswers = shuffleArray(allAnswers);
    const questionAll = {
        title: quiz[0].title,
        quizId: quiz[0].id,
        mode: "normal",
        questionTitle: questions[0].title,
        correctAnswer: questions[0].correctAnswer,
        answer: shuffleAnswers
    }
    res.send(questionAll);
    return;
};

export const insertQuiz = async (req: any, res: any) => {
    const { title, autor, question } = req.body;
    console.log(title, " ", autor ? autor : null, " ", question);
    try {
        const allQuestions: Question[] = JSON.parse(question);
        const result = await insertQuizDb(title, autor ? autor : null, allQuestions);
        const response = {
            ...result,
            insertId: Number(result.insertId)
        };
        console.log('Inserted quiz with ID:', response.insertId);
        
        for (const questionItem of allQuestions) {
            await insertQuestionDb(response.insertId, questionItem);
        }
        
        res.json(response);
    } catch (error) {
        console.error('Error parsing questions:', error);
        res.status(400).send('Invalid question format');
    }
}