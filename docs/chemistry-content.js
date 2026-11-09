(function (root, factory) {
  'use strict';
  var content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  if (root) root.ChemistryContent = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Original starter material, not official exam questions or full syllabus coverage.
  // The subject shape matches QuantContent.subjects.maths/physics.
  // Indices 0–1: first questions; 2: simpler supported check; 3: application check;
  // 4–5: transfer opportunities. The engine determines support/delay eligibility;
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
          {prompt: 'A researcher uses carbon-14 as a label in a molecule. Carbon has atomic number 6. Before any radioactive decay occurs, what does each neutral carbon-14 atom contain?', options: ['8 protons, 6 neutrons and 8 electrons', '6 protons, 14 neutrons and 6 electrons', '6 protons, 8 neutrons and 6 electrons', '14 protons, 6 neutrons and 14 electrons'], answer: 2, explanation: 'Isotoop on endiselt süsinik: 6 prootonit. Massiarv 14 annab 14 − 6 = 8 neutronit. Neutraalsel aatomil on 6 elektroni. Molekulis kasutamine ei muuda isotoobi tuuma koostist.', skill: 'isotope_label_transfer'}
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
          {prompt: 'Two neighbouring water molecules are separated without changing either molecule’s chemical formula. Which interaction between them is being overcome?', options: ['The covalent O–H bonds inside both molecules', 'The forces holding protons inside each oxygen nucleus', 'An intermolecular hydrogen bond', 'A metallic bond between oxygen atoms'], answer: 2, explanation: 'Üksteisest eraldatakse kaks tervet H₂O molekuli: nendevaheline vesiniksideme koostoime katkeb. Molekulide O–H kovalentsed sidemed säilivad; vesi ei lagune selle tõttu vesinikuks ja hapnikuks.', skill: 'intermolecular_transfer'}
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
          {prompt: 'For 2Mg + O₂ → 2MgO, how many grams of O₂ are required to react completely with 4.8 g of Mg? Use M(Mg) = 24 g/mol and M(O₂) = 32 g/mol.', options: ['3.2 g', '6.4 g', '2.4 g', '9.6 g'], answer: 0, explanation: 'Mg ainehulk on 4,8 / 24 = 0,20 mol. Suhe Mg : O₂ on 2 : 1, seega O₂ on vaja 0,10 mol. Mass on 0,10 × 32 = 3,2 g. Moolsuhet ei tohi otse grammidele rakendada.', skill: 'mass_ratio_transfer'}
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
          {prompt: 'A 75 mL sample of 0.40 mol/L glucose solution is diluted to a final volume of 300 mL. No glucose is lost or reacts. Which pair gives its final concentration and the moles of glucose present?', options: ['0.10 mol/L and 0.030 mol', '0.080 mol/L and 0.030 mol', '0.10 mol/L and 0.120 mol', '1.60 mol/L and 0.030 mol'], answer: 0, explanation: 'Algne ainehulk on 0,40 × 0,075 = 0,030 mol ja see säilib. Uus kontsentratsioon on 0,030 / 0,300 = 0,10 mol/L. Lõppmaht 300 mL ei tähenda 300 mL vee lisamist.', skill: 'dilution_amount_conservation'}
        ]
      }
    ]
  };
});
