module.exports = {
    /**
     * 
     * @param {string} userName 
     */
    async getCurrentlyWatching(userName) {
        const endPoint = `https://api.myanimelist.net/v2/users/${userName}/animelist?status=watching&limit=1000`;

        try {
            const res = await fetch(endPoint, {
                headers: {
                    "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID,
                    "Accept": "application/json"
                }
            });
    
            if(!res.ok) return null;

            const json = await res.json();

            return json.data.map(entry => entry.node.title);

        } catch(err) {
            console.error(err);
        }

    }
}