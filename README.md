# Torwali Spell Checker (Office Add-in)

An open-source spell-checking and linguistic tool designed for the Torwali language. This project is part of a broader initiative to develop **Torwali Machine Translation** and digital resources for the language community.

## 🌟 Overview
This Microsoft Word Add-in provides real-time spell-checking for Torwali text. By leveraging a custom wordlist and linguistic data, it helps users maintain orthographic consistency in digital documents.

## 🚀 Features
- **Torwali Dictionary Integration**: Uses a specialized `wordlist-data.js` containing thousands of verified Torwali words.
- **Custom Taskpane**: A user-friendly interface for managing suggestions and corrections.
- **Office Integration**: Works directly within Microsoft Word (Desktop and Online).

## 📁 Project Structure
- `manifest.xml`: The configuration file that defines the add-in's settings and permissions.
- `taskpane.html/js`: The front-end interface and logic for the spell-checking engine.
- `wordlist-data.js`: The core database of the Torwali lexicon.
- `assets/`: Contains icons and branding materials.

## 🛠️ Installation (Sideloading)
To use this add-in locally for development:
1. Upload the `manifest.xml` to a shared network folder or use the Office Add-in sideloading feature.
2. Open Microsoft Word.
3. Go to **Insert > My Add-ins > Shared Folder** (or follow [Microsoft's sideloading guide](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/test-debug-office-add-ins)).
4. Select **Torwali Spell Checker**.

## 📝 Usage
1. Type or paste Torwali text into your Word document.
2. Open the Torwali Spell Checker taskpane from the Ribbon.
3. Click "Check Document" to scan for errors and view suggested corrections.

## 🤝 Contributing
This project is a work in progress as part of the Torwali Machine Translation project. 
- To add new words: Update `wordlist-data.js`.
- To improve the algorithm: Edit `wordlist.js` or `commands.js`.

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*Built with ❤️ for the Torwali Language Community.*