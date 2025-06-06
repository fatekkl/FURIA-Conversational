# FURIA Bot

O FURIA Bot é um bot do Telegram que fornece informações sobre a equipe FURIA, como seus jogos recentes, calendário completo e outras funcionalidades. Ele também permite testar seus conhecimentos com quizzes sobre a equipe.

Veja o bot em: https://web.telegram.org/k/#@ConversationalFURIA_bot

## Funcionalidades

- **/start**: Inicia o bot e dá as boas-vindas ao usuário.
- **/menu**: Exibe os comandos disponíveis no bot.
- **/jogos**: Exibe opções sobre os últimos jogos ou o calendário completo de jogos da equipe FURIA.
- **/noticias**: Exibe as últimas notícias sobre a equipe FURIA.
- **/quiz**: Teste seus conhecimentos sobre a FURIA com um quiz interativo (a funcionalidade do quiz também pode ser adicionada no futuro).

## Instalação

### 1. Clonar o repositório

Clone o repositório do bot em sua máquina local:

```bash
git clone https://github.com/fatekkl/furia-bot.git
cd furia-bot
```

### 2. Instalar dependências

Instale as dependências do projeto utilizando o NPM:

```bash
npm install
```

### 3. Configuração

Crie um arquivo `.env` na raiz do projeto e adicione seu **token do bot do Telegram**:

```dotenv
BOT_TOKEN=seu_token_aqui
```

### 4. Executar o bot

Para rodar o bot, basta executar o seguinte comando:

```bash
node index.js
```

Agora, o bot estará rodando e pronto para responder aos comandos no Telegram.

## Comandos

- **/start**: Inicia o bot e exibe uma mensagem de boas-vindas.
- **/menu**: Exibe os comandos disponíveis para o usuário.
- **/jogos**: Exibe uma lista dos últimos jogos da FURIA ou o calendário completo de jogos.
- **/noticias**: Exibe as últimas notícias relacionadas à FURIA.
- **/quiz**: Teste seus conhecimentos com um quiz interativo sobre a FURIA.

### Jogos Recentes

Quando o usuário seleciona a opção **Jogos Recentes**, o bot consulta o serviço de resultados de partidas da FURIA e exibe os 5 jogos mais recentes, incluindo os times, placar e evento.

### Calendário Completo

Quando o usuário escolhe a opção **Calendário Completo**, o bot exibe os próximos 25 jogos, com informações sobre os times, placar e evento de cada partida.

## Arquivos

- `index.js`: Arquivo principal que inicializa o bot, prepara os comandos e interações.
- `commands/`: Pasta que contém o arquivo responsável por definir a funcionalidade de cada comando.
- `models/`: Pasta que contém arquivos de classes ou interfaces, definindo regras pro código e melhorando a organização.
- `services/services.js`: Serviço que coleta as informações dos últimos jogos da FURIA através de scraping na HLTV usando Puppeteer.
- `.env`: Arquivo de configuração que contém o token do bot do Telegram.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Telegram Bot API**: API utilizada para interagir com o Telegram.
- **Puppeteer**: Biblioteca para scraping de dados da web.

## Possíveis Melhorias 

Durante o desenvolvimento do projeto, foi um desafio otimizar obter os dados de notícias e jogos, decidi seguir utilizando Web Scrapping e isso custou determinado desempenho para o projeto, que apesar de ter conseguido otimizar bastante, cerca de 52%. Ainda poderia ser otimizado com melhorias no tratamento de erros e integração com uma API, evitando o uso do puppeteer que é relativamente pesado.

## Licença

Este projeto está licenciado sob a licença [Creative Commons Atribuição-NãoComercial 4.0 Internacional (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/deed.pt).  
Você pode copiar e redistribuir o material em qualquer meio ou formato e adaptá-lo, **desde que não o utilize para fins comerciais** e forneça o devido crédito.

## TODO

- [x] Criar comando para exibição das últimas notícias.
- [x] Adicionar prospecção de melhorias no README.
- [x] Estudar fontes para exibição dos jogos FUTUROS.
- [x] Criar classe para organizar melhor as partidas.
- [x] Hospedar o Bot.
