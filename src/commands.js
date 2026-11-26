// Tambah perintah baru cukup dengan menambah entri di sini.
// handler menerima: { sender, args, say, bot, isAdmin }
const commands = {
  help: {
    desc: 'Daftar perintah',
    run: ({ say, bot }) => {
      const list = Object.keys(commands).map((c) => bot.config.prefix + c).join(', ')
      say(`Perintah: ${list}`)
    }
  },
  ping: {
    desc: 'Tes bot',
    run: ({ say, sender }) => say(`Pong, ${sender}!`)
  },
  uptime: {
    desc: 'Lama bot aktif',
    run: ({ say, bot }) => {
      const s = Math.floor((Date.now() - bot.startedAt) / 1000)
      say(`Aktif ${Math.floor(s / 3600)}j ${Math.floor((s % 3600) / 60)}m ${s % 60}d`)
    }
  },
  say: {
    desc: 'Bot mengulang pesan (admin)',
    admin: true,
    run: ({ say, args }) => say(args.join(' ') || '...')
  },
  stop: {
    desc: 'Matikan bot (admin)',
    admin: true,
    run: ({ say, bot }) => {
      say('Bot dimatikan. Sampai jumpa!')
      setTimeout(() => bot.stop(), 500)
    }
  }
}

module.exports = commands
