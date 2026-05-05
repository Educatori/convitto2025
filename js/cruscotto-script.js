/**
 * SCRIPT.JS - cruscotto 1.1 (FIX FIREBASE STABILE)
 */

let cambiTurnoManuali = {};
let assenzeProgrammate = {};
let updatingFromFirebase = false; // 🔥 anti-loop

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

        r.innerHTML = `
            <div class="st-header">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="room-badge">room ${s.room}</span>
                    <button class="btn-switch" onclick="toggleSwitchTurno(this)">⇄</button>
                </div>
                <span style="font-size:0.75em; color:#666; font-weight:bold;">
                    ${s.classe} ${s.percorso || ''} ${s.gruppo || ''} ${isLab ? '<span class="lab-badge">LAB</span>' : ''} 
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
    
    ascoltaCambiamentiFirebase(); 
    mostraDataReset();
}

// --- 2. LOGICA TURNI ---
function turnoStudente(classe, cognome) {
    const oggi = new Date();
    const giornoSettimana = oggi.getDay(); 
    const cgn = cognome.toUpperCase();
    if (OVERRIDE_TURNI_DINNER[cgn] && OVERRIDE_TURNI_DINNER[cgn][giornoSettimana]) {
        return OVERRIDE_TURNI_DINNER[cgn][giornoSettimana];
    }
    return TURNI_DINNER[1].includes(classe) ? 1 : 2;
}

function toggleSwitchTurno(btn) {
    const r = btn.closest('.student-row');
    const cognome = r.dataset.cognome;
    cambiTurnoManuali[cognome] = !cambiTurnoManuali[cognome];
    btn.classList.toggle('modificato');
    salvaDatiLocale();
}

// --- 3. INPUT ---
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
    const isTardi = (o) => o.includes(":") && o > limite;
    const isNo = (o) => paroleNo.includes(o);

    if (riga.classList.contains('assente') || isNo(entra) || isNo(ppIn) || isTardi(entra) || isTardi(ppIn)) {
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

// --- 4. FIREBASE SAVE ---
function salvaDatiLocale() {
    if (updatingFromFirebase) return; // 🔥 anti-loop

    const updates = {};

    document.querySelectorAll('.student-row').forEach(r => {
        const cognome = r.dataset.cognome;

        updates[cognome] = {
            esce: r.querySelector('.in-u').value,
            entra: r.querySelector('.in-i').value,
            assente: r.classList.contains('assente'),
            dinnerno: r.dataset.dinnerno,
            switch: cambiTurnoManuali[cognome] || false
        };
    });

    Object.entries(updates).forEach(([cognome, val]) => {
        db.ref('statoGiornaliero/' + cognome).update(val);
    });
}

// --- 5. FIREBASE LISTENER ---
function ascoltaCambiamentiFirebase() {
    db.ref('statoGiornaliero').on('value', (snapshot) => {
        updatingFromFirebase = true;

        const dati = snapshot.val() || {};

        document.querySelectorAll('.student-row').forEach(r => {
            const cognome = r.dataset.cognome;
            const d = dati[cognome];

            if (d) {
                const inU = r.querySelector('.in-u');
                const inI = r.querySelector('.in-i');

                if (document.activeElement !== inU) inU.value = d.esce || "";
                if (document.activeElement !== inI) inI.value = d.entra || "";

                r.classList.toggle('assente', d.assente);
                r.querySelector('.btn-ass')?.classList.toggle('active-ass', d.assente);

                r.dataset.dinnerno = d.dinnerno || "0";
                r.classList.toggle('dinner-no', d.dinnerno === "1");
                r.querySelector('.btn-din')?.classList.toggle('active-din', d.dinnerno === "1");

                cambiTurnoManuali[cognome] = d.switch || false;
                r.querySelector('.btn-switch')?.classList.toggle('modificato', d.switch);

                // 🔥 RICALCOLO AUTOMATICO
                controllaDinnerAutomatico(r);
            }
        });

        updatingFromFirebase = false;
    });
}

// --- 6. ASSENZE ---
function salvaAssenzeProgrammate() {
    db.ref('assenzeProgrammate').set(assenzeProgrammate);
}

function caricaAssenzeProgrammate() {
    db.ref('assenzeProgrammate').on('value', (snapshot) => {
        assenzeProgrammate = snapshot.val() || {};
        renderListaAssenze();
    });
}

// --- UTILITY ---
function isAssenteProgrammato(cognome, data) {
    const lista = assenzeProgrammate[cognome.toUpperCase()];
    if (!lista) return false;
    const oggi = new Date(data.toISOString().split('T')[0]);
    return lista.some(p => oggi >= new Date(p.dal) && oggi <= new Date(p.al));
}

function isStudenteInLabOggi(classe, gruppo, data) {
    const dataKey = data.toLocaleDateString('it-IT');
    const giorno = data.getDay();
    const gLab = CALENDARIO_GRUPPI_DINNER[dataKey];

    if ({1:["2P"],3:["2B"],4:["2A"]}[giorno]?.includes(classe)) return true;

    if ((classe==="5A"||classe==="5B") && gLab) {
        return (gLab==="gr1" && gruppo==="G1") || (gLab==="gr2" && gruppo==="G2");
    }

    return false;
}

function isPPNoDinnerOggi(cognome, giorno) {
    return ASSENTI_PERMESSO[giorno]?.includes(cognome.toUpperCase());
}

function updateClock() {
    const el = document.getElementById('digitalClock');
    if (el) el.innerText = new Date().toLocaleTimeString('it-IT');
}

function mostraDataReset() {
    const dReset = localStorage.getItem('dataUltimoReset');
    if (dReset) document.getElementById('info-reset').innerText = `Update: ${dReset}`;
}

window.onload = init;
