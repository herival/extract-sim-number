const fs = require('fs');
const Tesseract = require('tesseract.js');
const path = require('path');

// Fonction pour initialiser le fichier de log
function initLogFile(logFilePath) {

    fs.writeFileSync(logFilePath, 'Tesseract OCR Logs\n', (err) => {
        if (err) {
            console.error('Erreur lors de l\'initialisation du fichier de log:', err);
        }
    });
}

// Fonction pour ajouter une entrée de log au fichier
function logToFile(logFilePath, message) {
    console.log('traitement du fichier Veuillez patientez...');
    fs.appendFileSync(logFilePath, message + '\n', (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture du log:', err);
        }
    });
}


// Fonction OCR avec Tesseract.js
async function performOCR(imagePath, logFilePath) {
    initLogFile(logFilePath);

    return Tesseract.recognize(
        imagePath,
        'eng',
        {
            logger: info => {
                // console.log(info); // Afficher le log dans la console
                // logToFile(logFilePath, JSON.stringify(info)); // Enregistrer le log dans le fichier
            }
        }
    ).then(({ data: { text } }) => {
        // console.log('Texte extrait:', text);
        logToFile(logFilePath, text); // Enregistrer le log dans le fichier
        return text;
    }).catch(err => {
        console.error('Erreur OCR:', err);
        // console.log(info)
        throw err;
    });
}

module.exports = { performOCR };