(function (root, factory) {
  'use strict';
  var content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  if (root) root.QuantContent = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Original teaching material. Questions 0–1 are diagnostics, 2–3 supported
  // applications and 4–5 transfer opportunities. A transfer item is not
  // automatically evidence of delayed or independent recall.
  return {
    version: 1,
    subjects: {
      maths: {
        key: 'hendrik-maths-v1',
        title: 'Matemaatika',
        topics: [
          {
            id: 'fractions_percentages',
            title: 'Osa, tervik ja protsent',
            english: 'Fractions, percentages and the denominator',
            why: 'Katsetulemuste ja pärilikkuse ülesannetes muudab vastust see, millisest rühmast räägitakse.',
            explanation: [
              'Alusta küsimusest: mis on siin tervik? Osa jagatud tervikuga annab osamäära. Protsendi saamiseks korruta osamäär 100-ga. Näiteks 0,25 tähendab 25%.',
              'Kui küsitakse tulemust tüdrukute hulgas, on nimetajas tüdrukute arv, mitte kogu klass. Samamoodi erinevad „kõigi järglaste hulgas” ja „tütarde hulgas”.',
              'Protsent ja protsendipunkt on erinevad. Muutus 20%-lt 30%-le on 10 protsendipunkti; suhteline kasv võrreldes algse 20%-ga on 50%.'
            ],
            worked: {
              prompt: '40 seemnest idaneb 12. Mitu protsenti seemnetest idanes?',
              steps: ['Tervik on kõik 40 külvatud seemet.', 'Osamäär on 12 / 40 = 0,30.', '0,30 × 100% = 30%.'],
              answer: 'Idanes 30% seemnetest.'
            },
            sources: [{title: 'Opiq: Matemaatika 7. klassile, murd ja protsent (õpiku sisukord)', url: 'https://www.opiq.ee/Kit/Details/524'}],
            questions: [
              {prompt: '24 rakust 6 on jagunemas. Mitu protsenti neist rakkudest on jagunemas?', options: ['4%', '25%', '40%', '75%'], answer: 1, explanation: 'Tervik on 24 rakku. 6 / 24 = 0,25 ehk 25%.', skill: 'part_of_whole'},
              {prompt: '150 õpilasest 20% tuleb kooli rattaga. Mitu õpilast see on?', options: ['20', '75', '30', '120'], answer: 2, explanation: '20% = 0,20. Arvuta 0,20 × 150 = 30.', skill: 'percentage_of_quantity'},
              {prompt: 'Katses idaneb 30 seemnest 9. Kui suur on idanenud seemnete osakaal?', options: ['30%', '9%', '70%', '90%'], answer: 0, explanation: '9 / 30 = 0,30. Idanenud seemnete osakaal on 30%.', skill: 'part_of_whole'},
              {prompt: '60 osalejast 45 lõpetab matka. Mitu protsenti osalejatest lõpetab?', options: ['15%', '45%', '60%', '75%'], answer: 3, explanation: '45 / 60 = 3 / 4 = 0,75 ehk 75%.', skill: 'part_of_whole'},
              {prompt: 'Ühes katses suureneb idanemine 20%-lt 30%-le. Kui suur on muutus protsendipunktides?', options: ['50 protsendipunkti', '10 protsendipunkti', '30 protsendipunkti', '150 protsendipunkti'], answer: 1, explanation: 'Protsendipunktide leidmiseks lahuta protsendimäärad: 30 − 20 = 10. Suhteline kasv oleks eraldi arvutus: 10 / 20 = 50%.', skill: 'percentage_points'},
              {prompt: 'Rühmas on 60 õpilast, neist 36 tüdrukud. 9 tüdrukut kannab prille. Mitu protsenti tüdrukutest kannab prille?', options: ['15%', '60%', '25%', '40%'], answer: 2, explanation: 'Küsitakse tüdrukute, mitte kogu rühma kohta. Seega 9 / 36 = 0,25 ehk 25%.', skill: 'conditional_denominator'}
            ]
          },
          {
            id: 'proportions',
            title: 'Võrdeline ja pöördvõrdeline muutus',
            english: 'Direct and inverse proportion',
            why: 'Sama arutlus aitab võrrelda hindu, liikumisaega ning gaasivahetuse pindala ja vahemaa mõju.',
            explanation: [
              'Võrdelise sõltuvuse korral muudab ühe suuruse korrutamine mingi teguriga teist sama teguriga. Kui ühikuhind ei muutu, maksab kolm korda suurem kogus kolm korda rohkem.',
              'Pöördvõrdelise sõltuvuse korral jagatakse teine suurus sama teguriga. Sama teepikkuse läbimisel tähendab kaks korda suurem ühtlane kiirus kaks korda väiksemat aega.',
              'Lihtsas gaasi difusiooni mudelis on ülekandekiirus võrdeline pindalaga A ja pöördvõrdeline kihi paksusega d: kiirus on võrdeline A / d. See võrdlus eeldab, et osarõhkude vahe, materjali omadused ja muud tegurid ei muutu.'
            ],
            worked: {
              prompt: 'Mudelis sõltub ülekandekiirus suhtest A / d. Pindala kahekordistub ja kihi paksus kolmekordistub. Muud tegurid ei muutu. Mis saab kiirusest?',
              steps: ['Pindala muutuse tegur on 2.', 'Paksuse muutuse tegur 3 läheb nimetajasse.', 'Uue ja vana kiiruse suhe on 2 / 3.'],
              answer: 'Uus kiirus on 2/3 varasemast ehk väiksem, mitte suurem.'
            },
            sources: [
              {title: 'Opiq: Matemaatika 7. klassile, võrdeline ja pöördvõrdeline sõltuvus (sisukord)', url: 'https://www.opiq.ee/Kit/Details/524'},
              {title: 'OpenStax Biology 2e: Gas Exchange across Respiratory Surfaces', url: 'https://openstax.org/books/biology-2e/pages/39-2-gas-exchange-across-respiratory-surfaces'}
            ],
            questions: [
              {prompt: '3 ühesugust vihikut maksab 6 eurot. Hind vihiku kohta ei muutu. Kui palju maksab 5 vihikut?', options: ['8 eurot', '15 eurot', '10 eurot', '30 eurot'], answer: 2, explanation: 'Üks vihik maksab 6 / 3 = 2 eurot. Viis vihikut maksab 5 × 2 = 10 eurot.', skill: 'direct_proportion'},
              {prompt: 'Sama teepikkus läbitakse kaks korda suurema ühtlase kiirusega. Kuidas muutub sõiduaeg?', options: ['Aeg väheneb poole võrra.', 'Aeg kahekordistub.', 'Aeg ei muutu.', 'Aeg suureneb neli korda.'], answer: 0, explanation: 'Aeg = teepikkus / kiirus. Kui sama teepikkuse juures kiirus kahekordistub, on aeg pool varasemast.', skill: 'inverse_proportion'},
              {prompt: 'Difusiooni mudelis kolmekordistub pindala. Kihi paksus, osarõhkude vahe ja materjali omadused ei muutu. Kuidas muutub gaasi ülekandekiirus?', options: ['Väheneb kolmandikuni.', 'Ei muutu.', 'Suureneb üheksa korda.', 'Suureneb kolm korda.'], answer: 3, explanation: 'Selles mudelis on kiirus pindalaga võrdeline. Kolmekordne pindala annab kolmekordse kiiruse, kui muud tegurid ei muutu.', skill: 'area_scaling'},
              {prompt: 'Samas difusiooni mudelis muutub kiht kaks korda paksemaks. Pindala ja muud tegurid ei muutu. Uus ülekandekiirus on…', options: ['kaks korda suurem.', 'pool varasemast.', 'sama suur.', 'neli korda väiksem.'], answer: 1, explanation: 'Kiirus on paksusega pöördvõrdeline. Kaks korda paksem kiht annab poole varasemast kiirusest.', skill: 'thickness_scaling'},
              {prompt: 'Labori mudelis sõltub ülekandekiirus suhtest A / d. Pindala kahekordistub, aga kihi paksus neljakordistub. Kõik muu jääb samaks. Mis on uus kiirus võrreldes vanaga?', options: ['1/2 varasemast', '2 korda varasem', '4 korda varasem', '8 korda varasem'], answer: 0, explanation: 'Mõjud tuleb ühendada: 2 / 4 = 1/2. Suurem pindala ei korva selles näites täielikult paksemat kihti.', skill: 'combined_scaling'},
              {prompt: '900 mL vee ülekandmisel suureneb püsiv voolukiirus 25 mL/min-lt 75 mL/min-le. Kuidas muutub kogu vee ülekandmise aeg?', options: ['Kahekordistub.', 'Kolmekordistub.', 'Väheneb kolmandikuni.', 'Ei muutu.'], answer: 2, explanation: 'Voolukiirus suureneb kolm korda. Sama mahu aeg väheneb kolmandikuni: 900 / 25 = 36 min ja 900 / 75 = 12 min.', skill: 'inverse_rate_time'}
            ]
          },
          {
            id: 'formulas_units',
            title: 'Valemist puuduva suuruseni',
            english: 'Rearranging formulas and checking units',
            why: 'Ühest seosest saab leida eri suurusi; ühikud aitavad märgata valesti valitud tehet.',
            explanation: [
              'Kirjuta kõigepealt seos ja märgi otsitav suurus. Kui v = s / t, siis s = v × t ja t = s / v. Võrrandi mõlemale poolele tuleb teha sama tehe.',
              'Kontrolli ühikuid. Meetrite jagamine sekunditega annab m/s. Džaulide jagamine vattidega annab sekundeid, sest 1 W = 1 J/s.',
              'Arvutamiseks peavad ühikud omavahel sobima. Kui kiirus on mm/s ja vahemaa mm, saad aja sekundites. Kui ühikud ei sobi, teisenda need enne arvutamist.'
            ],
            worked: {
              prompt: 'Seade kannab üle 240 J energiat keskmise võimsusega 12 W. Leia aeg, kasutades P = E / t.',
              steps: ['Korruta mõlemad pooled ajaga: P × t = E.', 'Jaga mõlemad pooled võimsusega: t = E / P.', 't = 240 J / 12 W = 20 s, sest W = J/s.'],
              answer: 'Aeg on 20 sekundit.'
            },
            sources: [
              {title: 'Opiq: Matemaatika 7. klassile, võrrandid ja sõltuvused (sisukord)', url: 'https://www.opiq.ee/Kit/Details/524'},
              {title: 'Füüsika 8. klassile: liikumine, tihedus ja võimsus', url: 'https://opik.fyysika.ee/index.php/book/view/36'}
            ],
            questions: [
              {prompt: 'Jooksja läbib 120 m 30 sekundiga. Mis on tema keskmine kiirus, kui v = s / t?', options: ['4 m/s', '0,25 m/s', '90 m/s', '3600 m/s'], answer: 0, explanation: 'v = 120 m / 30 s = 4 m/s. Vahemaa jagatakse ajaga.', skill: 'substitution_speed'},
              {prompt: 'Tihedus on rho = m / V. Milline avaldis annab sellest seosest massi m?', options: ['m = rho / V', 'm = V / rho', 'm = rho − V', 'm = rho × V'], answer: 3, explanation: 'Korruta võrrandi mõlemad pooled ruumalaga V: rho × V = m.', skill: 'rearrange_product'},
              {prompt: 'Lamp kasutab 600 J energiat keskmise võimsusega 30 W. Kui P = E / t, siis kui kaua lamp töötas?', options: ['18 000 s', '20 s', '0,05 s', '570 s'], answer: 1, explanation: 't = E / P = 600 J / 30 W = 20 s.', skill: 'rearrange_time'},
              {prompt: '0,5 L lahuses on 3 g ainet. Kui massikontsentratsioon c = m / V, siis milline on c?', options: ['1,5 g/L', '0,167 g/L', '6 g/L', '3,5 g/L'], answer: 2, explanation: 'c = 3 g / 0,5 L = 6 g/L. Pooles liitris oleva massi kahekordistamine annab massi ühe liitri kohta.', skill: 'substitution_concentration'},
              {prompt: 'Mikroskoobi all liigub osake ühtlaselt kiirusega 0,4 mm/s. Kui kaua kulub 12 mm läbimiseks?', options: ['30 s', '4,8 s', '0,033 s', '12,4 s'], answer: 0, explanation: 't = s / v = 12 mm / (0,4 mm/s) = 30 s. Millimeetrid taanduvad ja järele jäävad sekundid.', skill: 'transfer_time_units'},
              {prompt: 'Vedeliku tihedus on 1,2 g/mL ja ruumala 150 mL. Leia mass seosest rho = m / V.', options: ['125 g', '0,008 g', '180 g', '151,2 g'], answer: 2, explanation: 'm = rho × V = 1,2 g/mL × 150 mL = 180 g. mL taandub; vastuse ühik on gramm.', skill: 'transfer_density_mass'}
            ]
          },
          {
            id: 'probability_conditions',
            title: 'Tõenäosus: millise tingimusega?',
            english: 'Probability, conditions and independence',
            why: 'Pärilikkuse küsimuses tuleb eristada võimalikku tulemust, küsitud rühma ja sündmuste sõltumatust.',
            explanation: [
              'Kui kõik elementaarsed tulemused on võrdselt võimalikud, on tõenäosus sobivate tulemuste arv jagatud kõigi tulemuste arvuga. Eri nimetusega tulemused ei pruugi olla võrdselt tõenäolised.',
              'Tingimus muudab vaadeldavat rühma. „Prille kandvate tüdrukute osakaal tüdrukute hulgas” kasutab nimetajana tüdrukute arvu. Sõna „hulgas” aitab leida õige terviku.',
              'Kahe sündmuse ühist tõenäosust võib arvutada esimese tõenäosuse ja sellele järgneva tingimusliku tõenäosuse korrutisena. Sõltumatute sündmuste korral teine tõenäosus esimese tulemusest ei muutu. Ilma tagasipanekuta loosimisel see tavaliselt muutub.'
            ],
            worked: {
              prompt: 'Kotis on 4 rohelist ja 2 kollast kuuli. Võetakse juhuslikult kaks kuuli, esimest tagasi panemata. Kui tõenäoline on saada kaks rohelist?',
              steps: ['Esimese rohelise tõenäosus on 4/6.', 'Pärast rohelist jääb alles 3 rohelist kuuli 5 kuuli hulgas: teise tõenäosus on 3/5.', 'Ühine tõenäosus on (4/6) × (3/5) = 12/30 = 2/5.'],
              answer: 'Tõenäosus on 2/5 ehk 40%. Teine loosimine sõltub esimesest.'
            },
            sources: [
              {title: 'Opiq: Matemaatika 11. klassile, tõenäosuse teemad (sisukord)', url: 'https://www.opiq.ee/Kit/Details/490'},
              {title: 'Opiq: Kombinatoorika, tasuta tutvumispeatükk', url: 'https://www.opiq.ee/kit/490/chapter/27023'}
            ],
            questions: [
              {prompt: 'Kotis on 3 sinist ja 2 punast ühesuguse kujuga kuuli. Iga kuuli väljavõtmine on sama tõenäoline. Kui suur on sinise kuuli saamise tõenäosus?', options: ['1/2', '2/5', '3/5', '3/2'], answer: 2, explanation: 'Siniseid kuule on 3 ja kokku kuule 5. Seega tõenäosus on 3/5. Kaks värvi ei tähenda, et värvid oleksid võrdselt tõenäolised.', skill: 'equally_likely_outcomes'},
              {prompt: 'Klassis on 12 tüdrukut ja 8 poissi. 6 tüdrukut kannab prille. Üks tüdruk valitakse juhuslikult. Kui suur on tõenäosus, et ta kannab prille?', options: ['1/2', '3/10', '6/8', '12/20'], answer: 0, explanation: 'Valik tehakse 12 tüdruku hulgast. Sobivaid on 6, seega 6/12 = 1/2. Poisse sellesse nimetajasse ei lisata.', skill: 'conditional_group'},
              {prompt: 'Õiglast münti visatakse kaks korda sõltumatult. Kui suur on kahe kulli tõenäosus?', options: ['1', '1/2', '0', '1/4'], answer: 3, explanation: 'Iga viske kulli tõenäosus on 1/2 ja visked on sõltumatud: 1/2 × 1/2 = 1/4.', skill: 'independent_events'},
              {prompt: 'Lihtsas pärilikkuse mudelis annab üks vanem järglasele võrdse tõenäosusega alleeli A või a. Teine vanem annab alati a. Kui suur on kombinatsiooni Aa tõenäosus?', options: ['1/4', '1/2', '3/4', '1'], answer: 1, explanation: 'Aa tekib siis, kui esimene vanem annab A. Selle tõenäosus on 1/2; teiselt tuleb a kindlasti.', skill: 'inheritance_outcomes'},
              {prompt: 'Kotis on 2 punast ja 1 sinine kuul. Võetakse juhuslikult kaks kuuli ilma tagasipanekuta. Kui suur on kahe punase tõenäosus?', options: ['4/9', '2/3', '1/3', '1/2'], answer: 2, explanation: 'Esimene punane: 2/3. Pärast seda on üks punane kahe kuuli hulgas: 1/2. Korrutis on 2/3 × 1/2 = 1/3, mitte 2/3 × 2/3.', skill: 'dependent_events'},
              {prompt: 'Ülesande mudelis on tütre sünni tõenäosus 1/2 ja tunnuse esinemise tõenäosus 1/4. Ülesanne ütleb, et need sündmused on sõltumatud. Kui suur on tõenäosus saada tütar, kellel tunnus esineb?', options: ['1/4', '1/8', '3/4', '1/2'], answer: 1, explanation: 'Küsitakse mõlemat sündmust korraga. Antud sõltumatuse eeldusel: 1/2 × 1/4 = 1/8. Ainult tütarde hulgas oleks tunnuse tõenäosus 1/4.', skill: 'joint_vs_conditional'}
            ]
          },
{
  "id": "plane_geometry",
  "title": "Tasandilised kujundid: küljed, nurgad ja pindala",
  "english": "Plane geometry: perimeter, area, angles and right triangles",
  "why": "Üks väike võimalus proovida geomeetria alustalasid. Joonista soovi korral ise lihtne skeem ja märgi antud suurused; selgituse võid avada ka enne vastamist.",
  "explanation": [
    "Ümbermõõt P (perimeter) on kujundi piirjoone pikkus: liida kõigi külgede pikkused. Pindala A (area) kirjeldab kujundi sisse jääva pinna suurust. Ristküliku (rectangle) külgedega a ja b on P = 2(a + b) ning A = a × b. Pikkuse ühik võib olla cm, pindala ühik aga cm².",
    "Rööpküliku (parallelogram) pindala on A = b × h. Kõrgus h (perpendicular height) mõõdetakse valitud alusega b risti; kaldkülg ei ole üldjuhul kõrgus. Sama aluse ja kõrgusega kolmnurga (triangle) pindala on pool sellest: A = b × h / 2.",
    "Kolmnurga sisenurkade summa on 180°. Kumera n-nurga (convex polygon) saab ühest tipust jagada n − 2 kolmnurgaks, seega tema sisenurkade summa on (n − 2) × 180°. Nelinurgal on summa 360°. Korrapärase hulknurga (regular polygon) kõik sisenurgad on võrdsed: ühe nurga leidmiseks jaga summa n-ga. Tavalise ebakorrapärase hulknurga nurgad ei pea olema võrdsed.",
    "Täisnurkses kolmnurgas (right triangle) on täisnurga vastaskülg hüpotenuus c (hypotenuse). Kahe kaateti a ja b (legs) ning hüpotenuusi seos on a² + b² = c². Hüpotenuusi pikkuse saamiseks võta summast ruutjuur. Pythagorase teoreemi ei tohi kasutada suvalise kolmnurga külgede kohta."
  ],
  "worked": {
    "prompt": "Ristkülikukujulise kaardi küljed on 6 cm ja 4 cm. Leia eraldi ümbermõõt ja pindala.",
    "steps": [
      "Ümbermõõt käib mööda kaardi nelja serva: P = 6 + 4 + 6 + 4 = 20 cm.",
      "Pindala katab kaardi sisemuse: A = 6 × 4 = 24 cm².",
      "Kontrolli ühikuid: serva pikkus on sentimeetrites, kaetud pind ruutsentimeetrites. Need on kaks erinevat suurust."
    ],
    "answer": "Ümbermõõt on 20 cm ja pindala 24 cm²."
  },
  "sources": [
    {
      "title": "Opiq: hulknurgad ja rööpküliku pindala (sisukord; peatükid võivad vajada tellimust)",
      "url": "https://www.opiq.ee/Kit/Details/524",
      "note": "Soovi korral vali 5.3 või 5.5. Vaata üht selgitust, sule see ja joonista oma näide koos nurkade või ristuva kõrgusega."
    },
    {
      "title": "OpenStax Prealgebra 2e: Rectangles, Triangles and Trapezoids",
      "url": "https://openstax.org/books/prealgebra-2e/pages/9-4-use-properties-of-rectangles-triangles-and-trapezoids"
    },
    {
      "title": "OpenStax Prealgebra 2e: Angles, Triangles and the Pythagorean Theorem",
      "url": "https://openstax.org/books/prealgebra-2e/pages/9-3-use-properties-of-angles-triangles-and-the-pythagorean-theorem"
    },
    {
      "title": "OpenStax Contemporary Mathematics: Polygons, Perimeter and Circumference",
      "url": "https://openstax.org/books/contemporary-mathematics/pages/10-4-polygons-perimeter-and-circumference"
    }
  ],
  "questions": [
    {
      "prompt": "Ristküliku küljed on 7 cm ja 4 cm. Milline paar annab õigesti ümbermõõdu P ja pindala A?",
      "options": [
        "P = 11 cm; A = 28 cm²",
        "P = 22 cm; A = 28 cm²",
        "P = 28 cm; A = 22 cm²",
        "P = 22 cm; A = 11 cm²"
      ],
      "answer": 1,
      "explanation": "Ümbermõõt on kõigi nelja külje summa: P = 2 × (7 + 4) = 22 cm. Pindala on A = 7 × 4 = 28 cm². Ümbermõõdu ja pindala ühikud on erinevad.",
      "skill": "rectangle_perimeter_area"
    },
    {
      "prompt": "Kumera nelinurga kolm sisenurka on 80°, 95° ja 110°. Kui suur on neljas sisenurk?",
      "options": [
        "65°",
        "95°",
        "75°",
        "105°"
      ],
      "answer": 2,
      "explanation": "Nelinurga sisenurkade summa on 360°. Antud nurkade summa on 80 + 95 + 110 = 285°. Puuduv nurk on 360 − 285 = 75°.",
      "skill": "quadrilateral_missing_angle"
    },
    {
      "prompt": "Ristküliku pikkus on 5 cm ja laius 3 cm. Kasuta pindala seost A = pikkus × laius. Kui suur on pindala?",
      "options": [
        "15 cm²",
        "8 cm²",
        "16 cm²",
        "15 cm"
      ],
      "answer": 0,
      "explanation": "A = 5 cm × 3 cm = 15 cm². Korrutame kaks pikkust, seega vastus on pindalaühikus cm². Arv 16 cm oleks selle ristküliku ümbermõõt.",
      "skill": "rectangle_area_supported"
    },
    {
      "prompt": "Rööpküliku alus on 9 cm, sellele alusele risti mõõdetud kõrgus 4 cm ja kaldkülg 5 cm. Kui suur on rööpküliku pindala?",
      "options": [
        "45 cm²",
        "18 cm²",
        "28 cm²",
        "36 cm²"
      ],
      "answer": 3,
      "explanation": "Pindala jaoks korruta alus ristuva kõrgusega: A = 9 × 4 = 36 cm². Kaldkülge 5 cm selles valemis kõrguse asemel ei kasutata. Poolitamine annaks sama aluse ja kõrgusega kolmnurga pindala.",
      "skill": "parallelogram_perpendicular_height"
    },
    {
      "prompt": "Ristkülikukujulise plaadi küljed on 6 cm ja 8 cm. Kui pikk on ühest nurgast vastasnurka tõmmatud diagonaal?",
      "options": [
        "14 cm",
        "100 cm",
        "10 cm",
        "48 cm"
      ],
      "answer": 2,
      "explanation": "Diagonaal moodustab külgedega täisnurkse kolmnurga. d² = 6² + 8² = 36 + 64 = 100 cm², seega d = √100 = 10 cm. Arv 100 kirjeldab siin pikkuse ruutu, mitte pikkust.",
      "skill": "pythagorean_diagonal_transfer"
    },
    {
      "prompt": "Korrapärase viisnurga kõik sisenurgad on võrdsed. Kui suur on üks sisenurk?",
      "options": [
        "72°",
        "108°",
        "120°",
        "540°"
      ],
      "answer": 1,
      "explanation": "Viisnurga sisenurkade summa on (5 − 2) × 180° = 540°. Korrapärase viisnurga viis nurka on võrdsed, seega üks nurk on 540° / 5 = 108°. 72° oleks selle kujundi välisnurk, mitte küsitud sisenurk.",
      "skill": "regular_polygon_angle_transfer"
    }
  ]
}
        ]
      },
      physics: {
        key: 'hendrik-physics-v1',
        title: 'Füüsika',
        topics: [
          {
            id: 'units_scale',
            title: 'Ühikud ja mõõtkava',
            english: 'Units, prefixes and scale',
            why: 'Rakkude mõõtmed, vedelike mahud ja elektrilised suurused vajavad samu täpseid ühikuteisendusi.',
            explanation: [
              'Eesliide ütleb, mitu põhiühikut suurus sisaldab: kilo tähendab 1000, milli 0,001 ja mikro 0,000001. Näiteks 1 mm = 1000 mikromeetrit (µm).',
              'Teisendamisel muutub arv, mitte mõõdetud kogus. 2 mL ja 0,002 L tähistavad sama mahtu. 1 cm³ = 1 mL on mahuühikute täpne seos.',
              'Pindala teisendamisel tuleb pikkuse teisendustegur ruutu võtta, ruumala puhul kuupi. Kuna 1 cm = 0,01 m, on 1 cm² = 0,0001 m², mitte 0,01 m².'
            ],
            worked: {
              prompt: 'Raku pikkus on 250 µm. Kirjuta see millimeetrites.',
              steps: ['1 mm = 1000 µm.', 'Millimeetrites arvu saamiseks jaga mikromeetrite arv 1000-ga.', '250 / 1000 = 0,25.'],
              answer: '250 µm = 0,25 mm.'
            },
            sources: [{title: 'TÜ soovitatud õpik: Sissejuhatus füüsikasse. Kulgliikumise kinemaatika', url: 'https://opik.fyysika.ee/index.php/book/view/77'}],
            questions: [
              {prompt: 'Kui palju on 2,5 mL liitrites?', options: ['0,25 L', '0,0025 L', '2500 L', '0,025 L'], answer: 1, explanation: '1 mL = 0,001 L. Seega 2,5 mL = 2,5 × 0,001 L = 0,0025 L.', skill: 'volume_prefix'},
              {prompt: 'Kui palju on 3000 µm millimeetrites?', options: ['3 mm', '0,003 mm', '30 mm', '3 000 000 mm'], answer: 0, explanation: '1000 µm = 1 mm. Seega 3000 µm = 3 mm.', skill: 'micro_to_milli'},
              {prompt: 'Seadme voolutugevus on 0,4 A. Milline on sama voolutugevus milliamprites?', options: ['0,0004 mA', '4 mA', '40 mA', '400 mA'], answer: 3, explanation: '1 A = 1000 mA. 0,4 × 1000 = 400 mA.', skill: 'current_prefix'},
              {prompt: 'Ülekantud energia on 5 kJ. Mitu džauli see on?', options: ['0,005 J', '500 J', '5000 J', '50 J'], answer: 2, explanation: 'Kilo tähendab 1000. 5 kJ = 5 × 1000 J = 5000 J.', skill: 'energy_prefix'},
              {prompt: 'Mikroskoobipildil on ruudukujulise ala külg 200 µm. Kui suur on selle ala pindala mm²-des?', options: ['0,2 mm²', '0,04 mm²', '40 mm²', '4 mm²'], answer: 1, explanation: '200 µm = 0,2 mm. Ruudu pindala on 0,2 mm × 0,2 mm = 0,04 mm². Teisendada tuleb mõlemad mõõtmed.', skill: 'area_conversion'},
              {prompt: 'Väikese anuma ruumala on 2 cm³. Kui palju vett mahub sellesse milliliitrites?', options: ['2 mL', '20 mL', '0,002 mL', '2000 mL'], answer: 0, explanation: '1 cm³ = 1 mL. Seega 2 cm³ = 2 mL. See on mahuühikute seos ega sõltu vedeliku tihedusest.', skill: 'cubic_volume_conversion'}
            ]
          },
          {
            id: 'pressure',
            title: 'Rõhk ja rõhkude vahe',
            english: 'Pressure and pressure differences',
            why: 'Rõhk seob jõu ja pindala; rõhkude erinevused aitavad mõista ka hingamist ja vedelike liikumist.',
            explanation: [
              'Pinnale risti mõjuva jõu korral on keskmine rõhk p = F / A. Ühik paskal on 1 Pa = 1 N/m². Sama jõud väiksemal pinnal annab suurema rõhu.',
              'Paigalseisvas ühtlase tihedusega vedelikus annab sügavuse muutus rõhu muutuse delta p = rho × g × h. Kogurõhk sisaldab lisaks vedeliku pinnale mõjuvat rõhku. Kui ülesanne lubab, kasuta g = 10 N/kg.',
              'Avatud ühenduse korral võib rõhkude vahe tekitada vedeliku või gaasi üldise voolu kõrgema rõhu poolt madalama poole. Hapniku difusiooni läbi membraani kirjeldab aga hapniku osarõhkude vahe; seda ei tohi samastada kogu õhu voolamisega.'
            ],
            worked: {
              prompt: 'Padi jaotab 120 N suuruse pinnaga risti mõjuva jõu ühtlaselt 0,06 m² suurusele alale. Leia keskmine rõhk.',
              steps: ['Kasuta p = F / A.', 'p = 120 N / 0,06 m².', '120 / 0,06 = 2000 ning N/m² = Pa.'],
              answer: 'Keskmine rõhk on 2000 Pa.'
            },
            sources: [
              {title: 'Füüsika 8. klassile: rõhk ja rõhk vedelikes', url: 'https://opik.fyysika.ee/index.php/book/view/36'},
              {title: 'OpenStax Biology 2e: Gas Exchange across Respiratory Surfaces', url: 'https://openstax.org/books/biology-2e/pages/39-2-gas-exchange-across-respiratory-surfaces'}
            ],
            questions: [
              {prompt: '40 N suurune jõud mõjub pinnaga risti 0,02 m² alale. Mis on keskmine rõhk?', options: ['0,8 Pa', '20 Pa', '2000 Pa', '4000 Pa'], answer: 2, explanation: 'p = F / A = 40 / 0,02 = 2000 Pa.', skill: 'force_area_pressure'},
              {prompt: 'Sama suur jõud jaotatakse kaks korda suuremale pindalale. Kuidas muutub keskmine rõhk?', options: ['Väheneb poole võrra.', 'Kahekordistub.', 'Ei muutu.', 'Suureneb neli korda.'], answer: 0, explanation: 'p = F / A. Kui jõud jääb samaks ja pindala kahekordistub, on rõhk pool varasemast.', skill: 'pressure_area_relation'},
              {prompt: 'Karp avaldab lauale pinnaga risti 90 N jõudu. Toetuspindala on 0,03 m². Leia keskmine rõhk.', options: ['2,7 Pa', '3000 Pa', '270 Pa', '30 Pa'], answer: 1, explanation: 'p = 90 N / 0,03 m² = 3000 Pa. Rõhu leidmisel jõudu pindalaga ei korrutata.', skill: 'force_area_pressure'},
              {prompt: 'Kui palju suureneb rõhk vees 0,4 m sügavamale liikudes? Kasuta rho = 1000 kg/m³ ja g = 10 N/kg.', options: ['40 Pa', '400 Pa', '25 000 Pa', '4000 Pa'], answer: 3, explanation: 'Rõhu suurenemine on rho × g × h = 1000 × 10 × 0,4 = 4000 Pa. See on muutus, mitte koos õhurõhuga arvutatud kogurõhk.', skill: 'hydrostatic_difference'},
              {prompt: 'Lihtsas hingamismudelis on avatud õhutee välisotsa rõhk 101 000 Pa ja kopsupoolse otsa rõhk 100 800 Pa. Mis suunas liigub õhk selle rõhkude vahe toimel?', options: ['Väljast kopsu poole.', 'Kopsust väljapoole.', 'Õhk ei saa liikuda, sest mõlemad rõhud on positiivsed.', 'Suunda ei saa rõhkude võrdlemisel kunagi määrata.'], answer: 0, explanation: 'Välisrõhk on 200 Pa kõrgem. Avatud õhutees suunab see rõhkude vahe üldise õhuvoolu kopsu poole.', skill: 'bulk_flow_direction'},
              {prompt: 'Hapniku osarõhk on alveoolis 13 kPa ja selle kõrval veres 5 kPa. Membraan laseb hapnikku läbi. Millises suunas toimub hapniku netodifusioon?', options: ['Verest alveooli, sest 5 on väiksem kui 13.', 'Mõlemas suunas täpselt võrdselt, sest kogurõhku pole antud.', 'Alveoolist verre, kõrgema hapniku osarõhu poolt madalama poole.', 'Hapnik saab liikuda ainult koos kogu õhuvooluga.'], answer: 2, explanation: 'Hapniku netodifusiooni suuna määrab siin hapniku osarõhkude erinevus: 13 kPa poolt 5 kPa poole. See ei ole sama protsess mis kogu õhu voolamine õhutees.', skill: 'partial_pressure_diffusion'}
            ]
          },
          {
            id: 'energy_power',
            title: 'Energia, töö ja võimsus',
            english: 'Energy, work and power',
            why: 'Energia kogus ja selle ülekandmise kiirus on eri asjad nii seadmes kui lihase töös.',
            explanation: [
              'Energiat ja tööd mõõdetakse džaulides (J). Kui muutumatu jõud mõjub nihkega samas suunas, on töö W = F × s. Teistes suundades ei sobi see lihtkuju ilma parandusteta.',
              'Keskmine võimsus on ülekantud energia või tehtud töö ajaühikus: P = delta E / delta t. 1 W = 1 J/s. Sama töö tegemine lühema ajaga tähendab suuremat keskmist võimsust.',
              'Energia ei kao: kasuliku töö kõrval võib energiat kanduda näiteks soojusena. Kasutegur = kasulik energia / kogu sisendenergia. ATP ei ole energia ise; rakus seovad ATP-ga seotud reaktsioonid energia ülekande teiste protsessidega.'
            ],
            worked: {
              prompt: 'Mootor tõmbab koormat muutumatu 20 N jõuga 3 m jõu suunas. See võtab 10 s. Leia töö ja keskmine võimsus.',
              steps: ['Töö W = F × s = 20 N × 3 m = 60 J.', 'Keskmine võimsus P = W / t.', 'P = 60 J / 10 s = 6 W.'],
              answer: 'Töö on 60 J ja keskmine võimsus 6 W.'
            },
            sources: [{title: 'Füüsika 8. klassile: mehaaniline töö, energia, võimsus ja kasutegur', url: 'https://opik.fyysika.ee/index.php/book/view/36'}],
            questions: [
              {prompt: 'Seade kannab 6 sekundiga üle 120 J energiat. Milline on keskmine võimsus?', options: ['720 W', '0,05 W', '20 W', '126 W'], answer: 2, explanation: 'P = delta E / delta t = 120 J / 6 s = 20 W.', skill: 'power_from_energy_time'},
              {prompt: 'Milline paar seob suuruse õige ühikuga?', options: ['Energia – J; võimsus – W.', 'Energia – W; võimsus – J.', 'Energia – N; võimsus – m.', 'Energia – Pa; võimsus – kg.'], answer: 0, explanation: 'Energia ühik on džaul (J). Võimsuse ühik on vatt (W), mis tähendab džauli sekundis.', skill: 'energy_power_units'},
              {prompt: 'Muutumatu 15 N jõud tõmbab kelku 4 m jõuga samas suunas. Kui suur on selle jõu töö?', options: ['3,75 J', '19 J', '11 J', '60 J'], answer: 3, explanation: 'Jõud on muutumatu ja nihkega samas suunas, seega W = F × s = 15 × 4 = 60 J.', skill: 'mechanical_work'},
              {prompt: 'Pump teeb 20 sekundiga 600 J kasulikku tööd. Milline on selle töö keskmine võimsus?', options: ['12 000 W', '30 W', '0,033 W', '620 W'], answer: 1, explanation: 'P = W / t = 600 J / 20 s = 30 W. Siin küsitakse kasuliku töö, mitte kogu sisendi võimsust.', skill: 'power_from_work_time'},
              {prompt: 'Seade saab 1000 J elektrienergiat ja annab 250 J kasulikku mehaanilist energiat. Kui suur on kasutegur?', options: ['4%', '75%', '25%', '400%'], answer: 2, explanation: 'Kasutegur = 250 / 1000 = 0,25 ehk 25%. Ülejäänud energia ei kao; see kandub teistesse vormidesse või mujale.', skill: 'efficiency'},
              {prompt: 'Kaks mootorit teevad kumbki 90 J tööd. Esimene teeb seda 3 s ja teine 6 s jooksul. Kuidas võrdub teise mootori keskmine võimsus esimese omaga?', options: ['See on poole väiksem.', 'See on kaks korda suurem.', 'See on sama suur, sest töö on sama.', 'See on neli korda suurem.'], answer: 0, explanation: 'Esimese võimsus on 90/3 = 30 W ja teise 90/6 = 15 W. Sama töö kaks korda pikema ajaga tähendab poolt võimsust.', skill: 'energy_vs_power_transfer'}
            ]
          },
          {
            id: 'electricity',
            title: 'Laeng, vool ja pinge',
            english: 'Charge, current and voltage',
            why: 'Need mõisted aitavad mõista nii kooli vooluringe kui ka seda, mida närviraku elektriline signaal üldse tähendab.',
            explanation: [
              'Keskmine voolutugevus näitab, kui palju laengut läbib vaadeldavat ristlõiget ajaühikus: I = delta Q / delta t. Laengu ühik on kulon (C), voolutugevusel amper (A); 1 A = 1 C/s.',
              'Pinge on energia muutus laenguühiku kohta: 1 V = 1 J/C. Voolutugevus ei ole sama mis pinge. Oomilise takisti korral püsival temperatuuril kirjeldab neid seos I = U / R.',
              'Metalljuhtmes kannavad voolu elektronid, lahuses ja rakumembraani kanalites võivad seda teha ioonid. Närvirakk pole lihtsalt metalltraat: ioonide liikumist mõjutavad nii elektriline mõju kui ka kontsentratsioonide erinevus.'
            ],
            worked: {
              prompt: 'Oomilise takisti takistus püsib 4 oomi. Selle otste vahel on 12 V pinge. Leia voolutugevus.',
              steps: ['Kasuta I = U / R.', 'I = 12 V / 4 oomi.', '12 / 4 = 3.'],
              answer: 'Voolutugevus on 3 A.'
            },
            sources: [
              {title: 'Füüsika 9. klassile: elektrivool, pinge ja Ohmi seadus', url: 'https://opik.fyysika.ee/index.php/book/view/70'},
              {title: 'Opiq: Elekter ja magnetism, laengukandjad ja elektrivool vedelikes (sisukord)', url: 'https://www.opiq.ee/Kit/Details/408'}
            ],
            questions: [
              {prompt: 'Juhtme ristlõiget läbib 3 sekundiga 6 C laengut. Milline on keskmine voolutugevus?', options: ['18 A', '2 A', '0,5 A', '9 A'], answer: 1, explanation: 'I = delta Q / delta t = 6 C / 3 s = 2 A.', skill: 'charge_current'},
              {prompt: '3 C laengu liikumisel kantakse üle 12 J energiat. Kui suur on pinge?', options: ['36 V', '0,25 V', '9 V', '4 V'], answer: 3, explanation: 'Pinge = energia laenguühiku kohta: 12 J / 3 C = 4 V.', skill: 'energy_per_charge'},
              {prompt: 'Teist juhet läbib 3 sekundiga 9 C laengut. Leia keskmine voolutugevus.', options: ['3 A', '27 A', '0,333 A', '6 A'], answer: 0, explanation: 'I = 9 C / 3 s = 3 A. Laeng jagatakse ajaga.', skill: 'charge_current'},
              {prompt: 'Oomilise takisti takistus on püsival temperatuuril 3 oomi ja pinge 6 V. Leia voolutugevus.', options: ['18 A', '0,5 A', '2 A', '9 A'], answer: 2, explanation: 'I = U / R = 6 V / 3 oomi = 2 A. Ülesandes on antud Ohmi seaduse kasutamiseks sobiv mudel.', skill: 'ohms_law'},
              {prompt: 'Sama oomilise takisti pinge tõuseb 4 V-lt 12 V-le. Takistus ja temperatuur ei muutu. Kuidas muutub voolutugevus?', options: ['Väheneb kolmandikuni.', 'Ei muutu.', 'Suureneb üheksa korda.', 'Suureneb kolm korda.'], answer: 3, explanation: 'I = U / R. Pinge suureneb kolm korda ja R püsib sama, seega suureneb voolutugevus kolm korda.', skill: 'voltage_current_scaling'},
              {prompt: 'Rakumembraani avatud kanalis liiguvad naatriumioonid Na+. Milline väide on õige?', options: ['Elektrivoolu pole, sest voolu saavad kanda ainult elektronid.', 'Laetud ioonide liikumine võib kanda elektrivoolu.', 'Pinge ja voolutugevus on selles kanalis sama suurus.', 'Ioonide liikumist ei saa kontsentratsioonide erinevus mõjutada.'], answer: 1, explanation: 'Elektrivool on laengukandjate suunatud liikumine; kandjad võivad olla ka ioonid. Nende liikumist rakus mõjutavad nii elektriline mõju kui kontsentratsioonide erinevus.', skill: 'ionic_current_transfer'}
            ]
          },
          {
            id: 'atomic_photons',
            title: 'Aatom ja footon: valem sammhaaval',
            english: 'Quantum atomic model, photon energy and units',
            why: 'Seome suuruse, ühiku ja füüsikalise tähenduse. See on üks väike algusteema aatomifüüsikast, mitte kogu kursus. Võid avada selgituse enne vastamist.',
            explanation: [
              'Tänapäevane aatomimudel kirjeldab elektroni leidmise tõenäosusjaotust. Orbitaal ei ole kindel ringrada ümber tuuma. Seotud elektroni lubatud energiatasemed on diskreetsed; aatomi üleminekul kõrgemalt energiatasemelt madalamale võib kiirguda footon energiaga, mis võrdub tasemete vahega.',
              'Footon on elektromagnetkiirguse kvant. Ühe footoni energia E = h × f, kus f on sagedus hertsides (Hz = 1/s) ja h on Plancki konstant. Kasutame siin arvutustes ümardust h = 6,6 × 10⁻³⁴ J·s. Ühikukontroll: J·s × 1/s = J. Suurem sagedus tähendab suuremat ühe footoni energiat.',
              'Vaakumis c = f × λ, kus c = 3,0 × 10⁸ m/s ja λ on lainepikkus meetrites. Seega f = c / λ ja E = h × c / λ. Pikem lainepikkus tähendab väiksemat footoni energiat. Enne asendamist teisenda ühikud: 1 nm = 10⁻⁹ m, näiteks 600 nm = 6,0 × 10⁻⁷ m.',
              'Kirjuta antud suurused koos ühikutega, vali otsitavale suurusele sobiv valem, asenda arvud ja kontrolli ühikut. Arvuta arvkordajad ja kümne astmed eraldi. Kui aatom kiirgab tasemete energiavahe ΔE suuruse footoni, siis ΔE = h × f ning f = ΔE / h. See ei tähenda, et elektroni tee oleks klassikaline ringorbiit.'
            ],
            worked: {
              prompt: 'Valguse lainepikkus vaakumis on 600 nm. Leia ühe footoni energia. Kasuta c = 3,0 × 10⁸ m/s ja h = 6,6 × 10⁻³⁴ J·s.',
              steps: [
                'Teisenda: λ = 600 × 10⁻⁹ m = 6,0 × 10⁻⁷ m.',
                'Leia sagedus: f = c / λ = (3,0 × 10⁸) / (6,0 × 10⁻⁷) = 0,5 × 10¹⁵ Hz = 5,0 × 10¹⁴ Hz.',
                'Leia energia: E = h × f = (6,6 × 10⁻³⁴) × (5,0 × 10¹⁴) = 33 × 10⁻²⁰ J = 3,3 × 10⁻¹⁹ J.',
                'Kontrolli tähendust ja ühikut: vastus on ühe footoni energia džaulides. Kahekordse lainepikkuse korral oleks ühe footoni energia poole väiksem.'
              ],
              answer: 'Ühe footoni energia on ligikaudu 3,3 × 10⁻¹⁹ J.'
            },
            sources: [
              {title: 'OpenStax College Physics 2e: The Photoelectric Effect — footoni energia ja lainepikkus', url: 'https://openstax.org/books/college-physics-2e/pages/29-2-the-photoelectric-effect'},
              {title: 'OpenStax Chemistry 2e: Development of Quantum Theory — orbitaal ja tõenäosus', url: 'https://openstax.org/books/chemistry-2e/pages/6-3-development-of-quantum-theory'},
              {title: 'Opiq: Bohri aatomiehituse mudel — mudelite võrdlus (lisalugemine)', url: 'https://www.opiq.ee/kit/575/chapter/31962'}
            ],
            questions: [
              {prompt: 'Footoni energia arvutamiseks tahad kasutada c väärtust ühikus m/s. Lainepikkus on 450 nm. Milline on sama lainepikkus meetrites? 1 nm = 10⁻⁹ m.', options: ['4,5 × 10⁻⁹ m', '4,5 × 10⁻⁷ m', '4,5 × 10⁷ m', '4,5 × 10⁻⁶ m'], answer: 1, explanation: '450 nm = 450 × 10⁻⁹ m = 4,5 × 10⁻⁷ m. Arv muutub ühikuga koos, tegelik lainepikkus jääb samaks.', skill: 'photon_nm_to_metre'},
              {prompt: 'Milline kirjeldus sobib tänapäevase kvantmehaanilise aatomimudeliga?', options: ['Iga elektron peab liikuma mööda kindlat klassikalist ringorbiiti.', 'Orbitaal on koht aatomituumas, kus elektron alati paigal seisab.', 'Mudeli järgi puuduvad aatomil lubatud energiatasemed.', 'Mudel annab elektroni leidmise tõenäosusjaotuse, mitte kindla klassikalise ringraja.'], answer: 3, explanation: 'Orbitaal kirjeldab elektroni kvantolekut ja sellest saab leida asukoha tõenäosusjaotuse. See ei ole Bohri mudeli kindel ringorbiit. Seotud elektroni lubatud energiatasemed on diskreetsed.', skill: 'orbital_probability_model'},
              {prompt: 'Ühe footoni sagedus on 3,0 × 10¹⁴ Hz. Kasuta E = h × f ja h = 6,6 × 10⁻³⁴ J·s. Milline on selle footoni energia?', options: ['1,98 × 10⁻¹⁹ J', '1,98 × 10⁻⁴⁷ J', '2,2 × 10⁻⁴⁸ J', '1,98 × 10¹⁹ J'], answer: 0, explanation: 'E = 6,6 × 3,0 × 10⁻³⁴⁺¹⁴ J = 19,8 × 10⁻²⁰ J = 1,98 × 10⁻¹⁹ J. Sagedusega korrutatakse; astendajad liidetakse. J·s × Hz = J.', skill: 'photon_energy_from_frequency'},
              {prompt: 'Valguse lainepikkus vaakumis on 400 nm. Leia ühe footoni energia, kasutades E = h × c / λ, h = 6,6 × 10⁻³⁴ J·s ja c = 3,0 × 10⁸ m/s. 1 nm = 10⁻⁹ m.', options: ['4,95 × 10⁻²⁸ J', '1,65 × 10⁻¹⁹ J', '4,95 × 10⁻¹⁹ J', '7,92 × 10⁻³² J'], answer: 2, explanation: 'λ = 4,0 × 10⁻⁷ m. E = (6,6 × 10⁻³⁴ × 3,0 × 10⁸) / (4,0 × 10⁻⁷) J = 4,95 × 10⁻¹⁹ J. Jagamine nanomeetrite arvu 400-ga ilma ühikute teisenduseta annaks vale suurusjärgu.', skill: 'photon_energy_from_wavelength'},
              {prompt: 'Võrdled vaakumis kiirguvaid 300 nm ja 600 nm lainepikkusega footoneid. Kasuta E = h × c / λ. Kuidas võrdub ühe 600 nm footoni energia ühe 300 nm footoni energiaga?', options: ['See on kaks korda suurem.', 'See on sama suur.', 'See on neli korda suurem.', 'See on poole väiksem.'], answer: 3, explanation: 'Lainepikkus kahekordistub ja h ning c ei muutu. Energia on lainepikkusega pöördvõrdeline: E₆₀₀ / E₃₀₀ = 300 / 600 = 1/2. Võrdlus käib ühe footoni energia, mitte valgusallika koguvõimsuse kohta.', skill: 'photon_wavelength_energy_ratio'},
              {prompt: 'Aatom läheb kõrgemalt energiatasemelt madalamale ja kiirgab ühe footoni. Tasemete energiavahe on 3,96 × 10⁻¹⁹ J. Leia footoni sagedus seosest ΔE = h × f, kui h = 6,6 × 10⁻³⁴ J·s.', options: ['2,61 × 10⁻⁵² Hz', '6,0 × 10¹⁴ Hz', '1,67 × 10⁻¹⁵ Hz', '6,0 × 10⁻¹⁴ Hz'], answer: 1, explanation: 'Kiiratav footon viib ära tasemete energiavahe. f = ΔE / h = (3,96 / 6,6) × 10⁻¹⁹⁺³⁴ Hz = 0,6 × 10¹⁵ Hz = 6,0 × 10¹⁴ Hz. Energia jagatakse Plancki konstandiga; J / (J·s) = 1/s = Hz.', skill: 'atomic_transition_frequency'}
            ]
          }
        ]
      }
    }
  };
});
