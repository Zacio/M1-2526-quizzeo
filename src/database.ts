import mariadb from "mariadb";
import type { Pool } from "mariadb";

export let db : Pool | null = null;

export async function initDatabase(){
    db = mariadb.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        connectionLimit: 15
    })

    //check if table QUIZZES exists
    const result = await db.query(`
        SHOW TABLES LIKE 'QUIZZES'
    `)
    if(result.length == 0){
        await db.execute(`
            CREATE TABLE USERS (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )`
        )

        await db.execute(`
            CREATE TABLE QUIZZES (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                autor INT,
                FOREIGN KEY (autor) REFERENCES USERS(id)
            )
        `)

        await db.execute(`
            CREATE TABLE QUESTIONS (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title TEXT,
                correctAnswer TEXT,
                incorrectAnswer1 TEXT,
                incorrectAnswer2 TEXT,
                incorrectAnswer3 TEXT,
                quizId INT
            )
        `)

        //generate a demo quizz on subject : france
        //generate 10 questions
        await db.execute(`
            INSERT INTO QUIZZES (title) VALUES ('Do you know France?')
        `)

        const quizzId = await db.query(`
            SELECT id FROM QUIZZES WHERE title = 'Do you know France?'
        `)

        await db.execute(`
            INSERT INTO QUESTIONS (title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, quizId) 
            VALUES 
            ('What is the capital of France?', 'Paris', 'London', 'Berlin', 'Madrid', ${quizzId[0].id}),
            ('What is the anthem of France?', 'La Marseillaise', 'God save the king', 'The Star-Spangled Banner', 'La Marseillaise', ${quizzId[0].id}),
            ('What is the currency of France?', 'Euro', 'Dollar', 'Pound', 'Yen', ${quizzId[0].id}),
            ('What is the population of France?', '66 million', '76 million', '86 million', '96 million', ${quizzId[0].id}),
            ('What is the language of France?', 'French', 'English', 'Spanish', 'German', ${quizzId[0].id}),
            ('What is the religion of France?', 'Christianity', 'Islam', 'Hinduism', 'Buddhism', ${quizzId[0].id}),
            ('What is the government of France?', 'Republic', 'Monarchy', 'Dictatorship', 'Communism', ${quizzId[0].id}),
            ('What is the economy of France?', 'Advanced', 'Developing', 'Third World', 'Fourth World', ${quizzId[0].id}),
            ('What is the education of France?', 'Free', 'Expensive', 'Cheap', 'Affordable', ${quizzId[0].id}),
            ('What is the healthcare of France?', 'Good', 'Bad', 'Average', 'Excellent', ${quizzId[0].id})
        `)

        console.log('Database initialized');
        
    }
    else{
        console.log('Database already initialized')
        const quizz = await db.query(`
            SELECT * FROM QUIZZES
        `)
        console.log(quizz)

        const questions = await db.query(`
            SELECT * FROM QUESTIONS where quizId = ${quizz[0].id}
        `)
        console.log(questions)
    }
}


