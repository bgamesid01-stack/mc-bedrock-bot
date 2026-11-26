const Bot = require('./bot')
const log = require('./logger')

const bot = new Bot()
bot.start()

process.on('SIGINT', () => bot.stop())
process.on('SIGTERM', () => bot.stop())
process.on('unhandledRejection', (e) => log.error('Unhandled rejection:', e))
process.on('uncaughtException', (e) => log.error('Uncaught exception:', e))
