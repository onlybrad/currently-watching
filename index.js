const {Client, GatewayIntentBits} = require("discord.js");
const commandHandler = require("./handlers/commandHandler");

const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
]});

client.on("messageCreate", commandHandler);
client.login(process.env.DISCORD_BOT_TOKEN);

process.removeAllListeners("warning");
