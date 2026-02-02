let dictionary;
let errors = [];

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        // Initialize dictionary
        if (typeof TorwaliDictionary !== 'undefined') {
            dictionary = new TorwaliDictionary();
            setupEventListeners();
            
            // Show dictionary status
            const stats = dictionary.getStats();
            showStatus(`Torwali Dictionary: ${stats.totalWords} words loaded`, 'success', 'documentStatus');
        } else {
            showStatus("Error: Dictionary not loaded", "error", "documentStatus");
        }
    }
});

function setupEventListeners() {
    document.getElementById("checkDocument").onclick = checkDocument;
    document.getElementById("checkSelection").onclick = checkSelection;
    document.getElementById("addWord").onclick = addCustomWord;
    
    // Enter key for adding words
    document.getElementById("newWord").addEventListener("keypress", function(e) {
        if (e.key === "Enter") addCustomWord();
    });
}

async function checkDocument() {
    if (!dictionary) {
        showStatus("Dictionary not loaded", "error");
        return;
    }
    
    showLoading(true);
    clearResults();
    
    try {
        await Word.run(async (context) => {
            const body = context.document.body;
            const searchResults = body.search("[^\\s.,;!?\\n]+", { matchWildcards: true });
            context.load(searchResults, "text");
            
            await context.sync();
            
            errors = [];
            for (const range of searchResults.items) {
                const word = range.text.trim();
                if (word && !dictionary.isValidWord(word)) {
                    const suggestions = dictionary.getSuggestions(word);
                    errors.push({
                        word: word,
                        range: range,
                        suggestions: suggestions,
                        context: context
                    });
                }
            }
            
            displayResults();
            showStatus(`Found ${errors.length} spelling errors`, 'success');
        });
    } catch (error) {
        showStatus("Error: " + error.message, "error");
    } finally {
        showLoading(false);
    }
}

async function checkSelection() {
    if (!dictionary) {
        showStatus("Dictionary not loaded", "error");
        return;
    }
    
    showLoading(true);
    clearResults();
    
    try {
        await Word.run(async (context) => {
            const selection = context.document.getSelection();
            const searchResults = selection.search("[^\\s.,;!?\\n]+", { matchWildcards: true });
            context.load(searchResults, "text");
            
            await context.sync();
            
            errors = [];
            for (const range of searchResults.items) {
                const word = range.text.trim();
                if (word && !dictionary.isValidWord(word)) {
                    const suggestions = dictionary.getSuggestions(word);
                    errors.push({
                        word: word,
                        range: range,
                        suggestions: suggestions,
                        context: context
                    });
                }
            }
            
            displayResults();
            showStatus(`Found ${errors.length} errors in selection`, 'success');
        });
    } catch (error) {
        showStatus("Error: " + error.message, "error");
    } finally {
        showLoading(false);
    }
}

function displayResults() {
    const resultsDiv = document.getElementById("results");
    
    if (errors.length === 0) {
        resultsDiv.innerHTML = '<div class="success status">No spelling errors found!</div>';
        return;
    }
    
    let html = '<h3>Spelling Errors:</h3>';
    
    errors.forEach((error, index) => {
        const suggestionHtml = error.suggestions.length > 0 
            ? `<div class="suggestions">
                Suggestions: ${error.suggestions.map((suggestion, sIndex) => 
                    `<span class="suggestion" data-index="${index}" data-suggestion="${suggestion.replace(/"/g, '&quot;')}">
                        ${suggestion}
                    </span>`
                ).join(' ')}
               </div>`
            : '<div class="suggestions">No suggestions available</div>';
        
        html += `
            <div class="error-item">
                <strong>${error.word}</strong>
                ${suggestionHtml}
                <div class="actions">
                    <button data-index="${index}" class="ignore-btn">Ignore</button>
                    <button data-index="${index}" class="add-btn">Add to Dictionary</button>
                </div>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
    
    // Add event listeners for buttons
    resultsDiv.querySelectorAll('.suggestion').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const suggestion = this.getAttribute('data-suggestion');
            replaceWord(index, suggestion);
        });
    });
    
    resultsDiv.querySelectorAll('.ignore-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            ignoreWord(index);
        });
    });
    
    resultsDiv.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            addToDictionary(index);
        });
    });
}

async function replaceWord(errorIndex, replacement) {
    try {
        await Word.run(async (context) => {
            const error = errors[errorIndex];
            error.range.insertText(replacement, "Replace");
            await context.sync();
            
            // Remove from errors list
            errors.splice(errorIndex, 1);
            displayResults();
            showStatus('Word replaced', 'success');
        });
    } catch (error) {
        showStatus("Error: " + error.message, "error");
    }
}

function ignoreWord(errorIndex) {
    errors.splice(errorIndex, 1);
    displayResults();
    showStatus('Word ignored', 'success');
}

function addToDictionary(errorIndex) {
    if (!dictionary) return;
    
    const word = errors[errorIndex].word;
    if (dictionary.addWord(word)) {
        errors.splice(errorIndex, 1);
        displayResults();
        showStatus(`"${word}" added to dictionary`, 'success', 'wordStatus');
    }
}

function addCustomWord() {
    if (!dictionary) {
        showStatus("Dictionary not loaded", "error", "wordStatus");
        return;
    }
    
    const newWordInput = document.getElementById("newWord");
    const word = newWordInput.value.trim();
    
    if (!word) {
        showStatus("Please enter a word", "error", "wordStatus");
        return;
    }
    
    if (dictionary.addWord(word)) {
        showStatus(`"${word}" added to dictionary`, "success", "wordStatus");
        newWordInput.value = "";
        newWordInput.focus();
    } else {
        showStatus(`"${word}" already exists`, "error", "wordStatus");
    }
}

function showStatus(message, type, elementId = "documentStatus") {
    const statusDiv = document.getElementById(elementId);
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = "block";
    
    setTimeout(() => {
        statusDiv.style.display = "none";
    }, 3000);
}

function showLoading(show) {
    document.getElementById("loading").style.display = show ? "block" : "none";
}

function clearResults() {
    document.getElementById("results").innerHTML = "";
}
