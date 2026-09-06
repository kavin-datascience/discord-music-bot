# Nyra — Simple Music Bot Starter

This is a minimal but real working music bot with `/play`, `/skip`, `/stop`, and `/queue`.
Once this runs, we can add filters, playlists, 24/7 mode, etc.

## What you need installed on your computer

1. **Node.js** (v18 or newer) — https://nodejs.org
2. **Java 17+** — required to run Lavalink (the audio engine) — https://adoptium.net
3. **Lavalink.jar** — download the latest release from:
   https://github.com/lavalink-devs/Lavalink/releases
   (Grab the file called `Lavalink.jar`)

## Setup steps

### 1. Install bot dependencies
Open a terminal in this folder and run:
```
npm install
```

### 2. Configure your secrets
- Rename `.env.example` to `.env`
- Open it and fill in:
  - `DISCORD_TOKEN` — from the Bot tab in the Discord Developer Portal
  - `CLIENT_ID` — your Application ID, found on the General Information page of your app

### 3. Start Lavalink (the audio server)
Put `Lavalink.jar` in this same folder (or note its path), then run:
```
java -jar Lavalink.jar
```
Leave this terminal window open — Lavalink needs to keep running whenever your bot is online.
It uses the `application.yml` file already included here (default password: `youshallnotpass` —
you can change it, just make sure `.env`'s `LAVALINK_PASSWORD` matches).

You'll know it worked when you see a line like `Lavalink is ready to accept connections.`

### 4. Register your slash commands
In a **new** terminal window (keep Lavalink running in the other one):
```
npm run deploy
```
This tells Discord about `/play`, `/skip`, `/stop`, `/queue`. Global commands can take up to an
hour to show up — for instant testing, see the note in `deploy-commands.js`.

### 5. Start the bot
```
npm start
```
You should see `Nyra is online as YourBotName#0000` and `[Lavalink] Node "main-node" connected.`

### 6. Test it
In your Discord server, join a voice channel, then run `/play never gonna give you up`.

## Troubleshooting
- **"Node not connected" errors** → Lavalink isn't running, or the port/password in `.env`
  doesn't match `application.yml`.
- **Commands don't show up in Discord** → wait up to an hour for global commands, or double check
  `CLIENT_ID` is correct and you ran `npm run deploy`.
- **Bot joins but plays nothing** → check the Lavalink terminal for errors; YouTube occasionally
  changes things that require updating Lavalink or its YouTube plugin.

## Next steps once this works
- Add audio filters (bassboost, nightcore, 8D)
- Add `/247` for staying in voice channels permanently
- Add saved playlists
- Deploy to Oracle Cloud so it runs even when your computer is off
