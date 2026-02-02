// taskpane.js - Corrected version
(function() {
    "use strict";
    
    // 1. WAIT for Office to initialize
    Office.onReady(function(info) {
        if (info.host === Office.HostType.Word) {
            console.log("Torwali Spell Checker loaded successfully!");
            
            // 2. Now initialize your functions
            initializeButtons();
            
            // 3. Load wordlist AFTER Office is ready
            loadWordlist();
        } else {
            console.error("This add-in only works in Microsoft Word");
        }
    });
    
    // Your wordlist variable
    let torwaliDictionary = [];
    
    function loadWordlist() {
        try {
            // Load from wordlist-data.js (already included)
            if (typeof wordlist !== 'undefined') {
                torwaliDictionary = wordlist;
                console.log("Loaded " + torwaliDictionary.length + " Torwali words");
                showStatus("wordStatus", "لغت لوڈ ہو گئی: " + torwaliDictionary.length + " الفاظ", "success");
            } else {
                console.error("wordlist-data.js not loaded properly");
                showStatus("wordStatus", "لغت لوڈ نہیں ہو سکی", "error");
            }
        } catch (error) {
            console.error("Error loading wordlist:", error);
        }
    }
    
    function initializeButtons() {
        // Button click handlers - make sure elements exist
        document.getElementById("checkDocument").addEventListener("click", checkDocument);
        document.getElementById("checkSelection").addEventListener("click", checkSelection);
        document.getElementById("addWord").addEventListener("click", addWordToDictionary);
    }
    
    function checkDocument() {
        showLoading(true);
        console.log("Checking entire document...");
        
        Word.run(function(context) {
            var body = context.document.body;
            context.load(body, 'text');
            
            return context.sync()
                .then(function() {
                    var text = body.text;
                    console.log("Document text length:", text.length);
                    // Call your spell check logic here
                    performSpellCheck(text);
                })
                .catch(function(error) {
                    console.error("Error:", error);
                    showStatus("documentStatus", "خرابی: " + error.message, "error");
                });
        });
    }
    
    function checkSelection() {
        console.log("Checking selection...");
        
        Word.run(function(context) {
            var selection = context.document.getSelection();
            context.load(selection, 'text');
            
            return context.sync()
                .then(function() {
                    var text = selection.text;
                    console.log("Selected text:", text);
                    performSpellCheck(text);
                });
        });
    }
    
    function addWordToDictionary() {
        var newWord = document.getElementById("newWord").value.trim();
        if (newWord) {
            if (!torwaliDictionary.includes(newWord)) {
                torwaliDictionary.push(newWord);
                console.log("Added word:", newWord);
                showStatus("wordStatus", "لفظ شامل کیا گیا: " + newWord, "success");
                document.getElementById("newWord").value = "";
            } else {
                showStatus("wordStatus", "لفظ پہلے سے موجود ہے", "error");
            }
        }
    }
    
    function performSpellCheck(text) {
        // Basic spell check logic
        var words = text.split(/\s+/);
        var errors = [];
        
        words.forEach(function(word, index) {
            if (word.length > 0 && !torwaliDictionary.includes(word.toLowerCase())) {
                errors.push({
                    word: word,
                    position: index,
                    suggestions: getSuggestions(word)
                });
            }
        });
        
        displayResults(errors);
        showLoading(false);
    }
    
    function getSuggestions(word) {
        // Basic suggestion algorithm
        var suggestions = [];
        var maxDistance = 2;
        
        torwaliDictionary.forEach(function(dictWord) {
            // Simple distance check (implement proper algorithm)
            if (Math.abs(dictWord.length - word.length) <= maxDistance) {
                suggestions.push(dictWord);
            }
        });
        
        return suggestions.slice(0, 5); // Return top 5
    }
    
    function displayResults(errors) {
        var resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";
        
        if (errors.length === 0) {
            resultsDiv.innerHTML = "<div class='success status'>کوئی غلطی نہیں ملی!</div>";
            return;
        }
        
        errors.forEach(function(error) {
            var errorHtml = '<div class="error-item">';
            errorHtml += '<div class="word-title">' + error.word + '</div>';
            errorHtml += '<div class="suggestions">';
            
            error.suggestions.forEach(function(suggestion) {
                errorHtml += '<button class="suggestion-btn" onclick="replaceWord(\'' + error.word + '\', \'' + suggestion + '\')">' + suggestion + '</button>';
            });
            
            errorHtml += '</div></div>';
            resultsDiv.innerHTML += errorHtml;
        });
        
        showStatus("documentStatus", errors.length + " غلطیاں ملیں", "error");
    }
    
    function replaceWord(oldWord, newWord) {
        Word.run(function(context) {
            var searchResults = context.document.body.search(oldWord, {matchCase: false});
            context.load(searchResults, 'text');
            
            return context.sync()
                .then(function() {
                    searchResults.items[0].insertText(newWord, 'Replace');
                    return context.sync();
                })
                .then(function() {
                    console.log("Replaced", oldWord, "with", newWord);
                    checkDocument(); // Refresh check
                });
        });
    }
    
    function showLoading(show) {
        document.getElementById("loading").style.display = show ? "block" : "none";
    }
    
    function showStatus(elementId, message, type) {
        var element = document.getElementById(elementId);
        element.textContent = message;
        element.className = "status " + type;
        element.style.display = "block";
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            element.style.display = "none";
        }, 5000);
    }
    
    // Make functions available globally for onclick handlers
    window.checkDocument = checkDocument;
    window.checkSelection = checkSelection;
    window.addWordToDictionary = addWordToDictionary;
    window.replaceWord = replaceWord;
    
})();
