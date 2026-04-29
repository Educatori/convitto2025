/**
 * SCRIPT.JS - Versione Integrale Omnicomprensiva
 * gruppi
 * percorso
 + Colonna BUS
 */

let cambiTurnoManuali = {};

// --- 1. INIZIALIZZAZIONE ---
function init() {
    const d = new Date();
    const dateEl = document.getElementById('todayDate');
    if (dateEl) dateEl.innerText = d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    
    updateClock();
    setInterval(updateClock, 1000);

    const lista = document.getElementById('listaStudenti');
    if (!lista) return;
    lista.innerHTML = "";

    const studenti = [...studenticonvittori];
    studenti.sort((a, b) => a.room.localeCompare(b.room, undefined, { numeric: true })).forEach(s => {
        const r = document.createElement('div');
        r.className = 'student-row';
        
        const isLab = isStudenteInLabOggi(s.classe, s.gruppo, d);
        if (isLab) r.classList.add('highlight-lab');

        r.dataset.cognome = s.cognome;
        r.dataset.nomeCompleto = s.cognome + " " + s.nome;
        r.dataset.classe = s.classe;
        r.dataset.room = s.room;
        r.dataset.gruppo = s.gruppo || "";
        r.dataset.percorso = s.percorso || "";
        r.dataset.dinnerno = "0";

        r.innerHTML = `
            <div class="st-header">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="room-badge">room ${s.room}</span>
                    <button class="btn-switch" onclick="toggleSwitchTurno(this)">⇄</button>
                </div>
                <span style="font-size:0.75em; color:#666; font-weight:bold;">
                    ${s.classe} ${s.percorso ? ''+s.percorso+'' : ''} ${s.gruppo || ''} ${isLab ? '<span class="lab-badge">LAB</span>' : ''} 
                </span>
            </div>
            <b style="font-size:1.1em">${s.cognome}</b> ${s.nome}
            <div class="inputs">
                <input type="text" placeholder="ESCE" class="in-u" onchange="this.value=normalizzaOrario(this.value); salvaDatiLocale();">
                <input type="text" placeholder="ENTRA" class="in-i" oninput="controllaDinnerAutomatico(this.closest('.student-row'))" onchange="this.value=normalizzaOrario(this.value); salvaDatiLocale();">
            </div>
            <div class="btns">
                <button class="btn-ass" onclick="toggleAssenza(this)">ASSENTE</button>
                <button class="btn-din" onclick="toggleDinnerNo(this)">NON CENA</button>
            </div>`;
        lista.appendChild(r);
    });
    
    caricaDatiLocale();
    mostraDataReset();
}

function haDirittoAlBus(s) {
    if (!s) return false;
    const classe = s.classe.toUpperCase();
    const escluse = ["2A", "2B"];
    return !escluse.includes(classe) && !classe.includes("P");
}

// --- LOGICA TURNI, FILTRI E INPUT (INVARIATA) ---
function turnoStudente(classe, cognome) {
    const oggi = new Date();
    const giornoSettimana = oggi.getDay(); 
    const cgn = cognome.toUpperCase();
    if (OVERRIDE_TURNI_DINNER[cgn] && OVERRIDE_TURNI_DINNER[cgn][giornoSettimana]) return OVERRIDE_TURNI_DINNER[cgn][giornoSettimana];
    return TURNI_DINNER[1].includes(classe) ? 1 : 2;
}

function toggleSwitchTurno(btn) {
    const r = btn.closest('.student-row');
    const cognome = r.dataset.cognome;
    cambiTurnoManuali[cognome] = !cambiTurnoManuali[cognome];
    btn.classList.toggle('modificato');
    salvaDatiLocale();
}

function normalizzaOrario(valore) {
    valore = valore.trim().toLowerCase().replace(".", ":").replace(",", ":");
    if (/^\d{2}$/.test(valore)) valore += ":00";
    if (/^\d{4}$/.test(valore)) valore = valore.slice(0, 2) + ":" + valore.slice(2);
    return valore;
}

