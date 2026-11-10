(function (root) {
  'use strict';

  // Append-only, original questions. The existing diagnostic order, question
  // meanings, mock and warm-up are unchanged. These IDs identify the exact
  // subskill; a success on another facet is not evidence for this one.
  const reason = (prompt, choices, answer, explanation) => ({ prompt, choices, answer, explanation });
  const item = (skill, stage, value) => ({
    id: `geometry-${skill}-${stage}-2026-11-11`,
    skill,
    stage,
    // Fresh wording within a visit is not delayed recall. Exposure remains
    // unknown until the caller records it; opening help makes it supported.
    evidence: stage === 'practice' ? 'immediate_practice' : stage === 'transfer' ? 'fresh_same_visit' : 'later_reserve',
    ...value,
  });
  const diagram = (description, body) => ({
    description,
    note: 'Skeem ei ole mõõtkavas. Kasuta antud suurusi, mitte pildilt mõõtmist.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" role="img" aria-label="${description}"><g fill="none" stroke="currentColor" stroke-width="2">${body}</g></svg>`,
  });
  const label = (x, y, text) => `<text x="${x}" y="${y}" fill="currentColor" stroke="none" font-size="15" text-anchor="middle">${text}</text>`;
  const rhombus = (horizontal, vertical, halves = false) => diagram(
    halves ? `Romb, mille keskpunktist tipuni ulatuvad pooldiagonaalid on ${horizontal} cm ja ${vertical} cm.` : `Romb diagonaalidega ${horizontal} cm ja ${vertical} cm.`,
    '<path d="M 25 90 L 160 20 L 295 90 L 160 160 Z"/><path d="M 25 90 H 295 M 160 20 V 160" stroke-dasharray="5 4"/>' +
    (halves ? label(226, 81, `${horizontal} cm`) + label(185, 56, `${vertical} cm`) + label(150, 108, 'O') : label(160, 177, `d₁ täispikkus ${horizontal} cm`) + label(214, 15, `d₂ täispikkus ${vertical} cm`)),
  );
  const trapezoid = (bottom, top, height, slant = null) => diagram(
    `Trapets alustega ${bottom} cm ja ${top} cm ning kõrgusega ${height} cm${slant === null ? '' : `; kaldhaar on ${slant} cm`}.`,
    '<path d="M 40 140 L 280 140 L 220 40 L 40 40 Z"/><path d="M 50 140 V 130 H 40"/>' +
    label(160, 163, `${bottom} cm`) + label(130, 28, `${top} cm`) + label(21, 94, `${height} cm`) +
    (slant === null ? '' : label(275, 83, `${slant} cm`)),
  );
  const parallelogram = (base, side, angle) => diagram(
    `Rööpkülik: alus ${base} cm, kõrvalkülg ${side} cm, nende vaheline nurk ${angle} kraadi. Kõrgust ei ole ette joonistatud.`,
    angle === 150
      ? '<path d="M 130 130 L 290 130 L 203.4 80 L 43.4 80 Z"/>' + label(210, 155, `${base} cm`) + label(72, 121, `${side} cm`) + label(144, 116, '150°')
      : '<path d="M 25 130 L 205 130 L 291.6 80 L 111.6 80 Z"/>' + label(115, 155, `${base} cm`) + label(57, 97, `${side} cm`) + label(66, 123, '30°'),
  );
  const rectangle = (width, height) => diagram(
    `Ristkülik külgedega ${width} cm ja ${height} cm.`,
    '<path d="M 55 40 H 265 V 135 H 55 Z"/><path d="M 55 124 H 66 V 135"/>' + label(160, 159, `${width} cm`) + label(294, 92, `${height} cm`),
  );

  const skills = {
    polygon_angle_sum: {
      id: 'polygon_angle_sum', topic: 'angles', diagnosticIndex: 0,
      title: 'Hulknurga kõigi sisenurkade summa',
      rules: [
        'Kumer hulknurk jaguneb ühest tipust joonestades n − 2 kolmnurgaks.',
        'Iga kolmnurga nurgad annavad 180°. Kogu summa on (n − 2) · 180°.',
        'See on kõigi sisenurkade summa, mitte üks nurk. Korrapärasust summa leidmiseks vaja ei ole.',
      ],
      example: [
        'Leia kumera seitsenurga sisenurkade summa.',
        'Ühest tipust saan viis kolmnurka, sest 7 − 2 = 5.',
        'Viie kolmnurga nurgad kokku: 5 · 180° = 900°.',
      ],
      practice: item('polygon_angle_sum', 'practice', {
        prompt: 'Leia kumera kaheksanurga kõigi sisenurkade summa.', unit: '°', answer: 1080,
        explanation: 'Kaheksanurk jaguneb ühest tipust kuueks kolmnurgaks. 6 · 180° = 1080°.',
        reason: reason('Miks korrutasid 180° just kuuega?', ['Kaheksanurgal on kuus külge.', 'Ühest tipust saab kujundi jagada kuueks kolmnurgaks.', 'Iga kaheksanurga üks nurk on 180°.'], 1, 'Kolmnurki on kaks vähem kui tippe: 8 − 2 = 6. Me ei eelda võrdseid nurki.'),
      }),
      transfer: item('polygon_angle_sum', 'transfer', {
        prompt: 'Kumeral hulknurgal on 13 külge. Tema nurgad ei ole kõik võrdsed. Leia kõigi sisenurkade summa.', unit: '°', answer: 1980,
        explanation: 'Võrdsed nurgad pole summa leidmiseks vajalikud. Ühest tipust tekib 13 − 2 = 11 kolmnurka; summa on 11 · 180° = 1980°.',
        reason: reason('Kas ebavõrdsed nurgad takistavad summa leidmist?', ['Jah, enne peab iga nurga eraldi mõõtma.', 'Jah, valem kehtib ainult korrapärase hulknurga puhul.', 'Ei, 11 kolmnurgaks jagamine annab summa ka ebakorrapärasel kumeral hulknurgal.'], 2, 'Kumerus võimaldab sama kolmnurkadeks jaotamise; korrapärasust pole vaja.'),
      }),
      reserve: item('polygon_angle_sum', 'reserve', {
        prompt: 'Kumera kümnenurga ühe nurga suurus ei ole teada. Leia siiski kõigi sisenurkade summa.', unit: '°', answer: 1440,
        explanation: 'Külgede arv määrab summa: (10 − 2) · 180° = 1440°. Üksiknurga suurust pole selleks vaja.',
        reason: reason('Milline antud info määrab küsitud summa?', ['Kümme külge ja kumerus.', 'Ainult ühe nurga suurus.', 'Kõigi külgede pikkused.'], 0, 'Ühest tipust tekib kaheksa kolmnurka. Külgede pikkused ja üksiknurgad võivad erineda.'),
      }),
    },
    polygon_diagonal_count: {
      id: 'polygon_diagonal_count', topic: 'angles', diagnosticIndex: 1,
      title: 'Diagonaalid ühest tipust ja kogu kujundis',
      rules: [
        'Diagonaal ühendab mitte-naabertippe. Ühest tipust ei ühenda sa seda tippu ennast ega tema kahte naabrit: alles jääb n − 3.',
        'Kõigi tippude kaupa loendades loed iga diagonaali kahest otsast. Seepärast on neid kokku n(n − 3) / 2.',
      ],
      example: [
        'Mitu diagonaali on kokku seitsenurgal?',
        'Igast tipust väljub 7 − 3 = 4 diagonaali.',
        '7 · 4 = 28 loeb iga joone kaks korda. Kokku on 28 : 2 = 14 diagonaali.',
      ],
      practice: item('polygon_diagonal_count', 'practice', {
        prompt: 'Mitu diagonaali on kokku kumeral kaheksanurgal?', answer: 20,
        explanation: 'Ühest tipust väljub viis diagonaali. 8 · 5 : 2 = 20.',
        reason: reason('Miks tuleb tippude kaupa loendatud arv lõpuks kahega jagada?', ['Iga diagonaal on loetud mõlemast otsast.', 'Hulknurga külgi on alati paarisarv.', 'Diagonaal jagab alati nurga pooleks.'], 0, 'Joont tipust A tippu D ja joont D-st A-sse ei loeta eri diagonaalideks.'),
      }),
      transfer: item('polygon_diagonal_count', 'transfer', {
        prompt: 'Ürituse märgiks joonistatakse kumer 13-nurk ja ühendatakse kõik mitte-naabertippude paarid. Mitu erinevat diagonaali saadakse?', answer: 65,
        explanation: 'Igast 13 tipust väljub 10 diagonaali. Iga diagonaali loetakse kahest otsast: 13 · 10 : 2 = 65.',
        reason: reason('Miks väljub ühest tipust kümme, mitte kaksteist diagonaali?', ['Kolm diagonaali on alati paralleelsed.', 'Kaks naabertippu annavad küljed; iseendaga ühendust samuti ei tehta.', 'Iga nurga juures tuleb kolm joont kustutada.'], 1, '13 tipust tuleb välja jätta vaadeldav tipp ja tema kaks naabrit: 13 − 3 = 10.'),
      }),
      reserve: item('polygon_diagonal_count', 'reserve', {
        prompt: 'Mitu erinevat diagonaali on kokku kumeral 14-nurgal?', answer: 77,
        explanation: 'Ühest tipust 14 − 3 = 11; kogu kujundis 14 · 11 : 2 = 77.',
        reason: reason('Mida arv 154 selles arvutuses tähendaks?', ['Õiget diagonaalide arvu.', 'Ainult külgede arvu.', 'Kõikide diagonaalide kahekordset loendamist.'], 2, '14 · 11 = 154 loeb iga ühenduse mõlemast otsast; erinevaid diagonaale on 77.'),
      }),
    },
    regular_polygon_exterior: {
      id: 'regular_polygon_exterior', topic: 'angles', diagnosticIndex: 2,
      title: 'Korrapärase hulknurga välisnurk ja külgede arv',
      rules: [
        'Üks samas suunas võetud välisnurk igas tipus annab täisringi ehk 360°.',
        'Korrapärase hulknurga kõik need pöörded on võrdsed. Külgede arv on 360° jagatud ühe välisnurgaga.',
        'Sisenurk ja temaga kõrvuti olev välisnurk annavad kokku 180°.',
      ],
      example: [
        'Korrapärase hulknurga üks välisnurk on 36°. Mitu külge tal on?',
        'Ümber kujundi liikudes tehakse kokku 360° pööret.',
        'Võrdseid 36° pöördeid mahub täisringi 360 : 36 = 10. Seega on kümme külge.',
      ],
      practice: item('regular_polygon_exterior', 'practice', {
        prompt: 'Korrapärase kumera hulknurga üks välisnurk on 20°. Mitu külge on hulknurgal?', answer: 18,
        explanation: 'Kõik välispöörded kokku annavad 360°. 360 : 20 = 18.',
        reason: reason('Miks kasutad jagatavana 360°, mitte 180°?', ['Iga sisenurk on 360°.', 'Korrapärasel hulknurgal on alati 360 külge.', 'Üks sama suunaga välispööre iga tipu juures annab kokku täisringi.'], 2, '180° on kõrvuti oleva sise- ja välisnurga summa, mitte kõigi välispöörete summa.'),
      }),
      transfer: item('regular_polygon_exterior', 'transfer', {
        prompt: 'Joonistad korrapärase kumera hulknurga. Iga külje lõpus pöörad samas suunas 15°. Mitu külge on valmis kujundil?', answer: 24,
        explanation: 'Üks ring nõuab 360° kogupööret. Võrdseid pöördeid on 360 : 15 = 24.',
        reason: reason('Millise nurga kirjeldab liikumisel tehtav 15° pööre?', ['Välisnurga.', 'Sisenurga.', 'Kõigi sisenurkade summa.'], 0, 'Külje senise suuna ja järgmise külje suuna vaheline pööre on välisnurk.'),
      }),
      reserve: item('regular_polygon_exterior', 'reserve', {
        prompt: 'Korrapärase kumera hulknurga üks sisenurk on 162°. Mitu külge on hulknurgal?', answer: 20,
        explanation: 'Kõrvuti olev välisnurk on 180° − 162° = 18°. Külgi on 360 : 18 = 20.',
        reason: reason('Milline samm on enne külgede arvu leidmist vajalik?', ['Jagada 162° kohe külgede arvuga.', 'Leida kõrvuti olev välisnurk 180° − 162°.', 'Eeldada, et igal nurgal on kaks külge, ja korrutada 162 kahega.'], 1, 'Täisringi 360° jagame välisnurga, mitte sisenurgaga.'),
      }),
    },
    quadrilateral_missing_angle: {
      id: 'quadrilateral_missing_angle', topic: 'properties', diagnosticIndex: 3,
      title: 'Nelinurga puuduv sisenurk',
      rules: [
        'Kumera nelinurga diagonaal jagab kujundi kaheks kolmnurgaks. Kõigi sisenurkade summa on 360°.',
        'Liida kolm antud sisenurka ning lahuta nende summa 360°-st. Ära eelda täisnurki ega võrdseid nurki, kui neid pole antud.',
      ],
      example: [
        'Kumera nelinurga kolm sisenurka on 82°, 107° ja 93°.',
        'Need annavad 82 + 107 + 93 = 282°.',
        'Puuduv nurk on 360° − 282° = 78°. Kontroll: neli nurka kokku on 360°.',
      ],
      practice: item('quadrilateral_missing_angle', 'practice', {
        prompt: 'Kumera nelinurga kolm sisenurka on 68°, 109° ja 117°. Leia neljas sisenurk.', unit: '°', answer: 66,
        explanation: 'Antud nurgad kokku: 68 + 109 + 117 = 294°. Neljas on 360 − 294 = 66°.',
        reason: reason('Milline seos kehtib selle ülesande puhul kindlasti?', ['Kõigi nelja sisenurga summa on 360°.', 'Kõik nurgad on võrdsed.', 'Iga kahe kõrvuti nurga summa on 180°.'], 0, 'Kõrvuti nurkade 180° seos vajab lisatingimusi, näiteks rööpküliku paralleelseid külgi.'),
      }),
      transfer: item('quadrilateral_missing_angle', 'transfer', {
        prompt: 'Kumera nelinurkse detaili nurgad A, B ja C on 84°, 97° ja 118°. Kui suur on nurk D?', unit: '°', answer: 61,
        explanation: '84 + 97 + 118 = 299°. 360 − 299 = 61°.',
        reason: reason('Kuidas saad vastust kontrollida?', ['D peab olema suurim nurk.', 'Liidan kõik neli nurka ja kontrollin, kas saan 360°.', 'Korrutan neljanda nurga neljaga ja pean saama 360°.'], 1, 'Nurgad pole öeldud võrdsed. Kontrollime nende kogusummat, mitte nelja võrdse nurga eeldust.'),
      }),
      reserve: item('quadrilateral_missing_angle', 'reserve', {
        prompt: 'Kumera nelinurga kolm sisenurka on 91°, 102° ja 79°. Leia neljas sisenurk.', unit: '°', answer: 88,
        explanation: '91 + 102 + 79 = 272°. Neljas nurk on 360 − 272 = 88°.',
        reason: reason('Miks on nelinurga sisenurkade summa 360°?', ['Iga nurk on täisnurk.', 'Nelinurgal on neli võrdset külge.', 'Diagonaal jagab kumera nelinurga kaheks kolmnurgaks, kummaski 180°.'], 2, 'Kaks kolmnurka annavad 2 · 180°. Täisnurki ega võrdseid külgi pole vaja.'),
      }),
    },
    parallelogram_equal_diagonals: {
      id: 'parallelogram_equal_diagonals', topic: 'properties', diagnosticIndex: 4,
      title: 'Mida võrdsed diagonaalid rööpküliku kohta tõestavad?',
      rules: [
        'Rööpkülikus annavad võrdse pikkusega diagonaalid ristküliku: kõik nurgad on täisnurgad.',
        'Üksnes sellest ei järeldu ruut ega võrdsed küljed. Näiteks 6 cm × 8 cm ristkülikul on mõlemad diagonaalid 10 cm.',
        'Järeldus kasutab eeldust, et kujund on rööpkülik. Suvalise nelinurga võrdsed diagonaalid üksi ristkülikut ei tõesta.',
      ],
      example: [
        'Rööpkülikus ABCD on AC = BD. Miks annab see ristküliku?',
        'Kolmnurkadel ABC ja BAD on AB ühine, BC = AD rööpküliku vastaskülgedena ning AC = BD eeldusest. Kolmnurgad on KKK järgi võrdsed.',
        'Seega on lähisnurgad B ja A võrdsed. Need annavad kokku 180°, nii et kumbki on 90°.',
        'Ruudu jaoks jääb puudu külgede võrdsuse tingimus. 6 × 8 ristkülik on vastunäide väitele „peab olema ruut”.',
      ],
      practice: item('parallelogram_equal_diagonals', 'practice', {
        prompt: 'Tead, et kujund on rööpkülik ning tema diagonaalid on võrdsed. Millise liigi saad kindlasti järeldada?',
        choices: ['Romb', 'Ruut', 'Ristkülik', 'Ükski eelmistest ei ole kindel'], answer: 2,
        explanation: 'Võrdsed diagonaalid annavad rööpkülikus täisnurgad, seega ristküliku. Külgede võrdsust pole antud.',
        reason: reason('Miks ei saa veel kindlalt järeldada ruutu?', ['Võrdsed diagonaalid keelavad täisnurgad.', 'Külgede võrdsust pole teada; näiteks 6 × 8 ristkülikul on samuti võrdsed diagonaalid.', 'Ruut ei ole rööpkülik.'], 1, 'Ruut on eriline ristkülik ja romb. Ristkülikul võivad lähisküljed olla erineva pikkusega.'),
      }),
      transfer: item('parallelogram_equal_diagonals', 'transfer', {
        prompt: 'Rööpkülikus ABCD on AC = BD, kuid AB ja BC on eri pikkusega. Milline väide on kindlasti tõene?',
        choices: ['Diagonaalid on risti.', 'Kõik neli sisenurka on 90°.', 'Kõik neli külge on võrdsed.', 'Kujund on ruut.'], answer: 1,
        explanation: 'Võrdsed diagonaalid koos rööpküliku eeldusega annavad ristküliku. Erinevad lähisküljed välistavad ruudu.',
        reason: reason('Milline järelduste ahel on põhjendatud?', ['Võrdsed diagonaalid → alati võrdsed küljed → ruut.', 'Eri pikkusega lähisküljed → ükski nurk ei saa olla 90°.', 'Rööpkülik ja võrdsed diagonaalid → ristkülik; eri lähisküljed → see ei ole ruut.'], 2, 'Diagonaalide võrdsus ja külgede võrdsus on eri omadused. Kasutame ainult antud eeldusi.'),
      }),
      reserve: item('parallelogram_equal_diagonals', 'reserve', {
        prompt: 'Uue nelinurga kohta tead ainult, et diagonaalid on võrdsed. Paralleelseid külgi ei ole antud. Kas sellest piisab ristküliku tõestamiseks?',
        choices: ['Jah, alati.', 'Jah, kui diagonaalid on piisavalt pikad.', 'Ei, näiteks mitte-ristkülikukujulisel võrdhaarsel trapetsil võivad diagonaalid samuti võrdsed olla.'], answer: 2,
        explanation: 'Puudub eeldus, et kujund on rööpkülik. Võrdhaarne trapets on vastunäide üldisele väitele.',
        reason: reason('Milline eeldus oli eelmises ristküliku järelduses oluline?', ['Et kujund on rööpkülik.', 'Et diagonaali mõõdeti sentimeetrites.', 'Et joonis on horisontaalne.'], 0, 'Võrdsed diagonaalid annavad ristküliku rööpkülikute hulgas; suvaliste nelinurkade hulgas sellest ei piisa.'),
      }),
    },
    rhombus_diagonal_area: {
      id: 'rhombus_diagonal_area', topic: 'areas', diagnosticIndex: 5,
      title: 'Rombi pindala diagonaalidest',
      rules: [
        'Rombi diagonaalid on risti ja poolitavad teineteist.',
        'Nelja väikese täisnurkse kolmnurga pindalad kokku annavad S = d₁ · d₂ / 2. d₁ ja d₂ tähendavad täispikki diagonaale.',
        'Pooldiagonaali pikkus pole sama mis diagonaali täispikkus. Pindala vastus käib ruutühikutes.',
      ],
      example: [
        'Rombi diagonaalid on 8 cm ja 14 cm. Leia pindala.',
        'Pooldiagonaalid on 4 cm ja 7 cm. Ühe väikese kolmnurga pindala on 4 · 7 : 2 = 14 cm².',
        'Selliseid kolmnurki on neli: 4 · 14 = 56 cm². Sama annab 8 · 14 : 2 = 56 cm².',
      ],
      practice: item('rhombus_diagonal_area', 'practice', {
        prompt: 'Rombi diagonaalide täispikkused on 12 cm ja 18 cm. Leia pindala.', unit: 'cm²', answer: 108,
        diagram: rhombus(12, 18),
        explanation: 'S = 12 · 18 : 2 = 108 cm². Arv 216 oleks kahekordne pindala.',
        reason: reason('Mida tähendavad siin 12 cm ja 18 cm?', ['Rombi kahe külje pikkusi.', 'Kahte pooldiagonaali.', 'Diagonaalide täispikkusi, mille korrutis jagatakse kahega.'], 2, 'Täisdiagonaalide valem S = d₁d₂/2 on teistsugune kui arvutus pooldiagonaalidega.'),
      }),
      transfer: item('rhombus_diagonal_area', 'transfer', {
        prompt: 'Rombikujulise plaadi üks diagonaal on 6 cm ja teine 22 cm. Kui suur on plaadi pindala?', unit: 'cm²', answer: 66,
        diagram: rhombus(6, 22),
        explanation: 'S = 6 · 22 : 2 = 66 cm². Pooldiagonaalidega kontroll: 4 · (3 · 11 : 2) = 66 cm².',
        reason: reason('Milline jaotus põhjendab vastust?', ['Neli täisnurkset kolmnurka kaatetitega 3 cm ja 11 cm.', 'Kaks ristkülikut külgedega 6 cm ja 22 cm.', 'Neli kolmnurka kaatetitega 6 cm ja 22 cm.'], 0, 'Iga väike kolmnurk kasutab pooldiagonaale. Nende nelja pindala liitmisel saad rombi pindala.'),
      }),
      reserve: item('rhombus_diagonal_area', 'reserve', {
        prompt: 'Rombi diagonaalid lõikuvad punktis O. Ühest tipust O-ni on 5 cm ja naabertipust O-ni 9 cm. Leia rombi pindala.', unit: 'cm²', answer: 90,
        diagram: rhombus(5, 9, true),
        explanation: 'Antud on pooldiagonaalid. Täisdiagonaalid on 10 cm ja 18 cm; S = 10 · 18 : 2 = 90 cm². Või neli kolmnurka: 4 · 5 · 9 : 2 = 90 cm².',
        reason: reason('Miks ei sobi siia arvutus 5 · 9 : 2 kogu rombi pindalaks?', ['Sest rombi pindala ei saa leida diagonaalidest.', 'See annab ainult ühe neljast väikesest kolmnurgast; 5 ja 9 on pooldiagonaalid.', 'Sest pindala jaoks tuleb pikkused alati liita.'], 1, 'Punkt O on diagonaalide keskpunkt. Ühe väikese kolmnurga pindala on 22,5 cm² ning kogu rombil 90 cm².'),
      }),
    },
    trapezoid_base_height_area: {
      id: 'trapezoid_base_height_area', topic: 'mixed', diagnosticIndex: 6,
      title: 'Trapetsi pindala antud kõrgusega',
      rules: [
        'Trapetsi alused on kaks paralleelset külge. Kõrgus on nende ristkaugus.',
        'Pindala on aluste keskmine pikkus korda kõrgus: S = (a + b) · h / 2.',
        'Kaldhaar ei asenda kõrgust. Kui kõrgus on juba antud, pole selle leidmiseks Pythagorase teoreemi vaja.',
      ],
      example: [
        'Trapetsi alused on 18 cm ja 8 cm ning kõrgus 6 cm.',
        'Aluste keskmine on (18 + 8) : 2 = 13 cm.',
        'Pindala on 13 · 6 = 78 cm².',
      ],
      practice: item('trapezoid_base_height_area', 'practice', {
        prompt: 'Trapetsi paralleelsed alused on 14 cm ja 8 cm. Kõrgus on 5 cm. Leia pindala.', unit: 'cm²', answer: 55,
        diagram: trapezoid(14, 8, 5),
        explanation: 'Aluste keskmine on 11 cm. Pindala on 11 · 5 = 55 cm².',
        reason: reason('Millised kolm pikkust määravad siin pindala?', ['Mõlemad paralleelsed alused ja nende ristkaugus.', 'Kõik küljed peale kõrguse.', 'Ainult pikem alus ja kaldhaar.'], 0, 'Trapetsi pindala jaoks kasutame aluste keskmist ja kõrgust.'),
      }),
      transfer: item('trapezoid_base_height_area', 'transfer', {
        prompt: 'Täisnurkse trapetsi alused on 17 cm ja 11 cm, kõrgus 8 cm ning kaldhaar 10 cm. Leia pindala.', unit: 'cm²', answer: 112,
        diagram: trapezoid(17, 11, 8, 10),
        explanation: 'Kõrgus on 8 cm, mitte kaldhaar 10 cm. S = (17 + 11) · 8 : 2 = 112 cm².',
        reason: reason('Miks ei kasuta sa kõrguse asemel 10 cm?', ['Pikemat antud arvu ei tohi pindalas kasutada.', '10 cm on kaldhaara pikkus, aga kõrgus peab olema alustega risti.', 'Trapetsi pindala ei sõltu ühestki külje pikkusest.'], 1, 'Kõrgus on paralleelsete aluste ristkaugus. Selles kujundis sobivad ka mõõdud: aluste vahe 6 cm, kõrgus 8 cm ja kaldhaar 10 cm moodustavad 6–8–10 kolmnurga.'),
      }),
      reserve: item('trapezoid_base_height_area', 'reserve', {
        prompt: 'Trapetsi pindala on 105 cm² ja alused 17 cm ning 13 cm. Leia kõrgus.', unit: 'cm', answer: 7,
        explanation: 'Aluste keskmine on (17 + 13) : 2 = 15 cm. Kuna 15 · h = 105, siis h = 7 cm.',
        reason: reason('Milline võrrand seob antud suurused?', ['17 + 13 + h = 105.', '17 · 13 · h = 105.', '((17 + 13) / 2) · h = 105.'], 2, 'Kasutame sama pindalaseost, kuid nüüd on tundmatuks kõrgus, mitte pindala.'),
      }),
    },
    parallelogram_included_angle_area: {
      id: 'parallelogram_included_angle_area', topic: 'areas', diagnosticIndex: 7,
      title: 'Rööpküliku kõrgus külje ja nurga abil',
      rules: [
        'Rööpküliku pindala on alus korda sellele alusele risti olev kõrgus.',
        'Kõrguse joonestamisel tekib täisnurkne kolmnurk: kõrvalkülg on hüpotenuus ja kõrgus on antud teravnurga vastaskaatet. Seega h = b · sin α.',
        '30° puhul sin 30° = 0,5. Ka sin 150° = 0,5: kõrguse kolmnurgas kasutatakse siis 30° teravnurka.',
      ],
      example: [
        'Rööpküliku alus on 10 cm, kõrvalkülg 12 cm ja nende vaheline nurk 30°. Leia pindala.',
        'Joonesta alusega risti kõrgus. Kõrguse kolmnurgas on 12 cm hüpotenuus; kõrgus on 30° nurga vastaskaatet.',
        'Kõrgus on 12 · sin 30° = 6 cm. Pindala on 10 · 6 = 60 cm².',
      ],
      practice: item('parallelogram_included_angle_area', 'practice', {
        prompt: 'Rööpküliku alus on 14 cm, kõrvalkülg 10 cm ja nende vaheline nurk 30°. Leia pindala.', unit: 'cm²', answer: 70,
        diagram: parallelogram(14, 10, 30),
        explanation: 'Kõrgus on 10 · sin 30° = 5 cm. Pindala on 14 · 5 = 70 cm².',
        reason: reason('Miks ei ole pindala 14 · 10 = 140 cm²?', ['Kaks külge tuleb hoopis liita.', '10 cm on kaldkülg; sellele alusele risti olev kõrgus on 5 cm.', 'Rööpküliku pindala on alati sama mis kolmnurga pindala.'], 1, 'Kahe külje korrutis oleks pindala siis, kui nende vaheline nurk oleks 90°.'),
      }),
      transfer: item('parallelogram_included_angle_area', 'transfer', {
        prompt: 'Rööpküliku küljed on 9 cm ja 12 cm ning nende vaheline nurk 150°. Leia pindala.', unit: 'cm²', answer: 54,
        diagram: parallelogram(9, 12, 150),
        explanation: 'Kõrguse täisnurkses kolmnurgas on teravnurk 180° − 150° = 30°. Kõrgus 12 · sin 30° = 6 cm ning pindala 9 · 6 = 54 cm².',
        reason: reason('Miks saab siin kasutada sin 30° väärtust?', ['Kõiki nurki võib pindala leidmisel asendada 30°-ga.', '150° on sama nurk mis 30°.', 'Kõrguse kolmnurga teravnurk on 180° − 150° = 30°, mille siinus on sama.'], 2, 'Kujundi lähisnurgad on 150° ja 30°. Kõrgus ei muutu, kui kasutame sobivas täisnurkses kolmnurgas 30° nurka.'),
      }),
      reserve: item('parallelogram_included_angle_area', 'reserve', {
        prompt: 'Rööpkülikukujulise pinna alus on 16 cm, kõrvalkülg 9 cm ning nende vaheline nurk 30°. Leia pindala.', unit: 'cm²', answer: 72,
        diagram: parallelogram(16, 9, 30),
        explanation: 'Kõrgus on 9 · 0,5 = 4,5 cm. Pindala on 16 · 4,5 = 72 cm².',
        reason: reason('Milline on 9 cm küljele vastav roll kõrguse kolmnurgas?', ['See on hüpotenuus; kõrgus 4,5 cm on 30° nurga vastaskaatet.', 'See on alati kõrgus.', 'See on alus, mis tuleb 16 cm-ga kokku liita.'], 0, 'Kõrgus asub valitud alusega risti. Kaldkülg on selles täisnurkses kolmnurgas pikem külg ehk hüpotenuus.'),
      }),
    },
    rectangle_perimeter_area: {
      id: 'rectangle_perimeter_area', topic: 'areas', optional: true,
      prerequisiteFor: ['rhombus_diagonal_area', 'trapezoid_base_height_area', 'parallelogram_included_angle_area'],
      title: 'Ümbermõõt või pindala?',
      rules: [
        'Ümbermõõt on piirjoone pikkus: liida kõik küljed. Ristküliku ümbermõõt P = 2(a + b).',
        'Pindala kirjeldab kaetud sisemust. Ristküliku pindala S = a · b.',
        'Piirjoont mõõdame näiteks sentimeetrites; kaetud pinda ruutsentimeetrites. Need vastavad eri küsimustele.',
      ],
      example: [
        'Ristkülikukujulise kaardi küljed on 5 cm ja 4 cm.',
        'Serva ümber kulgevat paela on vaja 5 + 4 + 5 + 4 = 18 cm. See on ümbermõõt.',
        'Kaarti katva paberi pindala on 5 · 4 = 20 cm². Üks vastus ei asenda teist.',
      ],
      practice: item('rectangle_perimeter_area', 'practice', {
        prompt: 'Ristküliku küljed on 9 cm ja 4 cm. Milline paar annab õigesti ümbermõõdu P ja pindala S?',
        choices: ['P = 13 cm; S = 36 cm²', 'P = 26 cm; S = 36 cm²', 'P = 36 cm; S = 26 cm²', 'P = 26 cm²; S = 36 cm'], answer: 1,
        diagram: rectangle(9, 4),
        explanation: 'Piirjoon: 9 + 4 + 9 + 4 = 26 cm. Sisemus: 9 · 4 = 36 cm².',
        reason: reason('Miks tuleb ümbermõõdu leidmisel 9 ja 4 mõlemat kaks korda arvestada?', ['Ristküliku neli külge on 9, 4, 9 ja 4 cm.', 'Pindalaühik sisaldab ruutu.', 'Kõik ristküliku küljed on sama pikad.'], 0, 'Ümbermõõt käib mööda kõiki nelja serva. Kaks eri pikkusega külge korduvad vastaskülgedena.'),
      }),
      transfer: item('rectangle_perimeter_area', 'transfer', {
        prompt: '8 cm × 5 cm ristkülikukujulisele sildile pannakse pael ümber serva ja kile kogu esiküljele. Kui palju on vaja paela ja kui suur on kile pindala?',
        choices: ['Paela 40 cm; kilet 26 cm²', 'Paela 13 cm; kilet 40 cm²', 'Paela 26 cm; kilet 40 cm²', 'Paela 26 cm; kilet 13 cm²'], answer: 2,
        diagram: rectangle(8, 5),
        explanation: 'Pael käib mööda nelja külge: 8 + 5 + 8 + 5 = 26 cm. Kile katab pinna: 8 · 5 = 40 cm².',
        reason: reason('Milline mõte aitab valida sobiva arvutuse?', ['Mõlema jaoks tuleb külgede pikkused korrutada.', 'Pael mõõdab piiri; kile katab sisemust.', 'Suurem arv peab alati olema pindala.'], 1, 'Valime arvutuse küsitud suuruse järgi, mitte selle järgi, kumb arv tundub suurem.'),
      }),
      reserve: item('rectangle_perimeter_area', 'reserve', {
        prompt: 'Ristküliku küljed on 11 cm ja 3 cm. Milline paar annab õigesti ümbermõõdu ja pindala?',
        choices: ['P = 28 cm; S = 33 cm²', 'P = 14 cm; S = 33 cm²', 'P = 33 cm; S = 28 cm²', 'P = 28 cm²; S = 33 cm'], answer: 0,
        diagram: rectangle(11, 3),
        explanation: 'P = 11 + 3 + 11 + 3 = 28 cm. S = 11 · 3 = 33 cm².',
        reason: reason('Millised ühikud sobivad vastustele?', ['Mõlemad on sentimeetrites.', 'Mõlemad on ruutsentimeetrites.', 'Ümbermõõt sentimeetrites, pindala ruutsentimeetrites.'], 2, 'Piirjoon on pikkus, kaetud sisemus on pindala.'),
      }),
    },
  };

  const api = {
    version: 1,
    created: '2026-11-11',
    interpretation: {
      reasonAfterSavedAnswer: true,
      noMasteryFromImmediateSuccess: true,
      reserveIsNotAutomaticallyDelayedRecall: true,
      noSchoolGradeConversion: true,
    },
    skills,
  };
  root.GeometrySprintTargets = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
