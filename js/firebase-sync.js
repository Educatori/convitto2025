// ========== GESTIONE STATO CONNESSIONE ==========
function updateConnectionStatus(connected) {
    const statusDiv = document.getElementById('connection-status');
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

// ========== SINCRONIZZAZIONE DATI CONVITTO ==========
async function syncDataToFirebase() {
    if (isSyncing) return;
    
    const oggi = new Date();
    const dateKey = oggi.toLocaleDateString('it-IT').split('/').join('-');
    const datiCorrenti = localStorage.getItem('datiConvitto');
    
    if (datiCorrenti && datiCorrenti !== '{}') {
        try {
            await database.ref(`convitto/${dateKey}/dati`).set(JSON.parse(datiCorrenti));
            await database.ref(`convitto/${dateKey}/lastUpdate`).set(firebase.database.ServerValue.TIMESTAMP);
            console.log('✅ Dati sincronizzati con Firebase');
        } catch (error) {
            console.error('❌ Errore sync Firebase:', error);
            updateConnectionStatus(false);
        }
    }
}

async function loadDataFromFirebase() {
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
                
                if (typeof caricaDatiLocale === 'function') {
                    caricaDatiLocale();
                }
                if (typeof aggiornaStatiUI === 'function') {
                    aggiornaStatiUI();
                }
                
                setTimeout(() => { isSyncing = false; }, 100);
                console.log('📥 Dati caricati da Firebase');
            }
            updateConnectionStatus(true);
        } else {
            await syncDataToFirebase();
            updateConnectionStatus(true);
        }
    } catch (error) {
        console.error('❌ Errore caricamento da Firebase:', error);
        updateConnectionStatus(false);
    }
}

