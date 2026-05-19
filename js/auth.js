// js/auth.js
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

let app;
try {
    app = initializeApp(firebaseConfig);
} catch (e) {
    // L'app è già stata inizializzata da un altro modulo
    app = getApp();
}

export const auth = getAuth(app);
export const db = getDatabase(app);

document.body.style.visibility = "hidden";
let isAuthorized = false;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        const authRef = ref(db, `authoreziedUsers/${uid}`);
        const snapshot = await get(authRef);
        if (snapshot.exists() && snapshot.val() === true) {
            isAuthorized = true;
            document.body.style.visibility = "visible";
            window._currentUser = user;
            document.dispatchEvent(new CustomEvent("authReady", { detail: { user } }));
        } else {
            await signOut(auth);
            alert("Accesso non autorizzato.");
            window.location.href = "login.html";
        }
    } else {
        if (!isAuthorized) {
            const currentPage = window.location.pathname.split("/").pop();
            window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
        }
    }
});