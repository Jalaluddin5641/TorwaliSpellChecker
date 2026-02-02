# Torwali Spell Checker (Office Add-in)

An open-source spell-checking and linguistic tool designed for the Torwali language. This project is part of a broader initiative to develop **Torwali Machine Translation** and digital resources for the language community.

## 🌟 Overview
This Microsoft Word Add-in provides real-time spell-checking for Torwali text. By leveraging a custom wordlist and linguistic data, it helps users maintain orthographic consistency in digital documents.

**Compatible with:**
- Microsoft Word LTSC 2024
- Office 365
- Word Online
- Word 2016+

## 🚀 Features
- **Torwali Dictionary Integration**: Uses a specialized `wordlist-data.js` containing thousands of verified Torwali words.
- **Custom Taskpane**: A user-friendly interface for managing suggestions and corrections.
- **Office Integration**: Works directly within Microsoft Word (Desktop and Online).
- **Real-time Checking**: Check entire documents or selected text.

## 📁 Project Structure
- `manifest.xml`: The configuration file that defines the add-in's settings and permissions.
- `taskpane.html/js`: The front-end interface and logic for the spell-checking engine.
- `commands.html/js`: Office.js function bindings for ribbon buttons.
- `wordlist-data.js`: The core database of the Torwali lexicon.
- `wordlist.js`: Dictionary management and suggestion algorithms.
- `assets/`: Contains icons and branding materials.
- `package.bat`: Automated packaging script.

## 🛠️ Installation (LTSC 2024)

### Method 1: Package Installation
1. Run `package.bat` to create `TorwaliSpellChecker.officeaddin`
2. Open Microsoft Word LTSC 2024
3. Go to **Insert > Get Add-ins > Upload My Add-in**
4. Browse and select `TorwaliSpellChecker.officeaddin`
5. Click **Upload**

### Method 2: Sideloading for Development
1. Copy all files to a folder
2. Open Word LTSC 2024
3. Go to **File > Options > Trust Center > Trust Center Settings > Trusted Add-in Catalogs**
4. Add your folder path under **Catalog URL**
5. Go to **Insert > My Add-ins > Shared Folder**

## 📝 Usage
1. Type or paste Torwali text into your Word document.
2. Open the Torwali Spell Checker taskpane from the Ribbon.
3. Click "Check Document" to scan for errors and view suggested corrections.
4. Click "Check Selection" to check only selected text.
5. Add custom words to the dictionary via the taskpane.

## 🤝 Contributing
This project is a work in progress as part of the Torwali Machine Translation project. 
- To add new words: Update `wordlist-data.js`.
- To improve the algorithm: Edit `wordlist.js` or `commands.js`.
- Report issues on GitHub.

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

*Built with ❤️ for the Torwali Language Community.*
