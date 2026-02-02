// Torwali Dictionary using pre-loaded wordlist
class TorwaliDictionary {
    constructor() {
        this.wordSet = new Set();
        this.wordList = [];
        this.isLoaded = false;
        this.initialize();
    }

    // Initialize with wordlist
    initialize() {
        try {
            // Try to load from wordlist-data.js
            if (typeof torwaliWordlist !== 'undefined') {
                // Add all words to Set for fast lookup
                for (const word of torwaliWordlist) {
                    const cleanWord = word.toLowerCase().trim();
                    if (cleanWord) {
                        this.wordSet.add(cleanWord);
                        this.wordList.push(word); // Keep original for display
                    }
                }
                this.isLoaded = true;
                console.log(`Dictionary loaded: ${this.wordSet.size} words`);
            } else {
                // Fallback to empty dictionary
                console.warn("torwaliWordlist not found, using empty dictionary");
                this.isLoaded = true;
            }
        } catch (error) {
            console.error("Failed to initialize dictionary:", error);
            this.isLoaded = true;
        }
    }

    // Check if word is valid - OPTIMIZED using Set
    isValidWord(word) {
        if (!this.isLoaded || !word || typeof word !== 'string') {
            return false;
        }
        
        const searchWord = word.toLowerCase().trim();
        return searchWord && this.wordSet.has(searchWord);
    }

    // Get suggestions for misspelled word
    getSuggestions(word, maxSuggestions = 5) {
        if (!this.isLoaded || !word) {
            return [];
        }
        
        const searchWord = word.toLowerCase();
        const suggestions = [];
        
        // Simple distance-based suggestions
        for (const dictWord of this.wordList) {
            if (suggestions.length >= maxSuggestions) break;
            
            const distance = this.calculateSimilarity(searchWord, dictWord.toLowerCase());
            if (distance <= 3) { // Allow 3 character differences
                suggestions.push({
                    word: dictWord,
                    distance: distance
                });
            }
        }
        
        // Sort by similarity and return words
        return suggestions
            .sort((a, b) => a.distance - b.distance)
            .slice(0, maxSuggestions)
            .map(s => s.word);
    }

    // Calculate Levenshtein distance between two words
    calculateSimilarity(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        
        const matrix = [];
        
        // Initialize matrix
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        
        // Fill matrix
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const cost = a.charAt(j - 1) === b.charAt(i - 1) ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,     // deletion
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j - 1] + cost // substitution
                );
            }
        }
        
        return matrix[b.length][a.length];
    }

    // Add custom word to dictionary
    addWord(word) {
        if (!word || typeof word !== 'string') {
            return false;
        }
        
        const trimmedWord = word.trim();
        const lowerWord = trimmedWord.toLowerCase();
        
        if (!trimmedWord || this.wordSet.has(lowerWord)) {
            return false;
        }
        
        // Add to set for fast lookup
        this.wordSet.add(lowerWord);
        
        // Add to list for suggestions and display
        this.wordList.push(trimmedWord);
        
        return true;
    }

    // Get dictionary statistics
    getStats() {
        return {
            totalWords: this.wordSet.size,
            isLoaded: this.isLoaded,
            sample: this.wordList.slice(0, 5)
        };
    }
}

// Create global instance
const dictionary = new TorwaliDictionary();

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TorwaliDictionary;
    module.exports.dictionary = dictionary;
}

if (typeof window !== 'undefined') {
    window.TorwaliDictionary = TorwaliDictionary;
    window.torwaliDictionary = dictionary;
}
