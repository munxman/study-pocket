(function (root, factory) {
  'use strict';
  var content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  if (root) root.ExamPlanContent = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // A source-backed planning snapshot, not a learner assessment or admission promise.
  // Coverage describes the pack containing this page; it is not completed study.
  return {
    version: 2,
    checkedAt: '2026-11-09',
    intakeYear: 2027,
    sources: {
      italy: {title: 'Padova: 2026 vastuvõtutingimused ja ainekava', year: '2026/2027', checkedAt: '2026-11-09', url: 'https://wwwassets.unipd.it/sites/default/files/2026-09/2026_Bando_L_MedicineAndSurgery_ENG_V2.pdf'},
      tartu: {title: 'TÜ: eestikeelne arstiteadus', year: '2026; 2027 info ootel', checkedAt: '2026-11-09', url: 'https://ut.ee/et/oppekavad/arstiteadus'},
      academic: {title: 'TÜ: akadeemiline test ja SAT', year: '2026; 2027 info ootel', checkedAt: '2026-11-09', url: 'https://ut.ee/et/akadeemiline-test'},
      school: {title: 'Riigi Teataja: 2026/2027 riigieksamid', year: '2026/2027', checkedAt: '2026-11-09', url: 'https://www.riigiteataja.ee/public-api/api/v1/akt/122052026003/blob-html'},
      english: {title: 'Harno: inglise keele riigieksami asendamine', year: '2026/2027 · kehtiv üldkord', checkedAt: '2026-11-09', url: 'https://harno.ee/rahvusvahelised-keeleeksamid'},
      bluebook: {title: 'College Board: ametlik Bluebooki proovitest', year: 'praegune digitaalse SAT-i harjutus', checkedAt: '2026-11-09', url: 'https://satsuite.collegeboard.org/practice/practice-tests/bluebook'},
      satFormat: {title: 'College Board: digitaalse SAT-i ülesehitus', year: 'kehtiv formaat', checkedAt: '2026-11-09', url: 'https://satsuite.collegeboard.org/sat/whats-on-the-test/structure'},
      satDates: {title: 'College Board: SAT-i kuupäevad ja tähtajad', year: '2026/2027', checkedAt: '2026-11-09', url: 'https://satsuite.collegeboard.org/sat/dates-deadlines'},
      academicSample: {title: 'TÜ: akadeemilise testi näidisülesanded', year: 'TÜ praegusel lehel viidatud näidis', checkedAt: '2026-11-09', url: 'https://ut.ee/sites/default/files/2023-02/Akadeemilise%20testi%20n%C3%A4idis%C3%BClesanded.pdf'}
    },
    focus: [
      'Hoia bioloogia töös. Harjuta ka keemia, füüsika ja matemaatika põhiseoseid: need toetavad nii IMAT-it kui ka Tartu ettevalmistust.',
      'English / IELTS: kogu kogemust kõigist neljast oskusest. Jaanuari keskpaik on tulemuse saamise planeerimiseesmärk, eksamiaeg vajab eraldi kokkulepet.',
      'Alusta jõukohasest sammust, vaata vajadusel selgitust ja proovi hiljem uut ülesannet ilma abita. Võid alati peatuda või teise teema valida.'
    ],
    italy: {
      title: 'Esimene siht: meditsiin Itaalias',
      intro: 'Ingliskeelse õppe ettevalmistus ühendab bioloogia, keemia, füüsika, matemaatika, loogika ja ingliskeelse lugemise.',
      applicableYear: 2026,
      status: 'previous-year',
      questions: 60,
      minutes: 100,
      maximum: 90,
      scoring: {correct: 1.5, wrong: -0.4, blank: 0},
      sections: [
        {name: 'Bioloogia', questions: 23}, {name: 'Keemia', questions: 15},
        {name: 'Füüsika ja matemaatika', questions: 13}, {name: 'Loogika', questions: 5},
        {name: 'Lugemine ja üldteadmised', questions: 4}
      ],
      note: 'See on 2026. aasta formaat. 2027. aasta tingimused ja kuupäev vajavad veel kinnitamist. Lühike bioloogiaproov ei näita kogu IMAT-i tulemust.',
      sourceId: 'italy'
    },
    tartu: {
      title: 'Varuvariant: arstiteadus Tartus eesti keeles',
      applicableYear: 2026,
      status: 'previous-year',
      components: [
        {id: 'estonian', title: 'Eesti keele riigieksam', weight: 30, minimum: null},
        {id: 'academic', title: 'Akadeemiline test või arvestatav SAT', weight: 20, minimum: 51},
        {id: 'science', title: 'Füüsika ja keemia kokku', weight: 30, minimum: 51, parts: [{title: 'Füüsika', maximum: 50}, {title: 'Keemia', maximum: 50}]},
        {id: 'interview', title: 'Eestikeelne intervjuu', weight: 20, minimum: 51}
      ],
      eligibilityMinimum: 66,
      note: '2026. aasta reeglid: akadeemiline test, füüsika-keemia koondtulemus ja intervjuu peavad igaüks jõudma vähemalt 51 punktini. Keemia ja füüsika annavad kumbki kuni 50 punkti; 51 nõue käib nende summa kohta. Vähemalt 66 konkursipunkti lubab konkureerida, kuid sissepääsu määrab paremusjärjestus. 2027. aasta tingimused on veel ootel.',
      sourceId: 'tartu'
    },
    dates: [
      {id: 'ielts-goal', title: 'IELTS-i tulemus käes', label: 'Jaanuari keskpaik 2027', date: null, year: '2027', status: 'planning', kind: 'goal', sourceId: 'english', note: 'Meie planeerimiseesmärk: jätta aega kooli tähtaegadeks. Siht on 7.0+, kuid vajalik ettevalmistus selgub kõigi nelja oskuse tegelikust hindamisest. Eksamit pole selle plaaniga broneeritud.'},
      {id: 'school-certificate', title: 'Anna koolile teada oma keeleeksami valik', label: '20. jaanuar 2027', date: '2027-01-20', year: '2026/2027', status: 'confirmed', kind: 'deadline', sourceId: 'english', note: 'Teavita kooli valikust ja/või esita olemasolev tunnistus. Varem tehtud eksami tunnistusega asendamisel peab see kehtima vähemalt 31. augustini 2027.'},
      {id: 'harno-certificate', title: 'Kool saadab tunnistuse Harnole', label: '1. veebruar 2027', date: '2027-02-01', year: '2026/2027', status: 'confirmed', kind: 'school-deadline', sourceId: 'english', note: 'See on kooli tähtaeg olemasoleva rahvusvahelise tunnistusega asendamise korral. Teistel keeleeksami asendamise võimalustel on oma korraldus.'},
      {id: 'estonian-exam', title: 'Eesti keele riigieksam', label: '12. aprill 2027', date: '2027-04-12', year: '2027', status: 'confirmed', kind: 'exam', sourceId: 'school', note: 'Eestikeelne kirjalik riigieksam. Koolis tehtav töö jääb ettevalmistuse oluliseks osaks.'},
      {id: 'maths-exam', title: 'Matemaatika riigieksam', label: '19. mai 2027', date: '2027-05-19', year: '2027', status: 'confirmed', kind: 'exam', sourceId: 'school', note: 'Matemaatika toetab ka IMAT-i ning füüsika ja keemia arvutusi.'},
      {id: 'academic-info', title: 'TÜ akadeemilise testi uus info', label: 'Hiljemalt 1. detsember 2026', date: null, year: '2027 vastuvõtt', status: 'awaiting', kind: 'information', sourceId: 'academic', note: 'TÜ avaldab selleks ajaks 2027. aasta info. See pole testi kuupäev; ka SAT-i arvestamise ajavahemik vajab kontrolli.'},
      {id: 'tartu-info', title: 'Tartu 2027 tingimused ja eksamiajad', label: 'Hiljemalt detsembri lõpp 2026', date: null, year: '2027 vastuvõtt', status: 'awaiting', kind: 'information', sourceId: 'tartu', note: 'TÜ lubab avaldada uue info detsembri lõpuks. Praegu ei pane me 2026. aasta eksamipäevi 2027. aasta kalendrisse.'},
      {id: 'imat-exam', title: 'IMAT 2027', label: 'Kuupäev veel teadmata', date: null, year: '2027', status: 'awaiting', kind: 'exam', sourceId: 'italy', note: 'Praegu kasutame 2026. aasta ainekava. Ametlik 2027. aasta kuupäev, registreerimisaeg ja tingimused tuleb avaldamisel uuesti kontrollida.'}
    ],
    coverage: [
      {id: 'biology', title: 'Bioloogia · IMAT', topics: 30, scope: 'Rakud, pärilikkus ja füsioloogia valitud teemad.', gap: 'Kogu bioloogia ainekava katvus ja iseseisev rakendamine vajavad edasist kontrolli.', href: './imat.html'},
      {id: 'chemistry', title: 'Keemia', topics: 4, scope: 'Aatomi ehitus, sidemed, ainehulk ja kontsentratsioon.', gap: 'Alustav osa; edasi on vaja muu hulgas reaktsioone, tasakaalu, happeid-aluseid ja orgaanikat.', href: './quant.html?subject=chemistry'},
      {id: 'physics', title: 'Füüsika', topics: 5, scope: 'Ühikud, rõhk, energia, elekter ning aatomi ja footoni alused.', gap: 'Alustav osa; kogu kooli ja sisseastumiseksami füüsikakursus vajab laiemat ettevalmistust.', href: './quant.html?subject=physics'},
      {id: 'maths', title: 'Matemaatika', topics: 5, scope: 'Protsendid, võrdeline muutus, valemid, tõenäosus ja tasandigeomeetria alused.', gap: 'Alustav osa; funktsioonid, laiem geomeetria ja ülejäänud eksamikursus ei ole sellega kaetud.', href: './quant.html?subject=maths'}
    ],
    later: 'Loogika ja lugemine, eesti keele riigieksam ning Tartu intervjuu vajavad oma ettevalmistust. Nende täielikke kursusi see äpp praegu ei paku.',
    sat: {
      title: 'SAT kui Tartu lisavõimalus',
      intro: 'SAT-i matemaatika ja ingliskeelne arutlemine toetavad ka teisi eksameid. Alusta ühest oskusest; suurema SAT-i plaani otsustame tegeliku proovitulemuse järgi.',
      href: './videos.html?exam=SAT',
      action: 'Valin lühikese SAT-i harjutuse',
      steps: [
        'Proovi üht matemaatika või Reading and Writing oskust. Video on soovi korral abiks; pärast seda rakenda mõtet uues ülesandes.',
        'Vaata ka TÜ akadeemilise testi näidisülesandeid. Need aitavad võrrelda teistsugust arutlustesti, kuid ei anna ametlikku tulemust.',
        'Kui lepime kokku pikema proovi, tee väljaspool seda äppi üks seni tegemata ametlik Bluebooki täistest. Hoia teine seni nägemata test hilisemaks võrdluseks.'
      ],
      practiceNote: 'Siinsed algupärased lühiharjutused ei anna SAT-i skaalapunkte ega ennusta sissepääsu. Video vaatamine ja kohe pärast selgitust õnnestumine ei tõenda hilisemat iseseisvat oskust.',
      format: {readingQuestions: 54, readingMinutes: 64, mathQuestions: 44, mathMinutes: 70, breakMinutes: 10, sourceId: 'satFormat'},
      formatNote: 'Kummaski osas on kaks moodulit. Teise mooduli raskus sõltub esimese tulemusest. Bluebooki ametlik täistest on eraldi; see äpp ei jäljenda SAT-i skaalat ega adaptiivset hindamist.',
      tartuRules: {
        applicableYear: 2026,
        status: 'previous-year',
        weight: 20,
        minimum: 51,
        betterResultCounts: true,
        attemptsPerYear: 1,
        academicDates: ['2026-03-28', '2026-04-11', '2026-07-06'],
        acceptedSatFrom: '2025-03-28',
        acceptedSatThrough: '2026-06-10',
        officialScoreDeadline: '2026-06-30',
        intake2027Confirmed: false,
        note: '2026. aastal moodustas akadeemiline test või arvestatav SAT 20% arstiteaduse konkursitulemusest; vajalik oli vähemalt 51 akadeemilise testi punkti. Mõlema testi korral arvestati paremat tulemust.',
        attemptsNote: 'Akadeemilist testi sai teha ühe korra aastas. Arstiteaduse 2026. aasta valikud olid 28. märts, 11. aprill või 6. juuli; kevadel teinu ei saanud juulis uuesti proovida.',
        eligibilityNote: '2026. aasta SAT-i arvestusaken oli 28.03.2025–10.06.2026 ning ametlik tulemus pidi TÜ-ni jõudma 30.06.2026. Need ei ole 2027. aasta tähtajad. 2027. aasta arvestusaken ja tingimused vajavad kinnitamist; TÜ lubab akadeemilise testi infot uuendada hiljemalt 1. detsembriks 2026.',
        conversions: [{sat: 1030, academic: 51}, {sat: 1330, academic: 70}, {sat: 1400, academic: 75}, {sat: 1450, academic: 80}, {sat: 1500, academic: 88}, {sat: 1530, academic: 93}],
        sourceId: 'academic'
      },
      possibleDates: [
        {date: '2026-12-05', label: '5. detsember 2026', registration: '2026-11-20', registrationLabel: '20. november 2026'},
        {date: '2027-03-06', label: '6. märts 2027', registration: '2027-02-19', registrationLabel: '19. veebruar 2027'},
        {date: '2027-05-01', label: '1. mai 2027', registration: '2027-04-16', registrationLabel: '16. aprill 2027'},
        {date: '2027-06-05', label: '5. juuni 2027', registration: '2027-05-21', registrationLabel: '21. mai 2027'}
      ],
      datesNote: 'College Board on need testipäevad kinnitanud, kuid meie osalemine pole otsustatud. Märts võib sobida esimeseks katseks ja mai vajadusel korduseks. Juuni tulemuse sobivust TÜ 2027. aasta vastuvõtuks ei saa praegu lubada. Tavaregistreerimise tähtajad lõpevad kell 23.59 USA idaranniku aja järgi; kohaliku keskuse vabad kohad tuleb eraldi kontrollida.',
      bookingNote: 'Registreerimine ja tasud arutame enne Ingmariga. Äpp näitab infot ning ei registreeri ega maksa.'
    },
    diagnostic: {
      title: 'Akadeemiline test või SAT?',
      text: 'Enne SAT-i ettevalmistusele suure osa ajast andmist proovi TÜ näidisülesandeid ning soovi korral ametlikku Bluebooki SAT-i proovitesti. Need mõõdavad eri asju. SAT-i valik otsustame tulemuse ja TÜ 2027. aasta reeglite järgi; praegu pole vaja tasulist eksamit broneerida.',
      sourceIds: ['academic', 'bluebook']
    }
  };
});
