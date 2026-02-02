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
                // ڈیٹا کو صاف اور نارملائز کریں
                this.wordList = torwaliWordlist.map(w => w.normalize('NFC').trim());
                this.wordSet = new Set(this.wordList);
                this.isLoaded = true;
            }
        } catch (error) {
            console.error("Init failed:", error);
        }
    }

    isValidWord(word) {
        if (!word) return false;
        const searchWord = word.trim().normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, "");
        return this.wordSet.has(searchWord);
    }

    // بہترین تجاویز کے لیے فنکشن
    getSuggestions(word) {
        const target = word.trim().normalize('NFC');
        
        // صرف لغت میں موجود الفاظ میں سے مماثلت تلاش کریں
        return this.wordList
            .map(w => ({
                word: w,
                score: this.calculateSimilarity(target, w)
            }))
            .filter(item => item.score < 3) // صرف وہ الفاظ جو بہت قریب ہوں
            .sort((a, b) => a.score - b.score)
            .slice(0, 5)
            .map(item => item.word);
    }
addWord(word) {
    const normalized = word.trim().normalize('NFC');
    if (!this.wordSet.has(normalized)) {
        this.wordSet.add(normalized);
        this.wordList.push(normalized);
        return true;
    }
    return false;
}
    // Levenshtein Distance Algorithm
    calculateSimilarity(s1, s2) {
        const costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0) costs[j] = j;
                else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    getStats() {
        return { totalWords: this.wordSet.size };
    }
}

window.dictionary = new TorwaliDictionary();
