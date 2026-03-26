/**
 * DATABASE.JS - Gestione Dati Convitto
 * Qui puoi aggiornare studenti, orari e calendari senza toccare il codice logico.
 */

// 1. ANAGRAFICA STUDENTI
    const studenti=[ 
// 1A
{ cognome: "COMMOD", nome: "Gaia", classe: "1A", gruppo: "", room:"218" },
{ cognome: "GASPARD", nome: "Thierry", classe: "1A", gruppo: "", room:"105" },
{ cognome: "JANS", nome: "Giada", classe: "1A", gruppo: "", room:"203" },
{ cognome: "OBETTI", nome: "Virginia", classe: "1A", gruppo: "", room:"203" },
{ cognome: "PETTORALI", nome: "Matilde", classe: "1A", gruppo: "", room:"203" },
{ cognome: "ZIGGIOTTO", nome: "Beatrice", classe: "1A", gruppo: "", room:"211" },
// 1B
{ cognome: "BLANCHET N", nome: "Nadine", classe: "1B", gruppo: "", room:"221" },
{ cognome: "BOMBONATO", nome: "Francesco", classe: "1B", gruppo: "", room:"104" },
{ cognome: "DATTRINO", nome: "Nicolas", classe: "1B", gruppo: "", room:"105" },
{ cognome: "GIOVANDO", nome: "Caterina", classe: "1B", gruppo: "", room:"206" },
{ cognome: "LUNARDI", nome: "Filippo", classe: "1B", gruppo: "", room:"108" },
{ cognome: "POUJOL", nome: "Chiara", classe: "1B", gruppo: "", room:"206" },
{ cognome: "QUERIO GIANETTO", nome: "Giorgio", classe: "1B", gruppo: "", room:"104" },
{ cognome: "SALVI", nome: "Sophie", classe: "1B", gruppo: "", room:"206" },
{ cognome: "SCHIRRU", nome: "Didier Félicien Hervé", classe: "1B", gruppo: "", room:"108" },
{ cognome: "VILARDO", nome: "Gabriele", classe: "1B", gruppo: "", room:"104" },
// 1P

{ cognome: "CHABLOZ", nome: "Annette", classe: "1P", gruppo: "", room:"213" },
{ cognome: "DAGOSTINO", nome: "Domenico", classe: "1P", gruppo: "", room:"108" },
{ cognome: "FURLAN", nome: "Alessandro", classe: "1P", gruppo: "", room:"111" },
{ cognome: "GIOVANNELLI P", nome: "Pietro", classe: "1P", gruppo: "", room:"106" },
{ cognome: "GUIZZETTI RINCON", nome: "Francisco Andres", classe: "1P", gruppo: "", room:"105" },
{ cognome: "LAI", nome: "Stefano", classe: "1P", gruppo: "", room:"106" },
{ cognome: "LAZIER", nome: "Francesco", classe: "1P", gruppo: "", room:"106" },
{ cognome: "PAONESSA", nome: "Leonardo", classe: "1P", gruppo: "", room:"107" },
{ cognome: "VINCENT", nome: "Thomas", classe: "1P", gruppo: "", room:"103" },
{ cognome: "RUSCI DI LUCA", nome: "Greta", classe: "1P", gruppo: "", room:"212" },
{ cognome: "SILVANI", nome: "Amelie", classe: "1P", gruppo: "", room:"204" },
// 2A
{ cognome: "BARAVALLE", nome: "Andrea", classe: "2A", gruppo: "", room:"102" },
{ cognome: "BERTOT", nome: "Manuele", classe: "2A", gruppo: "", room:"102" },
{ cognome: "BUZZI", nome: "Alessandro", classe: "2A", gruppo: "", room:"101" },
{ cognome: "CASTELLANO", nome: "Martina", classe: "2A", gruppo: "", room:"204" },
{ cognome: "DA FRE", nome: "Gaia", classe: "2A", gruppo: "", room:"207" },
{ cognome: "DE GASPER", nome: "Lara", classe: "2A", gruppo: "", room:"207" },
{ cognome: "GARCIA", nome: "Luis Alberto", classe: "2A", gruppo: "", room:"118" },
{ cognome: "HERESAZ", nome: "Alyce", classe: "2A", gruppo: "", room:"211" },
{ cognome: "PENNARD", nome: "Serena", classe: "2A", gruppo: "", room:"211" },
{ cognome: "SAITTA", nome: "Asia", classe: "2A", gruppo: "", room:"207" },
// 2B
{ cognome: "CHEN", nome: "Michael Jianhao", classe: "2B", gruppo: "", room:"109" },
{ cognome: "DELLAQUILA", nome: "Gabriele", classe: "2B", gruppo: "", room:"107" },
{ cognome: "DUNAND", nome: "Audrey", classe: "2B", gruppo: "", room:"218" },
{ cognome: "GHILARDINI", nome: "Leonardo", classe: "2B", gruppo: "", room:"114" },
{ cognome: "MAINO", nome: "Giada", classe: "2B", gruppo: "", room:"218" },
{ cognome: "MISERENDINO", nome: "Ludovica", classe: "2B", gruppo: "", room:"204" },
{ cognome: "MOUNIM", nome: "Yahya", classe: "2B", gruppo: "", room:"109" },
{ cognome: "PEZZOLI", nome: "Niccolò", classe: "2B", gruppo: "", room:"101" },
{ cognome: "TACCONE", nome: "Nicholas", classe: "2B", gruppo: "", room:"109" },
// 2P
{ cognome: "BERRIAD", nome: "Thierry", classe: "2P", gruppo: "", room:"121" },
{ cognome: "BERRUTI A", nome: "Andrea", classe: "2P", gruppo: "", room:"114" },
{ cognome: "BERRUTI S", nome: "Stefano", classe: "2P", gruppo: "", room:"114" },
{ cognome: "CASALICCHIO", nome: "Nahuel", classe: "2P", gruppo: "", room:"121" },
{ cognome: "CLERIN", nome: "Pietro", classe: "2P", gruppo: "", room:"110" },
{ cognome: "DONZEL", nome: "Elodie", classe: "2P", gruppo: "", room:"213" },
{ cognome: "GENS", nome: "Aaron", classe: "2P", gruppo: "", room:"102" },
{ cognome: "HERRERA", nome: "Alexander", classe: "2P", gruppo: "", room:"115" },
{ cognome: "MONTERO", nome: "Karen", classe: "2P", gruppo: "", room:"209" },
{ cognome: "PERRIN", nome: "Annie", classe: "2P", gruppo: "", room:"213" },
{ cognome: "STEVENIN", nome: "Joelle", classe: "2P", gruppo: "", room:"208" },
{ cognome: "TORTORELLI C", nome: "Carlotta", classe: "2P", gruppo: "", room:"209" },
{ cognome: "TORTORELLI G", nome: "Greta", classe: "2P", gruppo: "", room:"209" },
// 3P
{ cognome: "CONSOL", nome: "Gaia", classe: "3P", gruppo: "", room:"208" },

{ cognome: "LAGOMARSINI", nome: "Michele", classe: "3P", gruppo: "", room:"111" },
{ cognome: "LLESHI", nome: "Gabriele", classe: "3P", gruppo: "", room:"115" },
{ cognome: "MARRERO", nome: "Lewis", classe: "3P", gruppo: "", room:"115" },
{ cognome: "RONCO", nome: "Angelica", classe: "3P", gruppo: "", room:"208" },
// 3A
{ cognome: "CATTARINUSSI", nome: "Samuele", classe: "3A", gruppo: "", room:"101" },
{ cognome: "FLORIAN", nome: "Gabriele", classe: "3A", gruppo: "", room:"118" },
{ cognome: "MARANGELO", nome: "Giulio", classe: "3A", gruppo: "", room:"118" },
{ cognome: "PEAQUIN", nome: "Linda", classe: "3A", gruppo: "", room:"214" },
{ cognome: "ZOPPO", nome: "Rodrigue", classe: "3A", gruppo: "", room:"121" },
// 3B
{ cognome: "BLANCHET M", nome: "Magalie", classe: "3B", gruppo: "", room:"214" },
{ cognome: "BOGGIA", nome: "Vittoria", classe: "3B", gruppo: "", room:"214" },
{ cognome: "CIRINA", nome: "Lorenzo", classe: "3B", gruppo: "", room:"110" },
{ cognome: "DUBLANC", nome: "Nicole", classe: "3B", gruppo: "", room:"202" },
{ cognome: "GRANATA", nome: "Gabriele", classe: "3B", gruppo: "", room:"110" },
{ cognome: "PRUTEANU", nome: "Mihai Giuliano", classe: "3B", gruppo: "", room:"116" },
{ cognome: "TRIOLO", nome: "Eleonora", classe: "3B", gruppo: "", room:"214" },
// 3C
{ cognome: "CELESIA M", nome: "Marta", classe: "3C", gruppo: "", room:"215" },
{ cognome: "COSTABLOZ", nome: "Giorgia", classe: "3C", gruppo: "", room:"202" },
{ cognome: "CUMINO", nome: "Lucia", classe: "3C", gruppo: "", room:"205" },
{ cognome: "EPICOCO", nome: "Angelica", classe: "3C", gruppo: "", room:"205" },
{ cognome: "MERLET", nome: "Cedric", classe: "3C", gruppo: "", room:"113" },
{ cognome: "PALMISANO", nome: "Clarissa", classe: "3C", gruppo: "", room:"202" },
{ cognome: "TARTIN", nome: "Zoe", classe: "3C", gruppo: "", room:"215" },
// 4A
{ cognome: "CHIADO", nome: "Diego", classe: "4A", gruppo: "", room:"123" },
{ cognome: "COMIOTTO", nome: "Lucia", classe: "4A", gruppo: "", room:"216" },
{ cognome: "CONTA", nome: "Giovanni", classe: "4A", gruppo: "", room:"117" },
{ cognome: "CROCE", nome: "Giacomo", classe: "4A", gruppo: "", room:"117" },
{ cognome: "DANNA", nome: "Gioele", classe: "4A", gruppo: "", room:"119" },
{ cognome: "DI TRIA", nome: "Alice", classe: "4A", gruppo: "", room:"220" },
{ cognome: "MANCUSO", nome: "Gaia", classe: "4A", gruppo: "", room:"219" },
{ cognome: "MARCIANO", nome: "Alberto", classe: "4A", gruppo: "", room:"116" },
{ cognome: "MENALDINO", nome: "Moreno", classe: "4A", gruppo: "", room:"113" },
{ cognome: "NAVARRETTA", nome: "Alexis Denis Fabien", classe: "4A", gruppo: "", room:"123" },
{ cognome: "OBERTO", nome: "Debora", classe: "4A", gruppo: "", room:"210" },
{ cognome: "TAPPELLA", nome: "Luca", classe: "4A", gruppo: "", room:"116" },
{ cognome: "TESSARIN", nome: "Sharon", classe: "4A", gruppo: "", room:"205" },
{ cognome: "VIOT", nome: "Cecilia", classe: "4A", gruppo: "", room:"210" },
// TEBANO 2* DINNER
{ cognome: "TEBANO", nome: "Serena", classe: "3P", gruppo: "", room:"212" },
// 4B
{ cognome: "CHESSA", nome: "Samuele", classe: "4B", gruppo: "", room:"111" },
{ cognome: "FAVRE", nome: "Emilie", classe: "4B", gruppo: "", room:"217" },
{ cognome: "GIOVANNELLI T", nome: "Tommaso", classe: "4B", gruppo: "", room:"113" },
{ cognome: "GORREX", nome: "Valerie", classe: "4B", gruppo: "", room:"212" },
{ cognome: "HACHEMAOUI", nome: "Slimane Raffaello", classe: "4B", gruppo: "", room:"117" },
{ cognome: "MEYNET", nome: "Riccardo", classe: "4B", gruppo: "", room:"123" },
{ cognome: "NICOLASI", nome: "Ginevra", classe: "4B", gruppo: "", room:"217" },
{ cognome: "SAVELLA", nome: "Ilaria", classe: "4B", gruppo: "", room:"210" },
{ cognome: "SERIO", nome: "Federica", classe: "4B", gruppo: "", room:"217" },
// 5A
{ cognome: "CARRUOZZO", nome: "Amalia", classe: "5A", gruppo: "G1", room:"201" },
{ cognome: "CELESIA A", nome: "Alessio", classe: "5A", gruppo: "G2", room:"120" },
{ cognome: "DE GATTIS", nome: "Eleonora", classe: "5A", gruppo: "G2", room:"219" },
{ cognome: "OBERT", nome: "Tommy", classe: "5A", gruppo: "G2", room:"125" },
{ cognome: "PETRIS", nome: "Maurizio", classe: "5A", gruppo: "G2", room:"113" },
{ cognome: "PICCOLI", nome: "Greta", classe: "5A", gruppo: "G1", room:"201" },
{ cognome: "PIGNATELLI", nome: "Maria Vittoria", classe: "5A", gruppo: "G1", room:"201" },
{ cognome: "RASO", nome: "Beatrice", classe: "5A", gruppo: "G2", room:"220" },
{ cognome: "SALVADORI", nome: "Emile", classe: "5A", gruppo: "G2", room:"124" },
{ cognome: "SORRENTI", nome: "Gabriele", classe: "5A", gruppo: "G1", room:"120" },
{ cognome: "VALLOMY", nome: "Etienne", classe: "5A", gruppo: "G2", room:"124" },
{ cognome: "VIGLIANO", nome: "Jacopo", classe: "5A", gruppo: "G1", room:"120" },
// 5B
{ cognome: "CHREIM", nome: "Khadijé", classe: "5B", gruppo: "G1", room:"221" },
{ cognome: "CORVO", nome: "Filippo", classe: "5B", gruppo: "G1", room:"119" },
{ cognome: "COTTINO", nome: "Jacqueline", classe: "5B", gruppo: "G2", room:"219" },
{ cognome: "KOUROUMA", nome: "Nora", classe: "5B", gruppo: "G2", room:"215" },
{ cognome: "LINTY", nome: "Alys", classe: "5B", gruppo: "G1", room:"216" },
{ cognome: "MARGUERETTAZ", nome: "Greta", classe: "5B", gruppo: "G2", room:"221" },
{ cognome: "MILLERY", nome: "Mathieu", classe: "5B", gruppo: "G2", room:"124" },
{ cognome: "RABAGLIO", nome: "Filippo", classe: "5B", gruppo: "G1", room:"119" }
];

