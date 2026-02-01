let dictionary;

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        // Initialize dictionary
        if (typeof TorwaliDictionary !== 'undefined') {
            dictionary = new TorwaliDictionary();
        }
    }
});

// Function called from ribbon button
async function checkDocument() {
    try {
        await Word.run(async (context) => {
            const body = context.document.body;
            const searchResults = body.search("\\w+", {matchWildcards: true});
            context.load(searchResults, "text");
            
            await context.sync();
            
            let errorCount = 0;
            for (const range of searchResults.items) {
                const word = range.text.trim();
                if (word && dictionary && !dictionary.isValidWord(word)) {
                    errorCount++;
                }
            }
            
            Office.context.ui.message("Spell check complete. Found " + errorCount + " errors.");
        });
    } catch (error) {
        Office.context.ui.message("Error: " + error.message);
    }
}

// Function called from context menu
async function checkSelection() {
    try {
        await Word.run(async (context) => {
            const selection = context.document.getSelection();
            const searchResults = selection.search("\\w+", {matchWildcards: true});
            context.load(searchResults, "text");
            
            await context.sync();
            
            let errorCount = 0;
            for (const range of searchResults.items) {
                const word = range.text.trim();
                if (word && dictionary && !dictionary.isValidWord(word)) {
                    errorCount++;
                    // Highlight errors
                    range.font.highlightColor = "yellow";
                }
            }
            
            await context.sync();
            Office.context.ui.message("Found " + errorCount + " errors in selection.");
        });
    } catch (error) {
        Office.context.ui.message("Error: " + error.message);
    }
}

// Global declaration for Office.js
if (typeof Office !== 'undefined') {
    Office.actions.associate("checkDocument", checkDocument);
    Office.actions.associate("checkSelection", checkSelection);
}Office.actions.associate("checkSelection", checkSelection); 
Office.actions.associate("checkSelection", checkSelection); 
