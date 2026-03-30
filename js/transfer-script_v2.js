/**
 * TRANSFER-SCRIPT.JS - Versione Aggiornata
 */

function generaGriglia() {
    const grid = document.getElementById('mainGrid');
    if (!grid) return;

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
    
    // Controllo flessibile per esterni
    if (typeof studentiesterni !== 'undefined') {
        listaDalDatabase = listaDalDatabase.concat(studentiesterni);
    } else if (typeof esterni !== 'undefined') {
        listaDalDatabase = listaDalDatabase.concat(esterni);
    }

    // 3. Filtraggio e Raggruppamento per classe
    const classi = {};
    
    listaDalDatabase.forEach(s => {
        // Salta se non ha cognome o se la classe è nell'elenco degli esclusi
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

        // Ordinamento studenti per cognome
        classi[nomeClasse].sort((a, b) => a.cognome.localeCompare(b.cognome));

        const occupantiHtml = classi[nomeClasse].map(s => {
    // Rendiamo i tag più compatti
    const tagPercorso = s.percorso ? `<span class="percorso-tag">${s.percorso}</span>` : "";
    const tagGruppo = s.gruppo ? `<small>[${s.gruppo}]</small>` : "";
    
    // Stanza evidenziata solo se presente
    const stanza = s.room ? `<b>${s.room}</b>` : "--";

    return `
        <div class="row-student">
            <span class="student-name"><b>${s.cognome}</b> ${s.nome[0]}.</span> 
            <span class="student-details">${stanza} ${tagPercorso} ${tagGruppo}</span>
        </div>`;
}).join('');

        // Costruzione box della classe
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

// Lancia la funzione al caricamento
window.onload = generaGriglia;