// 2. CONFIGURAZIONE TURNI BASE (per Classe)
const TURNI_BASE = { 
    1: ['1A', '1B', '1P', '2A', '2B', '2P', '3P'], 
    2: ['3A', '3B', '3C', '4A', '4B', '5A', '5B'] 
};

// 3. TABELLA OVERRIDE TURNI (La modifica suggerita)
// Formato: "COGNOME": { GiornoSettimana: TurnoDestinazione }
// GiornoSettimana: 1=Lun, 2=Mar, 3=Mer, 4=Gio, 5=Ven
const OVERRIDE_TURNI = {
    "TEBANO": { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 }, // Sempre turno 2
    "SCHIRRU": { 1: 2, 3: 2, 4: 2 },            // Turno 2 Lun, Mer, Gio
    "BOMBONATO": { 1: 2, 3: 2, 4: 2 },
    "PAONESSA": { 1: 2, 3: 2, 4: 2 },
    "SALVI": { 1: 2, 3: 2 },
    "SAITTA": { 3: 2 }                          // Turno 2 solo Mercoledì
};

// 4. PERMESSI PERMANENTI (Dettaglio Orari)
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


// 5. ASSENTI PERMESSO (Chi non cena per giorno)
 const ASSENTI_PERMESSO = { 
    1: ['TESSARIN', 'CASALICCHIO', 'PIGNATELLI', 'MENALDINO', 'CHESSA', 'QUERIO GIANETTO'], 
    2: ['CHEN', 'COMMOD', 'CASALICCHIO', 'CLERIN', 'LAZIER', 'LUNARDI', 'GASPARD', 'PAONESSA', 'QUERIO GIANETTO', 'BOMBONATO', 'SCHIRRU', 'VILARDO'], 
    3: ['BERRUTI S', 'DAGOSTINO', 'GIOVANNELLI P', 'CASALICCHIO', 'SAITTA', 'PIGNATELLI', 'CHESSA', 'QUERIO GIANETTO', 'BOMBONATO', 'SCHIRRU', 'VILARDO'], 
    4: ['BERRUTI A', 'CHEN', 'CASALICCHIO', 'CLERIN', 'MENALDINO', 'CHESSA', 'QUERIO GIANETTO', 'BOMBONATO', 'SCHIRRU', 'VILARDO'] 
};

// 6. CALENDARIO LABORATORI (G1/G2 per 5A e 5B)
const CALENDARIO_GRUPPI = { 
         
 "24/03/2026": "gr1", "31/03/2026": "gr2", "14/04/2026": "gr1", "21/04/2026": "gr2", "28/04/2026": "gr1", "05/05/2026": "gr2", "12/05/2026": "gr1", "19/05/2026": "gr2", "26/05/2026": "gr1", "09/06/2026": "gr2"
};

 const ASSENTI_CLASSI={ 
     1:['2P'], 2:['5A','5B'], 3:['2B'], 4:['2A']
};
