/**
 * DATABASE.JS - Gestione Dati Convitto
 * Qui puoi aggiornare studenti, orari e calendari senza toccare il codice logico.
 */

// x. ANAGRAFICA STUDENTI CONVITTORI ED ESTERNI

const LAB_PRANZO = { 
    1: ['4A'], 2: ['1B', '3A'], 3: ['1A', '4B'], 4: ['3B', '3C'] 
};


// CONFIGURAZIONE TURNI BASE DINNER
const TURNI_DINNER = { 
    1: ['1A', '1B', '1P', '2A', '2B', '2P', '3P'], 
    2: ['3A', '3B', '3C', '4A', '4B', '5A', '5B'] 
};

 // CONFIGURAZIONE CLASSI LAB DINNER
const LAB_DINNER={ 
     1:['2P'], 2:['5A','5B'], 3:['2B'], 4:['2A']
};



// 1. TABELLA OVERRIDE TURNI DINNER (La modifica suggerita)
// Formato: "COGNOME": { GiornoSettimana: TurnoDestinazione }
// GiornoSettimana: 1=Lun, 2=Mar, 3=Mer, 4=Gio, 5=Ven
const OVERRIDE_TURNI_DINNER = {
    "TEBANO": { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 }, // Sempre turno 2
    "SCHIRRU": { 1: 2, 3: 2, 4: 2 },            // Turno 2 Lun, Mer, Gio
    "BOMBONATO": { 1: 2, 3: 2, 4: 2 },
    "PAONESSA": { 1: 2, 3: 2, 4: 2 },
    "SALVI": { 1: 2, 3: 2 },
    "SAITTA": { 3: 2 }                          // Turno 2 solo Mercoledì
};

// 2. PERMESSI PERMANENTI (Dettaglio Orari)
    const ORARI_PP = { 
        // Configurazione orari PP predefiniti (Giorno: 1=Lun, 2=Mar, 3=Mer, 4=Gio)
    // AGGIUNGERE QUI ALTRI PP 
    "BERRUTI A": { 4: { out: "13:30", in: "NO rientro" }},     
};


// 3. ASSENTI PERMESSO DINNER (Chi non cena per giorno)
 const ASSENTI_PERMESSO = { 
    1: ['TESSARIN', 'CASALICCHIO', 'PIGNATELLI', 'MENALDINO', 'CHESSA', 'QUERIO GIANETTO'], 
    2: ['CHEN', 'COMMOD', 'CASALICCHIO', 'CLERIN', 'LAZIER', 'LUNARDI', 'GASPARD', 'PAONESSA', 'QUERIO GIANETTO', 'BOMBONATO', 'SCHIRRU', 'VILARDO'], 
    3: ['BERRUTI S', 'DAGOSTINO', 'GIOVANNELLI P', 'CASALICCHIO', 'SAITTA', 'PIGNATELLI', 'CHESSA', 'QUERIO GIANETTO', 'BOMBONATO', 'SCHIRRU', 'VILARDO'], 
    4: ['BERRUTI A', 'CHEN', 'CASALICCHIO', 'CLERIN', 'MENALDINO', 'CHESSA', 'QUERIO GIANETTO', 'BOMBONATO', 'SCHIRRU', 'VILARDO'] 
};

// 4. CALENDARIO LABORATORI DINNER (G1/G2 per 5A e 5B)
const CALENDARIO_GRUPPI_DINNER = { 
         
    "31/03/2026": "gr2",  "09/04/2026": "gr2", "14/04/2026": "gr1", "16/04/2026": "gr1",
    "21/04/2026": "gr2", "23/04/2026": "gr2", "28/04/2026": "gr1", "30/04/2026": "gr1",
    "05/05/2026": "gr2", "07/05/2026": "gr2", "12/05/2026": "gr1", "14/05/2026": "gr1",
    "19/05/2026": "gr2", "21/05/2026": "gr2", "26/05/2026": "gr1", "28/05/2026": "gr1",
    "04/06/2026": "gr2", "09/06/2026": "gr2"
};

 