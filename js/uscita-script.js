/**
 * BUS-SCRIPT.JS / LIBERA-SCRIPT.JS - Generazione Griglia Libera
 */

function generaGrigliaLibera() {
    // 1. CORREZIONE: Usiamo il nome corretto della variabile dal database
    if (typeof studenticonvittori === 'undefined') {
        alert("Errore: studenticonvittori non trovato in convittori.js!");
        console.error("Assicurati che js/convittori.js sia caricato prima di questo script.");
        return;
    }

    // 2. FILTRO E ORDINAMENTO
    // Filtriamo per sicurezza (solo chi ha un cognome) e ordiniamo alfabeticamente
    const listaFinale = studenticonvittori
        .filter(s => s && s.cognome)
        .sort((a, b) => a.cognome.localeCompare(b.cognome));

    // 3. PULIZIA COLONNE (Evita che la lista si duplichi al ricaricamento)
    const col0 = document.getElementById('col0');
    const col1 = document.getElementById('col1');
    
    if (col0) col0.innerHTML = "";
    if (col1) col1.innerHTML = "";

    // 4. DISTRIBUZIONE IN DUE COLONNE
    const itemsPerCol = Math.ceil(listaFinale.length / 2);

    listaFinale.forEach((s, index) => {
        // Calcola in quale colonna inserire lo studente
        const colIndex = Math.floor(index / itemsPerCol);
        const colTarget = document.getElementById('col' + colIndex);

        if (colTarget) {
            const row = document.createElement('div');
            row.className = `student-row`;
            
            // Layout della riga con toggle per sbarrare il nome al click
            row.innerHTML = `
                <div class="cell-room">${s.room || '-'}</div>
                <div class="cell-class" style="font-size: 0.85em; width: 70px;">
    ${[s.classe, s.percorso, s.gruppo].filter(Boolean).join(" ") || '-'} </div>
                <div class="cell-name" style="cursor:pointer; flex-grow: 1;">
                    <b>${s.cognome}</b> ${s.nome}
                </div>
                <div class="cell-notes"><div class="line-notes"></div></div>
                <div class="cell-notes"><div class="line-notes"></div></div>
            `;

            // Aggiungiamo l'evento click per sbarrare la riga in modo pulito
            row.querySelector('.cell-name').addEventListener('click', () => {
                row.classList.toggle('row-crossed');
            });

            colTarget.appendChild(row);
        }
    });
}

// Inizializza al caricamento della finestra
window.onload = generaGrigliaLibera;
