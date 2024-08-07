const fs = require('fs');
const path = require('path');

// Récupérer le fichier à traiter depuis les arguments de la ligne de commande
const filePath = process.argv[2];

if (!filePath) {
    console.error('Veuillez spécifier le chemin du fichier à traiter.');
    process.exit(1);
}
// Fonction pour lire le fichier et rechercher les nombres
function rechercherNombres(filePath) {
    // Lire le fichier
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier:', err);
            return;
        }

        // Utiliser une expression régulière pour trouver les nombres commençant par 007
        const regex = /\b007\d*\b/g;
        const resultats = data.match(regex);

        if (resultats) {
            console.log('Nombres trouvés:', resultats);
            ecrireDansCsv(resultats);
        } else {
            console.log('Aucun nombre commençant par 007 trouvé.');
        }
    });
}

// Fonction pour écrire les résultats dans un fichier CSV
function ecrireDansCsv(resultats) {
    const csvFilePath = path.join(__dirname, 'resultats.csv');
    
    // En-tête du fichier CSV
    const header = 'Nombre\n';
    let serieChiffres = "'8944538531";
    // Contenu du fichier CSV
    const contenu = resultats.map(nombre => `${serieChiffres}${nombre}`).join('\n');
    
    // Écrire dans le fichier CSV
    fs.writeFile(csvFilePath, header + contenu, (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture du fichier CSV:', err);
        } else {
            console.log('Les résultats ont été écrits dans resultats.csv');
        }
    });
}

// extraction dans un fichier txt
rechercherNombres(filePath);
