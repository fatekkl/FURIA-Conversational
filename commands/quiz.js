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

    const userStates = {}; // Armazena o progresso por usuário

    // Inicia o quiz
    bot.onText(/\/quiz/, (msg) => {
        const chatId = msg.chat.id;

        userStates[chatId] = {
            currentQuestionIndex: 0,
            score: 0
        };

        sendQuestion(chatId);
    });

    // Envia pergunta com inline keyboard
    const sendQuestion = (chatId) => {
        const state = userStates[chatId];
        if (!state) return;

        const current = questions[state.currentQuestionIndex];
        const optionsMarkup = {
            reply_markup: {
                inline_keyboard: current.options.map(option => [
                    { text: option, callback_data: `quiz|${option}` }
                ])
            }
        };

        bot.sendMessage(chatId, current.question, optionsMarkup);
    };

    // Trata respostas de qualquer usuário, sem depender de comando anterior
    bot.on("callback_query", (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;

        const [prefix, userAnswer] = callbackQuery.data.split('|');

        if (prefix !== "quiz") {
            // Ignora outras interações que não sejam do quiz
            return;
        }

        const state = userStates[chatId];
        if (!state) {
            bot.sendMessage(chatId, "❗ Por favor, inicie o quiz com /quiz primeiro.");
            bot.answerCallbackQuery(callbackQuery.id);
            return;
        }

        const correctAnswer = questions[state.currentQuestionIndex].answer;

        if (userAnswer === correctAnswer) {
            state.score++;
            bot.sendMessage(chatId, "✅ Resposta correta!");
        } else {
            bot.sendMessage(chatId, `❌ Resposta errada! A correta era: ${correctAnswer}`);
        }

        state.currentQuestionIndex++;

        if (state.currentQuestionIndex < questions.length) {
            sendQuestion(chatId);
        } else {
            bot.sendMessage(chatId, `🎉 Você finalizou o quiz! Pontuação final: ${state.score}/${questions.length}.`);
            delete userStates[chatId];
        }

        // Confirmação da interação com o botão
        bot.answerCallbackQuery(callbackQuery.id);
    });
};
