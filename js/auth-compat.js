// js/auth-compat.js
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();

document.body.style.visibility = "hidden";
let isAuthorized = false;

// Attendi che l'autenticazione sia pronta PRIMA di controllare l'autorizzazione
auth.onAuthStateChanged(async (user) => {
    console.log("Auth state changed:", user ? user.email : "No user");
    
    if (user) {
        const uid = user.uid;
        // CORREZIONE: Usa il percorso corretto per gli utenti autorizzati
        const snapshot = await db.ref(`authoreziedUsers/${uid}`).once("value");
        
        if (snapshot.exists() && snapshot.val() === true) {
            isAuthorized = true;
            document.body.style.visibility = "visible";
            window._currentUser = user;
            console.log("User authorized, firing authReady event");
            document.dispatchEvent(new CustomEvent("authReady", { detail: { user } }));
        } else {
            console.log("User not in authorized list");
            await auth.signOut();
            alert("Accesso non autorizzato.");
            window.location.href = "login.html";
        }
    } else {
        if (!isAuthorized && !window.location.pathname.includes("login.html")) {
            console.log("No user, redirecting to login");
            const currentPage = window.location.pathname.split("/").pop();
            window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
        }
    }
});