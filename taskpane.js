let dictionary = window.dictionary || window.torwaliDictionary || new TorwaliDictionary();
let errors = [];

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        setupEventListeners();
        const stats = dictionary.getStats();
        if (stats.totalWords > 0) {
            showStatus(`لغت تیار ہے: ${stats.totalWords} الفاظ ملے`, 'success', 'documentStatus');
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
                const word = range.text.trim();
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
        container.innerHTML = "<p style='padding:10px;'>کوئی غلطی نہیں ملی۔</p>";
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
        error.suggestions.forEach(sug => {
            const btn = document.createElement("button");
            btn.className = "suggestion-btn";
            btn.textContent = sug;
            btn.onclick = () => replaceWord(index, sug);
            sugContainer.appendChild(btn);
        });
    });
}

async function replaceWord(index, newWord) {
    const error = errors[index];
    await Word.run(async (context) => {
        error.range.insertText(newWord, "Replace");
        await context.sync();
    });
    errors.splice(index, 1);
    displayResults();
}

function showStatus(message, type, elementId = "documentStatus") {
    const statusDiv = document.getElementById(elementId);
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = "block";
}

function showLoading(show) {
    document.getElementById("loading").style.display = show ? "block" : "none";
}

function clearResults() {
    document.getElementById("results").innerHTML = "";
}
