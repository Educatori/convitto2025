/* FIREBASE-CRUSCOTTO-SYNC.JS */
// ========== GESTIONE STATO CONNESSIONE ==========
function updateConnectionStatus(connected) {
    const statusDiv = document.getElementById('connection-status');
    if (statusDiv) {
        if (connected) {
            statusDiv.innerHTML = '🟢 Connesso';
            statusDiv.style.background = '#d4edda';
            statusDiv.style.color = '#155724';
        } else {
            statusDiv.innerHTML = '🔴 Offline - Modifica locale';
            statusDiv.style.background = '#f8d7da';
            statusDiv.style.color = '#721c24';
        }
    }
}

// ========== AUTO-SAVE INTERVAL ==========
function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => {
        if (auth.currentUser && navigator.onLine) {
            triggerSync();
        }
    }, 5000);
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

// ========== SINCRONIZZAZIONE DATI CONVITTO ==========
async function syncDataToFirebase() {
    if (isSyncing) return;
    if (!auth.currentUser) return;
    
    const oggi = new Date();
    const dateKey = oggi.toLocaleDateString('it-IT').split('/').join('-');
    const datiCorrenti = localStorage.getItem('datiConvitto');
    
    if (datiCorrenti && datiCorrenti !== '{}') {
        try {
            await database.ref(`convitto/${dateKey}/dati`).set(JSON.parse(datiCorrenti));
            await database.ref(`convitto/${dateKey}/lastUpdate`).set(firebase.database.ServerValue.TIMESTAMP);
            console.log('✅ Dati sincronizzati con Firebase');
            updateConnectionStatus(true);
        } catch (error) {
            console.error('❌ Errore sync Firebase:', error);
            updateConnectionStatus(false);
        }
    }
}

async function loadDataFromFirebase() {
    if (!auth.currentUser) return;
    
    const oggi = new Date();
    const dateKey = oggi.toLocaleDateString('it-IT').split('/').join('-');
    
    try {
        const snapshot = await database.ref(`convitto/${dateKey}/dati`).get();
        
        if (snapshot.exists()) {
            const firebaseData = snapshot.val();
            const localData = localStorage.getItem('datiConvitto');
            
            if (JSON.stringify(firebaseData) !== localData) {
                isSyncing = true;
                localStorage.setItem('datiConvitto', JSON.stringify(firebaseData));
                
                if (typeof window.caricaDatiLocaleOriginal === 'function') {
                    window.caricaDatiLocaleOriginal();
                } else if (typeof caricaDatiLocale === 'function') {
                    caricaDatiLocale();
                }
                
                setTimeout(() => { isSyncing = false; }, 100);
                console.log('📥 Dati caricati da Firebase');
            }
            updateConnectionStatus(true);
        }
    } catch (error) {
        console.error('❌ Errore caricamento da Firebase:', error);
        updateConnectionStatus(false);
    }
}

function listenToFirebaseChanges() {
    if (!auth.currentUser) return;
    
    const oggi = new Date();
    const dateKey = oggi.toLocaleDateString('it-IT').split('/').join('-');
    
    if (currentDataListener) {
        database.ref(`convitto/${dateKey}/dati`).off('value', currentDataListener);
    }
    
    currentDataListener = (snapshot) => {
        if (!isSyncing && snapshot.exists() && auth.currentUser) {
            const firebaseData = snapshot.val();
            const localData = localStorage.getItem('datiConvitto');
            
            if (JSON.stringify(firebaseData) !== localData) {
                isSyncing = true;
                localStorage.setItem('datiConvitto', JSON.stringify(firebaseData));
                
                if (typeof window.caricaDatiLocaleOriginal === 'function') {
                    window.caricaDatiLocaleOriginal();
                } else if (typeof caricaDatiLocale === 'function') {
                    caricaDatiLocale();
                }
                
                setTimeout(() => { isSyncing = false; }, 100);
                console.log('🔄 Aggiornamento in tempo reale dati convitto');
            }
        }
    };
    
    database.ref(`convitto/${dateKey}/dati`).on('value', currentDataListener);
}

// ========== SINCRONIZZAZIONE NOTE ==========
async function syncNoteToFirebase() {
    if (!auth.currentUser) return;
    
    const note = localStorage.getItem('note_convitto');
    if (note !== null) {
        try {
            await database.ref('note/convitto').set(note);
            console.log('✅ Note sincronizzate');
        } catch (error) {
            console.error('❌ Errore sync note:', error);
        }
    }
}

