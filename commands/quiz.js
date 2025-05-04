module.exports = (bot) => {
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

    // Estado de cada usuário
    const userState = {};

    bot.onText(/\/quiz/, (msg) => {
        const chatId = msg.chat.id;

        userState[chatId] = {
            currentQuestionIndex: 0,
            score: 0
        };

        askQuestion(chatId);
    });

    const askQuestion = (chatId) => {
        const state = userState[chatId];
        const currentQuestion = questions[state.currentQuestionIndex];

        const options = currentQuestion.options.map(option => ({
            text: option,
            callback_data: option
        }));

        const optionsMarkup = {
            reply_markup: {
                inline_keyboard: options.map(option => [option])
            }
        };

        bot.sendMessage(chatId, currentQuestion.question, optionsMarkup);
    };

    const checkAnswer = (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const state = userState[chatId];

        if (!state) {
            bot.sendMessage(chatId, "❗ Comece o quiz com /quiz primeiro!");
            return;
        }

        const userAnswer = callbackQuery.data;
        const correctAnswer = questions[state.currentQuestionIndex].answer;

        if (userAnswer === correctAnswer) {
            state.score++;
            bot.sendMessage(chatId, "✅ Resposta correta!");
        } else {
            bot.sendMessage(chatId, `❌ Resposta errada! A correta era: ${correctAnswer}`);
        }

        state.currentQuestionIndex++;

        if (state.currentQuestionIndex < questions.length) {
            askQuestion(chatId);
        } else {
            bot.sendMessage(chatId, `🎉 Você completou o quiz! Sua pontuação final é: ${state.score} de ${questions.length}.`);
            delete userState[chatId]; // Limpa o progresso
        }

        // Remove o botão de resposta (opcional)
        bot.answerCallbackQuery(callbackQuery.id);
    };

    bot.on("callback_query", checkAnswer);
};
