/**
 * TRANSFER-SCRIPT.JS - Versione Aggiornata con Nome File PDF Dinamico
 */

function generaGriglia() {
    const grid = document.getElementById('mainGrid');
    if (!grid) return;

    // --- AGGIORNAMENTO TITOLO PER STAMPA PDF ---
    impostaTitoloDinamico();

    // 1. Configurazione: Classi da ESCLUDERE e Lab del giorno
    const classiDaEscludere = ["1P", "2P", "3P", "2A", "2B", "5B"];
    const oggi = new Date().getDay(); 
    const labConfig = (typeof LAB_PRANZO !== 'undefined') ? LAB_PRANZO : {};
    const classiInLabOggi = labConfig[oggi] || [];

    // 2. Caricamento e Unione dati
    let listaDalDatabase = [];

    if (typeof studenticonvittori !== 'undefined') {
        listaDalDatabase = listaDalDatabase.concat(studenticonvittori);
    }
    
    if (typeof studentiesterni !== 'undefined') {
        listaDalDatabase = listaDalDatabase.concat(studentiesterni);
    } else if (typeof esterni !== 'undefined') {
        listaDalDatabase = listaDalDatabase.concat(esterni);
    }

    // 3. Filtraggio e Raggruppamento per classe
    const classi = {};
    
    listaDalDatabase.forEach(s => {
        if (!s.cognome || s.cognome.trim() === "") return;
        
        const nomeClasse = s.classe ? s.classe.toUpperCase().trim() : "SENZA CLASSE";
        
        if (classiDaEscludere.includes(nomeClasse)) return;

        if (!classi[nomeClasse]) classi[nomeClasse] = [];
        classi[nomeClasse].push(s);
    });

    const elencoClassi = Object.keys(classi).sort();
    grid.innerHTML = "";

    // 4. Generazione HTML
    elencoClassi.forEach(nomeClasse => {
        const box = document.createElement('div');
        const haLabOggi = classiInLabOggi.includes(nomeClasse);
        
        box.className = `room-box ${haLabOggi ? 'has-lab' : ''}`;

        classi[nomeClasse].sort((a, b) => a.cognome.localeCompare(b.cognome));

        const occupantiHtml = classi[nomeClasse].map(s => {
            const tagPercorso = s.percorso ? `<span class="percorso-tag">${s.percorso}</span>` : "";
            const tagGruppo = s.gruppo ? `• ${s.gruppo}` : "";
            const dettagli = [
                ` ${s.room || '--'}`,
                tagPercorso,
                tagGruppo
            ].filter(Boolean).join(" ");

            return `
                <div class="row-student">
                    <span class="student-name"><b>${s.cognome}</b> ${s.nome}</span>
                    <span class="student-details">${dettagli}</span>
                </div>`;
        }).join('');

        box.innerHTML = `
            <div class="room-info">
                <span> ${nomeClasse}</span>
                ${haLabOggi ? '<span class="lab-badge">LAB LUNCH</span>' : ''}
            </div>
            <div class="occupants-list">
                ${occupantiHtml}
            </div>
        `;

        grid.appendChild(box);
    });
}

/**
 * Funzione per impostare il titolo della pagina che diventerà il nome del PDF
 */
function impostaTitoloDinamico() {
    const oggi = new Date();
    
    // Opzioni per formattare la data come richiesto (lunedì 4 maggio 2026)
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dataFormattata = oggi.toLocaleDateString('it-IT', options);
    
    // Imposta il document.title (usato dai browser come nome file in "Salva come PDF")
    document.title = `Transfer Lunch - ${dataFormattata}`;
}

// Lancia la funzione al caricamento
window.onload = generaGriglia;
