function creaRigaStudente(s) {

    const row = document.createElement('div');
    row.className = 'student-row';

    const infoClasse = `${s.classe}`;

    row.innerHTML = `
        <div class="cell-class">${infoClasse}</div>

        <div class="cell-name" style="cursor:pointer">
            <b>${s.cognome}</b> ${s.nome}
        </div>

        <div class="cell-check"><div class="check-box"></div></div>
        <div class="cell-check"><div class="check-box"></div></div>
        <div class="cell-check"><div class="check-box"></div></div>
        <div class="cell-check"><div class="check-box"></div></div>
    `;

    const nameCell = row.querySelector('.cell-name');
    const checkBoxes = row.querySelectorAll('.check-box');

    nameCell.addEventListener('click', () => {
        row.classList.toggle('row-crossed');
    });

    checkBoxes.forEach(box => {
        box.addEventListener('click', (e) => {
            e.stopPropagation();
            box.classList.toggle('checked');
        });
    });

    return row;
}

function generaDinner() {

    if (typeof studenticonvittori === 'undefined') {
        console.error("convittori.js non caricato");
        return;
    }

    const turno1 = [];
    const turno2 = [];

    studenticonvittori.forEach(s => {

        if (!s.cognome) return;

        const classe = s.classe.toUpperCase();

        // TURNO 1
        if (
            classe.startsWith('1') ||
            classe.startsWith('2') ||
            classe.includes('3P')
        ) {
            turno1.push(s);
        }

        // TURNO 2
        else if (
            classe.startsWith('3') ||
            classe.startsWithWith('4') ||
            classe.startsWith('5')
        ) {
            turno2.push(s);
        }
    });

    turno1.sort((a,b) =>
        a.classe.localeCompare(b.classe, undefined, {numeric:true}) ||
        a.cognome.localeCompare(b.cognome)
    );

    turno2.sort((a,b) =>
        a.classe.localeCompare(b.classe, undefined, {numeric:true}) ||
        a.cognome.localeCompare(b.cognome)
    );

    const box1 = document.getElementById('turno1');
    const box2 = document.getElementById('turno2');

    turno1.forEach(s => {
        box1.appendChild(creaRigaStudente(s));
    });

    turno2.forEach(s => {
        box2.appendChild(creaRigaStudente(s));
    });
}

window.addEventListener('DOMContentLoaded', generaDinner);