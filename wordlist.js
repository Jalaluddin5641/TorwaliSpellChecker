class TorwaliDictionary {
    constructor() {
        this.wordSet = new Set();
        this.isLoaded = false;
        this.initialize();
    }

    initialize() {
        try {
            // Check if the variable from wordlist-data.js is available
            if (typeof torwaliWordlist !== 'undefined') {
                // Normalize every word in your list to NFC format
                const normalizedList = torwaliWordlist.map(word => 
                    word.trim().normalize('NFC')
                );
                this.wordSet = new Set(normalizedList);
                this.isLoaded = true;
                console.log("Torwali Dictionary successfully normalized and loaded.");
            }
        } catch (error) {
            console.error("Dictionary initialization failed:", error);
        }
    }

    isValidWord(word) {
        if (!word) return false;
        
        // 1. Trim spaces
        // 2. Normalize to NFC (This is the most important part for آ or ؤ)
        // 3. Remove invisible characters (ZWNJ, etc.)
        const cleanWord = word.trim()
                              .normalize('NFC')
                              .replace(/[\u200B-\u200D\uFEFF]/g, "");
                              
        return this.wordSet.has(cleanWord);
    }

    getStats() {
        return { totalWords: this.wordSet.size };
    }
}

window.dictionary = new TorwaliDictionary();