async function loadNoteFromFirebase() {
    if (!auth.currentUser) return;
    
    try {
        const snapshot = await database.ref('note/convitto').get();
        if (snapshot.exists()) {
            const firebaseNote = snapshot.val();
            const localNote = localStorage.getItem('note_convitto');
            
            if (firebaseNote !== localNote) {
                localStorage.setItem('note_convitto', firebaseNote);
                const noteInput = document.getElementById('dailyNotes');
                if (noteInput) noteInput.value = firebaseNote;
                console.log('📥 Note caricate da Firebase');
            }
        }
    } catch (error) {
        console.error('❌ Errore caricamento note:', error);
    }
}

function listenToNoteChanges() {
    if (!auth.currentUser) return;
    
    if (currentNoteListener) {
        database.ref('note/convitto').off('value', currentNoteListener);
    }
    
    currentNoteListener = (snapshot) => {
        if (!isSyncing && snapshot.exists() && auth.currentUser) {
            const firebaseNote = snapshot.val();
            const localNote = localStorage.getItem('note_convitto');
            
            if (firebaseNote !== localNote) {
                isSyncing = true;
                localStorage.setItem('note_convitto', firebaseNote);
                const noteInput = document.getElementById('dailyNotes');
                if (noteInput) noteInput.value = firebaseNote;
                setTimeout(() => { isSyncing = false; }, 100);
                console.log('🔄 Aggiornamento note in tempo reale');
            }
        }
    };
    
    database.ref('note/convitto').on('value', currentNoteListener);
}

// ========== SINCRONIZZAZIONE ASSENZE PROGRAMMATE ==========
async function syncAssenzeToFirebase() {
    if (!auth.currentUser) return;
    
    const assenze = localStorage.getItem('assenzeProgrammate');
    if (assenze) {
        try {
            await database.ref('assenze/programmate').set(JSON.parse(assenze));
            console.log('✅ Assenze sincronizzate');
        } catch (error) {
            console.error('❌ Errore sync assenze:', error);
        }
    }
}

async function loadAssenzeFromFirebase() {
    if (!auth.currentUser) return;
    
    try {
        const snapshot = await database.ref('assenze/programmate').get();
        if (snapshot.exists()) {
            const firebaseAssenze = snapshot.val();
            const localAssenze = localStorage.getItem('assenzeProgrammate');
            
            if (JSON.stringify(firebaseAssenze) !== localAssenze) {
                localStorage.setItem('assenzeProgrammate', JSON.stringify(firebaseAssenze));
                if (typeof window.caricaAssenzeProgrammate === 'function') {
                    window.caricaAssenzeProgrammate();
                } else if (typeof caricaAssenzeProgrammate === 'function') {
                    caricaAssenzeProgrammate();
                }
                if (typeof window.renderListaAssenzeOriginal === 'function') {
                    window.renderListaAssenzeOriginal();
                } else if (typeof renderListaAssenze === 'function') {
                    renderListaAssenze();
                }
                console.log('📥 Assenze caricate da Firebase');
            }
        }
    } catch (error) {
        console.error('❌ Errore caricamento assenze:', error);
    }
}

function listenToAssenzeChanges() {
    if (!auth.currentUser) return;
    
    if (currentAssenzeListener) {
        database.ref('assenze/programmate').off('value', currentAssenzeListener);
    }
    
    currentAssenzeListener = (snapshot) => {
        if (!isSyncing && snapshot.exists() && auth.currentUser) {
            const firebaseAssenze = snapshot.val();
            const localAssenze = localStorage.getItem('assenzeProgrammate');
            
            if (JSON.stringify(firebaseAssenze) !== localAssenze) {
                isSyncing = true;
                localStorage.setItem('assenzeProgrammate', JSON.stringify(firebaseAssenze));
                if (typeof window.caricaAssenzeProgrammate === 'function') {
                    window.caricaAssenzeProgrammate();
                } else if (typeof caricaAssenzeProgrammate === 'function') {
                    caricaAssenzeProgrammate();
                }
                setTimeout(() => { isSyncing = false; }, 100);
                console.log('🔄 Aggiornamento assenze in tempo reale');
            }
        }
    };
    
    database.ref('assenze/programmate').on('value', currentAssenzeListener);
}

// ========== SINCRONIZZAZIONE PERMESSI ==========
async function syncPermessiToFirebase() {
    if (!auth.currentUser) return;
    
    const permessi = localStorage.getItem('permessiPermanenti');
    if (permessi) {
        try {
            await database.ref('permessi/permanenti').set(JSON.parse(permessi));
            console.log('✅ Permessi sincronizzati');
        } catch (error) {
            console.error('❌ Errore sync permessi:', error);
        }
    }
}

