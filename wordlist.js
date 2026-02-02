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
            if (typeof torwaliWordlist !== 'undefined') {
                // Normalize all words in the data list to NFC (Standard Unicode form)
                this.wordList = torwaliWordlist.map(w => w.normalize('NFC').trim());
                this.wordSet = new Set(this.wordList);
                this.isLoaded = true;
                console.log("Torwali Dictionary Loaded.");
            } else {
                console.warn("torwaliWordlist not found");
                this.isLoaded = true;
            }
        } catch (error) {
            console.error("Init failed:", error);
            this.isLoaded = true;
        }
    }

    isValidWord(word) {
        if (!word) return false;

        // 1. Trim whitespace
        // 2. Normalize to NFC (Fixes issues where 'کھ' might be stored differently than typed)
        // 3. Remove Zero-Width Non-Joiner (common in Arabic script typing)
        const searchWord = word.trim()
            .normalize('NFC')
            .replace(/[\u200B-\u200D\uFEFF]/g, "");

        return this.wordSet.has(searchWord);
    }

    getSuggestions(word) {
        const searchWord = word.trim().normalize('NFC');
        const prefix = searchWord.substring(0, 1); // Use 1 character for broader suggestions
        
        return this.wordList
            .filter(w => w.startsWith(prefix))
            .slice(0, 5);
    }

    getStats() {
        return { totalWords: this.wordSet.size };
    }
}

window.dictionary = new TorwaliDictionary();
