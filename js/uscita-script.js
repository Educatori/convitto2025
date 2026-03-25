function generaGrigliaLibera() {
    // Controllo che il database condiviso sia stato caricato
    if (typeof studenti === 'undefined') {
        alert("Errore: database.js non trovato nella cartella js!");
        return;
    }

    // Filtriamo e ordiniamo per cognome
    const listaFinale = studenti
        .filter(s => s && s.cognome)
        .sort((a, b) => a.cognome.localeCompare(b.cognome));

    // Dividiamo la lista in due colonne
    const itemsPerCol = Math.ceil(listaFinale.length / 2);

    listaFinale.forEach((s, index) => {
        const colIndex = Math.floor(index / itemsPerCol);
        const colTarget = document.getElementById('col' + colIndex);

        if (colTarget) {
            const row = document.createElement('div');
            row.className = `student-row`;
            row.innerHTML = `
                <div class="cell-room">${s.room || '-'}</div>
                <div class="cell-class">${s.classe || '-'}</div>
                <div class="cell-name" onclick="this.parentElement.classList.toggle('row-crossed')">
                    <b>${s.cognome}</b> ${s.nome}
                </div>
                <div class="cell-notes"><div class="line-notes"></div></div>
                <div class="cell-notes"><div class="line-notes"></div></div>
            `;
            colTarget.appendChild(row);
        }
    });
}

// Inizializza al caricamento
window.onload = generaGrigliaLibera;