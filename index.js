const { match } = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const { performOCR } = require('./ocr');

// Exécuter l'OCR sur une image 
const logFileName = `sim.txt`;

// const logFilePath = path.join(__dirname, logFileName);
const logFilePath = path.join(path.dirname(process.execPath), logFileName);
const imagePath = 'scan.jpg';
const filePath = "sim.txt";




// Fonction pour lire le fichier et rechercher les nombres
async function rechercherNombres(filePath) {

    //Lecture Carte SIM ORANGE
    console.log('Programme pour lire extraire les numeros de carte SIM');
    // Lire le fichier
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier:', err);
            return;
        }

        // Utiliser une expression régulière pour trouver les nombres commençant par 007
        const regex = /\b007\d*\b/g;
        const resultats = data.match(regex);

        // Filtrer les nombres par longueur spécifique (par exemple, seulement ceux avec 6 chiffres au total)
        const validLength = 9;
        const validNumbers = [];
        const invalidNumbers = [];

        if (resultats) {
            resultats.forEach(match => {
                if (match.length === validLength) {
                    validNumbers.push(match);
                } else {
                    invalidNumbers.push(match);
                }
            });

            // console.log('Nombres trouvés:', resultats);
            console.log('Nombre traité :', resultats.length);
            console.log('Nombre traité :', validNumbers.length);
            console.error('Nombre erreur: ', invalidNumbers.length);
            ecrireDansCsv(resultats);
        } else {
            console.log('Aucun nombre commençant par 007 trouvé.');
        }
    });
}

// Fonction pour obtenir une chaîne de caractères basée sur la date et l'heure actuelles
function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

// Fonction pour écrire les résultats dans un fichier CSV
function ecrireDansCsv(resultats) {

    // recuperer la date et l'heure d'extraction et créer un fichier unique
    const timestamp = getTimestamp();
    const uniqueFileName = `resultats_${timestamp}.csv`;
    const csvFilePath = path.join(path.dirname(process.execPath), uniqueFileName);

    // En-tête du fichier CSV
    const header = 'Nombre\n';
    let serieChiffres = "'8944538531";
    // Contenu du fichier CSV
    const contenu = resultats.map(nombre => `${serieChiffres}${nombre}`).join('\n');


    // Écrire dans le fichier CSV
    fs.writeFile(csvFilePath, header + contenu, (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture du fichier CSV:', err);
            endTerminal();
        } else {
            console.log('Les résultats ont été écrits dans', uniqueFileName);
            endTerminal();
        }
    });


}

function endTerminal() {
    // Mettre en pause le terminal
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Appuyez sur Entrée pour quitter...', () => {
        rl.close();
    });
}

async function main() {
// Traiter l'image
    await performOCR(imagePath, logFilePath); // Attend que firstFunction soit terminée
    // extraction dans un fichier csv
    rechercherNombres(filePath);// Ensuite, exécute secondFunction
  }

main();
