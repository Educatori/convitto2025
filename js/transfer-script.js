 function generaGrigliaRooming() {
    const grid = document.getElementById('mainGrid');
    if (!grid) return;

    const extra = [
        { cognome: " ", nome: " ", classe: ".", gruppo: "", room: " " },
        
    ];

    let listaDalDatabase = [];

if (typeof studenti !== 'undefined') {
    listaDalDatabase = listaDalDatabase.concat(studenti);
}

if (typeof fuorisede !== 'undefined') {
    listaDalDatabase = listaDalDatabase.concat(fuorisede);
} else {
        console.warn("Attenzione: variabile 'studenti' non trovata in database.js");
    }

    const tuttiIPartecipanti = [...extra, ...listaDalDatabase];
    const classi = {};

    // Raggruppamento per classe
    tuttiIPartecipanti.forEach(s => {
        const classe = s.classe || "Senza classe";
        if (!classi[classe]) classi[classe] = [];
        classi[classe].push(s);
    });

    // Ordinamento classi alfabetico
    const elencoClassi = Object.keys(classi).sort((a, b) => a.localeCompare(b));

    grid.innerHTML = "";

    elencoClassi.forEach(classe => {
        const box = document.createElement('div');
        box.className = 'room-box';

        // Ordinamento alfabetico cognome dentro ogni classe
        classi[classe].sort((a, b) => (a.cognome || "").localeCompare(b.cognome || ""));

        const occupantiHtml = classi[classe].map(s => {
            const infoGruppo = s.gruppo ? ` [${s.gruppo}]` : "";
            let nomeDisplay;

            if (s.cognome === "-") {
                nomeDisplay = "<i>Libero / Foresteria</i>";
                } else {
                nomeDisplay = `<b>${s.cognome}</b> ${s.nome}`;
                }

            return `
                <div class="row-student">
                    <span class="student-name">${nomeDisplay}</span>
                    <span class="student-details"> ${s.room}${infoGruppo}</span>
                </div>`;
        }).join('');

        box.innerHTML = `
            <div class="room-info">${classe}</div>
            <div class="occupants-list">${occupantiHtml}</div>
        `;

        grid.appendChild(box);
    });
}

window.onload = generaGrigliaRooming;
