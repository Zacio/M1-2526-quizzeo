
export type Question = {
    title: string,
    correctAnswer: string,
    incorrectAnswer1: string,
    incorrectAnswer2: string,
    incorrectAnswer3: string
};

export const modes = ["hidden","square","duo"] as const
export type Mode = typeof modes[number]
