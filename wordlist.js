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
                this.wordList = [...torwaliWordlist].sort((a, b) => a.localeCompare(b));
                this.wordSet = new Set(this.wordList);
                this.isLoaded = true;
                console.log(`Dictionary loaded: ${this.wordList.length} words`);
            } else {
                // Fallback to empty dictionary
                console.warn("torwaliWordlist not found, using empty dictionary");
                this.wordList = [];
                this.wordSet = new Set();
                this.isLoaded = true;
            }
        } catch (error) {
            console.error("Failed to initialize dictionary:", error);
            this.wordList = [];
            this.wordSet = new Set();
            this.isLoaded = true;
        }
    }

    // Check if word is valid
    isValidWord(word) {
        if (!this.isLoaded || !word || typeof word !== 'string') {
            return false;
        }
        
        const searchWord = word.toLowerCase().trim();
        if (!searchWord) return false;
        
        // Binary search for efficiency
        let left = 0;
        let right = this.wordList.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const midWord = this.wordList[mid].toLowerCase();
            
            if (midWord === searchWord) {
                return true;
            } else if (midWord < searchWord) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return false;
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
            .map(s => s.word);
    }

    // Calculate similarity between two words
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
        if (!trimmedWord || this.wordSet.has(trimmedWord)) {
            return false;
        }
        
        // Add to set
        this.wordSet.add(trimmedWord);
        
        // Insert in sorted position
        const index = this.findInsertionIndex(trimmedWord);
        this.wordList.splice(index, 0, trimmedWord);
        
        return true;
    }

    // Find where to insert a word to maintain sorted order
    findInsertionIndex(word) {
        let left = 0;
        let right = this.wordList.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const comparison = word.localeCompare(this.wordList[mid]);
            
            if (comparison === 0) {
                return mid; // Word already exists (shouldn't happen)
            } else if (comparison > 0) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return left;
    }

    // Get dictionary statistics
    getStats() {
        return {
            totalWords: this.wordList.length,
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