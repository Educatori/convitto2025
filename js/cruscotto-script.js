/**
 * SCRIPT.JS - Gestione CRUSCOTTO (Versione Firebase Realtime)
 */

let cambiTurnoManuali = {};
let assenzeProgrammate = {};

// --- 1. INIZIALIZZAZIONE ---
function getDataKey() {
    const d = new Date();
    return d.toISOString().split('T')[0]; // es: 2026-05-05
}

function init() {
    const d = new Date();
    caricaAssenzeProgrammate();
    
    // Mostra data e avvia orologio
    const dateEl = document.getElementById('todayDate');
    if (dateEl) dateEl.innerText = d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    
    updateClock();
    setInterval(updateClock, 1000);

    const lista = document.getElementById('listaStudenti');
    if (!lista) return;
    lista.innerHTML = "";

    // Ordinamento per camera e generazione card
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
                <input type="text" placeholder="ESCE" class="in-u" onchange="this.value=normalizzaOrario(this.value); salvaDatiCloud();">
                <input type="text" placeholder="ENTRA" class="in-i" oninput="controllaDinnerAutomatico(this.closest('.student-row'))" onchange="this.value=normalizzaOrario(this.value); salvaDatiCloud();">
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
    
    // Avvio Firebase
    caricaDatiCloud();
    attivaRealtime();
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

function toggleSwitchTurno(btn) {
    const r = btn.closest('.student-row');
    const cognome = r.dataset.cognome;
    cambiTurnoManuali[cognome] = !cambiTurnoManuali[cognome];
    btn.classList.toggle('modificato');
    salvaDatiCloud();
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
        document.querySelectorAll('.student-row').forEach(card => {
            card.style.display = (card.dataset.room === rVal) ? 'block' : 'none';
        });
    } else { applicaFiltri(); }
}

// --- 4. LOGICA INPUT ---
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
    
    // Recupera i valori e normalizzali
    let entraVal = riga.querySelector('.in-i').value.trim().toLowerCase();
    let ppIn = (ORARI_PP[cognome] && ORARI_PP[cognome][giornoSettimana]) ? normalizzaOrario(ORARI_PP[cognome][giornoSettimana].in) : "";

    // Definiamo il limite di tolleranza per la cena
    let limite = TURNI_DINNER[1].includes(classe) ? "18:30" : "19:15";

    // Parole chiave che triggerano il "No Cena" e no rientro, resta fuori
    const paroleNo = ["no", "non", "nor", "x"];

    // Funzione di controllo ritardo
    const isTardi = (orario) => {
        if (!orario || orario === "") return false;
        const orarioNormalizzato = normalizzaOrario(orario);
        return orarioNormalizzato.includes(":") && orarioNormalizzato > limite;
    };

    // Funzione di controllo testo "no"
    const isTestoNo = (val) => paroleNo.some(p => val.includes(p));

    // LOGICA DI ATTIVAZIONE
    if (
        riga.classList.contains('assente') || 
        isTestoNo(entraVal) || 
        isTardi(entraVal) || 
        isTardi(ppIn)
    ) {
        riga.dataset.dinnerno = "1";
        riga.classList.add('dinner-no');
        riga.querySelector('.btn-din')?.classList.add('active-din');
    } else {
        riga.dataset.dinnerno = "0";
        riga.classList.remove('dinner-no');
        riga.querySelector('.btn-din')?.classList.remove('active-din');
    }
}

function toggleAssenza(btn) {
    const r = btn.closest('.student-row');
    r.classList.toggle('assente');
    btn.classList.toggle('active-ass');
    controllaDinnerAutomatico(r);
    salvaDatiCloud();
}

function toggleDinnerNo(btn) {
    const r = btn.closest('.student-row');
    r.dataset.dinnerno = r.dataset.dinnerno === "1" ? "0" : "1";
    r.classList.toggle('dinner-no');
    btn.classList.toggle('active-din');
    salvaDatiCloud();
}

// --- 5. FIREBASE INTEGRATION ---

