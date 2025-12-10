## Telegram Bot

The Telegram bot is a Node.js application responsible for interacting with the Telegram API.

-   **Runtime:** [Node.js](https://nodejs.org/)
-   **Web Framework:** [Express.js](https://expressjs.com/) for the web server that accompanies the bot.
-   **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) as the Object Data Mapper (ODM).
-   **Telegram API Client:** [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) to communicate with the Telegram Bot API.
-   **Template Engine:** [EJS](https://ejs.co/) for rendering dynamic web pages.
-   **Development Utilities:**
    -   [nodemon](https://nodemon.io/) to automatically restart the server during development.
    -   [concurrently](https://github.com/open-cli/concurrently) to run multiple npm scripts at the same time.
    -   [dotenv](https://github.com/motdotla/dotenv) to manage environment variables.
