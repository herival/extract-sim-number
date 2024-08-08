const fs = require('fs');

// Exemple de chaîne de caractères
const string = "Voici quelques chiffres : 007123, 007890123, 00745, 007123456789, et 123007.";

// Expression régulière pour trouver les nombres qui commencent par "007" avec un nombre de chiffres variable
const regex = /\b007\d*\b/g;

// Trouver toutes les correspondances dans la chaîne
const matches = string.match(regex);

// Filtrer les nombres par longueur spécifique (par exemple, seulement ceux avec 6 chiffres au total)
const validLength = 6;
const validNumbers = [];
const invalidNumbers = [];

if (matches) {
    matches.forEach(match => {
        if (match.length === validLength) {
            validNumbers.push(match);
        } else {
            invalidNumbers.push(match);
        }
    });

    // Afficher les nombres valides
    if (validNumbers.length > 0) {
        console.log('Nombres valides :', validNumbers);
        
        // Écrire les nombres valides dans un fichier CSV
        const validCsvContent = validNumbers.join('\n');
        fs.writeFile('nombres_valides_007.csv', validCsvContent, (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier CSV des nombres valides:', err);
            } else {
                console.log('Fichier CSV des nombres valides créé avec succès : nombres_valides_007.csv');
            }
        });
    }

    // Afficher les nombres invalides
    if (invalidNumbers.length > 0) {
        console.error('Nombres invalides (erreurs) :', invalidNumbers);
        
        // Écrire les nombres invalides dans un fichier séparé
        const invalidCsvContent = invalidNumbers.join('\n');
        fs.writeFile('nombres_invalides_007.csv', invalidCsvContent, (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier CSV des nombres invalides:', err);
            } else {
                console.log('Fichier CSV des nombres invalides créé avec succès : nombres_invalides_007.csv');
            }
        });
    }
} else {
    console.log('Aucun nombre trouvé qui commence par 007.');
}
