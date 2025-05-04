// commands/quiz.js
module.exports = (bot) => {
    bot.onText(/\/quiz/, (msg) => {
        const chatId = msg.chat.id;

        const questions = [
            {
                question: "Qual foi o primeiro título internacional conquistado pela FURIA no CS:GO?",
                options: ["DreamHack Masters Las Vegas 2017", "ESL One Cologne 2019", "IEM Katowice 2020", "StarLadder Major Berlin 2019"],
                answer: "DreamHack Masters Las Vegas 2017"
            },
            {
                question: "Quem é o jogador da FURIA conhecido por ser um dos melhores AWPer do mundo?",
                options: ["yuurih", "kNgV-", "art", "VINI"],
                answer: "yuurih"
            },
            {
                question: "Em que torneio a FURIA obteve sua primeira vitória em um evento Major?",
                options: ["IEM Katowice 2019", "StarLadder Major Berlin 2019", "ESL Pro League Season 11", "IEM Beijing 2020"],
                answer: "StarLadder Major Berlin 2019"
            },
            {
                question: "Qual é a composição atual da FURIA CS:GO (incluindo o capitão)?",
                options: ["art, yuurih, VINI, kNgV-, drop", "art, yuurih, VINI, KSCERATO, HEN1", "art, yuurih, VINI, KSCERATO, drop", "art, KSCERATO, VINI, yuurih, HEN1"],
                answer: "art, yuurih, VINI, KSCERATO, drop"
            },
            {
                question: "Qual jogador da FURIA foi eleito o MVP da ECS Season 8 Finals?",
                options: ["art", "yuurih", "kNgV-", "VINI"],
                answer: "yuurih"
            }
        ];

        let currentQuestionIndex = 0;
        let score = 0;

        const askQuestion = () => {
            const currentQuestion = questions[currentQuestionIndex];
            const options = currentQuestion.options.map(option => ({
                text: option,
                callback_data: option
            }));

            const questionText = currentQuestion.question;

            const optionsMarkup = {
                reply_markup: {
                    inline_keyboard: options.map(option => [option])
                }
            };

            bot.sendMessage(chatId, questionText, optionsMarkup);
        };

        const checkAnswer = (callbackQuery) => {
            const userAnswer = callbackQuery.data;
            const correctAnswer = questions[currentQuestionIndex].answer;

            if (userAnswer === correctAnswer) {
                score++;
                bot.sendMessage(callbackQuery.message.chat.id, "✅ Resposta correta!");
            } else {
                bot.sendMessage(callbackQuery.message.chat.id, "❌ Resposta errada!");
            }

            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                askQuestion();
            } else {
                bot.sendMessage(callbackQuery.message.chat.id, `🎉 Você completou o quiz! Sua pontuação final é: ${score} de ${questions.length}.`);
            }
        };

        askQuestion();

        
    });

    bot.on("callback_query", (callbackQuery) => {
        checkAnswer(callbackQuery);
    });
};