function controllaDinnerAutomatico(riga) {
    const classe = riga.dataset.classe;
    const cognome = riga.dataset.cognome;
    const giornoSettimana = new Date().getDay();
    let entra = normalizzaOrario(riga.querySelector('.in-i').value);
    let ppIn = (ORARI_PP[cognome] && ORARI_PP[cognome][giornoSettimana]) ? normalizzaOrario(ORARI_PP[cognome][giornoSettimana].in) : "";
    let limite = TURNI_DINNER[1].includes(classe) ? "18:30" : "19:15";
    const paroleNo = ["no", "non", "nor", "no rientro"];
    const isTardi = (orario) => orario.includes(":") && orario > limite;
    const isNoRientro = (orario) => paroleNo.includes(orario);

    if (riga.classList.contains('assente') || isNoRientro(entra) || isNoRientro(ppIn) || isTardi(entra) || isTardi(ppIn)) {
        riga.dataset.dinnerno = "1"; riga.classList.add('dinner-no');
    } else {
        riga.dataset.dinnerno = "0"; riga.classList.remove('dinner-no');
    }
}

// --- 5. STAMPA CON STILE RIPRISTINATO ---
function generaPopUpStampaConvitto() {
    const dataStampa = document.getElementById('todayDate').innerText;
    const oraStampa = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const dataOggiStampa = new Date().toLocaleDateString('it-IT');
    const giornoSettimana = new Date().getDay();
    const camere = {};

    document.querySelectorAll('.student-row').forEach(r => {
        const room = r.dataset.room || "---";
        const cognome = r.dataset.cognome;
        let ppOut = "", ppIn = "";
        if (ORARI_PP[cognome] && ORARI_PP[cognome][giornoSettimana]) {
            ppOut = ORARI_PP[cognome][giornoSettimana].out;
            ppIn = ORARI_PP[cognome][giornoSettimana].in;
        }
        const studenteOriginale = studenticonvittori.find(s => s.cognome === cognome);

        if (!camere[room]) camere[room] = [];
        camere[room].push({
            classe: r.dataset.classe,
            percorso: r.dataset.percorso,
            cognome: cognome,
            dinnerno: r.dataset.dinnerno,
            presente: !r.classList.contains('assente'),
            oraU: r.querySelector('.in-u').value, 
            oraI: r.querySelector('.in-i').value,
            ppOut: ppOut, ppIn: ppIn, 
            gruppo: r.dataset.gruppo,
            bus: haDirittoAlBus(studenteOriginale)
        });
    });

    const camereOrdinate = Object.keys(camere).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    const popup = window.open('', '_blank', 'width=1200,height=800');

    popup.document.write(`
        <html>
        <head>
            <title>Riepilogo Convitto - ${dataStampa}</title>
            <style>
                @page { size: A3 portrait; margin: 0.3cm; }
                body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; color: #000; }
                h2 { text-align: center; text-transform: uppercase; font-size: 1.1em; margin: 6px 0; }
                table { width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 10px; }
                th, td { border: 1px solid #000; padding: 4px 2px; text-align: center; font-size: 0.62em; }
                th { background: #f2f2f2; font-weight: bold; }
                .room-header { background: #eee; font-weight: bold; width: 45px; }
                .border-bottom-bold { border-bottom: 2.5px solid #000 !important; }
                .border-dashed { border-bottom: 1px dashed #999 !important; }
                .col-cognome { width: 130px; text-transform: uppercase; }
                .bg-gray { background: #f9f9f9; }
                .page-break { page-break-after: always; }
                .no-print { text-align: center; margin: 20px; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="no-print"><button onclick="window.print()" style="padding:15px 50px; background:#27ae60; color:white; font-weight:bold; border-radius:80px; border:none; cursor:pointer;">STAMPA A3</button></div>
            <h2>MASCHILE - piano 1° - ${dataStampa}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Room</th><th>Classe</th><th class="col-cognome">Cognome</th>
                        <th>Presente</th><th>Assente</th><th>Uscita</th><th>Ingresso</th>
                        <th>PP Uscita</th><th>PP Rientro</th><th>Dinner NO</th><th>Notte SI</th><th>Notte NO</th><th>7:30</th>
                    </tr>
                </thead>
                <tbody>
                    ${camereOrdinate.map((room) => {
                        let html = "";
                        html += camere[room].map((s, idx) => {
                            const isLastRow = idx === camere[room].length - 1;
                            const bClass = isLastRow ? 'class="border-bottom-bold"' : 'class="border-dashed"';
                            const bClassGray = isLastRow ? 'class="border-bottom-bold bg-gray"' : 'class="border-dashed bg-gray"';

                            return `
                                <tr>
                                    ${idx === 0 ? `<td rowspan="${camere[room].length}" class="room-header border-bottom-bold">${room}</td>` : ''}
                                    <td ${bClass}>${s.classe} ${s.percorso || ''}</td>
                                    <td ${bClass} class="col-cognome"><b>${s.cognome}</b> ${s.gruppo ? '('+s.gruppo+')' : ''}</td>
                                    <td ${bClass}>${s.presente ? 'X' : ''}</td>
                                    <td ${bClass}>${!s.presente ? 'X' : ''}</td>
                                    <td ${bClassGray}>${s.oraU}</td>
                                    <td ${bClass}>${s.oraI}</td>
                                    <td ${bClassGray}><b>${s.ppOut}</b></td>
                                    <td ${bClass}><b>${s.ppIn}</b></td>
                                    <td ${bClassGray}>${s.dinnerno === "1" ? "X" : ""}</td>
                                    <td ${bClass}></td><td ${bClassGray}></td>
                                    <td ${bClass}>${s.bus ? '🚌' : ''}</td>
                                </tr>`;
                        }).join('');

                        if (room === "125") {
                            html += `</tbody></table><div class="page-break"></div><h2>FEMMINILE - piano 2° - ${dataStampa}</h2><table><thead><tr><th>Room</th><th>Classe</th><th class="col-cognome">Cognome</th><th>Presente</th><th>Assente</th><th>Uscita</th><th>Ingresso</th><th>PP Uscita</th><th>PP Rientro</th><th>Dinner NO</th><th>Notte SI</th><th>Notte NO</th><th>7:30</th></tr></thead><tbody>`;
                        }
                        return html;
                    }).join('')}
                </tbody>
            </table>
        </body></html>`);
    popup.document.close();
}

