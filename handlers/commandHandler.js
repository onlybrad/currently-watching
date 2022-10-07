const { EmbedBuilder } = require("discord.js");
const { getCurrentlyWatching: anilistCurrentlyWatching } = require("../websites/anilist");
const { getCurrentlyWatching: malCurrentlyWatching } = require("../websites/myanimelist");

const COMMAND_PREFIX = "!cw";

/**
 * @param {string} userName 
 * @param {string[]} anilistResults 
 * @param {string[]} malResults 
 */
 function createMessage(userName, anilistResults, malResults) {
    const embeds = [];
    
    if(anilistResults != null) {
        embeds.push(new EmbedBuilder()
            .setThumbnail("https://i.imgur.com/eWkMA6J.png")
            .setColor(0x0099FF)
            .setTitle(`${userName} is currently watching:`)
            .setDescription(anilistResults.join("\n"))
        );
    }

    if(malResults != null) {
        embeds.push(new EmbedBuilder()
            .setThumbnail("https://i.imgur.com/VSZa39P.png")
            .setColor(0x0099FF)
            .setTitle(`${userName} is currently watching:`)
            .setDescription(malResults.join("\n"))
        );
    }

    return embeds.length === 0 ? `username ${userName} not found.` : {embeds};
}

module.exports = async function(message) {
    if(
        !message.content.startsWith(COMMAND_PREFIX)           || //doesn't start with the prefix
        message.content.charAt(COMMAND_PREFIX.length) !== " " || //no space between the prefix and the username
        message.content.length < COMMAND_PREFIX.length + 2       //the command must be at least 2 characters more than the prefix
    ) return;

    const userName = message.content.substring(COMMAND_PREFIX.length + 1);
    const [anilistResults,malResults] = await Promise.all([
        anilistCurrentlyWatching(userName),
        malCurrentlyWatching(userName)
    ]);

    message.channel.send(createMessage(userName, anilistResults, malResults));
}