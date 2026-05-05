/**
 * SCRIPT.JS - cruscotto 1.0 
 */

let cambiTurnoManuali = {};
let assenzeProgrammate = {};

// --- 1. INIZIALIZZAZIONE ---
function init() {
    const d = new Date();
    caricaAssenzeProgrammate();
    
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

        // CORREZIONE SINTASSI HTML E INPUT
        r.innerHTML = `
            <div class="st-header">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="room-badge">room ${s.room}</span>
                    <button class="btn-switch" onclick="toggleSwitchTurno(this)">⇄</button>
                </div>
                <span style="font-size:0.75em; color:#666; font-weight:bold;">
                    ${s.classe} ${s.percorso ? s.percorso : ''} ${s.gruppo || ''} ${isLab ? '<span class="lab-badge">LAB</span>' : ''} 
                </span>
            </div>
            <b style="font-size:1.1em">${s.cognome}</b> ${s.nome}
            <div class="inputs">
                <input type="text" placeholder="ESCE" class="in-u" 
                       onblur="this.value=normalizzaOrario(this.value); salvaDatiLocale();">
                <input type="text" placeholder="ENTRA" class="in-i" 
                       oninput="controllaDinnerAutomatico(this.closest('.student-row'))" 
                       onblur="this.value=normalizzaOrario(this.value); salvaDatiLocale();">
            </div>
            <div class="btns">
                <button class="btn-ass" onclick="toggleAssenza(this)">ASSENTE</button>
                <button class="btn-din" onclick="toggleDinnerNo(this)">NON CENA</button>
            </div>`;
        
        if (isAssenteProgrammato(s.cognome, d)) {
            r.classList.add('assente');
            r.dataset.dinnerno = "1";
        }
        
        lista.appendChild(r);
    });
    
    // Attiva l'ascolto dei dati in tempo reale
    ascoltaCambiamentiFirebase(); 
    mostraDataReset();
}

// --- 2. LOGICA TURNI E OVERRIDE ---
function turnoStudente(classe, cognome) {
    const oggi = new Date();
    const giornoSettimana = oggi.getDay(); 
    const cgn = cognome.toUpperCase();
    if (OVERRIDE_TURNI_DINNER[cgn] && OVERRIDE_TURNI_DINNER[cgn][giornoSettimana]) {
        return OVERRIDE_TURNI_DINNER[cgn][giornoSettimana];
    }
    return TURNI_DINNER[1].includes(classe) ? 1 : 2;
}

function haDirittoAlBus(s) {
    if (!s) return false;
    const classe = s.classe.toUpperCase();
    return !["2A", "2B"].includes(classe) && !classe.includes("P");
}

function toggleSwitchTurno(btn) {
    const r = btn.closest('.student-row');
    const cognome = r.dataset.cognome;
    cambiTurnoManuali[cognome] = !cambiTurnoManuali[cognome];
    btn.classList.toggle('modificato');
    salvaDatiLocale();
}

// --- 3. FILTRI E RICERCA ---
function applicaFiltri() {
    const s = document.getElementById('search').value.toLowerCase();
    document.querySelectorAll('.student-row').forEach(r => {
        const testo = (r.dataset.cognome + " " + r.dataset.nomeCompleto + " " + r.dataset.classe + " " + r.dataset.room).toLowerCase();
        r.style.display = testo.includes(s) ? 'block' : 'none';
    });
}

function validaERicerca() {
    const rVal = document.getElementById('roomInput').value;
    if (rVal !== "") {
        document.getElementById('search').value = ""; 
        document.querySelectorAll('.student-row').forEach(card => {
            card.style.display = (card.dataset.room === rVal) ? 'block' : 'none';
        });
    } else { applicaFiltri(); }
}

// --- 4. LOGICA INPUT E AUTO-DINNER ---
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
    const paroleNo = ["no", "non", "nor", "no rientro", "x"];
    const isTardi = (orario) => orario.includes(":") && orario > limite;
    const isNoRientro = (orario) => paroleNo.includes(orario);

    if (riga.classList.contains('assente') || isNoRientro(entra) || isNoRientro(ppIn) || isTardi(entra) || isTardi(ppIn)) {
        riga.dataset.dinnerno = "1";
        riga.classList.add('dinner-no');
    } else {
        riga.dataset.dinnerno = "0";
        riga.classList.remove('dinner-no');
    }
}

function toggleAssenza(btn) {
    const r = btn.closest('.student-row');
    r.classList.toggle('assente');
    btn.classList.toggle('active-ass');
    controllaDinnerAutomatico(r);
    salvaDatiLocale();
}

function toggleDinnerNo(btn) {
    const r = btn.closest('.student-row');
    r.dataset.dinnerno = r.dataset.dinnerno === "1" ? "0" : "1";
    r.classList.toggle('dinner-no');
    btn.classList.toggle('active-din');
    salvaDatiLocale();
}

