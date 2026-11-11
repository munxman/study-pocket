(function (root, factory) {
  'use strict';
  var content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  if (root) root.ChemistryContent = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Original starter material, not official exam questions or full syllabus coverage.
  // The subject shape matches QuantContent.subjects.maths/physics.
  // Original indices 0–5 stay stable; first questions use 0, 1, 4 and 5.
  // Versioned followups select checks for each exact skill, including appended items.
  // The engine determines support/delay eligibility;
  // a question's position never establishes independent mastery by itself.
  return {
    version: 1,
    key: 'hendrik-chemistry-v1',
    title: 'Keemia · Chemistry',
    topics: [
      {
        id: 'atomic_structure_ions',
        title: 'Aatom, isotoop ja ioon',
        english: 'Atomic structure, isotopes and ions',
        why: 'Na⁺ ja Ca²⁺ tähised närvi- ning lihasraku juures kirjeldavad osakese laengut. Need ei ole uued elemendid.',
        explanation: [
          'Aatomnumber Z (atomic number) näitab prootonite arvu. Prootonid määravad elemendi. Massiarv A (mass number) on prootonite ja neutronite koguarv: neutronid = A − Z. Massiarv ei ole sama mis perioodilisustabeli keskmine aatommass.',
          'Neutraalses aatomis on elektrone sama palju kui prootoneid. Elektroni loovutamine annab positiivse iooni ehk katiooni (cation); elektroni liitmine annab negatiivse iooni ehk aniooni (anion). Laeng elementaarlaengu ühikutes = prootonid − elektronid. Tavalise iooni tekkimisel tuum ei muutu.',
          'Isotoopidel (isotopes) on sama prootonite arv, aga erinev neutronite arv. Näiteks süsinik-12 ja süsinik-13 on mõlemad süsinik. Ca²⁺ tähendab, et kaltsiumi aatomiga võrreldes on kaks elektroni vähem. Selliste ioonide liikumine võib kanda elektrivoolu; membraanis liikumist mõjutavad nii kontsentratsiooni- kui ka elektriline erinevus.'
        ],
        worked: {
          prompt: 'Kaalium-39 aatomnumber on 19. Leia K⁺ prootonite, neutronite ja elektronide arv.',
          steps: ['Prootoneid on Z = 19.', 'Neutroneid on A − Z = 39 − 19 = 20.', 'Laeng +1 tähendab ühte elektroni vähem kui prootoneid: 19 − 1 = 18 elektroni.'],
          answer: 'K⁺: 19 prootonit, 20 neutronit ja 18 elektroni.'
        },
        followupVersion: 1,
        followups: {
          "0": {
            "skill": "particle_counts_charge",
            "title": "Iooni prootonid, neutronid ja elektronid",
            "explanation": [
              "Leia prootonid aatomnumbrist Z ja neutronid vahest A − Z. Elektronide arv on Z − laeng: positiivse iooni puhul lahuta, negatiivse puhul liida."
            ],
            "worked": {
              "prompt": "Berüllium-9 aatomnumber on 4. Mitu prootonit, neutronit ja elektroni on Be²⁺ ioonis?",
              "steps": [
                "Prootonid: Z = 4.",
                "Neutronid: 9 − 4 = 5.",
                "Elektronid: 4 − 2 = 2; tuum jääb samaks."
              ],
              "answer": "4 prootonit, 5 neutronit ja 2 elektroni."
            },
            "simpleIndex": 6,
            "applicationIndex": 7
          },
          "1": {
            "skill": "isotope_identity",
            "title": "Isotoopide ühine ja erinev osakeste arv",
            "explanation": [
              "Sama elemendi isotoopidel on sama prootonite arv. Erinev massiarv tuleb neutronitest; neutraalsete isotoopide elektronide arv on samuti sama."
            ],
            "worked": {
              "prompt": "Liitiumi aatomnumber on 3. Võrdle neutraalseid liitium-6 ja liitium-7 aatomeid.",
              "steps": [
                "Mõlemal on 3 prootonit ja neutraalsena 3 elektroni.",
                "Neutroneid on vastavalt 6 − 3 = 3 ja 7 − 3 = 4."
              ],
              "answer": "Isotoopidel erineb neutronite arv; elemendi määrab ühine prootonite arv."
            },
            "simpleIndex": 8,
            "applicationIndex": 9
          },
          "2": {
            "skill": "cation_electrons",
            "title": "Katiooni elektronide arv",
            "explanation": [
              "Positiivne ioon tekib elektronide loovutamisel. Lahuta algsest elektronide arvust loovutatud elektronide arv; prootoneid juurde ei teki."
            ],
            "worked": {
              "prompt": "Neutraalsel liitiumiaatomil on 3 elektroni. Ta loovutab ühe elektroni. Mitu jääb alles?",
              "steps": [
                "Loovutatud elektron lahkub aatomist.",
                "Alles on 3 − 1 = 2 elektroni."
              ],
              "answer": "Li⁺ ioonil on 2 elektroni."
            },
            "simpleIndex": 14,
            "applicationIndex": 15
          },
          "3": {
            "skill": "anion_and_neutrons",
            "title": "Aniooni neutronid ja elektronid",
            "explanation": [
              "Neutronite arv on A − Z ega muutu elektroni liitmisel. Negatiivse iooni elektronide arv saadakse, kui neutraalse aatomi Z elektronile liita vastuvõetud elektronid."
            ],
            "worked": {
              "prompt": "Broom-81 aatomnumber on 35. Neutraalne aatom liidab ühe elektroni. Leia Br⁻ neutronid ja elektronid.",
              "steps": [
                "Neutroneid on 81 − 35 = 46.",
                "Elektrone on 35 + 1 = 36."
              ],
              "answer": "Br⁻ sisaldab 46 neutronit ja 36 elektroni."
            },
            "simpleIndex": 16,
            "applicationIndex": 17
          },
          "4": {
            "skill": "biological_ion_charge",
            "title": "Rakus oleva iooni laeng ja elektronide arv",
            "explanation": [
              "Rakukeskkonnas oleva iooni laeng on prootonite arv miinus elektronide arv. Iooni tekkimisel ei muutu elemendi prootonite arv. Laeng üksi ei määra membraani läbimise suunda."
            ],
            "worked": {
              "prompt": "Magneesiumi aatomnumber on 12. Mitu elektroni on rakus leiduval Mg²⁺ ioonil?",
              "steps": [
                "Magneesiumil on 12 prootonit.",
                "Laeng +2 tähendab kahte elektroni vähem: 12 − 2 = 10."
              ],
              "answer": "Mg²⁺ ioonil on 12 prootonit ja 10 elektroni."
            },
            "simpleIndex": 10,
            "applicationIndex": 11
          },
          "5": {
            "skill": "isotope_label_transfer",
            "title": "Isotoopmärgise osakeste arv",
            "explanation": [
              "Märgistusotstarve ei muuda isotoobi tuuma. Leia prootonid aatomnumbrist ja neutronid massiarvu ning aatomnumbri vahest; neutraalsel aatomil on elektrone sama palju kui prootoneid."
            ],
            "worked": {
              "prompt": "Väävel-34 kasutatakse märgisena. Väävli aatomnumber on 16. Kirjelda üht neutraalset väävel-34 aatomit.",
              "steps": [
                "Prootoneid on 16 ja neutraalses aatomis elektrone 16.",
                "Neutroneid on 34 − 16 = 18."
              ],
              "answer": "16 prootonit, 18 neutronit ja 16 elektroni; märgiseks kasutamine neid arve ei muuda."
            },
            "simpleIndex": 12,
            "applicationIndex": 13
          }
        },
        sources: [
          {title: 'Opiq: Bohri aatomiehituse mudel (tasuta tutvumispeatükk)', url: 'https://www.opiq.ee/kit/575/chapter/31962', note: 'Soovi korral vaata aatomi osakeste skeemi. Seejärel sule tekst ja selgita oma sõnadega, mis muutub iooni tekkimisel.'},
          {title: 'OpenStax Chemistry 2e: Atomic Structure and Symbolism', url: 'https://openstax.org/books/chemistry-2e/pages/2-3-atomic-structure-and-symbolism'},
          {title: 'TÜ: keemia sisseastumiseksami teemad ja õppematerjalid', url: 'https://sisu.ut.ee/arst-sisseastumiseksam/keemia-sisseastumiseksam/'}
        ],
        questions: [
          {prompt: 'Sodium has atomic number 11. A sodium-23 ion has charge +1. How many protons, neutrons and electrons does this ion have?', options: ['11 protons, 12 neutrons, 12 electrons', '11 protons, 12 neutrons, 10 electrons', '10 protons, 13 neutrons, 11 electrons', '12 protons, 11 neutrons, 11 electrons'], answer: 1, explanation: 'Prootonite arv on 11, neutronite arv 23 − 11 = 12. Na⁺ on loovutanud ühe elektroni: 11 − 1 = 10. Positiivne laeng ei tähenda elektroni lisandumist.', skill: 'particle_counts_charge'},
          {prompt: 'Neutral carbon-12 and neutral carbon-13 atoms are isotopes. Which particle count is different?', options: ['The number of protons only', 'The number of electrons only', 'The number of neutrons only', 'The numbers of protons and electrons'], answer: 2, explanation: 'Süsiniku aatomnumber on mõlemal 6. Neutraalses aatomis on ka elektrone mõlemal 6. Neutronite arv erineb: 12 − 6 = 6 ja 13 − 6 = 7.', skill: 'isotope_identity'},
          {prompt: 'A neutral magnesium atom has 12 electrons. It loses two electrons to form Mg²⁺. How many electrons remain?', options: ['10', '12', '14', '2'], answer: 0, explanation: 'Elektroni loovutamisel elektronide arv väheneb: 12 − 2 = 10. Prootonite arv ei muutu, seega tekib laeng +2.', skill: 'cation_electrons'},
          {prompt: 'Chlorine has atomic number 17. A neutral chlorine-35 atom gains one electron. How many neutrons and electrons does the resulting ion contain?', options: ['17 neutrons and 18 electrons', '18 neutrons and 16 electrons', '19 neutrons and 17 electrons', '18 neutrons and 18 electrons'], answer: 3, explanation: 'Neutroneid on 35 − 17 = 18. Elektroni liitmisel on neid 17 + 1 = 18 ning tekib Cl⁻. Neutronite arv iooni tekkimisel ei muutu.', skill: 'anion_and_neutrons'},
          {prompt: 'Calcium ions can carry charge across a cell membrane. Calcium has atomic number 20. Which statement about one Ca²⁺ ion is correct?', options: ['It has 22 protons and 20 electrons.', 'It has 20 protons and 18 electrons.', 'It has 18 protons and 20 electrons.', 'It has 20 protons and 22 electrons.'], answer: 1, explanation: 'Kaltsiumi määrab 20 prootonit. Laengu +2 korral on elektrone kaks vähem: 18. Iooni laeng üksi ei ütle, mis suunas see läbi membraani liigub.', skill: 'biological_ion_charge'},
          {prompt: 'A researcher uses carbon-14 as a label in a molecule. Carbon has atomic number 6. Before any radioactive decay occurs, what does each neutral carbon-14 atom contain?', options: ['8 protons, 6 neutrons and 8 electrons', '6 protons, 14 neutrons and 6 electrons', '6 protons, 8 neutrons and 6 electrons', '14 protons, 6 neutrons and 14 electrons'], answer: 2, explanation: 'Isotoop on endiselt süsinik: 6 prootonit. Massiarv 14 annab 14 − 6 = 8 neutronit. Neutraalsel aatomil on 6 elektroni. Molekulis kasutamine ei muuda isotoobi tuuma koostist.', skill: 'isotope_label_transfer'},
          {"prompt":"Helium has atomic number 2. A helium-4 ion has charge +1. How many protons, neutrons and electrons does it contain?","options":["2 protons, 2 neutrons, 3 electrons","1 proton, 3 neutrons, 2 electrons","2 protons, 2 neutrons, 1 electron","2 protons, 4 neutrons, 1 electron"],"answer":2,"explanation":"Z = 2 annab 2 prootonit; A − Z = 4 − 2 = 2 neutronit. Laeng +1 tähendab 2 − 1 = 1 elektroni.","skill":"particle_counts_charge"},
          {"prompt":"Aluminium has atomic number 13. An aluminium-27 ion has charge +3. Which particle counts are correct?","options":["13 protons, 14 neutrons, 10 electrons","13 protons, 14 neutrons, 16 electrons","10 protons, 17 neutrons, 13 electrons","13 protons, 27 neutrons, 10 electrons"],"answer":0,"explanation":"Prootoneid on 13, neutroneid 27 − 13 = 14 ja elektrone 13 − 3 = 10. Iooni moodustumisel muutub elektronide, mitte prootonite arv.","skill":"particle_counts_charge"},
          {"prompt":"Neutral neon-20 and neon-22 are atoms of the same element. Which particle count differs between them?","options":["The number of protons only","The number of neutrons only","The number of electrons only","The numbers of protons and electrons"],"answer":1,"explanation":"Sama elemendi isotoopidel on sama prootonite arv ja neutraalsena sama elektronide arv. Erinev massiarv tuleb erinevast neutronite arvust.","skill":"isotope_identity"},
          {"prompt":"Neutral atom A contains 5 protons and 5 neutrons. Neutral atom B contains 5 protons and 6 neutrons. How are they related?","options":["They are different elements because their neutron counts differ.","They are oppositely charged ions.","They are the same isotope because their proton counts match.","They are isotopes of the same element with different neutron counts."],"answer":3,"explanation":"Mõlema 5 prootonit määravad boori. Neutronite arvud 5 ja 6 annavad eri isotoobid boor-10 ja boor-11. Mõlemad on neutraalsed.","skill":"isotope_identity"},
          {"prompt":"A K⁺ ion in a nerve cell has 19 protons. How many electrons does it have?","options":["20","19","18","1"],"answer":2,"explanation":"Laeng +1 tähendab ühte elektroni vähem kui prootoneid: 19 − 1 = 18. Rakus paiknemine seda seost ei muuda.","skill":"biological_ion_charge"},
          {"prompt":"A chloride ion near a cell membrane contains 17 protons and 18 electrons. What is its charge?","options":["+1","−1","0","−18"],"answer":1,"explanation":"Laeng = prootonid − elektronid = 17 − 18 = −1. See on Cl⁻; sellest üksi ei saa järeldada liikumissuunda läbi membraani.","skill":"biological_ion_charge"},
          {"prompt":"Nitrogen-15 is used as an isotope label. Nitrogen has atomic number 7. Consider one neutral nitrogen-15 atom. Which particle counts are correct?","options":["7 protons, 8 neutrons, 7 electrons","8 protons, 7 neutrons, 8 electrons","7 protons, 15 neutrons, 7 electrons","15 protons, 7 neutrons, 15 electrons"],"answer":0,"explanation":"Märgistamine ei muuda tuuma: Z = 7 annab 7 prootonit, 15 − 7 = 8 neutronit ja neutraalsus 7 elektroni.","skill":"isotope_label_transfer"},
          {"prompt":"An experiment uses oxygen-18 as a tracer. Oxygen has atomic number 8. Before any nuclear change, what does one neutral oxygen-18 atom contain?","options":["10 protons, 8 neutrons, 10 electrons","8 protons, 18 neutrons, 8 electrons","8 protons, 10 neutrons, 10 electrons","8 protons, 10 neutrons, 8 electrons"],"answer":3,"explanation":"Hapniku aatomnumber on 8. Massiarv 18 tähendab 18 − 8 = 10 neutronit; neutraalsel aatomil on 8 elektroni. Trasserina kasutamine ei muuda osakeste arvu.","skill":"isotope_label_transfer"},
          {"prompt":"A neutral calcium atom has 20 electrons. It loses two electrons to form Ca²⁺. How many electrons remain?","options":["22","2","20","18"],"answer":3,"explanation":"Elektronide loovutamisel arv väheneb: 20 − 2 = 18. Positiivne laeng ei tähenda elektronide lisandumist.","skill":"cation_electrons"},
          {"prompt":"A neutral aluminium atom has 13 electrons. It forms Al³⁺ by losing electrons. How many electrons does the ion have?","options":["16","10","13","3"],"answer":1,"explanation":"Laeng +3 tekib kolme elektroni loovutamisel. Alles on 13 − 3 = 10 elektroni.","skill":"cation_electrons"},
          {"prompt":"Fluorine has atomic number 9. A neutral fluorine-19 atom gains one electron. How many neutrons and electrons does the ion have?","options":["10 neutrons and 10 electrons","10 neutrons and 8 electrons","9 neutrons and 10 electrons","19 neutrons and 9 electrons"],"answer":0,"explanation":"Neutronite arv on 19 − 9 = 10. Elektroni liitmisel on elektrone 9 + 1 = 10. Liitunud elektron ei muuda tuuma.","skill":"anion_and_neutrons"},
          {"prompt":"Sulfur has atomic number 16. A neutral sulfur-34 atom gains two electrons to form S²⁻. How many neutrons and electrons does it contain?","options":["18 neutrons and 14 electrons","16 neutrons and 18 electrons","18 neutrons and 18 electrons","34 neutrons and 16 electrons"],"answer":2,"explanation":"Neutroneid on 34 − 16 = 18. Kaks liitunud elektroni annavad 16 + 2 = 18 elektroni; neutronite arv sellest ei muutu.","skill":"anion_and_neutrons"}
        ]
      },
      {
        id: 'bonding_polarity',
        title: 'Keemiline side ja polaarsus',
        english: 'Bonding, molecular polarity and hydrogen bonds',
        why: 'Vee omaduste ja biomolekulide koostoimete mõistmiseks tuleb eristada molekulisiseseid sidemeid molekulidevahelistest jõududest.',
        explanation: [
          'Kovalentses sidemes (covalent bond) jagavad aatomid elektronipaari. Kui üks aatom tõmbab sideme elektrone tugevamalt enda poole, on side polaarne: tekivad osalaengud δ⁺ ja δ⁻. Need osalaengud ei ole sama mis eraldi ioonide täisarvulised laengud.',
          'Iooniline side (ionic bond) põhineb vastasmärgiliste ioonide elektrostaatilisel tõmbumisel. Tahke NaCl koosneb ioonvõrest, mitte eraldiseisvatest NaCl-molekulidest. Aine lahustumise võimalust ei saa otsustada ainult sõna „iooniline” järgi.',
          'Molekuli polaarsus sõltub nii sidemete polaarsusest kui ka kujust. Vee molekul on nurgeline ja polaarne. Lineaarses sümmeetrilises CO₂ molekulis tühistavad kahe C=O sideme vastassuunalised dipoolid teineteise; molekul on tervikuna mittepolaarne.',
          'Vesiniksidemed (hydrogen bonds) võivad tekkida eri veemolekulide vahel. Ühe veemolekuli O–H sidemed on aga polaarsed kovalentsed sidemed. Sarnased vesiniksidemed aitavad hoida biomolekulide struktuuri, kuid näiteks DNA ahela tugev kovalentne karkass ei koosne vesiniksidemetest.'
        ],
        worked: {
          prompt: 'Miks ei piisa molekuli polaarsuse otsustamiseks teadmisest, et sellel on polaarsed sidemed?',
          steps: ['Igal polaarsel sidemel on laengueralduse suund.', 'Vaata molekuli kuju: kas sidemete mõjud tühistuvad?', 'Lineaarses CO₂ molekulis tühistuvad; nurgelises H₂O molekulis mitte.'],
          answer: 'Vaja on nii sidemete polaarsust kui ka nende ruumilist paigutust.'
        },
        followupVersion: 1,
        followups: {
          "0": {
            "skill": "within_between_molecules",
            "title": "Side ühe molekuli sees",
            "explanation": [
              "Erista sidet ühe molekuli aatomite vahel ja tõmbejõudu eri molekulide vahel. Ühise elektronipaari ebavõrdne jagamine ühe molekuli sees annab polaarse kovalentse sideme."
            ],
            "worked": {
              "prompt": "Mis tüüpi on N–H side ühe ammoniaagimolekuli sees?",
              "steps": [
                "N ja H kuuluvad samasse NH₃ molekuli ning jagavad elektronipaari.",
                "Lämmastik tõmbab paari tugevamalt: jagamine on ebavõrdne."
              ],
              "answer": "See on polaarne kovalentne side; molekulidevaheline vesinikside on teine koostoime."
            },
            "simpleIndex": 6,
            "applicationIndex": 7
          },
          "1": {
            "skill": "ionic_lattice",
            "title": "Vastasmärgiliste ioonide tõmme kristallis",
            "explanation": [
              "Ioonkristalli hoiab koos positiivsete ja negatiivsete ioonide elektrostaatiline tõmme. Kristall on korduv ioonvõre, mitte eraldi molekulide kogum."
            ],
            "worked": {
              "prompt": "Mis hoiab Ca²⁺ ja Cl⁻ ioone koos kaltsiumkloriidi kristallis?",
              "steps": [
                "Ioonide laengud on vastasmärgilised.",
                "Vastasmärgilised laengud tõmbuvad ja ioonid moodustavad võre."
              ],
              "answer": "Võret hoiab koos ioonide elektrostaatiline tõmme."
            },
            "simpleIndex": 8,
            "applicationIndex": 9
          },
          "2": {
            "skill": "polar_covalent_sharing",
            "title": "Ühise elektronipaari ebavõrdne jagamine",
            "explanation": [
              "Polaarses kovalentses sidemes jääb elektronipaar ühiseks, kuid seda tõmbab tugevamalt elektronegatiivsem aatom. Selle aatomi juures tekib osaline negatiivne laeng."
            ],
            "worked": {
              "prompt": "Kloor tõmbab H–Cl sideme elektrone tugevamalt kui vesinik. Kuidas jaotuvad osalaengud?",
              "steps": [
                "Ühine elektronipaar on rohkem kloori poole nihkunud.",
                "Kloori pool on δ⁻ ja vesiniku pool δ⁺."
              ],
              "answer": "Elektronipaari jagatakse ebavõrdselt: Hδ⁺–Clδ⁻."
            },
            "simpleIndex": 14,
            "applicationIndex": 15
          },
          "3": {
            "skill": "shape_and_polarity",
            "title": "Nurgeline kuju ja molekuli polaarsus",
            "explanation": [
              "Molekuli polaarsus sõltub sidemete dipoolide ruumilisest summast. Nurgelises molekulis ei ole kaks ühesugust sidemedipooli vastassuunalised ning need ei tühistu."
            ],
            "worked": {
              "prompt": "NH₃ on püramiidikujuline ja selle N–H sidemed on polaarsed. Kas sidemete dipoolid tühistuvad?",
              "steps": [
                "Kolm sidet paiknevad püramiidina, mitte tasapinnaliselt sümmeetriliselt ümber N aatomi.",
                "Sidemete dipoolide summa ei ole null."
              ],
              "answer": "NH₃ molekul on polaarne, sest kuju tõttu dipoolid ei tühistu."
            },
            "simpleIndex": 16,
            "applicationIndex": 17
          },
          "4": {
            "skill": "dipole_cancellation_transfer",
            "title": "Sidemete dipoolide tühistumine",
            "explanation": [
              "Vaata sidemete dipoolide tugevust ja suunda koos molekuli kujuga. Võrdsed vastassuunalised dipoolid tühistuvad; sellisel molekulil puudub püsiv summaarne dipool."
            ],
            "worked": {
              "prompt": "Kaks sidemedipooli on sama tugevusega: üks suundub vasakule ja teine paremale. Milline on nende summa?",
              "steps": [
                "Dipoolide suurused on võrdsed, kuid suunad vastupidised.",
                "Vektorsumma on null: kumbki ei jää ülekaalu."
              ],
              "answer": "Dipoolid tühistuvad ja molekul on tervikuna mittepolaarne."
            },
            "simpleIndex": 10,
            "applicationIndex": 11
          },
          "5": {
            "skill": "intermolecular_transfer",
            "title": "Tervete molekulide eraldamine",
            "explanation": [
              "Kui molekulid eralduvad üksteisest keemilist koostist muutmata, ületatakse nendevahelisi tõmbejõude. Kovalentsed sidemed molekulide sees jäävad alles."
            ],
            "worked": {
              "prompt": "Kaks etanoolimolekuli eraldatakse teineteisest, kuid mõlemad jäävad etanooliks. Kas nende sees olevad O–H sidemed katkevad?",
              "steps": [
                "Mõlema molekuli koostis ja aatomitevahelised sidemed säilivad.",
                "Ületatakse molekulidevaheline koostoime, mille hulka võib kuuluda vesinikside."
              ],
              "answer": "O–H kovalentsed sidemed jäävad alles; eraldamine puudutab molekulidevahelisi jõude."
            },
            "simpleIndex": 12,
            "applicationIndex": 13
          }
        },
        sources: [
          {title: 'Opiq: Kovalentse sideme polaarsus (võib vajada tellimust)', url: 'https://www.opiq.ee/kit/575/chapter/31967', note: 'Kui soovid lisaselgitust, loe üks lõik ja proovi siis ilma tekstita öelda, miks polaarne side ei tee iga molekuli polaarseks.'},
          {title: 'OpenStax Chemistry 2e: Covalent Bonding', url: 'https://openstax.org/books/chemistry-2e/pages/7-2-covalent-bonding'},
          {title: 'OpenStax Chemistry 2e: Molecular Structure and Polarity', url: 'https://openstax.org/books/chemistry-2e/pages/7-6-molecular-structure-and-polarity'},
          {title: 'OpenStax Chemistry 2e: Intermolecular Forces', url: 'https://openstax.org/books/chemistry-2e/pages/10-1-intermolecular-forces'}
        ],
        questions: [
          {prompt: 'What type of bond joins oxygen to hydrogen within a water molecule?', options: ['An ionic bond between separate O²⁻ and H⁺ ions', 'A polar covalent bond', 'A hydrogen bond between two molecules', 'A metallic bond'], answer: 1, explanation: 'Ühe H₂O molekuli sees jagavad O ja H elektronipaari ebavõrdselt: side on polaarne kovalentne. Veemolekulidevaheline vesiniksideme mõiste kirjeldab teist koostoimet.', skill: 'within_between_molecules'},
          {prompt: 'Which interaction holds the ions together in a solid sodium chloride lattice?', options: ['Hydrogen bonds between NaCl molecules', 'Shared electron pairs between all neighbouring ions', 'Attraction between the nuclei of neutral atoms', 'Electrostatic attraction between oppositely charged ions'], answer: 3, explanation: 'NaCl kristallis tõmbuvad Na⁺ ja Cl⁻ elektrostaatiliselt. Tegemist on ioonvõrega; tavakirjelduses ei koosne kristall eraldiseisvatest NaCl-molekulidest.', skill: 'ionic_lattice'},
          {prompt: 'In a polar covalent bond, what happens to the shared electrons?', options: ['They are attracted more strongly towards one bonded atom.', 'They become protons.', 'They must be shared exactly equally.', 'They disappear when the bond forms.'], answer: 0, explanation: 'Erineva elektronegatiivsusega aatomid tõmbavad ühist elektronipaari erineva tugevusega. Tulemuseks on osalaengud, mitte elektronide kadumine.', skill: 'polar_covalent_sharing'},
          {prompt: 'Water has polar O–H bonds and a bent molecular shape. Why is the whole molecule polar?', options: ['Its two hydrogen atoms have become free H⁺ ions.', 'Every molecule containing oxygen is polar.', 'The bond dipoles do not cancel in the bent shape.', 'Its oxygen atom has no electrons.'], answer: 2, explanation: 'Nurgelises molekulis ei tühista O–H sidemete dipoolid teineteist. Hapniku olemasolu üksinda ei tõesta molekuli polaarsust: oluline on ka kuju.', skill: 'shape_and_polarity'},
          {prompt: 'Carbon dioxide is linear: O=C=O. Both C=O bonds are polar and equal in magnitude. What follows about the molecule?', options: ['It must have a net charge of −2.', 'Its equal, opposite bond dipoles cancel, so it is nonpolar overall.', 'It is polar because any polar bond makes a molecule polar.', 'It has no covalent bonds.'], answer: 1, explanation: 'Sirge sümmeetrilise CO₂ molekuli võrdsed vastassuunalised dipoolid tühistuvad. Polaarsete sidemete olemasolu ei tähenda automaatselt polaarset molekuli.', skill: 'dipole_cancellation_transfer'},
          {prompt: 'Two neighbouring water molecules are separated without changing either molecule’s chemical formula. Which interaction between them is being overcome?', options: ['The covalent O–H bonds inside both molecules', 'The forces holding protons inside each oxygen nucleus', 'An intermolecular hydrogen bond', 'A metallic bond between oxygen atoms'], answer: 2, explanation: 'Üksteisest eraldatakse kaks tervet H₂O molekuli: nendevaheline vesiniksideme koostoime katkeb. Molekulide O–H kovalentsed sidemed säilivad; vesi ei lagune selle tõttu vesinikuks ja hapnikuks.', skill: 'intermolecular_transfer'},
          {"prompt":"Within one HF molecule, hydrogen and fluorine share an electron pair unequally. What type of bond joins them?","options":["A hydrogen bond between separate molecules","An ionic bond between separate ions","A metallic bond","A polar covalent bond within the molecule"],"answer":3,"explanation":"Ühine elektronipaar on ühe molekuli sees ning seda jagatakse ebavõrdselt. See määrab polaarse kovalentse sideme, mitte molekulidevahelise vesiniksideme.","skill":"within_between_molecules"},
          {"prompt":"Consider the O–H bond inside a single ethanol molecule. Oxygen attracts its shared electrons more strongly than hydrogen. Which description is correct?","options":["It is an intermolecular hydrogen bond.","It is a polar covalent bond inside the molecule.","It is an ionic lattice of separate O²⁻ and H⁺ ions.","It is a metallic bond between oxygen atoms."],"answer":1,"explanation":"Küsimus puudutab ühe etanoolimolekuli sees olevat sidet. O ja H jagavad elektronipaari ebavõrdselt, seega on side polaarne kovalentne.","skill":"within_between_molecules"},
          {"prompt":"In an ionic crystal, what interaction attracts a positive ion to a neighbouring negative ion?","options":["Electrostatic attraction between opposite charges","Attraction because both ions have the same charge","Hydrogen bonding between neutral molecules","Sharing every electron equally through the crystal"],"answer":0,"explanation":"Vastasmärgilised laengud tõmbuvad elektrostaatiliselt. See tõmme seob ioone võres.","skill":"ionic_lattice"},
          {"prompt":"Solid magnesium oxide contains Mg²⁺ and O²⁻ ions in a repeating lattice. What holds this lattice together?","options":["Hydrogen bonds between separate MgO molecules","Shared electron pairs in individual MgO molecules","Electrostatic attraction between oppositely charged ions","Attraction between neutral magnesium and oxygen atoms only"],"answer":2,"explanation":"Mg²⁺ ja O²⁻ on vastasmärgilised ioonid. Nende elektrostaatiline tõmme hoiab koos ioonvõret; tahket MgO ei kirjeldata eraldi molekulidena.","skill":"ionic_lattice"},
          {"prompt":"A linear X–Y–X molecule has two equal polar bonds pointing in opposite directions. What happens to the two bond dipoles?","options":["They add to give a larger dipole.","They cancel, so the molecule is nonpolar overall.","They create a charge of +2.","They remove the covalent bonds."],"answer":1,"explanation":"Sirges sümmeetrilises molekulis on kaks võrdset vastassuunalist dipooli. Nende summa on null, kuigi kumbki side on polaarne.","skill":"dipole_cancellation_transfer"},
          {"prompt":"An isolated gaseous BeCl₂ molecule is linear: Cl–Be–Cl. Its two Be–Cl bonds are equally polar. Which statement describes its overall polarity?","options":["It is polar because every polar bond makes a polar molecule.","It has a total charge of −2 because it contains two chlorine atoms.","It has no polar bonds because its shape is linear.","It is nonpolar because the equal opposite bond dipoles cancel."],"answer":3,"explanation":"Etteantud sirge sümmeetriline kuju paigutab võrdsed Be–Cl sidemedipoolid vastassuundadesse. Need tühistuvad; polaarne side ja molekuli summaarne polaarsus on eri asjad.","skill":"dipole_cancellation_transfer"},
          {"prompt":"Two ammonia molecules connected by a hydrogen bond are pulled apart while each remains NH₃. Which interaction is overcome?","options":["A covalent N–H bond inside each molecule","A force holding protons in the nitrogen nucleus","The hydrogen bond between the two molecules","A metallic bond inside ammonia"],"answer":2,"explanation":"Mõlemad NH₃ molekulid jäävad terveks. Seega ületatakse nendevaheline vesiniksideme koostoime, mitte N–H kovalentsed sidemed.","skill":"intermolecular_transfer"},
          {"prompt":"Liquid water evaporates into water vapour without a chemical reaction. Which interactions are overcome as H₂O molecules move apart?","options":["Intermolecular attractions, including hydrogen bonds","The covalent O–H bonds inside every molecule","The forces holding the oxygen nuclei together","Metallic bonds between water molecules"],"answer":0,"explanation":"Aurustumisel jääb osakeseks H₂O molekul. Molekulide lahutamiseks ületatakse molekulidevahelisi tõmbejõude, sealhulgas vesiniksidemeid; vee O–H sidemed säilivad.","skill":"intermolecular_transfer"},
          {"prompt":"Atoms A and B share an electron pair in a bond. A attracts that pair more strongly than B. Where is the shared pair more strongly attracted?","options":["Exactly equally towards A and B","Away from both atoms until it disappears","Towards atom A","Towards atom B"],"answer":2,"explanation":"Kui A tõmbab ühist elektronipaari tugevamalt, nihkub elektronide jaotus A poole. Paar jääb kovalentses sidemes ühiseks.","skill":"polar_covalent_sharing"},
          {"prompt":"Oxygen attracts the shared electrons in a C–O bond more strongly than carbon. Which description is correct?","options":["The shared electrons are drawn towards oxygen, giving it a partial negative charge.","The shared electrons are drawn towards carbon, giving it a partial negative charge.","The shared electrons become protons.","The shared electrons must be equally distributed because the bond is covalent."],"answer":0,"explanation":"Elektronegatiivsem hapnik tõmbab ühist elektronipaari enda poole. Hapniku osalaeng on δ⁻ ja süsiniku oma δ⁺; osalaeng ei ole vaba iooni täisarvuline laeng.","skill":"polar_covalent_sharing"},
          {"prompt":"A bent X–Y–X molecule has two equal polar bonds. Both bond dipoles point from Y towards X. Why is the molecule polar?","options":["Both X atoms must be free negative ions.","Every bent shape has a net electric charge.","The covalent bonds have disappeared.","The bond dipoles do not cancel in the bent shape."],"answer":3,"explanation":"Nurgeline paigutus tähendab, et dipoolid ei ole vastassuunalised. Nende summa pole null ja molekul on polaarne, kuigi kogu molekuli laeng võib olla null.","skill":"shape_and_polarity"},
          {"prompt":"An SO₂ molecule is bent and has two equally polar S–O bonds directed towards oxygen. What explains its overall polarity?","options":["Any molecule containing sulfur is polar.","Its bent shape prevents the bond dipoles from cancelling.","Each oxygen atom has become a separate O²⁻ ion.","Its bond dipoles cancel because the bonds have equal polarity."],"answer":1,"explanation":"Võrdsest sidemepolaarsusest üksi ei piisa dipoolide tühistumiseks. SO₂ nurgeline kuju annab dipoolidele mittenullise summa ja molekul on polaarne.","skill":"shape_and_polarity"}
        ]
      },
      {
        id: 'moles_stoichiometry',
        title: 'Mool, molaarmass ja reaktsiooni suhted',
        english: 'Moles, molar mass and stoichiometric ratios',
        why: 'Rakuhingamise võrrand seob glükoosi, hapniku ja süsihappegaasi ainehulgad. Koefitsiendid kirjeldavad osakeste ja moolide suhteid, mitte grammide suhteid.',
        explanation: [
          'Ainehulk n (amount of substance) loendab osakesi moolides: 1 mol sisaldab täpselt 6,02214076 × 10²³ nimetatud osakest. Täpsusta, kas loendad aatomeid, molekule või ioone.',
          'Molaarmass M (molar mass) seob massi m ja ainehulga: n = m / M. Kui m on grammides ja M ühikuga g/mol, saad n ühikuks mol. Suurema molaarmassiga aine sama mass sisaldab vähem moole.',
          'Tasakaalustatud reaktsioonivõrrandi koefitsiendid annavad moolsuhte (mole ratio). Võrrandis 2H₂ + O₂ → 2H₂O annab 1 mol reageerinud O₂ kokku 2 mol H₂O, kui vesinikku jätkub. Koefitsiendid ei ütle, et 1 g hapnikust tekiks 2 g vett.',
          'Glükoosi täieliku oksüdeerumise koondvõrrand on C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O. See sobib ainete koguste arvestuseks. Rakus toimub protsess paljude etappidena; võrrand ei ütle, kui kiiresti reaktsioon toimub ega mitu ATP molekuli tekib.'
        ],
        worked: {
          prompt: 'Glükoosi molaarmass on 180 g/mol. Mitu mooli CO₂ tekib 18 g glükoosi täielikul oksüdeerumisel, kui hapnikku on piisavalt?',
          steps: ['Leia glükoosi ainehulk: n = 18 g / (180 g/mol) = 0,10 mol.', 'Koondvõrrandis on glükoosi ja CO₂ moolsuhe 1 : 6.', 'CO₂ ainehulk on 0,10 × 6 = 0,60 mol.'],
          answer: 'Tekib 0,60 mol CO₂. See on ainehulga, mitte reaktsioonikiiruse ennustus.'
        },
        followupVersion: 1,
        followups: {
          "0": {
            "skill": "mass_to_moles",
            "title": "Massist ainehulga leidmine",
            "explanation": [
              "Jaga aine mass molaarmassiga: n = m / M. Grammid taanduvad, kui M ühik on g/mol, ning vastuse ühik on mol."
            ],
            "worked": {
              "prompt": "CO₂ molaarmass on 44 g/mol. Mitu mooli on 22 g CO₂?",
              "steps": [
                "Kirjuta n = m / M.",
                "n = 22 g / (44 g/mol) = 0,50 mol."
              ],
              "answer": "22 g CO₂ sisaldab 0,50 mol molekule."
            },
            "simpleIndex": 2,
            "applicationIndex": 6
          },
          "1": {
            "skill": "coefficient_ratio",
            "title": "Reaktsioonivõrrandi moolsuhe",
            "explanation": [
              "Tasakaalustatud võrrandi koefitsiendid annavad moolide suhte. Korruta antud ainehulk otsitava aine koefitsiendiga ja jaga antud aine koefitsiendiga; teist lähteainet peab jätkuma."
            ],
            "worked": {
              "prompt": "Võrrand on 2Na + Cl₂ → 2NaCl. Mitu mooli NaCl tekib 0,50 mol Cl₂ reageerimisel, kui Na on liias?",
              "steps": [
                "Cl₂ : NaCl moolsuhe on 1 : 2.",
                "n(NaCl) = 0,50 × 2 / 1 = 1,0 mol."
              ],
              "answer": "Tekib 1,0 mol NaCl; koefitsiendid kirjeldavad moole, mitte gramme."
            },
            "simpleIndex": 7,
            "applicationIndex": 8
          },
          "3": {
            "skill": "respiration_ratio",
            "title": "Glükoosi oksüdeerumise moolsuhe",
            "explanation": [
              "Koondvõrrandis C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O vastab ühele moolile glükoosile kuus mooli CO₂ ja kuus mooli H₂O. Kasuta seda suhet täieliku oksüdeerumise ja piisava hapniku korral."
            ],
            "worked": {
              "prompt": "Mitu mooli CO₂ tekib 0,050 mol glükoosi täielikul oksüdeerumisel piisava hapnikuga?",
              "steps": [
                "Glükoosi ja CO₂ koefitsientide suhe on 1 : 6.",
                "n(CO₂) = 0,050 × 6 = 0,30 mol."
              ],
              "answer": "Tekib 0,30 mol CO₂; koondvõrrand ei määra ATP täpset saagist."
            },
            "simpleIndex": 13,
            "applicationIndex": 14
          },
          "4": {
            "skill": "formula_atom_count",
            "title": "Aatomite ainehulk molekulivalemist",
            "explanation": [
              "Valemi alaindeks näitab selle elemendi aatomite arvu ühes molekulis. Elemendi aatomite moolide leidmiseks korruta molekulide ainehulk selle alaindeksiga."
            ],
            "worked": {
              "prompt": "Proovis on 0,20 mol H₂O₂ molekule. Mitu mooli hapniku aatomeid need sisaldavad?",
              "steps": [
                "Ühes H₂O₂ molekulis on 2 hapniku aatomit.",
                "Hapniku aatomeid on 0,20 × 2 = 0,40 mol."
              ],
              "answer": "0,40 mol hapniku aatomeid; see ei tähenda vabu O₂ molekule."
            },
            "simpleIndex": 9,
            "applicationIndex": 10
          },
          "5": {
            "skill": "mass_ratio_transfer",
            "title": "Massiarvutus reaktsiooni moolsuhtega",
            "explanation": [
              "Masside seostamiseks mine esmalt grammidest moolidesse, rakenda võrrandi koefitsientide suhet ja teisenda otsitavad moolid grammideks. Koefitsientide suhet ei saa otse massidele üle kanda."
            ],
            "worked": {
              "prompt": "N₂ + 3H₂ → 2NH₃. Kui palju H₂ on vaja 28 g N₂ täielikuks reageerimiseks? M(N₂) = 28 g/mol ja M(H₂) = 2 g/mol.",
              "steps": [
                "n(N₂) = 28 / 28 = 1 mol.",
                "Suhe N₂ : H₂ on 1 : 3, seega on vaja 3 mol H₂.",
                "m(H₂) = 3 × 2 = 6 g."
              ],
              "answer": "Vaja on 6 g H₂."
            },
            "simpleIndex": 11,
            "applicationIndex": 12
          }
        },
        sources: [
          {title: 'Opiq: moolarvutused, Keemia 9. klassile (sisukord; peatükid võivad vajada tellimust)', url: 'https://www.opiq.ee/Kit/Details/573', note: 'Soovi korral vali sisukorrast 4.2 või 4.4. Vaata üht näidet, seejärel proovi järgmise ülesande moolsuhe ja ühikud ise kirja panna.'},
          {title: 'TÜ Huvitav keemia: Mool, mass ja molaarmass', url: 'https://sisu.ut.ee/huvitavkeemia/22-mool-mass-ja-molaarmass/'},
          {title: 'OpenStax Chemistry 2e: Formula Mass and the Mole Concept', url: 'https://openstax.org/books/chemistry-2e/pages/3-1-formula-mass-and-the-mole-concept'},
          {title: 'OpenStax Chemistry 2e: Reaction Stoichiometry', url: 'https://openstax.org/books/chemistry-2e/pages/4-3-reaction-stoichiometry'}
        ],
        questions: [
          {prompt: 'Glucose has a molar mass of 180 g/mol. How many moles of glucose are present in 9.0 g?', options: ['20 mol', '0.50 mol', '0.050 mol', '1620 mol'], answer: 2, explanation: 'n = m / M = 9,0 g / (180 g/mol) = 0,050 mol. Massi ja molaarmassi korrutamine ei anna ainehulka.', skill: 'mass_to_moles'},
          {prompt: 'For 2H₂ + O₂ → 2H₂O, 0.30 mol of O₂ reacts completely with excess H₂. How many moles of water form?', options: ['0.15 mol', '0.30 mol', '0.90 mol', '0.60 mol'], answer: 3, explanation: 'Võrrandi järgi annab 1 mol O₂ kokku 2 mol H₂O. Seega 0,30 × 2 = 0,60 mol. Vesinik on liias ehk seda jätkub kogu hapniku reageerimiseks.', skill: 'coefficient_ratio'},
          {prompt: 'Water has a molar mass of 18 g/mol. How many moles of water are in 36 g?', options: ['2 mol', '0.5 mol', '18 mol', '648 mol'], answer: 0, explanation: 'Kasuta n = m / M: 36 g / (18 g/mol) = 2 mol. Ühikud g taanduvad ja alles jääb mol.', skill: 'mass_to_moles'},
          {prompt: 'Use C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O. If 0.020 mol of glucose is completely oxidised with sufficient oxygen, how many moles of CO₂ form?', options: ['0.020 mol', '0.120 mol', '0.0033 mol', '6.020 mol'], answer: 1, explanation: 'Glükoosi ja CO₂ moolsuhe on 1 : 6. Arvuta 0,020 × 6 = 0,120 mol. See koondvõrrand kirjeldab ainekoguseid, mitte ATP täpset saagist.', skill: 'respiration_ratio'},
          {prompt: 'A sample contains 0.40 mol of CO₂ molecules. How many moles of oxygen atoms are present in those molecules?', options: ['0.20 mol', '0.40 mol', '0.80 mol', '1.20 mol'], answer: 2, explanation: 'Igas CO₂ molekulis on kaks hapniku aatomit. Seega 0,40 mol molekulides on 2 × 0,40 = 0,80 mol hapniku aatomeid. Küsimus ei küsi vabu O₂ molekule.', skill: 'formula_atom_count'},
          {prompt: 'For 2Mg + O₂ → 2MgO, how many grams of O₂ are required to react completely with 4.8 g of Mg? Use M(Mg) = 24 g/mol and M(O₂) = 32 g/mol.', options: ['3.2 g', '6.4 g', '2.4 g', '9.6 g'], answer: 0, explanation: 'Mg ainehulk on 4,8 / 24 = 0,20 mol. Suhe Mg : O₂ on 2 : 1, seega O₂ on vaja 0,10 mol. Mass on 0,10 × 32 = 3,2 g. Moolsuhet ei tohi otse grammidele rakendada.', skill: 'mass_ratio_transfer'},
          {"prompt":"Urea has a molar mass of 60 g/mol. How many moles are present in a 12 g sample of urea?","options":["0.20 mol","5.0 mol","720 mol","0.020 mol"],"answer":0,"explanation":"Ainehulk n = m / M = 12 / 60 = 0,20 mol. Ühik g jagatud ühikuga g/mol annab mol.","skill":"mass_to_moles"},
          {"prompt":"For 2CO + O₂ → 2CO₂, 1.0 mol of O₂ reacts completely with excess CO. How many moles of CO₂ form?","options":["1.0 mol","0.50 mol","2.0 mol","3.0 mol"],"answer":2,"explanation":"O₂ : CO₂ moolsuhe on 1 : 2. Seega 1,0 mol O₂ annab 2,0 mol CO₂, sest CO on liias.","skill":"coefficient_ratio"},
          {"prompt":"For N₂ + 3H₂ → 2NH₃, 0.60 mol of H₂ reacts completely with excess N₂. How many moles of NH₃ form?","options":["0.90 mol","1.20 mol","0.20 mol","0.40 mol"],"answer":3,"explanation":"H₂ : NH₃ moolsuhe on 3 : 2. n(NH₃) = 0,60 × 2 / 3 = 0,40 mol; lämmastikku jätkub.","skill":"coefficient_ratio"},
          {"prompt":"A sample contains 0.50 mol of CH₄ molecules. How many moles of hydrogen atoms are inside these molecules?","options":["0.125 mol","2.0 mol","0.50 mol","1.0 mol"],"answer":1,"explanation":"Ühes CH₄ molekulis on 4 vesiniku aatomit. Nende ainehulk on 0,50 × 4 = 2,0 mol, mitte vabade H₂ molekulide ainehulk.","skill":"formula_atom_count"},
          {"prompt":"A sample contains 0.30 mol of NH₃ molecules. How many moles of hydrogen atoms does it contain?","options":["0.90 mol","0.30 mol","0.10 mol","0.60 mol"],"answer":0,"explanation":"Igas NH₃ molekulis on 3 vesiniku aatomit. Seega 0,30 mol molekulides on 0,30 × 3 = 0,90 mol vesiniku aatomeid.","skill":"formula_atom_count"},
          {"prompt":"For 2H₂ + O₂ → 2H₂O, how many grams of O₂ are needed to react completely with 4.0 g of H₂? Use M(H₂) = 2.0 g/mol and M(O₂) = 32 g/mol.","options":["2.0 g","64 g","32 g","128 g"],"answer":2,"explanation":"n(H₂) = 4,0 / 2,0 = 2,0 mol. Suhe H₂ : O₂ on 2 : 1, seega vaja on 1,0 mol O₂ ehk 1,0 × 32 = 32 g. Massisuhe ei ole 2 : 1.","skill":"mass_ratio_transfer"},
          {"prompt":"For 2Al + 3Cl₂ → 2AlCl₃, how many grams of Cl₂ are needed to react completely with 5.4 g of Al? Use M(Al) = 27 g/mol and M(Cl₂) = 71 g/mol.","options":["8.1 g","14.2 g","42.6 g","21.3 g"],"answer":3,"explanation":"n(Al) = 5,4 / 27 = 0,20 mol. n(Cl₂) = 0,20 × 3 / 2 = 0,30 mol. m(Cl₂) = 0,30 × 71 = 21,3 g. Koefitsientide suhe käib moolide kohta.","skill":"mass_ratio_transfer"},
          {"prompt":"Use C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O. How many moles of CO₂ form when 1.0 mol of glucose is completely oxidised with sufficient oxygen?","options":["1.0 mol","6.0 mol","0.167 mol","12 mol"],"answer":1,"explanation":"Glükoosi ja CO₂ moolsuhe on 1 : 6. Seega 1,0 mol glükoosist tekib täielikul oksüdeerumisel 6,0 mol CO₂.","skill":"respiration_ratio"},
          {"prompt":"Use C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O. How many moles of H₂O form when 0.040 mol of glucose is completely oxidised with sufficient oxygen?","options":["0.040 mol","0.0067 mol","0.480 mol","0.240 mol"],"answer":3,"explanation":"Glükoosi ja H₂O moolsuhe on 1 : 6. n(H₂O) = 0,040 × 6 = 0,240 mol. Arvutus kirjeldab koondvõrrandi ainehulki.","skill":"respiration_ratio"}
        ]
      },
      {
        id: 'concentration_dilution',
        title: 'Molaarne kontsentratsioon ja lahjendamine',
        english: 'Molar concentration and dilution',
        why: 'Rakukeskkonna kirjeldamisel tuleb eristada lahustunud aine hulka ja selle kontsentratsiooni. Sama ainehulk võib olla jaotunud erineva suurusega ruumalasse.',
        explanation: [
          'Molaarne kontsentratsioon c (molar concentration, molarity) on lahustunud aine ainehulk lahuse ruumala kohta: c = n / V. Kui n on moolides ja V liitrites, on ühik mol/L. 250 mL = 0,250 L. Ruumala tähendab kogu lahust, mitte ainult lisatud vett.',
          'Ühest seosest saad ka n = c × V. Kontsentratsiooni kahekordistamine sama ruumala juures tähendab kaks korda suuremat ainehulka. Sama kontsentratsiooniga kaks eri mahuga proovi ei sisalda tingimata sama palju ainet.',
          'Lahjendamisel lisatakse lahustit. Kui lahustunud aine ei reageeri ega lähe kaduma, jääb selle ainehulk samaks: c₁V₁ = c₂V₂. V₂ on lahuse lõppmaht. Näiteks 20 mL proovi lahjendamine lõppmahuni 100 mL teeb kontsentratsiooni viis korda väiksemaks.',
          'Bioloogias aitab see lugeda kontsentratsioonigradiente. Iooni netoliikumist läbi membraani mõjutavad lisaks kontsentratsioonile elektriline erinevus ja membraani läbitavus. Ka osmoosi ennustamisel tuleb teada lahustunud osakeste arvu ja membraani omadusi; kõigi ainete võrdsed mol/L väärtused ei tähenda automaatselt sama osmootset mõju.'
        ],
        worked: {
          prompt: '40 mL glükoosilahust kontsentratsiooniga 0,50 mol/L lahjendatakse lõppmahuni 200 mL. Glükoos ei reageeri ega lähe kaduma. Leia uus kontsentratsioon.',
          steps: ['Lõppmaht on 200 mL, mitte 40 + 200 mL.', 'Kasuta c₂ = c₁V₁ / V₂. Mahud võivad suhtes olla samas ühikus.', 'c₂ = 0,50 × 40 / 200 = 0,10 mol/L.'],
          answer: 'Uus kontsentratsioon on 0,10 mol/L; glükoosi ainehulk jääb samaks.'
        },
        followupVersion: 1,
        followups: {
          "0": {
            "skill": "molarity_from_amount",
            "title": "Kontsentratsioon ainehulgast ja mahust",
            "explanation": [
              "Molaarne kontsentratsioon on c = n / V. Kasuta lahustunud aine moole ja kogu lahuse mahtu liitrites; vastuse ühik on mol/L."
            ],
            "worked": {
              "prompt": "Lahuses on 0,40 mol ainet ning lahuse lõppmaht on 2,0 L. Leia kontsentratsioon.",
              "steps": [
                "c = n / V.",
                "c = 0,40 mol / 2,0 L = 0,20 mol/L."
              ],
              "answer": "Kontsentratsioon on 0,20 mol/L."
            },
            "simpleIndex": 2,
            "applicationIndex": 6
          },
          "1": {
            "skill": "amount_with_unit_conversion",
            "title": "Ainehulk milliliitrites antud lahusest",
            "explanation": [
              "Leia ainehulk valemiga n = c × V. Kui c on mol/L, teisenda milliliitrid enne liitriteks: V(L) = V(mL) / 1000."
            ],
            "worked": {
              "prompt": "Leia ainehulk 200 mL lahuses kontsentratsiooniga 0,30 mol/L.",
              "steps": [
                "200 mL = 0,200 L.",
                "n = 0,30 mol/L × 0,200 L = 0,060 mol."
              ],
              "answer": "Lahuses on 0,060 mol ainet."
            },
            "simpleIndex": 7,
            "applicationIndex": 8
          },
          "3": {
            "skill": "dilution_final_volume",
            "title": "Kontsentratsioon lahjendamise lõppmahust",
            "explanation": [
              "Lahjendamisel säilib ainehulk, kui aine ei reageeri ega kao. Uus kontsentratsioon on c₂ = c₁V₁ / V₂; V₂ on kogu lahuse lõppmaht, millele algmahtu juurde ei liideta."
            ],
            "worked": {
              "prompt": "30 mL lahust kontsentratsiooniga 1,0 mol/L lahjendatakse lõppmahuni 150 mL. Aine ei reageeri ega kao. Leia uus kontsentratsioon.",
              "steps": [
                "Maht suureneb 150 / 30 = 5 korda.",
                "Kontsentratsioon väheneb viis korda: 1,0 / 5 = 0,20 mol/L."
              ],
              "answer": "Uus kontsentratsioon on 0,20 mol/L; lõppmaht on 150 mL."
            },
            "simpleIndex": 13,
            "applicationIndex": 14
          },
          "4": {
            "skill": "stock_volume_transfer",
            "title": "Lahjendamiseks vajaliku lähtelahuse maht",
            "explanation": [
              "Kui aine ei reageeri ega kao, siis c₁V₁ = c₂V₂. Lähtelahuse maht on V₁ = c₂V₂ / c₁; V₂ tähendab lahuse lõppmahtu."
            ],
            "worked": {
              "prompt": "Kui palju 2,0 mol/L lähtelahust on vaja 250 mL lahuse valmistamiseks kontsentratsiooniga 0,20 mol/L?",
              "steps": [
                "Ainehulga säilimisel V₁ = c₂V₂ / c₁.",
                "V₁ = 0,20 × 250 / 2,0 = 25 mL.",
                "Mõõda 25 mL lähtelahust ja lahjenda lõppmahuni 250 mL."
              ],
              "answer": "Vaja on 25 mL lähtelahust; 250 mL on lõppmaht."
            },
            "simpleIndex": 9,
            "applicationIndex": 10
          },
          "5": {
            "skill": "dilution_amount_conservation",
            "title": "Lahjendamisel säiliv ainehulk ja uus kontsentratsioon",
            "explanation": [
              "Lahjendamisel ainehulk säilib, kui aine ei reageeri ega lähe kaduma. Leia algne n = c₁V₁ liitrites antud mahuga; uus kontsentratsioon on c₂ = n / V₂."
            ],
            "worked": {
              "prompt": "50 mL lahust kontsentratsiooniga 0,30 mol/L lahjendatakse lõppmahuni 150 mL. Aine ei reageeri ega kao. Leia uus kontsentratsioon ja ainehulk.",
              "steps": [
                "Algne ja lõplik ainehulk: n = 0,30 × 0,050 = 0,015 mol.",
                "Lõppmaht: 150 mL = 0,150 L.",
                "c₂ = 0,015 / 0,150 = 0,10 mol/L."
              ],
              "answer": "Uus kontsentratsioon on 0,10 mol/L ja säiliv ainehulk 0,015 mol."
            },
            "simpleIndex": 11,
            "applicationIndex": 12
          }
        },
        sources: [
          {title: 'Opiq: kontsentratsioon, Keemia alused (sisukord; peatükk võib vajada tellimust)', url: 'https://www.opiq.ee/Kit/Details/575', note: 'Soovi korral ava 4.2 ja keskendu molaarse kontsentratsiooni osale. Seejärel proovi üks lahjendus ise läbi mõelda: mis jääb samaks ja mis muutub?'},
          {title: 'TÜ Huvitav keemia: Lahuse molaarse kontsentratsiooni arvutamine', url: 'https://sisu.ut.ee/huvitavkeemia/26-lahuse-molaarse-kontsentratsiooni-arvutamine/'},
          {title: 'OpenStax Chemistry 2e: Molarity', url: 'https://openstax.org/books/chemistry-2e/pages/3-3-molarity'},
          {title: 'OpenStax Biology 2e: Passive Transport', url: 'https://openstax.org/books/biology-2e/pages/5-2-passive-transport'}
        ],
        questions: [
          {prompt: 'A solution contains 0.15 mol of glucose in a final volume of 0.50 L. What is its molar concentration?', options: ['0.075 mol/L', '0.30 mol/L', '3.33 mol/L', '0.65 mol/L'], answer: 1, explanation: 'c = n / V = 0,15 / 0,50 = 0,30 mol/L. Väiksemas kui ühe liitri mahus on kontsentratsiooni arvväärtus siin suurem kui ainehulga arvväärtus.', skill: 'molarity_from_amount'},
          {prompt: 'How many moles of glucose are in 250 mL of a 0.20 mol/L glucose solution?', options: ['50 mol', '0.80 mol', '0.00080 mol', '0.050 mol'], answer: 3, explanation: '250 mL = 0,250 L. Ainehulk n = c × V = 0,20 × 0,250 = 0,050 mol. Liitri ja milliliitri segiajamine muudaks vastust tuhat korda.', skill: 'amount_with_unit_conversion'},
          {prompt: 'A solution contains 0.10 mol of solute in exactly 1.0 L of solution. What is its molar concentration?', options: ['0.10 mol/L', '10 mol/L', '1.0 mol/L', '0.010 mol/L'], answer: 0, explanation: 'c = n / V = 0,10 / 1,0 = 0,10 mol/L. Kontsentratsioon tähendab ainehulka ühe liitri lahuse kohta.', skill: 'molarity_from_amount'},
          {prompt: 'A 25 mL sample of 0.80 mol/L glucose solution is diluted with water to a final volume of 100 mL. No glucose is lost or reacts. What is the final concentration?', options: ['3.2 mol/L', '0.80 mol/L', '0.20 mol/L', '0.16 mol/L'], answer: 2, explanation: 'Maht suureneb 100 / 25 = 4 korda ja ainehulk säilib. Kontsentratsioon väheneb neli korda: 0,80 / 4 = 0,20 mol/L. Lõppmaht on 100 mL, mitte 125 mL.', skill: 'dilution_final_volume'},
          {prompt: 'What volume of 0.60 mol/L glucose stock solution is needed to prepare 200 mL of 0.15 mol/L glucose solution by dilution? Assume no glucose is lost or reacts.', options: ['800 mL', '50 mL', '30 mL', '200 mL'], answer: 1, explanation: 'c₁V₁ = c₂V₂, seega V₁ = 0,15 × 200 / 0,60 = 50 mL. Mõõda see kogus lähtelahust ja lahjenda lõppmahuni 200 mL.', skill: 'stock_volume_transfer'},
          {prompt: 'A 75 mL sample of 0.40 mol/L glucose solution is diluted to a final volume of 300 mL. No glucose is lost or reacts. Which pair gives its final concentration and the moles of glucose present?', options: ['0.10 mol/L and 0.030 mol', '0.080 mol/L and 0.030 mol', '0.10 mol/L and 0.120 mol', '1.60 mol/L and 0.030 mol'], answer: 0, explanation: 'Algne ainehulk on 0,40 × 0,075 = 0,030 mol ja see säilib. Uus kontsentratsioon on 0,030 / 0,300 = 0,10 mol/L. Lõppmaht 300 mL ei tähenda 300 mL vee lisamist.', skill: 'dilution_amount_conservation'},
          {"prompt":"A glucose solution contains 0.18 mol of glucose in a final solution volume of 0.30 L. What is its molar concentration?","options":["0.054 mol/L","1.67 mol/L","0.60 mol/L","0.48 mol/L"],"answer":2,"explanation":"c = n / V = 0,18 / 0,30 = 0,60 mol/L. Jagaja on kogu lahuse lõppmaht liitrites.","skill":"molarity_from_amount"},
          {"prompt":"How many moles of solute are in 500 mL of a 0.10 mol/L solution?","options":["0.050 mol","50 mol","0.20 mol","0.00020 mol"],"answer":0,"explanation":"500 mL = 0,500 L. n = c × V = 0,10 × 0,500 = 0,050 mol; milliliitrid tuleb enne liitriteks teisendada.","skill":"amount_with_unit_conversion"},
          {"prompt":"A researcher takes 40 mL of a 0.75 mol/L glucose solution. How many moles of glucose are in the sample?","options":["30 mol","0.01875 mol","18.75 mol","0.030 mol"],"answer":3,"explanation":"40 mL = 0,040 L. n = 0,75 mol/L × 0,040 L = 0,030 mol. Liitrite kasutamine hoiab ühikud kooskõlas.","skill":"amount_with_unit_conversion"},
          {"prompt":"What volume of 1.0 mol/L stock solution is needed to make a final volume of 100 mL at 0.50 mol/L by dilution? No solute is lost or reacts.","options":["200 mL","50 mL","100 mL","0.50 mL"],"answer":1,"explanation":"V₁ = c₂V₂ / c₁ = 0,50 × 100 / 1,0 = 50 mL. See kogus lähtelahust lahjendatakse lõppmahuni 100 mL.","skill":"stock_volume_transfer"},
          {"prompt":"What volume in mL of 1.5 mol/L glucose stock solution is needed to prepare a final volume of 0.250 L at 0.12 mol/L? No glucose is lost or reacts.","options":["20 mL","2000 mL","2.0 mL","31.25 mL"],"answer":0,"explanation":"V₁ = 0,12 × 0,250 / 1,5 = 0,020 L. Teisendades: 0,020 × 1000 = 20 mL. Lähtelahus lahjendatakse lõppmahuni 0,250 L.","skill":"stock_volume_transfer"},
          {"prompt":"A 100 mL sample of 0.20 mol/L glucose solution is diluted to a final volume of 200 mL. No glucose is lost or reacts. What are the final concentration and glucose amount?","options":["0.20 mol/L and 0.020 mol","0.10 mol/L and 0.040 mol","0.10 mol/L and 0.020 mol","0.067 mol/L and 0.020 mol"],"answer":2,"explanation":"n = 0,20 × 0,100 = 0,020 mol ja see säilib. c₂ = 0,020 / 0,200 = 0,10 mol/L. Lõppmaht on 200 mL, mitte 300 mL.","skill":"dilution_amount_conservation"},
          {"prompt":"A 40 mL sample of 0.60 mol/L glucose solution is diluted to a final volume of 0.300 L. No glucose is lost or reacts. Which pair gives the final concentration and glucose amount?","options":["0.080 mol/L and 0.180 mol","0.080 mol/L and 0.024 mol","0.071 mol/L and 0.024 mol","0.60 mol/L and 0.024 mol"],"answer":1,"explanation":"Algne ainehulk on 0,60 × 0,040 = 0,024 mol ja säilib. Uus kontsentratsioon on 0,024 / 0,300 = 0,080 mol/L. Lõppmahule ei lisata algmahtu uuesti.","skill":"dilution_amount_conservation"},
          {"prompt":"A 100 mL sample of 0.40 mol/L glucose solution is diluted to a final volume of 200 mL. No glucose is lost or reacts. What is its final concentration?","options":["0.20 mol/L","0.80 mol/L","0.40 mol/L","0.133 mol/L"],"answer":0,"explanation":"Lõppmaht on kaks korda algmahust suurem. c₂ = 0,40 × 100 / 200 = 0,20 mol/L. Algmahtu ei liideta lõppmahule juurde.","skill":"dilution_final_volume"},
          {"prompt":"A 20 mL sample of 1.5 mol/L glucose solution is diluted to a final volume of 0.250 L. No glucose is lost or reacts. What is its final concentration?","options":["0.111 mol/L","18.75 mol/L","0.12 mol/L","120 mol/L"],"answer":2,"explanation":"Teisenda 20 mL = 0,020 L. c₂ = 1,5 × 0,020 / 0,250 = 0,12 mol/L. Ruumalad peavad olema samas ühikus ning 0,250 L on lõppmaht.","skill":"dilution_final_volume"}
        ]
      }
    ]
  };
});
