// CONVITTORI.JS
// Costruisce l'array studenticonvittori a partire da tuttiStudenti (definito in studenti_25-26.js)
// Vengono inclusi solo gli studenti con room numerica compresa tra 101 e 221 (convittori)

(function() {
    // Verifica che l'array globale tuttiStudenti esista
    if (typeof tuttiStudenti === 'undefined') {
        console.error("Errore: manca l'array 'tuttiStudenti'. Assicurati di aver incluso studenti_25-26.js PRIMA di convittori.js");
        window.studenticonvittori = [];
        return;
    }

    // Filtra i convittori: room tra 101 e 221 (inclusi)
    const convittori = tuttiStudenti.filter(s => {
        const roomNum = parseInt(s.room, 10);
        return !isNaN(roomNum) && roomNum >= 101 && roomNum <= 221;
    });

    // Mappa i campi per mantenerli compatibili con gli script esistenti
    window.studenticonvittori = convittori.map(s => ({
        cognome: s.cognome,
        nome: s.nome,
        classe: s.classe,
        room: s.room,
        gruppo: s.gruppo || "",
        percorso: s.percorso || ""
    }));

    console.log(`Convittori caricati: ${window.studenticonvittori.length}`);
})();
