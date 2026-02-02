let dictionary;
let errors = [];

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        // Safe check for the dictionary object
        dictionary = window.dictionary || window.torwaliDictionary;
        
        setupEventListeners();
        
        if (dictionary) {
            const stats = dictionary.getStats();
            if (stats.totalWords > 0) {
                showStatus(`لغت تیار ہے: ${stats.totalWords} الفاظ ملے`, 'success', 'documentStatus');
            }
        } else {
            showStatus("لغت لوڈ ہو رہی ہے... براہ کرم انتظار کریں", 'error', 'documentStatus');
            // Try to reload dictionary after 2 seconds
            setTimeout(() => {
                dictionary = window.dictionary || window.torwaliDictionary;
                if(dictionary) showStatus("لغت اب تیار ہے", 'success', 'documentStatus');
            }, 2000);
        }
    }
});

function setupEventListeners() {
    document.getElementById("checkDocument").onclick = checkDocument;
    document.getElementById("checkSelection").onclick = checkSelection;
    document.getElementById("addWord").onclick = addCustomWord;
}

async function checkDocument() {
    showLoading(true);
    clearResults();
    try {
        await Word.run(async (context) => {
            const body = context.document.body;
            // Capture Torwali script characters correctly
            const searchResults = body.search("[\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF]+", { matchWildcards: true });
            context.load(searchResults, "text");
            await context.sync();
            
            errors = [];
            for (const range of searchResults.items) {
                // IMPORTANT: Use normalize('NFC') to ensure matching with wordlist-data
                const word = range.text.trim().normalize('NFC');
                
                if (word && !dictionary.isValidWord(word)) {
                    const suggestions = dictionary.getSuggestions(word);
                    errors.push({ word, range, suggestions });
                }
            }
            displayResults();
        });
    } catch (error) {
        showStatus("Error: " + error.message, "error");
    } finally {
        showLoading(false);
    }
}

// Add this function to handle the "Check Selection" button which was missing logic
async function checkSelection() {
    showLoading(true);
    clearResults();
    try {
        await Word.run(async (context) => {
            const selection = context.document.getSelection();
            const searchResults = selection.search("[\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF]+", { matchWildcards: true });
            context.load(searchResults, "text");
            await context.sync();
            
            errors = [];
            for (const range of searchResults.items) {
                const word = range.text.trim().normalize('NFC');
                if (word && !dictionary.isValidWord(word)) {
                    const suggestions = dictionary.getSuggestions(word);
                    errors.push({ word, range, suggestions });
                }
            }
            displayResults();
        });
    } catch (error) {
        showStatus("Error: " + error.message, "error");
    } finally {
        showLoading(false);
    }
}

function displayResults() {
    const container = document.getElementById("results");
    container.innerHTML = "";
    
    if (errors.length === 0) {
        container.innerHTML = "<p style='padding:10px; color:green;'>کوئی غلطی نہیں ملی۔</p>";
        return;
    }

    errors.forEach((error, index) => {
        const div = document.createElement("div");
        div.className = "error-item";
        div.innerHTML = `
            <div class="word-title">${error.word}</div>
            <div class="suggestions" id="sug-${index}"></div>
            <button class="secondary" onclick="ignoreError(${index})" style="width:auto; display:inline-block; margin-top:5px;">نظر انداز کریں</button>
        `;
        container.appendChild(div);

        const sugContainer = document.getElementById(`sug-${index}`);
        if (error.suggestions && error.suggestions.length > 0) {
            error.suggestions.forEach(sug => {
                const btn = document.createElement("button");
                btn.className = "suggestion-btn";
                btn.textContent = sug;
                btn.onclick = () => replaceWord(index, sug);
                sugContainer.appendChild(btn);
            });
        } else {
            sugContainer.innerHTML = "<small style='color:#666;'>کوئی تجویز نہیں ملی</small>";
        }
    });
}

async function replaceWord(index, newWord) {
    const error = errors[index];
    await Word.run(async (context) => {
        error.range.insertText(newWord, "Replace");
        await context.sync();
    });
    // Remove from UI after replacement
    errors.splice(index, 1);
    displayResults();
}

// Define ignoreError which was being called but not defined
function ignoreError(index) {
    errors.splice(index, 1);
    displayResults();
}

async function addCustomWord() {
    const newWordInput = document.getElementById("newWord");
    const word = newWordInput.value.trim().normalize('NFC');
    
    if (!word) {
        showStatus("براہ کرم لفظ درج کریں", "error", "wordStatus");
        return;
    }
    
    // Check if dictionary has an addWord method (from your wordlist.js)
    if (dictionary.addWord && dictionary.addWord(word)) {
        showStatus(`"${word}" لغت میں شامل کر دیا گیا`, "success", "wordStatus");
        newWordInput.value = "";
    } else {
        showStatus("لفظ پہلے سے موجود ہے یا خرابی آئی", "error", "wordStatus");
    }
}

function showStatus(message, type, elementId = "documentStatus") {
    const statusDiv = document.getElementById(elementId);
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = "block";
    setTimeout(() => { statusDiv.style.display = "none"; }, 4000);
}

function showLoading(show) {
    document.getElementById("loading").style.display = show ? "block" : "none";
}

function clearResults() {
    document.getElementById("results").innerHTML = "";
}