async function loadPermessiFromFirebase() {
    if (!auth.currentUser) return;
    
    try {
        const snapshot = await database.ref('permessi/permanenti').get();
        if (snapshot.exists()) {
            const firebasePermessi = snapshot.val();
            const localPermessi = localStorage.getItem('permessiPermanenti');
            
            if (JSON.stringify(firebasePermessi) !== localPermessi) {
                localStorage.setItem('permessiPermanenti', JSON.stringify(firebasePermessi));
                if (typeof window.popolaListaPermessiOriginal === 'function') {
                    window.popolaListaPermessiOriginal();
                } else if (typeof popolaListaPermessi === 'function') {
                    popolaListaPermessi();
                }
                console.log('📥 Permessi caricati da Firebase');
            }
        }
    } catch (error) {
        console.error('❌ Errore caricamento permessi:', error);
    }
}

function listenToPermessiChanges() {
    if (!auth.currentUser) return;
    
    if (currentPermessiListener) {
        database.ref('permessi/permanenti').off('value', currentPermessiListener);
    }
    
    currentPermessiListener = (snapshot) => {
        if (!isSyncing && snapshot.exists() && auth.currentUser) {
            const firebasePermessi = snapshot.val();
            const localPermessi = localStorage.getItem('permessiPermanenti');
            
            if (JSON.stringify(firebasePermessi) !== localPermessi) {
                isSyncing = true;
                localStorage.setItem('permessiPermanenti', JSON.stringify(firebasePermessi));
                if (typeof window.popolaListaPermessiOriginal === 'function') {
                    window.popolaListaPermessiOriginal();
                } else if (typeof popolaListaPermessi === 'function') {
                    popolaListaPermessi();
                }
                setTimeout(() => { isSyncing = false; }, 100);
                console.log('🔄 Aggiornamento permessi in tempo reale');
            }
        }
    };
    
    database.ref('permessi/permanenti').on('value', currentPermessiListener);
}

// ========== TRIGGER SYNC ==========
function triggerSync() {
    if (!auth.currentUser) return;
    syncDataToFirebase();
    syncNoteToFirebase();
    syncAssenzeToFirebase();
    syncPermessiToFirebase();
}

// ========== FUNZIONE RESET DATI (SINGOLA, NON DUPLICATA) ==========
window.resetDati = function(modalita = 'soloManuali') {
    console.log("🔧 resetDati chiamata - modalità:", modalita);
    
    let conferma;
    if (modalita === 'completo') {
        conferma = confirm("⚠️ RESET COMPLETO: cancellerà TUTTI i dati (assenze programmate, permessi, note e variazioni). Sei sicuro? ⚠");
    } else {
        conferma = confirm("⚠️ Sei sicuro? Questo cancellerà SOLO le variazioni giornaliere (uscite, ingressi, assenze del giorno). Le assenze programmate e i permessi rimarranno. ⚠");
    }
    
    if (!conferma) return;
    
    const oggi = new Date();
    const dateKey = oggi.toLocaleDateString('it-IT').split('/').join('-');
    
    localStorage.removeItem('datiConvitto');
    
    if (typeof window.cambiTurnoManuali !== 'undefined') {
        const cambiTurnoManuali = window.cambiTurnoManuali || {};
        Object.keys(cambiTurnoManuali).forEach(key => {
            cambiTurnoManuali[key] = false;
        });
    }
    
    document.querySelectorAll('.student-row').forEach(row => {
        const inputU = row.querySelector('.in-u');
        const inputI = row.querySelector('.in-i');
        if (inputU) inputU.value = '';
        if (inputI) inputI.value = '';
        
        row.classList.remove('assente');
        row.classList.remove('dinner-no');
        row.dataset.dinnerno = "0";
        
        const btnAss = row.querySelector('.btn-ass');
        const btnDin = row.querySelector('.btn-din');
        const btnSwitch = row.querySelector('.btn-switch');
        
        if (btnAss) btnAss.classList.remove('active-ass');
        if (btnDin) btnDin.classList.remove('active-din');
        if (btnSwitch) btnSwitch.classList.remove('modificato');
        
        if (typeof window.isAssenteProgrammato === 'function' && 
            window.isAssenteProgrammato(row.dataset.cognome, oggi)) {
            row.classList.add('assente');
            if (btnAss) btnAss.classList.add('active-ass');
            row.dataset.dinnerno = "1";
        }
    });
    
    if (modalita === 'completo') {
        localStorage.removeItem('assenzeProgrammate');
        localStorage.removeItem('permessiPermanenti');
        localStorage.removeItem('note_convitto');
        
        if (typeof window.assenzeProgrammate !== 'undefined') {
            const assenzeProgrammate = window.assenzeProgrammate;
            Object.keys(assenzeProgrammate).forEach(k => delete assenzeProgrammate[k]);
        }
        
        if (database) {
            Promise.all([
                database.ref('assenze/programmate').remove(),
                database.ref('permessi/permanenti').remove(),
                database.ref('note/convitto').remove(),
                database.ref(`convitto/${dateKey}`).remove()
            ]).then(() => console.log("Firebase reset completo"))
             .catch(err => console.error("Errore reset Firebase:", err));
        }
    } else {
        if (database) {
            database.ref(`convitto/${dateKey}`).remove()
                .catch(err => console.error("Errore reset Firebase:", err));
        }
    }
    
    const ora = new Date().toLocaleString('it-IT');
    localStorage.setItem('dataUltimoReset', ora);
    const resetDiv = document.getElementById('info-reset');
    if (resetDiv) resetDiv.innerText = `Ultimo aggiornamento: ${ora}`;
    
    if (typeof window.caricaDatiLocale === 'function') {
        window.caricaDatiLocale();
    } else if (typeof caricaDatiLocale === 'function') {
        caricaDatiLocale();
    }
    
    document.querySelectorAll('.student-row').forEach(row => {
        if (typeof window.controllaDinnerAutomatico === 'function') {
            window.controllaDinnerAutomatico(row);
        } else if (typeof controllaDinnerAutomatico === 'function') {
            controllaDinnerAutomatico(row);
        }
    });
    
    alert(modalita === 'completo' ? '✅ Reset completo effettuato!' : '✅ Reset giornaliero effettuato!');
};

