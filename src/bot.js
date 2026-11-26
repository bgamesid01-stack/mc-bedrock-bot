const bedrock = require('bedrock-protocol')
const config = require('./config')
const log = require('./logger')
const commands = require('./commands')

class Bot {
  constructor() {
    this.config = config
    this.client = null
    this.stopped = false
    this.attempt = 0
    this.startedAt = Date.now()
    this.afkTimer = null
    this.reconnectTimer = null
  }

  start() {
    this.stopped = false
    log.info(`Menghubungkan ke ${config.host}:${config.port} sebagai ${config.username}...`)

    const opts = {
      host: config.host,
      port: config.port,
      username: config.username,
      offline: config.offline,
      profilesFolder: './auth-cache'
    }
    if (config.version) opts.version = config.version

    try {
      this.client = bedrock.createClient(opts)
    } catch (e) {
      log.error('Gagal membuat client:', e.message)
      return this.scheduleReconnect()
    }

    const c = this.client

    c.on('join', () => log.info('Berhasil login ke server.'))

    c.on('spawn', () => {
      this.attempt = 0
      log.info('Bot sudah spawn di dunia. Status: AKTIF')
      setTimeout(() => this.chat(config.welcomeMessage), 2000)
      this.startAntiAfk()
    })

    c.on('text', (packet) => this.onText(packet))

    c.on('kick', (p) => log.warn('Di-kick dari server:', p && p.message))
    c.on('disconnect', (p) => log.warn('Terputus:', p && (p.message || p.reason)))
    c.on('error', (e) => log.error('Error:', e && e.message ? e.message : e))
    c.on('close', () => {
      log.warn('Koneksi ditutup.')
      this.cleanup()
      if (!this.stopped) this.scheduleReconnect()
    })
  }

  onText(packet) {
    if (packet.type !== 'chat') return
    const sender = packet.source_name
    const msg = (packet.message || '').trim()
    if (!sender || sender === config.username || !msg.startsWith(config.prefix)) return

    const [name, ...args] = msg.slice(config.prefix.length).split(/\s+/)
    const cmd = commands[name.toLowerCase()]
    if (!cmd) return this.chat(`Perintah tidak dikenal. Ketik ${config.prefix}help`)

    const isAdmin = config.admins.includes(sender)
    if (cmd.admin && !isAdmin) return this.chat('Kamu bukan admin.')

    log.info(`Perintah dari ${sender}: ${msg}`)
    try {
      cmd.run({ sender, args, isAdmin, bot: this, say: (t) => this.chat(t) })
    } catch (e) {
      log.error('Perintah gagal:', e.message)
    }
  }

  chat(message) {
    if (!this.client) return
    try {
      this.client.queue('text', {
        type: 'chat',
        needs_translation: false,
        source_name: this.client.username || config.username,
        xuid: '',
        platform_chat_id: '',
        filtered_message: '',
        message: String(message)
      })
    } catch (e) {
      log.error('Gagal kirim chat:', e.message)
    }
  }

  startAntiAfk() {
    this.stopAntiAfk()
    if (config.antiAfkSeconds <= 0) return
    this.afkTimer = setInterval(() => {
      try {
        this.client.queue('animate', {
          action_id: 'swing_arm',
          runtime_entity_id: this.client.entityId
        })
      } catch (_) {
        /* abaikan, anti-AFK hanya pelengkap */
      }
    }, config.antiAfkSeconds * 1000)
  }

  stopAntiAfk() {
    if (this.afkTimer) clearInterval(this.afkTimer)
    this.afkTimer = null
  }

  cleanup() {
    this.stopAntiAfk()
    this.client = null
  }

  scheduleReconnect() {
    if (this.reconnectTimer) return
    this.attempt++
    const delay = Math.min(config.reconnectDelayMs * 2 ** (this.attempt - 1), config.reconnectMaxDelayMs)
    log.info(`Reconnect dalam ${Math.round(delay / 1000)} detik (percobaan ke-${this.attempt})...`)
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.start()
    }, delay)
  }

  stop() {
    this.stopped = true
    clearTimeout(this.reconnectTimer)
    this.stopAntiAfk()
    try {
      if (this.client) this.client.close()
    } catch (_) {}
    log.info('Bot berhenti.')
    process.exit(0)
  }
}

module.exports = Bot
