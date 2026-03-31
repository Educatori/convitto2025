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
    "BERRUTI S": { 3: { out: "14:00", in: "NO rientro" }},
    "BOMBONATO": { 1: { out: "17:00", in: "18:45" }, 3: { out: "17:00", in: "18:45" }, 4: { out: "17:00", in: "18:45" }},    
    "BOGGIA" : { 4: { out: "16:00", in: "19:00" }},
    "BUZZI": { 1: { out: "16:40", in: "18:00" }, 2: { out: "15:50", in: "18:00" }, 3: { out: "14:00", in: "16:30" }},
    "CASALICCHIO": { 1: { out: "18:00", in: "21:30" }, 2: { out: "18:00", in: "21:30" }, 3: { out: "18:00", in: "21:30" }, 4: { out: "18:00", in: "21:30" }},
    "CATTARINUSSI": { 2: { out: "15:00", in: "16:30" }, 3: { out: "15:15", in: "16:45" }, 4: { out: "17:30", in: "19:00" }},
    "CHEN": { 2: { out: "16:30", in: "NO rientro" }, 4: { out: "16:30", in: "NO rientro" } },
    "CHESSA": { 1: { out: "17:00", in: "21:30" }, 3: { out: "17:00", in: "21:30" }, 4: { out: "17:00", in: "21:30" }}, 
    "CHIADO": { 1: { out: "16:30", in: "18:45" }, 2: { out: "16:30", in: "18:45" }, 3: { out: "16:30", in: "18:45" }, 4: { out: "16:30", in: "18:45" }},
    "CIRINA": { 4: { out: "16:00", in: "19:00" }}, 
    "CLERIN": { 2: { out: "18:00", in: "21:30" }, 4: { out: "18:00", in: "21:30" }}, 
    "COMIOTTO": { 1: { out: "20:00", in: "21:30" }, 2: { out: "16:00", in: "19:00" }, 3: { out: "17:00", in: "19:00" }, 4: { out: "16:00", in: "19:00" }},
    "COMMOD": { 1: { out: "16:40", in: "21:30" }},  
    "DAGOSTINO": { 3: { out: "16:00", in: "21:30" }},
    "DATTRINO":  { 1: { out: "17:00", in: "18:30" }, 3: { out: "17:00", in: "18:30"}, 4: { out: "17:00", in: "18:30" }}, 
    "DI TRIA": { 1: { out: "16:40", in: "19:00" },  2: { out: "15:50", in: "19:00" }, 3: { out: "16:40", in: "19:00" }}, 
    "DUBLANC": { 1: { out: "17:00", in: "19:00" },  2: { out: "16:00", in: "18:00" }, 4: { out: "15:00", in: "17:00" }},
    "EPICOCO": { 2: { out: "17:40", in: "20:00" },  3: { out: "17:40", in: "20:00" }, 4: { out:  "17:40", in: "20:00" }},
    "FLORIAN":  { 1: { out: "16:50", in: "19:00" }, 2: { out: "15:00", in: "18:00" }, 4: { out: "16:50", in: "19:00" }},
    "GASPARD":  { 2: { out: "17:15", in: "20:00" },  4: { out: "17:15", in: "20:00" }},  
    "GIOVANNELLI P": { 3: { out: "17:30", in: "21:30" }},
    "LAZIER": { 2: { out: "17:00", in: "20:00" }},
    "LUNARDI":  { 2: { out: "17:00", in: "20:00" },  4: { out: "17:00", in: "20:00" }},     
    "MARANGELO": { 1: { out: "17:00", in: "19:00" },  2: { out: "14:45", in: "17:00" },  4: { out: "16:00", in: "19:00" }},   
    "MENALDINO":  { 1: { out: "18:00", in: "20:15" },   4: { out: "18:00", in: "20:15" } },     
    "MERLET":  { 1: { out: "16:00", in: "18:00" }, 2: { out: "16:00", in: "18:00" }, 3: { out: "16:00", in: "18:00" }, 4: { out: "16:00", in: "18:00" }},  
    "OBERT": { 1: { out: "16:00", in: "19:15" }, 2: { out: "16:00", in: "19:15" }, 3: { out: "16:00", in: "19:15" }, 4: { out: "16:00", in: "19:15" }},
    "OBERTO":  { 1: { out: "16:00", in: "19:00" }, 2: { out: "16:00", in: "19:00" }, 3: { out: "16:00", in: "19:00" }, 4: { out: "16:00", in: "19:00" }},   
    "PAONESSA": { 1: { out: "16:30", in: "19:00" }, 2: { out: "16:30", in: "21:30" }, 3: { out: "16:30", in: "19:00" }, 4: { out: "16:30", in: "19:00" }},    
    "PETRIS":  { 1: { out: "15:40", in: "19:00" }, 3: { out: "15:40", in: "19:00" }, 4: { out: "15:40", in: "19:00" }},  
    "PIGNATELLI":  { 1: { out: "17:00", in: "20:00" }, 3: { out: "17:00", in: "20:00" } }, 
    "QUERIO GIANETTO":  { 1: { out: "17:00", in: "19:30" }, 2: { out: "17:00", in: "19:30" }, 3: { out: "17:00", in: "19:30" }, 4: { out: "17:00", in: "19:30" }},   
    "SAITTA": { 1: { out: "19:20", in: "20:40" }, 3: { out: "15:45", in: "18:45" }},   
    "SALVI":  { 1: { out: "17:00", in: "19:00" },  3: { out: "17:00", in: "19:00" }, 4: { out: "17:00", in: "19:00" }},
    "SCHIRRU":  { 1: { out: "16:40", in: "18:30" },   2: { out: "16:40", in: "18:30" },  3: { out: "16:40", in: "18:30" }},
    "SORRENTI":  { 1: { out: "18:00", in: "19:00" }, 2: { out: "18:00", in: "19:00" }, 3: { out: "18:00", in: "19:00" }, 4: { out: "18:00", in: "19:00" }},
    "TAPPELLA":  { 1: { out: "17:00", in: "19:00" },  2: { out: "16:00", in: "18:00" },  3: { out: "17:00", in: "19:00" },  4: { out: "16:00", in: "18:00" }},  
    "TESSARIN": { 1: { out: "16:40", in: "NO rientro" }, 3: { out: "16:40", in: "NO rientro" }},
    "VILARDO":  { 1: { out: "17:00", in: "18:30" }, 3: { out: "17:00", in: "18:30" }, 4: { out: "17:00", in: "18:30" }},
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

 
