const { match } = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const { performOCR } = require('./ocr');
const configPath = path.join(process.cwd(), 'config.json');
const config = require(configPath);

// Fichier issue du traitement OCR
const logFileName = config.filePath;

// const logFilePath = path.join(__dirname, logFileName);
const logFilePath = path.join(path.dirname(process.execPath), logFileName);
// let imagePath = 'test';
const filePath = config.filePath;

//Lecture Carte SIM ORANGE
console.log(`

    ██╗  ██╗███████╗██████╗ ██╗     ██████╗  ██████╗██████╗ 
    ██║  ██║██╔════╝██╔══██╗██║    ██╔═══██╗██╔════╝██╔══██╗
    ███████║█████╗  ██████╔╝██║    ██║   ██║██║     ██████╔╝
    ██╔══██║██╔══╝  ██╔══██╗██║    ██║   ██║██║     ██╔══██╗
    ██║  ██║███████╗██║  ██║██║    ╚██████╔╝╚██████╗██║  ██║
    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═════╝  ╚═════╝╚═╝  ╚═╝                                                                                                                                         
`);
console.log(`
    -------------------------------------------------------
                --------------------------
    Développée par Herimalala VALISOA. extractsimnumber v1.3
                   Pour Solutions30 IT. 
                --------------------------
    -------------------------------------------------------

    `);
console.log('Programme pour relever les numeros de carte SIM');
console.log('Lecture du dossier en cours....');

// Fonction pour relever tous les fichiers .jpg dans le dossier
async function releverFichiersJPG(dossier) {
    // Lire le contenu du dossier
    fs.readdir(dossier, (err, fichiers) => {
        if (err) {
            console.error('Erreur lors de la lecture du dossier:', err);
            return;
        }

        // Filtrer les fichiers pour ne garder que les .jpg ou .jpeg
        const jpgFiles = fichiers.filter(fichier => {
            return path.extname(fichier).toLowerCase() === '.jpg' || path.extname(fichier).toLowerCase() === '.jpeg';
        });
        if (jpgFiles.length > 0) {
            // Afficher les fichiers .jpg trouvés
            console.log('Fichiers .jpg trouvés :', jpgFiles);
        }else{
            console.log('Aucun fichier jpg trouvé! Veuillez placer les fichiers images dans le dossier de l\'application.');
        }

        jpgFiles.forEach(fichier => {
            const imagePath = path.join(dossier, fichier);
            main(imagePath);
        });
    });

}
releverFichiersJPG('./');

// Fonction pour lire le fichier et rechercher les nombres
async function rechercherNombres(filePath, imagePath) {

    // Lire le fichier
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier:', err);
            return;
        }

        // Utiliser une expression régulière pour trouver les nombres commençant par 007
        const regex = /\b007\d*\b/g;
        const resultats = data.match(regex);

        // Filtrer les nombres par longueur spécifique de digits
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

            console.log('Nombre traité :', resultats.length);
            console.log('Nombre valide :', validNumbers.length);
            console.error('Nombre erreur: ', invalidNumbers.length);
            ecrireDansCsv(resultats);
            
            // supprimer le fichier temporaire pour éviter un retraitement
            const fichier_a_supprimer = path.join(path.dirname(process.execPath), config.filePath);
            fs.unlink(fichier_a_supprimer, (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression du fichier:', err);
                    return;
                }
            });

        } else {
            console.log('Aucun numero de SIM valide trouvé.');
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
    let serieChiffres = config.prefix;
    // Contenu du fichier CSV
    const contenu = resultats.map(nombre => `${serieChiffres}${nombre}`).join('\n');


    // Écrire dans le fichier CSV
    fs.writeFile(csvFilePath, header + contenu, (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture du fichier CSV:', err);
        } else {
            console.log('Les numeros sont enregistré dans le fichier :', uniqueFileName);
        }
    });
}

async function endTerminal() {
    // Mettre en pause le terminal
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Appuyez sur Entrée pour quitter...', () => {
        rl.close();
    });
}

async function main(imagePath) {
    // Traiter l'image
    await performOCR(imagePath, logFilePath); // Attend que performOCR est terminée
    // extraction dans un fichier csv
    rechercherNombres(filePath, imagePath);
}


