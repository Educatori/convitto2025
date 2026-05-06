// Configurazione Firebase
 const firebaseConfig = {
            apiKey: "AIzaSyAKBQJYiu1ConaCKOj_rlKQSOQaGVTinCc",
            authDomain: "cruscotto-438bc.firebaseapp.com",
            databaseURL: "https://cruscotto-438bc-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "cruscotto-438bc",
            storageBucket: "cruscotto-438bc.firebasestorage.app",
            messagingSenderId: "142955041436",
            appId: "1:142955041436:web:22be8db6e293bf14c55359",
            measurementId: "G-LK93GN5JNP"
        };
// Inizializza Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Variabili globali per la sincronizzazione
let isSyncing = false;
let currentDataListener = null;
let currentPermessiListener = null;
let currentNoteListener = null;
let currentAssenzeListener = null;
