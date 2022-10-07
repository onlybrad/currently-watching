const GRAPHQL_URL = "https://graphql.anilist.co";

/**
 * @param {"ANIME"|"MANGA"} type 
 * @param {"CURRENT"|"PLANNING"|"COMPLETED"|"DROPPED"|"PAUSED"|"REPEATING"} status 
 */
function getGraphQlQuery(type,status) {
    return(
    `query ($userName: String) {
        ${type.toLowerCase()}: MediaListCollection(userName: $userName, type: ${type}, status: ${status}) {
            lists {
                entries {
                    media {
                        title {
                            romaji
                        }
                    }
                }
            }
        }
    }`);
}

module.exports = {
    /**
     * @param {string} userName 
     */
    async getCurrentlyWatching(userName) {
        const body = JSON.stringify({
            query: getGraphQlQuery("ANIME","CURRENT"),
            variables : {userName}
        });

        try {
            const res = await fetch(GRAPHQL_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body
            });
    
            if(!res.ok) return null;
            
            const json = await res.json();
            
            return json.data.anime.lists[0].entries.map(entry => entry.media.title.romaji);

        } catch(err) {
            console.error(err);
        }
    }
}