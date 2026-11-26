# MC Bedrock Bot

Bot Minecraft Bedrock Edition (Node.js + [bedrock-protocol](https://github.com/PrismarineJS/bedrock-protocol)).
Fitur: auto-join, auto-reconnect (exponential backoff), perintah chat, anti-AFK, Docker.

## Jalankan
```bash
git clone https://github.com/USERNAME/mc-bedrock-bot.git
cd mc-bedrock-bot
npm install
cp .env.example .env   # isi SERVER_HOST, SERVER_PORT, dll
npm start
```

### Docker
```bash
cp .env.example .env
docker compose up -d --build
docker compose logs -f
```

## Perintah di chat game
`!help`, `!ping`, `!uptime`, `!say <teks>` (admin), `!stop` (admin).
Tambah perintah baru di `src/commands.js`.

## Catatan
- Server offline-mode: `OFFLINE=true` dan `online-mode=false` di `server.properties`.
- Server online-mode: `OFFLINE=false`, login Microsoft lewat kode yang tampil di console (token tersimpan di `auth-cache/`).
- Jika versi tidak cocok, isi `MC_VERSION` (mis. `1.21.50`).
- Server Bedrock memakai UDP, pastikan port 19132/UDP terbuka.