// --- 5. STAMPE ---
function generaPopUpStampaDinner() {
    let a1=0, p1=0, a2=0, p2=0, n1=[], n2=[], switch1=[], switch2=[];
    const oggi = new Date();
    const giornoSett = oggi.getDay();
    const oraEsatta = oggi.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const dataTestuale = document.getElementById('todayDate').innerText;

    document.querySelectorAll('.student-row').forEach(r => {
        const cognome = r.dataset.cognome;
        const nomeCompleto = r.dataset.nomeCompleto;
        let turnoOriginale = TURNI_DINNER[1].includes(r.dataset.classe) ? 1 : 2;
        let turnoEffettivo = turnoStudente(r.dataset.classe, cognome);
        if (cambiTurnoManuali[cognome]) turnoEffettivo = (turnoEffettivo === 1) ? 2 : 1;

        if (turnoEffettivo !== turnoOriginale) {
            const nota = (turnoEffettivo === 1) ? " (da 2° a 1°)" : " (da 1° a 2°)";
            if(turnoEffettivo === 1) switch1.push(nomeCompleto + nota);
            else switch2.push(nomeCompleto + nota);
        }

        const isLab = isStudenteInLabOggi(r.dataset.classe, r.dataset.gruppo, oggi);
        const isPPNoCena = isPPNoDinnerOggi(cognome, giornoSett);
        const escluso = isLab || isPPNoCena || r.classList.contains('assente') || r.dataset.dinnerno === "1";

        if (turnoEffettivo === 1) {
            if (escluso) { a1++; n1.push(nomeCompleto + (isLab ? " (LAB)" : "")); } else p1++;
        } else {
            if (escluso) { a2++; n2.push(nomeCompleto + (isLab ? " (LAB)" : "")); } else p2++;
        }
    });

    const popup = window.open('', '_blank');
    popup.document.write(`<html><head><title>Dinner</title><style>body{font-family:sans-serif;padding:20px;}.section{border-left:5px solid #333;padding-left:15px;margin-bottom:20px;}input{width:50px;font-weight:bold;text-align:center;border:none;border-bottom:1px solid #000;}</style></head><body><h2>Riepilogo Dinner - ${dataTestuale}</h2><div class="section"><h3>1° DINNER (18:30)</h3>Assenti: <input type="number" value="${a1}"> Presenti: <input type="number" value="${p1}"><div>Esclusi: ${n1.join(', ')}</div></div><div class="section"><h3>2° DINNER (19:15)</h3>Assenti: <input type="number" value="${a2}"> Presenti: <input type="number" value="${p2}"><div>Esclusi: ${n2.join(', ')}</div></div></body></html>`);
}

// --- 6. FIREBASE REALTIME ---
function salvaDatiLocale() {
    const dati = {};
    document.querySelectorAll('.student-row').forEach(r => {
        dati[r.dataset.cognome] = { 
            esce: r.querySelector('.in-u').value, 
            entra: r.querySelector('.in-i').value, 
            assente: r.classList.contains('assente'), 
            dinnerno: r.dataset.dinnerno, 
            switch: cambiTurnoManuali[r.dataset.cognome] || false 
        };
    });
    db.ref('statoGiornaliero').set(dati);
}

function ascoltaCambiamentiFirebase() {
    db.ref('statoGiornaliero').on('value', (snapshot) => {
        const dati = snapshot.val() || {};
        document.querySelectorAll('.student-row').forEach(r => {
            const cognome = r.dataset.cognome;
            const d = dati[cognome];
            if (d) {
                const inU = r.querySelector('.in-u');
                const inI = r.querySelector('.in-i');
                // Aggiorna testo solo se l'utente non sta scrivendo (evita sfarfallio)
                if (document.activeElement !== inU) inU.value = d.esce || "";
                if (document.activeElement !== inI) inI.value = d.entra || "";
                
                // Stato Assenza
                if (d.assente) {
                    r.classList.add('assente');
                    r.querySelector('.btn-ass')?.classList.add('active-ass');
                } else {
                    r.classList.remove('assente');
                    r.querySelector('.btn-ass')?.classList.remove('active-ass');
                }
                
                // Stato Dinner
                r.dataset.dinnerno = d.dinnerno || "0";
                if (d.dinnerno === "1") {
                    r.classList.add('dinner-no');
                    r.querySelector('.btn-din')?.classList.add('active-din');
                } else {
                    r.classList.remove('dinner-no');
                    r.querySelector('.btn-din')?.classList.remove('active-din');
                }

                // Sincronizzazione Switch Manuale
                cambiTurnoManuali[cognome] = d.switch || false;
                const btnSwitch = r.querySelector('.btn-switch');
                if (d.switch) btnSwitch?.classList.add('modificato');
                else btnSwitch?.classList.remove('modificato');
            }
        });
    });
}

// Funzioni Utility rimanenti (Salva Assenze, Lab, Clock)
function salvaAssenzeProgrammate() { db.ref('assenzeProgrammate').set(assenzeProgrammate).then(() => location.reload()); }
function caricaAssenzeProgrammate() { db.ref('assenzeProgrammate').on('value', (snapshot) => { assenzeProgrammate = snapshot.val() || {}; renderListaAssenze(); }); }
function isAssenteProgrammato(cognome, data) { const lista = assenzeProgrammate[cognome.toUpperCase()]; if (!lista) return false; const oggi = new Date(data.toISOString().split('T')[0]); return lista.some(p => { const dal = new Date(p.dal); const al = new Date(p.al); return oggi >= dal && oggi <= al; }); }
function isStudenteInLabOggi(classe, gruppo, dataOggetto) { const dataKey = dataOggetto.toLocaleDateString('it-IT'); const giorno = dataOggetto.getDay(); const gLab = CALENDARIO_GRUPPI_DINNER[dataKey]; if ({ 1: ["2P"], 3: ["2B"], 4: ["2A"] }[giorno]?.includes(classe)) return true; if ((classe === "5A" || classe === "5B") && gLab) return (gLab === "gr1" && gruppo === "G1") || (gLab === "gr2" && gruppo === "G2"); return false; }
function isPPNoDinnerOggi(cognome, giorno) { return ASSENTI_PERMESSO[giorno]?.includes(cognome.toUpperCase()); }
function updateClock() { const el = document.getElementById('digitalClock'); if(el) el.innerText = new Date().toLocaleTimeString('it-IT'); }
function mostraDataReset() { const dReset = localStorage.getItem('dataUltimoReset'); if (dReset) document.getElementById('info-reset').innerText = `Update: ${dReset}`; }

window.onload = init;
