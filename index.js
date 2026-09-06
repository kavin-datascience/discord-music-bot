require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Kazagumo } = require('kazagumo');
const { Connectors } = require('shoukaku');

// ---- 1. Create the Discord client ----
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

// ---- 2. Connect to your Lavalink server (must be running separately) ----
const Nodes = [
  {
    name: 'main-node',
    url: `${process.env.LAVALINK_HOST}:${process.env.LAVALINK_PORT}`,
    auth: process.env.LAVALINK_PASSWORD,
  },
];

client.kazagumo = new Kazagumo(
  {
    defaultSearchEngine: 'youtube',
    send: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    },
  },
  new Connectors.DiscordJS(client),
  Nodes
);

// Log whether Lavalink connected successfully - very useful for debugging
client.kazagumo.shoukaku.on('ready', (name) => console.log(`[Lavalink] Node "${name}" connected.`));
client.kazagumo.shoukaku.on('error', (name, error) => console.error(`[Lavalink] Node "${name}" error:`, error));
client.kazagumo.shoukaku.on('close', (name, code, reason) => console.warn(`[Lavalink] Node "${name}" closed: ${code} ${reason}`));

// ---- 3. Load slash commands from the /commands folder ----
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// ---- 4. Handle slash command interactions ----
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(`Error running /${interaction.commandName}:`, error);
    const reply = { content: 'Something went wrong running that command.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

// ---- 5. Handle track end / queue end events so the bot behaves sensibly ----
client.kazagumo.on('playerStart', (player, track) => {
  console.log(`[Playback] Started playing: ${track.title}`);
});

client.kazagumo.on('playerException', (player, error) => {
  console.error('[Playback] Track exception:', error);
  const channel = client.channels.cache.get(player.textId);
  const rawMessage = error?.exception?.message || error?.message || 'unknown error';
  const shortMessage = rawMessage.length > 300 ? rawMessage.slice(0, 300) + '...' : rawMessage;
  if (channel) channel.send(`Error playing that track: ${shortMessage}`);
});

client.kazagumo.on('playerStuck', (player, data) => {
  console.error('[Playback] Player stuck:', data);
  const channel = client.channels.cache.get(player.textId);
  if (channel) channel.send('Playback got stuck and was skipped.');
});

client.kazagumo.on('playerEnd', (player) => {
  const channel = client.channels.cache.get(player.textId);
  if (channel) channel.send('Queue finished — add more songs with `/play`!');
});

client.kazagumo.on('playerEmpty', (player) => {
  const channel = client.channels.cache.get(player.textId);
  if (channel) channel.send('Nothing left to play, leaving the voice channel.');
  player.destroy();
});

// ---- 6. Log in ----
client.once('ready', () => {
  console.log(`Nyra is online as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