// --- UTILITY FINALI (INVARIATE) ---
function isStudenteInLabOggi(classe, gruppo, dataOggetto) {
    const dataKey = dataOggetto.toLocaleDateString('it-IT');
    const giorno = dataOggetto.getDay();
    const gLab = CALENDARIO_GRUPPI_DINNER[dataKey];
    if ({ 1: ["2P"], 3: ["2B"], 4: ["2A"] }[giorno]?.includes(classe)) return true;
    if ((classe === "5A" || classe === "5B") && gLab) return (gLab === "gr1" && gruppo === "G1") || (gLab === "gr2" && gruppo === "G2");
    return false;
}
function updateClock() { document.getElementById('digitalClock').innerText = new Date().toLocaleTimeString('it-IT'); }
function salvaDatiLocale() {
    const dati = {};
    document.querySelectorAll('.student-row').forEach(r => {
        dati[r.dataset.cognome] = { esce: r.querySelector('.in-u').value, entra: r.querySelector('.in-i').value, assente: r.classList.contains('assente'), dinnerno: r.dataset.dinnerno, switch: cambiTurnoManuali[r.dataset.cognome] || false };
    });
    localStorage.setItem('datiConvitto', JSON.stringify(dati));
}
function caricaDatiLocale() { 
    const dati = JSON.parse(localStorage.getItem('datiConvitto') || "{}");
    document.querySelectorAll('.student-row').forEach(r => {
        const d = dati[r.dataset.cognome];
        if (d) {
            r.querySelector('.in-u').value = d.esce || ""; r.querySelector('.in-i').value = d.entra || "";
            if (d.assente) { r.classList.add('assente'); r.querySelector('.btn-ass')?.classList.add('active-ass'); }
            if (d.dinnerno === "1") { r.classList.add('dinner-no'); r.querySelector('.btn-din')?.classList.add('active-din'); r.dataset.dinnerno = "1"; }
            if (d.switch) { cambiTurnoManuali[r.dataset.cognome] = true; r.querySelector('.btn-switch')?.classList.add('modificato'); }
        }
    });
}
window.onload = init;