// ========== AGGIORNA STATI UI ==========
function aggiornaStatiUI() {
    document.querySelectorAll('.student-row').forEach(row => {
        const cognome = row.dataset.cognome;
        const dati = JSON.parse(localStorage.getItem('datiConvitto') || '{}');
        const studenteDati = dati[cognome];
        
        if (studenteDati) {
            const btnAss = row.querySelector('.btn-ass');
            const btnDin = row.querySelector('.btn-din');
            const btnSwitch = row.querySelector('.btn-switch');
            
            if (studenteDati.assente) {
                row.classList.add('assente');
                if (btnAss) btnAss.classList.add('active-ass');
            } else {
                row.classList.remove('assente');
                if (btnAss) btnAss.classList.remove('active-ass');
            }
            
            if (studenteDati.dinnerno === "1") {
                row.classList.add('dinner-no');
                if (btnDin) btnDin.classList.add('active-din');
                row.dataset.dinnerno = "1";
            } else {
                row.classList.remove('dinner-no');
                if (btnDin) btnDin.classList.remove('active-din');
                row.dataset.dinnerno = "0";
            }
            
            if (typeof window.cambiTurnoManuali !== 'undefined') {
                const cambiTurnoManuali = window.cambiTurnoManuali;
                if (studenteDati.switch) {
                    cambiTurnoManuali[cognome] = true;
                    if (btnSwitch) btnSwitch.classList.add('modificato');
                } else {
                    cambiTurnoManuali[cognome] = false;
                    if (btnSwitch) btnSwitch.classList.remove('modificato');
                }
            }
        }
    });
}

// ========== INIZIALIZZAZIONE ==========
async function initFirebaseSync() {
    console.log('🚀 Inizializzazione Firebase Sync...');
    
    await loadPermessiFromFirebase();
    await loadAssenzeFromFirebase();
    await loadNoteFromFirebase();
    await loadDataFromFirebase();
    
    listenToFirebaseChanges();
    listenToPermessiChanges();
    listenToAssenzeChanges();
    listenToNoteChanges();
    
    const dReset = localStorage.getItem('dataUltimoReset');
    const resetDiv = document.getElementById('info-reset');
    if (dReset && resetDiv) {
        resetDiv.innerText = `Ultimo aggiornamento: ${dReset}`;
    }
    
    const noteInput = document.getElementById('dailyNotes');
    if (noteInput && !noteInput.hasListener) {
        noteInput.addEventListener('input', () => {
            localStorage.setItem('note_convitto', noteInput.value);
            syncNoteToFirebase();
        });
        noteInput.hasListener = true;
    }
    
    console.log('✅ Firebase Sync attivo');
}

// Avvia sync solo quando l'utente è autenticato
auth.onAuthStateChanged((user) => {
    if (user) {
        initFirebaseSync();
    }
});

// Pulisci listener alla chiusura
window.addEventListener('beforeunload', () => {
    const oggi = new Date();
    const dateKey = oggi.toLocaleDateString('it-IT').split('/').join('-');
    
    if (currentDataListener) {
        database.ref(`convitto/${dateKey}/dati`).off('value', currentDataListener);
    }
    if (currentPermessiListener) {
        database.ref('permessi/permanenti').off('value', currentPermessiListener);
    }
    if (currentAssenzeListener) {
        database.ref('assenze/programmate').off('value', currentAssenzeListener);
    }
    if (currentNoteListener) {
        database.ref('note/convitto').off('value', currentNoteListener);
    }
});