function listenToFirebaseChanges() {
    const oggi = new Date();
    const dateKey = oggi.toLocaleDateString('it-IT').split('/').join('-');
    
    if (currentDataListener) {
        database.ref(`convitto/${dateKey}/dati`).off('value', currentDataListener);
    }
    
    currentDataListener = (snapshot) => {
        if (!isSyncing && snapshot.exists()) {
            const firebaseData = snapshot.val();
            const localData = localStorage.getItem('datiConvitto');
            
            if (JSON.stringify(firebaseData) !== localData) {
                isSyncing = true;
                localStorage.setItem('datiConvitto', JSON.stringify(firebaseData));
                
                if (typeof caricaDatiLocale === 'function') {
                    caricaDatiLocale();
                }
                if (typeof aggiornaStatiUI === 'function') {
                    aggiornaStatiUI();
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
    if (currentNoteListener) {
        database.ref('note/convitto').off('value', currentNoteListener);
    }
    
    currentNoteListener = (snapshot) => {
        if (!isSyncing && snapshot.exists()) {
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
    try {
        const snapshot = await database.ref('assenze/programmate').get();
        if (snapshot.exists()) {
            const firebaseAssenze = snapshot.val();
            const localAssenze = localStorage.getItem('assenzeProgrammate');
            
            if (JSON.stringify(firebaseAssenze) !== localAssenze) {
                localStorage.setItem('assenzeProgrammate', JSON.stringify(firebaseAssenze));
                if (typeof caricaAssenzeProgrammate === 'function') {
                    caricaAssenzeProgrammate();
                }
                if (typeof renderListaAssenze === 'function') {
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
    if (currentAssenzeListener) {
        database.ref('assenze/programmate').off('value', currentAssenzeListener);
    }
    
    currentAssenzeListener = (snapshot) => {
        if (!isSyncing && snapshot.exists()) {
            const firebaseAssenze = snapshot.val();
            const localAssenze = localStorage.getItem('assenzeProgrammate');
            
            if (JSON.stringify(firebaseAssenze) !== localAssenze) {
                isSyncing = true;
                localStorage.setItem('assenzeProgrammate', JSON.stringify(firebaseAssenze));
                if (typeof caricaAssenzeProgrammate === 'function') {
                    caricaAssenzeProgrammate();
                }
                if (typeof renderListaAssenze === 'function') {
                    renderListaAssenze();
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
    try {
        const snapshot = await database.ref('permessi/permanenti').get();
        if (snapshot.exists()) {
            const firebasePermessi = snapshot.val();
            const localPermessi = localStorage.getItem('permessiPermanenti');
            
            if (JSON.stringify(firebasePermessi) !== localPermessi) {
                localStorage.setItem('permessiPermanenti', JSON.stringify(firebasePermessi));
                if (typeof popolaListaPermessi === 'function') {
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
    if (currentPermessiListener) {
        database.ref('permessi/permanenti').off('value', currentPermessiListener);
    }
    
    currentPermessiListener = (snapshot) => {
        if (!isSyncing && snapshot.exists()) {
            const firebasePermessi = snapshot.val();
            const localPermessi = localStorage.getItem('permessiPermanenti');
            
            if (JSON.stringify(firebasePermessi) !== localPermessi) {
                isSyncing = true;
                localStorage.setItem('permessiPermanenti', JSON.stringify(firebasePermessi));
                if (typeof popolaListaPermessi === 'function') {
                    popolaListaPermessi();
                }
                setTimeout(() => { isSyncing = false; }, 100);
                console.log('🔄 Aggiornamento permessi in tempo reale');
            }
        }
    };
    
    database.ref('permessi/permanenti').on('value', currentPermessiListener);
}

// ========== OVERRIDE FUNZIONI SALVATAGGIO ==========
function triggerSync() {
    syncDataToFirebase();
    syncNoteToFirebase();
    syncAssenzeToFirebase();
    syncPermessiToFirebase();
}

const originalSalvaDatiLocale = window.salvaDatiLocale;
if (originalSalvaDatiLocale) {
    window.salvaDatiLocale = function() {
        originalSalvaDatiLocale();
        triggerSync();
    };
}

const originalSalvaAssenzeProgrammate = window.salvaAssenzeProgrammate;
if (originalSalvaAssenzeProgrammate) {
    window.salvaAssenzeProgrammate = function() {
        originalSalvaAssenzeProgrammate();
        syncAssenzeToFirebase();
    };
}

// Override per cancellaNote
window.cancellaNoteOriginal = window.cancellaNote;
if (window.cancellaNoteOriginal) {
    window.cancellaNote = function() {
        if (window.cancellaNoteOriginal()) {
            syncNoteToFirebase();
        }
    };
}

// ========== FUNZIONE RESET CON FIREBASE ==========
window.resetDati = function() {
    if (confirm("⚠️ Sei sicuro? Questo cancellerà tutte le uscite e le assenze inserite oggi ⚠")) {
        const oggi = new Date();
        const dateKey = oggi.toLocaleDateString('it-IT').split('/').join('-');
        
        database.ref(`convitto/${dateKey}`).remove().then(() => {
            localStorage.removeItem('datiConvitto');
            const ora = new Date().toLocaleString('it-IT');
            localStorage.setItem('dataUltimoReset', ora);
            
            if (typeof caricaDatiLocale === 'function') {
                caricaDatiLocale();
            }
            if (typeof aggiornaStatiUI === 'function') {
                aggiornaStatiUI();
            }
            
            const resetDiv = document.getElementById('info-reset');
            if (resetDiv) resetDiv.innerText = `Ultimo aggiornamento: ${ora}`;
            alert('✅ Dati resettati con successo!');
        }).catch(error => {
            console.error('Errore reset Firebase:', error);
            alert('❌ Errore durante il reset. Riprova.');
        });
    }
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
            
            if (typeof cambiTurnoManuali !== 'undefined') {
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
    
    setInterval(() => {
        if (navigator.onLine) {
            triggerSync();
        }
    }, 30000);
    
    const dReset = localStorage.getItem('dataUltimoReset');
    const resetDiv = document.getElementById('info-reset');
    if (dReset && resetDiv) {
        resetDiv.innerText = `Ultimo aggiornamento: ${dReset}`;
    }
    
    // Collega salvataggio note
    const noteInput = document.getElementById('dailyNotes');
    if (noteInput) {
        noteInput.addEventListener('input', () => {
            localStorage.setItem('note_convitto', noteInput.value);
            syncNoteToFirebase();
        });
    }
    
    console.log('✅ Firebase Sync attivo');
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        initFirebaseSync();
    } else {
        console.warn('⚠️ Firebase non configurato, modalità solo locale');
        updateConnectionStatus(false);
    }
});

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