async function salvaDatiCloud() {
    const dati = {};
    const key = getDataKey();

    document.querySelectorAll('.student-row').forEach(r => {
        const cognome = r.dataset.cognome;
        dati[cognome] = {
            esce: r.querySelector('.in-u').value,
            entra: r.querySelector('.in-i').value,
            assente: r.classList.contains('assente'),
            dinnerno: r.dataset.dinnerno,
            switch: cambiTurnoManuali[cognome] || false
        };
    });

    try {
        await window.fb.setDoc(window.fb.doc(window.db, "convitto", key), { 
            dati,
            ultimoAggiornamento: window.fb.serverTimestamp()
        }, { merge: true });
    } catch (e) { console.error("Errore salvataggio:", e); }
}

async function caricaDatiCloud() {
    const key = getDataKey();
    const docSnap = await window.fb.getDoc(window.fb.doc(window.db, "convitto", key));
    if (docSnap.exists()) {
        aggiornaInterfaccia(docSnap.data().dati);
    }
}

function attivaRealtime() {
    const key = getDataKey();
    window.fb.onSnapshot(window.fb.doc(window.db, "convitto", key), (snap) => {
        if (snap.exists()) {
            aggiornaInterfaccia(snap.data().dati);
        }
    });
}

function aggiornaInterfaccia(dati) {
    if (!dati) return;
    document.querySelectorAll('.student-row').forEach(r => {
        const d = dati[r.dataset.cognome];
        if (!d) return;

        const inU = r.querySelector('.in-u');
        const inI = r.querySelector('.in-i');
        const btnAss = r.querySelector('.btn-ass');
        const btnDin = r.querySelector('.btn-din');
        const btnSw = r.querySelector('.btn-switch');

        // Aggiorna solo se l'utente non sta scrivendo in quel campo
        if (document.activeElement !== inU) inU.value = d.esce || "";
        if (document.activeElement !== inI) inI.value = d.entra || "";

        r.classList.toggle('assente', d.assente);
        r.classList.toggle('dinner-no', d.dinnerno === "1");
        r.dataset.dinnerno = d.dinnerno;

        if (btnAss) btnAss.classList.toggle('active-ass', d.assente);
        if (btnDin) btnDin.classList.toggle('active-din', d.dinnerno === "1");
        if (btnSw) {
            btnSw.classList.toggle('modificato', d.switch);
            cambiTurnoManuali[r.dataset.cognome] = d.switch;
        }
    });
}

// --- UTILITY ---
function updateClock() { 
    const clock = document.getElementById('digitalClock');
    if(clock) clock.innerText = new Date().toLocaleTimeString('it-IT'); 
}

function isStudenteInLabOggi(classe, gruppo, dataOggetto) {
    const dataKey = dataOggetto.toLocaleDateString('it-IT');
    const giorno = dataOggetto.getDay();
    const gLab = CALENDARIO_GRUPPI_DINNER[dataKey];
    if ({ 1: ["2P"], 3: ["2B"], 4: ["2A"] }[giorno]?.includes(classe)) return true;
    if ((classe === "5A" || classe === "5B") && gLab) return (gLab === "gr1" && gruppo === "G1") || (gLab === "gr2" && gruppo === "G2");
    return false;
}

function caricaAssenzeProgrammate() {
    assenzeProgrammate = JSON.parse(localStorage.getItem('assenzeProgrammate') || "{}");
}

function isAssenteProgrammato(cognome, data) {
    const lista = assenzeProgrammate[cognome.toUpperCase()];
    if (!lista) return false;
    const oggi = new Date(data.toISOString().split('T')[0]);
    return lista.some(p => {
        const dal = new Date(p.dal);
        const al = new Date(p.al);
        return oggi >= dal && oggi <= al;
    });
}

// Funzione pannello laterale
function togglePanel() {
    const panel = document.getElementById('sidePanel');
    if (!panel) return;
    panel.style.right = (panel.style.right === "0px") ? "-350px" : "0px";
}

window.onload = init;
