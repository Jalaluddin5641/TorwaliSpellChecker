// Torwali Dictionary logic
class TorwaliDictionary {
    constructor() {
        this.wordSet = new Set();
        this.wordList = [];
        this.isLoaded = false;
        this.initialize();
    }

    initialize() {
        try {
            // Check if the data file loaded the array
            if (typeof torwaliWordlist !== 'undefined') {
                this.wordList = [...torwaliWordlist].sort((a, b) => a.localeCompare(b));
                this.wordSet = new Set(this.wordList);
                this.isLoaded = true;
            } else {
                console.warn("torwaliWordlist not found");
                this.wordList = [];
                this.isLoaded = true;
            }
        } catch (error) {
            console.error("Init failed:", error);
            this.isLoaded = true;
        }
    }

    isValidWord(word) {
        if (!word) return false;
        const searchWord = word.trim(); // Torwali is case-sensitive for some characters, so we avoid toLowerCase() if needed
        return this.wordSet.has(searchWord);
    }

    getSuggestions(word) {
        // Simple suggestion logic: find words starting with the same first two letters
        const prefix = word.substring(0, 2);
        return this.wordList
            .filter(w => w.startsWith(prefix))
            .slice(0, 5);
    }

    getStats() {
        return { totalWords: this.wordList.length };
    }
}

// Attach to window so taskpane.js and commands.js can see it
window.dictionary = new TorwaliDictionary();
