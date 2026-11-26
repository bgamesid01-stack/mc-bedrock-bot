require('dotenv').config()

const bool = (v, d) =>
  v === undefined || v === '' ? d : ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase())
const int = (v, d) => (Number.isFinite(parseInt(v, 10)) ? parseInt(v, 10) : d)

module.exports = {
  host: process.env.SERVER_HOST || '127.0.0.1',
  port: int(process.env.SERVER_PORT, 19132),
  username: process.env.BOT_USERNAME || 'BotServer',
  offline: bool(process.env.OFFLINE, true),
  version: process.env.MC_VERSION || undefined,
  prefix: process.env.COMMAND_PREFIX || '!',
  admins: (process.env.ADMINS || '').split(',').map((s) => s.trim()).filter(Boolean),
  welcomeMessage: process.env.WELCOME_MESSAGE || 'Bot aktif! Ketik !help',
  antiAfkSeconds: int(process.env.ANTI_AFK_SECONDS, 30),
  reconnectDelayMs: int(process.env.RECONNECT_DELAY_SECONDS, 5) * 1000,
  reconnectMaxDelayMs: int(process.env.RECONNECT_MAX_DELAY_SECONDS, 60) * 1000
}
