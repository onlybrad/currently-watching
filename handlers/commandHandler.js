const { EmbedBuilder } = require("discord.js");
const { getCurrentlyWatching: anilistCurrentlyWatching } = require("../websites/anilist");
const { getCurrentlyWatching: malCurrentlyWatching } = require("../websites/myanimelist");

const COMMAND_PREFIX = "!cw";
const COMMAND_REGEX = new RegExp(`${COMMAND_PREFIX} ([^\s]*) (mal|anilist)?$`);

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
    if(!message.content.startsWith(COMMAND_PREFIX)) return;

    const match = message.content.match(COMMAND_REGEX);

    if(!match) return;

    const [,userName,website] = match;

    if(!userName) return;

    if(!website) {
        const [anilistResults,malResults] = await Promise.all([
            anilistCurrentlyWatching(userName),
            malCurrentlyWatching(userName)
        ]);
    
        return message.channel.send(createMessage(userName, anilistResults, malResults));
    }

    if(website.toLowerCase() === "mal") {
        return message.channel.send(createMessage(userName,null,await malCurrentlyWatching(userName)));
    }

    if(website.toLowerCase() === "anilist") {
        return message.channel.send(createMessage(userName,await anilistCurrentlyWatching(userName)),null);
    }
}