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
            followupVersion: 1,
            followups: {
              "0": {
                "skill": "part_of_whole",
                "title": "Osa protsendina tervikust",
                "explanation": [
                  "Otsi kõigepealt tervik: kelle või mille hulgas osakaalu küsitakse? Võrdle soovitud osa selle tervikuga.",
                  "Osamäär = osa / tervik. Protsent kirjeldab sama suhet saja kohta, seega korruta osamäär 100-ga."
                ],
                "worked": {
                  "prompt": "Karbis on 20 pliiatsit, neist 8 punased. Mitu protsenti pliiatsitest on punased?",
                  "steps": [
                    "Tervik on 20 pliiatsit ja osa on 8.",
                    "8 / 20 × 100% = 40%."
                  ],
                  "answer": "Punased on 40% pliiatsitest."
                },
                "simpleIndex": 2,
                "applicationIndex": 3
              },
              "1": {
                "skill": "percentage_of_quantity",
                "title": "Protsendi leidmine kogusest",
                "explanation": [
                  "Protsent ütleb, mitu osa sajast võtame. Sama osamääraga suuremast tervikust saad rohkem esemeid.",
                  "Protsent tähendab sajandikku: 10% = 0,10. Osa = osamäär × tervik. Siin otsime esemete arvu, mitte protsendimäära."
                ],
                "worked": {
                  "prompt": "Leia 30% arvust 40.",
                  "steps": [
                    "30% tähendab kolme kümnendikku tervikust; tulemus peab olema väiksem kui 40.",
                    "30% = 0,30.",
                    "0,30 × 40 = 12."
                  ],
                  "answer": "Vastus on 12."
                },
                "simpleIndex": 6,
                "applicationIndex": 7
              },
              "4": {
                "skill": "percentage_points",
                "title": "Muutus protsendipunktides",
                "explanation": [
                  "Protsendipunktides muutus on uue ja vana protsendimäära vahe.",
                  "Selleks ei jagata muutust algse protsendimääraga; jagamine annaks suhtelise muutuse."
                ],
                "worked": {
                  "prompt": "Osakaal suureneb 35%-lt 50%-le. Kui suur on kasv protsendipunktides?",
                  "steps": [
                    "Lahuta uus ja vana protsendimäär: 50 − 35 = 15."
                  ],
                  "answer": "Kasv on 15 protsendipunkti."
                },
                "simpleIndex": 8,
                "applicationIndex": 9
              },
              "5": {
                "skill": "conditional_denominator",
                "title": "Protsent küsitud alarühmas",
                "explanation": [
                  "Sõnad „nende hulgas” määravad terviku. Alarühma osakaalu leidmisel on nimetajas selle alarühma suurus.",
                  "Kõrvalise rühma inimesi nimetajasse ei lisata."
                ],
                "worked": {
                  "prompt": "Klubis on 50 liiget, neist 20 noored. 6 noort mängib malet. Mitu protsenti noortest mängib malet?",
                  "steps": [
                    "Vaadeldav tervik on 20 noort, mitte 50 liiget.",
                    "6 / 20 × 100% = 30%."
                  ],
                  "answer": "Malet mängib 30% noortest."
                },
                "simpleIndex": 10,
                "applicationIndex": 11
              }
            },
            questions: [
              {prompt: '24 rakust 6 on jagunemas. Mitu protsenti neist rakkudest on jagunemas?', options: ['4%', '25%', '40%', '75%'], answer: 1, explanation: 'Tervik on 24 rakku. 6 / 24 = 0,25 ehk 25%.', skill: 'part_of_whole'},
              {prompt: '150 õpilasest 20% tuleb kooli rattaga. Mitu õpilast see on?', options: ['20', '75', '30', '120'], answer: 2, explanation: '20% = 0,20. Arvuta 0,20 × 150 = 30.', skill: 'percentage_of_quantity'},
              {prompt: 'Katses idaneb 30 seemnest 9. Kui suur on idanenud seemnete osakaal?', options: ['30%', '9%', '70%', '90%'], answer: 0, explanation: '9 / 30 = 0,30. Idanenud seemnete osakaal on 30%.', skill: 'part_of_whole'},
              {prompt: '60 osalejast 45 lõpetab matka. Mitu protsenti osalejatest lõpetab?', options: ['15%', '45%', '60%', '75%'], answer: 3, explanation: '45 / 60 = 3 / 4 = 0,75 ehk 75%.', skill: 'part_of_whole'},
              {prompt: 'Ühes katses suureneb idanemine 20%-lt 30%-le. Kui suur on muutus protsendipunktides?', options: ['50 protsendipunkti', '10 protsendipunkti', '30 protsendipunkti', '150 protsendipunkti'], answer: 1, explanation: 'Protsendipunktide leidmiseks lahuta protsendimäärad: 30 − 20 = 10. Suhteline kasv oleks eraldi arvutus: 10 / 20 = 50%.', skill: 'percentage_points'},
              {prompt: 'Rühmas on 60 õpilast, neist 36 tüdrukud. 9 tüdrukut kannab prille. Mitu protsenti tüdrukutest kannab prille?', options: ['15%', '60%', '25%', '40%'], answer: 2, explanation: 'Küsitakse tüdrukute, mitte kogu rühma kohta. Seega 9 / 36 = 0,25 ehk 25%.', skill: 'conditional_denominator'},
              {"prompt": "Leia 10% arvust 80. Kasuta 10% = 0,10.", "options": ["8", "10", "70", "800"], "answer": 0, "explanation": "0,10 × 80 = 8.", "skill": "percentage_of_quantity"},
              {"prompt": "Koolis on 240 õpilast. 15% neist laulab kooris. Mitu õpilast laulab kooris?", "options": ["15", "24", "36", "225"], "answer": 2, "explanation": "15% = 0,15; 0,15 × 240 = 36 õpilast.", "skill": "percentage_of_quantity"},
              {"prompt": "Osakaal kasvab 10%-lt 30%-le. Kui suur on kasv protsendipunktides?", "options": ["3 protsendipunkti", "20 protsendipunkti", "200 protsendipunkti", "40 protsendipunkti"], "answer": 1, "explanation": "30 − 10 = 20 protsendipunkti.", "skill": "percentage_points"},
              {"prompt": "Küsitluses langeb nõustujate osakaal 72%-lt 64%-le. Kui mitme protsendipunkti võrra see langeb?", "options": ["64 protsendipunkti", "12,5 protsendipunkti", "136 protsendipunkti", "8 protsendipunkti"], "answer": 3, "explanation": "Languse suurus on 72 − 64 = 8 protsendipunkti.", "skill": "percentage_points"},
              {"prompt": "Rühmas on 10 täiskasvanut ja 10 last. 5 last ujub. Mitu protsenti lastest ujub?", "options": ["25%", "5%", "50%", "75%"], "answer": 2, "explanation": "Tervik on 10 last. 5 / 10 × 100% = 50%.", "skill": "conditional_denominator"},
              {"prompt": "Koolis on 200 õpilast. 80 käib huviringis ja neist 28 robootikas. Mitu protsenti huviringis käijatest käib robootikas?", "options": ["14%", "35%", "28%", "65%"], "answer": 1, "explanation": "Nimetajas on 80 huviringis käijat: 28 / 80 × 100% = 35%.", "skill": "conditional_denominator"}
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
            followupVersion: 1,
            followups: {
              "0": {
                "skill": "direct_proportion",
                "title": "Võrdeline hind ja ühikuhind",
                "explanation": [
                  "Püsiva ühikuhinna korral on hind kogusega võrdeline.",
                  "Jaga koguhind esemete arvuga, et leida ühe eseme hind, ja korruta uue kogusega."
                ],
                "worked": {
                  "prompt": "4 ühesugust markerit maksab 12 eurot. Kui palju maksab 6 markerit sama tükihinnaga?",
                  "steps": [
                    "Ühe markeri hind on 12 / 4 = 3 eurot.",
                    "6 × 3 = 18 eurot."
                  ],
                  "answer": "Kuus markerit maksab 18 eurot."
                },
                "simpleIndex": 6,
                "applicationIndex": 7
              },
              "1": {
                "skill": "inverse_proportion",
                "title": "Sama teepikkuse aeg ja kiirus",
                "explanation": [
                  "Sama teepikkuse kiiremini läbimiseks kulub vähem aega. Kui ühtlane kiirus kahekordistub, kulub sama tee läbimiseks poole vähem aega.",
                  "Ühtlasel liikumisel t = s / v. Sama teepikkuse juures on aeg kiirusega pöördvõrdeline: kiiruse muutusteguriga tuleb aeg jagada."
                ],
                "worked": {
                  "prompt": "Sama marsruudi läbimiseks kulub 30 min. Ühtlane kiirus suureneb kolm korda. Kui kaua nüüd kulub?",
                  "steps": [
                    "Teepikkus jääb samaks.",
                    "Uus aeg = 30 / 3 = 10 min."
                  ],
                  "answer": "Nüüd kulub 10 min."
                },
                "simpleIndex": 8,
                "applicationIndex": 9
              },
              "4": {
                "skill": "combined_scaling",
                "title": "Kahe muutusteguri ühendamine",
                "explanation": [
                  "Suurem pindala soodustab ülekannet, paksem kiht takistab seda. Hinda mõlemat muutust eraldi, sest need võivad teineteist tugevdada või tasakaalustada.",
                  "Kui mudelis on kiirus võrdeline A / d, jaga pindala muutustegur paksuse muutusteguriga. Kõik muud mõjuvad suurused peavad jääma samaks."
                ],
                "worked": {
                  "prompt": "Mudel annab kiiruse võrdelisena A / d. A suureneb kolm korda ja d kaks korda. Kõik muu püsib. Leia uus kiirus vana suhtes.",
                  "steps": [
                    "Pindala kasv suurendab kiirust kolm korda, paksuse kasv vähendab seda kaks korda.",
                    "A tegur 3 läheb lugejasse ja d tegur 2 nimetajasse.",
                    "Uue ja vana kiiruse suhe on 3 / 2."
                  ],
                  "answer": "Uus kiirus on 1,5 korda varasem."
                },
                "simpleIndex": 10,
                "applicationIndex": 11
              },
              "5": {
                "skill": "inverse_rate_time",
                "title": "Kindla mahu ülekandmise aeg",
                "explanation": [
                  "Kui sama kogus vedelikku liigub igas minutis kiiremini läbi, saab ülekanne varem valmis. Kogus jääb samaks, muutub selle ülekandmiseks kuluv aeg.",
                  "Püsiva voolukiirusega aeg = maht / voolukiirus. Sama mahu juures jaga aeg voolukiiruse muutusteguriga; ühikud peavad sobima."
                ],
                "worked": {
                  "prompt": "120 mL vedelikku voolab kiirusega 20 mL/min. Uus voolukiirus on 60 mL/min. Kui pikk on uus aeg võrreldes vana ajaga?",
                  "steps": [
                    "Igas minutis liigub nüüd kolm korda rohkem vedelikku, seega sama koguse jaoks kulub kolmandik ajast.",
                    "Vana aeg on 120 / 20 = 6 min; uus aeg 120 / 60 = 2 min.",
                    "Uue ja vana aja suhe on 2 / 6 = 1/3."
                  ],
                  "answer": "Uus aeg on kolmandik varasemast."
                },
                "simpleIndex": 12,
                "applicationIndex": 13
              },
              "2": {
                "skill": "area_scaling",
                "title": "Pindala mõju ülekandekiirusele",
                "explanation": [
                  "Kui kiirus on pindalaga A võrdeline, korrutatakse kiirus sama teguriga kui pindala.",
                  "Difusiooni lihtmudelis kehtib see juhul, kui kihi paksus, osarõhkude vahe ja materjali omadused ei muutu."
                ],
                "worked": {
                  "prompt": "Mudelkiirus on pindalaga võrdeline. Pindala kasvab 2 cm²-lt 8 cm²-le ja kõik muud tegurid püsivad. Mis saab kiirusest?",
                  "steps": [
                    "Pindala tegur on 8 / 2 = 4.",
                    "Kiiruse tegur on samuti 4."
                  ],
                  "answer": "Kiirus suureneb neli korda."
                },
                "simpleIndex": 14,
                "applicationIndex": 15
              },
              "3": {
                "skill": "thickness_scaling",
                "title": "Kihi paksuse mõju ülekandekiirusele",
                "explanation": [
                  "Paksem kiht tähendab osakestele pikemat läbimise teed. Lihtsas difusioonimudelis vähendab see ülekandekiirust, kui pindala, osarõhkude vahe ja materjali omadused püsivad.",
                  "Kiirus on paksusega d pöördvõrdeline: jaga kiirus paksuse muutusteguriga."
                ],
                "worked": {
                  "prompt": "Mudelis on kiirus pöördvõrdeline paksusega. Paksus suureneb neli korda ja muud tegurid püsivad. Mis on uus kiirus vana suhtes?",
                  "steps": [
                    "Paksem kiht peab selles mudelis andma väiksema, mitte suurema ülekandekiiruse.",
                    "Paksuse tegur on 4; kiiruse tegur on 1 / 4."
                  ],
                  "answer": "Uus kiirus on neljandik varasemast."
                },
                "simpleIndex": 16,
                "applicationIndex": 17
              }
            },
            questions: [
              {prompt: '3 ühesugust vihikut maksab 6 eurot. Hind vihiku kohta ei muutu. Kui palju maksab 5 vihikut?', options: ['8 eurot', '15 eurot', '10 eurot', '30 eurot'], answer: 2, explanation: 'Üks vihik maksab 6 / 3 = 2 eurot. Viis vihikut maksab 5 × 2 = 10 eurot.', skill: 'direct_proportion'},
              {prompt: 'Sama teepikkus läbitakse kaks korda suurema ühtlase kiirusega. Kuidas muutub sõiduaeg?', options: ['Aeg väheneb poole võrra.', 'Aeg kahekordistub.', 'Aeg ei muutu.', 'Aeg suureneb neli korda.'], answer: 0, explanation: 'Aeg = teepikkus / kiirus. Kui sama teepikkuse juures kiirus kahekordistub, on aeg pool varasemast.', skill: 'inverse_proportion'},
              {prompt: 'Difusiooni mudelis kolmekordistub pindala. Kihi paksus, osarõhkude vahe ja materjali omadused ei muutu. Kuidas muutub gaasi ülekandekiirus?', options: ['Väheneb kolmandikuni.', 'Ei muutu.', 'Suureneb üheksa korda.', 'Suureneb kolm korda.'], answer: 3, explanation: 'Selles mudelis on kiirus pindalaga võrdeline. Kolmekordne pindala annab kolmekordse kiiruse, kui muud tegurid ei muutu.', skill: 'area_scaling'},
              {prompt: 'Samas difusiooni mudelis muutub kiht kaks korda paksemaks. Pindala ja muud tegurid ei muutu. Uus ülekandekiirus on…', options: ['kaks korda suurem.', 'pool varasemast.', 'sama suur.', 'neli korda väiksem.'], answer: 1, explanation: 'Kiirus on paksusega pöördvõrdeline. Kaks korda paksem kiht annab poole varasemast kiirusest.', skill: 'thickness_scaling'},
              {prompt: 'Labori mudelis sõltub ülekandekiirus suhtest A / d. Pindala kahekordistub, aga kihi paksus neljakordistub. Kõik muu jääb samaks. Mis on uus kiirus võrreldes vanaga?', options: ['1/2 varasemast', '2 korda varasem', '4 korda varasem', '8 korda varasem'], answer: 0, explanation: 'Mõjud tuleb ühendada: 2 / 4 = 1/2. Suurem pindala ei korva selles näites täielikult paksemat kihti.', skill: 'combined_scaling'},
              {prompt: '900 mL vee ülekandmisel suureneb püsiv voolukiirus 25 mL/min-lt 75 mL/min-le. Kuidas muutub kogu vee ülekandmise aeg?', options: ['Kahekordistub.', 'Kolmekordistub.', 'Väheneb kolmandikuni.', 'Ei muutu.'], answer: 2, explanation: 'Voolukiirus suureneb kolm korda. Sama mahu aeg väheneb kolmandikuni: 900 / 25 = 36 min ja 900 / 75 = 12 min.', skill: 'inverse_rate_time'},
              {"prompt": "2 ühesugust kausta maksab 4 eurot. Tükihind ei muutu. Kui palju maksab 3 kausta?", "options": ["2 eurot", "5 eurot", "6 eurot", "12 eurot"], "answer": 2, "explanation": "Üks kaust maksab 4 / 2 = 2 eurot, seega kolm maksab 3 × 2 = 6 eurot.", "skill": "direct_proportion"},
              {"prompt": "5 m sama kangast maksab 20 eurot. Meetrihind ei muutu. Kui palju maksab 7 m kangast?", "options": ["22 eurot", "28 eurot", "35 eurot", "140 eurot"], "answer": 1, "explanation": "Meetrihind on 20 / 5 = 4 eurot/m. 7 m maksab 7 × 4 = 28 eurot.", "skill": "direct_proportion"},
              {"prompt": "Teekonna läbimine võtab 12 min. Sama teekond läbitakse kaks korda suurema ühtlase kiirusega. Kui kaua kulub?", "options": ["24 min", "6 min", "10 min", "12 min"], "answer": 1, "explanation": "Sama teepikkuse korral jagame aja kiiruse kasvuteguriga: 12 / 2 = 6 min.", "skill": "inverse_proportion"},
              {"prompt": "Rattur läbib kindla teekonna ühtlaselt kiirusega 12 km/h 40 minutiga. Kui kaua kuluks samal teekonnal kiirusega 16 km/h?", "options": ["30 min", "44 min", "53⅓ min", "10 min"], "answer": 0, "explanation": "Aeg = 40 × 12 / 16 = 30 min. Teepikkus on mõlemal juhul sama.", "skill": "inverse_proportion"},
              {"prompt": "Kiirus on võrdeline A / d. A ja d mõlemad kahekordistuvad; muud tegurid ei muutu. Mis on uue ja vana kiiruse suhe?", "options": ["4", "2", "1/2", "1"], "answer": 3, "explanation": "Mõjud ühenduvad: 2 / 2 = 1. Kiirus jääb samaks.", "skill": "combined_scaling"},
              {"prompt": "Difusiooni mudelis on ülekandekiirus võrdeline A / d. Pindala kolmekordistub ja kihi paksus väheneb poolele. Osarõhkude vahe ja materjali omadused ei muutu. Mis on uue ja vana kiiruse suhe?", "options": ["3/2", "6", "1/6", "3"], "answer": 1, "explanation": "Pindala tegur on 3, paksuse tegur 1/2. Suhe on 3 / (1/2) = 6.", "skill": "combined_scaling"},
              {"prompt": "Sama anum täitub püsiva voolukiirusega 8 minutiga. Voolukiirus kahekordistub. Kui kaua täitmine nüüd kestab?", "options": ["16 min", "8 min", "4 min", "2 min"], "answer": 2, "explanation": "Sama mahu juures 8 / 2 = 4 min.", "skill": "inverse_rate_time"},
              {"prompt": "600 mL ülekandmisel langeb püsiv voolukiirus 50 mL/min-lt 20 mL/min-le. Mitu korda pikemaks muutub ülekandmise aeg?", "options": ["0,4 korda", "2,5 korda", "1,5 korda", "30 korda"], "answer": 1, "explanation": "Vana aeg 600 / 50 = 12 min; uus aeg 600 / 20 = 30 min. Suhe 30 / 12 = 2,5.", "skill": "inverse_rate_time"},
              {"prompt": "Ülekandekiirus on pindalaga võrdeline. Pindala kahekordistub; kõik muud tegurid püsivad. Mis on uue ja vana kiiruse suhe?", "options": ["1/2", "1", "2", "4"], "answer": 2, "explanation": "Võrdelisel sõltuvusel on kiiruse tegur sama mis pindala tegur: 2.", "skill": "area_scaling"},
              {"prompt": "Difusiooni mudelis väheneb pindala 12 cm²-lt 3 cm²-le. Kihi paksus, osarõhkude vahe ja materjali omadused püsivad. Mis on uue ja vana ülekandekiiruse suhe?", "options": ["4", "1/4", "1/3", "9"], "answer": 1, "explanation": "Sama paksuse ja muude tegurite juures on kiiruse suhe pindalade suhe: 3 / 12 = 1/4.", "skill": "area_scaling"},
              {"prompt": "Kiirus on kihi paksusega pöördvõrdeline. Paksus kolmekordistub; kõik muud tegurid püsivad. Mis on uue ja vana kiiruse suhe?", "options": ["3", "1/3", "1", "9"], "answer": 1, "explanation": "Pöördvõrdelise sõltuvuse järgi kiiruse tegur = 1 / 3.", "skill": "thickness_scaling"},
              {"prompt": "Difusiooni mudelis väheneb kihi paksus 0,6 mm-lt 0,2 mm-le. Pindala, osarõhkude vahe ja materjali omadused püsivad. Mis on uue ja vana ülekandekiiruse suhe?", "options": ["1/3", "0,4", "1", "3"], "answer": 3, "explanation": "Kiirus on paksusega pöördvõrdeline: vana paksus / uus paksus = 0,6 / 0,2 = 3.", "skill": "thickness_scaling"}
            ]
          },
          {
            id: 'formulas_units',
            title: 'Valemist puuduva suuruseni',
            english: 'Rearranging formulas and checking units',
            why: 'Ühest seosest saab leida eri suurusi; ühikud aitavad märgata valesti valitud tehet.',
            explanation: [
              "Mõtle enne valemit, mida suurus tähendab. Kiirus ütleb, kui pika tee läbid ajaühikus; võimsus ütleb, kui palju energiat kantakse üle ajaühikus. See aitab valida, kas korrutada või jagada.",
              "Kui v = s / t, siis s = v × t ja t = s / v. Võrrandi mõlemale poolele tuleb teha sama tehe: võrdsus peab säilima.",
              "Kontrolli ühikuid. Meetrite jagamine sekunditega annab m/s. Džaulide jagamine vattidega annab sekundeid, sest 1 W = 1 J/s. Kui ühikud ei sobi, teisenda need enne arvutamist."
            ],
            worked: {
              prompt: 'Seade kannab üle 240 J energiat keskmise võimsusega 12 W. Leia aeg, kasutades P = E / t.',
              steps: [
                "12 W tähendab keskmiselt 12 džauli igas sekundis. Otsime, mitu sellist sekundit on vaja 240 džauli ülekandmiseks.",
                "Korruta mõlemad pooled ajaga: P × t = E.",
                "Jaga mõlemad pooled võimsusega: t = E / P.",
                "t = 240 J / 12 W = 20 s, sest W = J/s."
              ],
              answer: 'Aeg on 20 sekundit.'
            },
            sources: [
              {title: 'Opiq: Matemaatika 7. klassile, võrrandid ja sõltuvused (sisukord)', url: 'https://www.opiq.ee/Kit/Details/524'},
              {title: 'Füüsika 8. klassile: liikumine, tihedus ja võimsus', url: 'https://opik.fyysika.ee/index.php/book/view/36'}
            ],
            followupVersion: 1,
            followups: {
              "0": {
                "skill": "substitution_speed",
                "title": "Kiirus teepikkusest ja ajast",
                "explanation": [
                  "Keskmine kiirus ütleb, kui palju teepikkust tuleb ühe ajaühiku kohta. Selle leidmiseks jaota kogu läbitud tee kulunud aja peale.",
                  "v = s / t. Kui s on meetrites ja t sekundites, tuleb vastus ühikus m/s."
                ],
                "worked": {
                  "prompt": "Kelgu teepikkus on 35 m ja aeg 7 s. Leia keskmine kiirus.",
                  "steps": [
                    "Jagame 35 meetrit seitsme sekundi peale, et leida keskmine teepikkus ühe sekundi kohta.",
                    "v = 35 m / 7 s = 5 m/s."
                  ],
                  "answer": "Keskmine kiirus on 5 m/s."
                },
                "simpleIndex": 6,
                "applicationIndex": 7
              },
              "1": {
                "skill": "rearrange_product",
                "title": "Jagatise valemist korrutise leidmine",
                "explanation": [
                  "Võrrandi võrdsus peab iga sammu järel säilima. Kui otsitav suurus on jagatud arvuga, saad jagamise kõrvaldada, korrutades mõlemad pooled sama arvuga.",
                  "Kui a = b / c ja c ei ole null, siis a × c = b. Ühtlase liikumise korral tähendab kiiruse korrutamine ajaga läbitud teepikkust."
                ],
                "worked": {
                  "prompt": "Avalda s seosest v = s / t.",
                  "steps": [
                    "Kiirus näitab teepikkust ajaühikus; korrutades selle ajaga, saame kogu teepikkuse.",
                    "Korruta mõlemad pooled t-ga: v × t = s."
                  ],
                  "answer": "s = v × t."
                },
                "simpleIndex": 8,
                "applicationIndex": 9
              },
              "4": {
                "skill": "transfer_time_units",
                "title": "Liikumisaja leidmine ja ühikud",
                "explanation": [
                  "Aja leidmiseks loe, mitu ühe sekundi jooksul läbitavat teepikkust mahub kogu teesse. Väiksem kiirus tähendab sama tee jaoks pikemat aega.",
                  "Ühtlasel liikumisel t = s / v. Teepikkuse ja kiiruse pikkusühikud peavad sobima: mm / (mm/s) = s."
                ],
                "worked": {
                  "prompt": "Detail liigub ühtlaselt kiirusega 0,5 mm/s ja läbib 4 mm. Leia aeg.",
                  "steps": [
                    "Igas sekundis läbitakse pool millimeetrit; ühe millimeetri jaoks kulub kaks sekundit.",
                    "t = s / v = 4 mm / (0,5 mm/s).",
                    "t = 8 s; millimeetrid taanduvad."
                  ],
                  "answer": "Aeg on 8 s."
                },
                "simpleIndex": 10,
                "applicationIndex": 11
              },
              "5": {
                "skill": "transfer_density_mass",
                "title": "Mass tihedusest ja ruumalast",
                "explanation": [
                  "Tihedus ütleb, kui suur mass on ühes ruumalaühikus. Kogu massi saad, võttes nii mitu sellist kogust, kui palju ruumalaühikuid proovis on.",
                  "Tihedus rho = m / V, seega m = rho × V. Ühikud peavad sobima: (g/mL) × mL = g."
                ],
                "worked": {
                  "prompt": "Aine tihedus on 2 g/mL ja ruumala 7 mL. Leia mass.",
                  "steps": [
                    "Iga milliliiter kaalub siin 2 grammi ning neid milliliitreid on seitse.",
                    "m = rho × V = 2 g/mL × 7 mL = 14 g."
                  ],
                  "answer": "Mass on 14 g."
                },
                "simpleIndex": 12,
                "applicationIndex": 13
              },
              "2": {
                "skill": "rearrange_time",
                "title": "Aeg energiast ja võimsusest",
                "explanation": [
                  "Võimsus näitab, kui palju energiat kantakse üle ühes sekundis. Aja leidmiseks küsi, mitu sellist sekundit on vaja kogu energia ülekandmiseks.",
                  "Seosest P = E / t saab P × t = E ja t = E / P. Ühik J / W annab sekundi, sest W = J/s."
                ],
                "worked": {
                  "prompt": "Seade kannab üle 56 J energiat keskmise võimsusega 8 W. Leia aeg.",
                  "steps": [
                    "8 W tähendab keskmiselt 8 J igas sekundis; 56 J jaoks on vaja seitset sellist sekundit.",
                    "t = E / P = 56 J / 8 W = 7 s."
                  ],
                  "answer": "Aeg on 7 s."
                },
                "simpleIndex": 14,
                "applicationIndex": 15
              },
              "3": {
                "skill": "substitution_concentration",
                "title": "Massikontsentratsiooni arvutamine",
                "explanation": [
                  "Massikontsentratsioon ütleb, kui palju lahustunud aine massi on ühes ruumalaühikus lahuses. Jaota aine mass kogu lahuse mahu peale.",
                  "c = m / V. Kui m on grammides ja V liitrites, on c ühik g/L."
                ],
                "worked": {
                  "prompt": "2 L lahuses on 10 g ainet. Leia massikontsentratsioon.",
                  "steps": [
                    "10 grammi on jaotunud kahe liitri peale, seega ühes liitris on pool sellest.",
                    "c = 10 g / 2 L = 5 g/L."
                  ],
                  "answer": "Massikontsentratsioon on 5 g/L."
                },
                "simpleIndex": 16,
                "applicationIndex": 17
              }
            },
            questions: [
              {prompt: 'Jooksja läbib 120 m 30 sekundiga. Mis on tema keskmine kiirus, kui v = s / t?', options: ['4 m/s', '0,25 m/s', '90 m/s', '3600 m/s'], answer: 0, explanation: 'v = 120 m / 30 s = 4 m/s. Vahemaa jagatakse ajaga.', skill: 'substitution_speed'},
              {prompt: 'Tihedus on rho = m / V. Milline avaldis annab sellest seosest massi m?', options: ['m = rho / V', 'm = V / rho', 'm = rho − V', 'm = rho × V'], answer: 3, explanation: 'Korruta võrrandi mõlemad pooled ruumalaga V: rho × V = m.', skill: 'rearrange_product'},
              {prompt: 'Lamp kasutab 600 J energiat keskmise võimsusega 30 W. Kui P = E / t, siis kui kaua lamp töötas?', options: ['18 000 s', '20 s', '0,05 s', '570 s'], answer: 1, explanation: 't = E / P = 600 J / 30 W = 20 s.', skill: 'rearrange_time'},
              {prompt: '0,5 L lahuses on 3 g ainet. Kui massikontsentratsioon c = m / V, siis milline on c?', options: ['1,5 g/L', '0,167 g/L', '6 g/L', '3,5 g/L'], answer: 2, explanation: 'c = 3 g / 0,5 L = 6 g/L. Pooles liitris oleva massi kahekordistamine annab massi ühe liitri kohta.', skill: 'substitution_concentration'},
              {prompt: 'Mikroskoobi all liigub osake ühtlaselt kiirusega 0,4 mm/s. Kui kaua kulub 12 mm läbimiseks?', options: ['30 s', '4,8 s', '0,033 s', '12,4 s'], answer: 0, explanation: 't = s / v = 12 mm / (0,4 mm/s) = 30 s. Millimeetrid taanduvad ja järele jäävad sekundid.', skill: 'transfer_time_units'},
              {prompt: 'Vedeliku tihedus on 1,2 g/mL ja ruumala 150 mL. Leia mass seosest rho = m / V.', options: ['125 g', '0,008 g', '180 g', '151,2 g'], answer: 2, explanation: 'm = rho × V = 1,2 g/mL × 150 mL = 180 g. mL taandub; vastuse ühik on gramm.', skill: 'transfer_density_mass'},
              {"prompt": "Pall läbib 6 m 2 sekundiga. Kasuta v = s / t. Mis on keskmine kiirus?", "options": ["12 m/s", "3 m/s", "4 m/s", "1/3 m/s"], "answer": 1, "explanation": "v = 6 m / 2 s = 3 m/s.", "skill": "substitution_speed"},
              {"prompt": "Sõiduk läbib 180 m 15 sekundiga. Leia keskmine kiirus.", "options": ["2700 m/s", "165 m/s", "0,0833 m/s", "12 m/s"], "answer": 3, "explanation": "v = 180 m / 15 s = 12 m/s.", "skill": "substitution_speed"},
              {"prompt": "Valemis a = b / 2 otsitakse b-d. Milline avaldis on õige?", "options": ["b = a / 2", "b = 2 / a", "b = 2 × a", "b = a − 2"], "answer": 2, "explanation": "Korrutame mõlemad pooled 2-ga: 2 × a = b.", "skill": "rearrange_product"},
              {"prompt": "Massikontsentratsioon c = m / V. Milline avaldis annab aine massi m?", "options": ["m = c / V", "m = c × V", "m = V / c", "m = c + V"], "answer": 1, "explanation": "Mõlemad pooled korrutatakse ruumalaga V: c × V = m.", "skill": "rearrange_product"},
              {"prompt": "Osake liigub ühtlaselt kiirusega 2 mm/s. Kui kaua kulub 10 mm läbimiseks?", "options": ["20 s", "0,2 s", "5 s", "12 s"], "answer": 2, "explanation": "t = 10 mm / (2 mm/s) = 5 s.", "skill": "transfer_time_units"},
              {"prompt": "Liugur liigub ühtlaselt kiirusega 0,3 mm/s. Kui kaua kulub 1,2 cm läbimiseks? 1 cm = 10 mm.", "options": ["4 s", "36 s", "0,025 s", "40 s"], "answer": 3, "explanation": "1,2 cm = 12 mm. t = 12 mm / (0,3 mm/s) = 40 s.", "skill": "transfer_time_units"},
              {"prompt": "Aine tihedus on 3 g/mL ja ruumala 2 mL. Kasuta m = rho × V. Leia mass.", "options": ["1,5 g", "5 g", "6 g", "2/3 g"], "answer": 2, "explanation": "m = 3 g/mL × 2 mL = 6 g.", "skill": "transfer_density_mass"},
              {"prompt": "Õli tihedus on 0,8 g/mL. Anumas on 250 mL õli. Mis on õli mass?", "options": ["312,5 g", "200 g", "250,8 g", "0,0032 g"], "answer": 1, "explanation": "m = 0,8 g/mL × 250 mL = 200 g.", "skill": "transfer_density_mass"},
              {"prompt": "Seade kannab üle 12 J energiat võimsusega 3 W. Kasuta t = E / P. Kui kaua see kestab?", "options": ["36 s", "4 s", "9 s", "0,25 s"], "answer": 1, "explanation": "t = 12 J / 3 W = 4 s.", "skill": "rearrange_time"},
              {"prompt": "Lamp kasutab 840 J energiat keskmise võimsusega 35 W. Kui P = E / t, siis kui kaua lamp töötab?", "options": ["29 400 s", "805 s", "0,0417 s", "24 s"], "answer": 3, "explanation": "t = E / P = 840 J / 35 W = 24 s.", "skill": "rearrange_time"},
              {"prompt": "1 L lahuses on 4 g ainet. Kasuta c = m / V. Leia massikontsentratsioon.", "options": ["4 g/L", "0,25 g/L", "3 g/L", "5 g/L"], "answer": 0, "explanation": "c = 4 g / 1 L = 4 g/L.", "skill": "substitution_concentration"},
              {"prompt": "0,4 L lahuses on 7,2 g ainet. Leia massikontsentratsioon.", "options": ["2,88 g/L", "7,6 g/L", "18 g/L", "0,0556 g/L"], "answer": 2, "explanation": "c = 7,2 g / 0,4 L = 18 g/L.", "skill": "substitution_concentration"}
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
            followupVersion: 1,
            followups: {
              "0": {
                "skill": "equally_likely_outcomes",
                "title": "Võrdselt võimalike tulemuste loendamine",
                "explanation": [
                  "Kui iga ese on sama tõenäoline, on sobiva eseme tõenäosus sobivate esemete arv / kõigi esemete arv.",
                  "Värvide või nimetuste arv üksi ei määra nende tõenäosusi."
                ],
                "worked": {
                  "prompt": "Karbis on 5 musta ja 3 valget nuppu. Iga nupp valitakse sama tõenäoliselt. Mis on musta nupu tõenäosus?",
                  "steps": [
                    "Sobivaid nuppe on 5, kokku 5 + 3 = 8.",
                    "Tõenäosus on 5/8."
                  ],
                  "answer": "Musta nupu tõenäosus on 5/8."
                },
                "simpleIndex": 6,
                "applicationIndex": 7
              },
              "1": {
                "skill": "conditional_group",
                "title": "Tõenäosus valitud alarühmas",
                "explanation": [
                  "Tingimus määrab, kelle või mille hulgast valitakse. Arvuta sobivate arv jagatuna just selle rühma suurusega.",
                  "Kõigist inimestest valimine ja ühest alarühmast valimine on erinevad katsed."
                ],
                "worked": {
                  "prompt": "Klubis on 18 noort ja 12 täiskasvanut. Noortest 6 mängib malet. Üks noor valitakse juhuslikult. Mis on maletaja tõenäosus?",
                  "steps": [
                    "Valik tehakse 18 noore hulgast; täiskasvanuid ei lisata.",
                    "6/18 = 1/3."
                  ],
                  "answer": "Tõenäosus on 1/3."
                },
                "simpleIndex": 8,
                "applicationIndex": 9
              },
              "4": {
                "skill": "dependent_events",
                "title": "Loosimine ilma tagasipanekuta",
                "explanation": [
                  "Ilma tagasipanekuta jääb pärast esimest valikut esemeid vähemaks. Teise sündmuse tõenäosus tuleb leida alles jäänud rühmast.",
                  "Kahe sobiva valiku tõenäosus = esimese sobiva tõenäosus × teise sobiva tõenäosus esimese järel."
                ],
                "worked": {
                  "prompt": "Kotis on 3 punast ja 2 sinist kuuli. Võetakse juhuslikult kaks kuuli ilma tagasipanekuta. Mis on kahe punase tõenäosus?",
                  "steps": [
                    "Esimese punase tõenäosus on 3/5.",
                    "Pärast punast on 2 punast 4 kuuli hulgas: 2/4.",
                    "(3/5) × (2/4) = 3/10."
                  ],
                  "answer": "Kahe punase tõenäosus on 3/10."
                },
                "simpleIndex": 10,
                "applicationIndex": 11
              },
              "5": {
                "skill": "joint_vs_conditional",
                "title": "Ühine ja tingimuslik tõenäosus",
                "explanation": [
                  "Küsimus „mõlemad korraga” nõuab kahte õnnestumist. „Teine esimese tingimusel” vaatleb ainult neid katseid, kus esimene on juba toimunud.",
                  "Sõltumatute sündmuste ühine tõenäosus on tõenäosuste korrutis. Esimese sündmuse toimumine ei muuda teise tõenäosust."
                ],
                "worked": {
                  "prompt": "Õiglast münti ja õiglast täringut kasutatakse sõltumatult. Mis on kulli ja kuue saamise ühine tõenäosus?",
                  "steps": [
                    "Kulli tõenäosus on 1/2; kuue tõenäosus 1/6.",
                    "Ühine tõenäosus on 1/2 × 1/6 = 1/12. Ainult kulliga katsete hulgas oleks kuue tõenäosus 1/6."
                  ],
                  "answer": "Kulli ja kuue ühine tõenäosus on 1/12."
                },
                "simpleIndex": 12,
                "applicationIndex": 13
              },
              "2": {
                "skill": "independent_events",
                "title": "Sõltumatute sündmuste korrutamine",
                "explanation": [
                  "Sõltumatute sündmuste korral ei muuda esimese sündmuse toimumine teise tõenäosust.",
                  "Mõlema sündmuse ühine tõenäosus on nende tõenäosuste korrutis."
                ],
                "worked": {
                  "prompt": "Õiglast täringut ja õiglast münti kasutatakse sõltumatult. Mis on paarisarvu ning kulli tõenäosus?",
                  "steps": [
                    "Paarisarv tuleb pooltel täringuvisetel; neist omakorda pooltel saame sõltumatu mündiviskega kulli.",
                    "Paarisarvude tõenäosus on 3/6 = 1/2 ja kulli tõenäosus 1/2.",
                    "Ühine tõenäosus = 1/2 × 1/2 = 1/4."
                  ],
                  "answer": "Tõenäosus on 1/4."
                },
                "simpleIndex": 14,
                "applicationIndex": 15
              },
              "3": {
                "skill": "inheritance_outcomes",
                "title": "Alleelidest järglase kombinatsioonini",
                "explanation": [
                  "Lihtsas mudelis annab kumbki vanem järglasele ühe alleeli. Eri alleelidega vanem annab kumbagi võrdse tõenäosusega.",
                  "Moodusta võimalikud kombinatsioonid ja loe sobivad. Mudelis on vanemate alleeliandmised sõltumatud."
                ],
                "worked": {
                  "prompt": "Vanemad on Aa ja Aa. Mõlemad annavad sõltumatult A või a tõenäosusega 1/2. Mis on aa tõenäosus?",
                  "steps": [
                    "Võrdselt tõenäolised kombinatsioonid on AA, Aa, aA ja aa.",
                    "aa on üks neljast: 1/4."
                  ],
                  "answer": "aa tõenäosus on 1/4."
                },
                "simpleIndex": 16,
                "applicationIndex": 17
              }
            },
            questions: [
              {prompt: 'Kotis on 3 sinist ja 2 punast ühesuguse kujuga kuuli. Iga kuuli väljavõtmine on sama tõenäoline. Kui suur on sinise kuuli saamise tõenäosus?', options: ['1/2', '2/5', '3/5', '3/2'], answer: 2, explanation: 'Siniseid kuule on 3 ja kokku kuule 5. Seega tõenäosus on 3/5. Kaks värvi ei tähenda, et värvid oleksid võrdselt tõenäolised.', skill: 'equally_likely_outcomes'},
              {prompt: 'Klassis on 12 tüdrukut ja 8 poissi. 6 tüdrukut kannab prille. Üks tüdruk valitakse juhuslikult. Kui suur on tõenäosus, et ta kannab prille?', options: ['1/2', '3/10', '6/8', '12/20'], answer: 0, explanation: 'Valik tehakse 12 tüdruku hulgast. Sobivaid on 6, seega 6/12 = 1/2. Poisse sellesse nimetajasse ei lisata.', skill: 'conditional_group'},
              {prompt: 'Õiglast münti visatakse kaks korda sõltumatult. Kui suur on kahe kulli tõenäosus?', options: ['1', '1/2', '0', '1/4'], answer: 3, explanation: 'Iga viske kulli tõenäosus on 1/2 ja visked on sõltumatud: 1/2 × 1/2 = 1/4.', skill: 'independent_events'},
              {prompt: 'Lihtsas pärilikkuse mudelis annab üks vanem järglasele võrdse tõenäosusega alleeli A või a. Teine vanem annab alati a. Kui suur on kombinatsiooni Aa tõenäosus?', options: ['1/4', '1/2', '3/4', '1'], answer: 1, explanation: 'Aa tekib siis, kui esimene vanem annab A. Selle tõenäosus on 1/2; teiselt tuleb a kindlasti.', skill: 'inheritance_outcomes'},
              {prompt: 'Kotis on 2 punast ja 1 sinine kuul. Võetakse juhuslikult kaks kuuli ilma tagasipanekuta. Kui suur on kahe punase tõenäosus?', options: ['4/9', '2/3', '1/3', '1/2'], answer: 2, explanation: 'Esimene punane: 2/3. Pärast seda on üks punane kahe kuuli hulgas: 1/2. Korrutis on 2/3 × 1/2 = 1/3, mitte 2/3 × 2/3.', skill: 'dependent_events'},
              {prompt: 'Ülesande mudelis on tütre sünni tõenäosus 1/2 ja tunnuse esinemise tõenäosus 1/4. Ülesanne ütleb, et need sündmused on sõltumatud. Kui suur on tõenäosus saada tütar, kellel tunnus esineb?', options: ['1/4', '1/8', '3/4', '1/2'], answer: 1, explanation: 'Küsitakse mõlemat sündmust korraga. Antud sõltumatuse eeldusel: 1/2 × 1/4 = 1/8. Ainult tütarde hulgas oleks tunnuse tõenäosus 1/4.', skill: 'joint_vs_conditional'},
              {"prompt": "Karbis on 1 roheline ja 3 kollast ühesugust kuuli. Iga kuul valitakse sama tõenäoliselt. Mis on rohelise kuuli tõenäosus?", "options": ["1/2", "3/4", "1/3", "1/4"], "answer": 3, "explanation": "Sobiv kuul on üks, kokku kuule neli: 1/4.", "skill": "equally_likely_outcomes"},
              {"prompt": "Kaardid numbritega 1 kuni 10 on võrdselt tõenäoliselt valitavad. Mis on tõenäosus valida kolmega jaguv arv?", "options": ["1/3", "3/10", "7/10", "3/7"], "answer": 1, "explanation": "Sobivad arvud on 3, 6 ja 9: kolm kümnest kaardist, seega 3/10.", "skill": "equally_likely_outcomes"},
              {"prompt": "Karbis on 4 ümmargust ja 6 kandilist märki. Ümmargustest 1 on sinine. Juhuslikult valitakse üks ümmargune märk. Mis on sinise tõenäosus?", "options": ["1/10", "1/6", "1/4", "4/10"], "answer": 2, "explanation": "Tingimus piirab valiku nelja ümmarguse märgiga. Siniseid on üks: 1/4.", "skill": "conditional_group"},
              {"prompt": "Koolis on 120 õpilast. Neist 30 käib kooris ja kooriliikmetest 12 mängib klaverit. Juhuslikult valitakse üks kooriliige. Mis on klaverimängija tõenäosus?", "options": ["1/10", "1/4", "3/5", "2/5"], "answer": 3, "explanation": "Valim on 30 kooriliiget, sobivaid on 12. 12/30 = 2/5.", "skill": "conditional_group"},
              {"prompt": "Kotis on 2 rohelist ja 2 kollast kuuli. Võetakse juhuslikult kaks kuuli ilma tagasipanekuta. Mis on kahe rohelise tõenäosus?", "options": ["1/4", "1/6", "1/2", "2/3"], "answer": 1, "explanation": "Esimene roheline: 2/4. Seejärel teine roheline: 1/3. Korrutis 2/4 × 1/3 = 1/6.", "skill": "dependent_events"},
              {"prompt": "Loosikarbis on 4 võidupiletit ja 3 tühja piletit. Võetakse juhuslikult kaks piletit ilma tagasipanekuta. Mis on kahe võidupileti tõenäosus?", "options": ["16/49", "4/7", "2/7", "3/7"], "answer": 2, "explanation": "Esimene võit: 4/7. Selle järel teine võit: 3/6. Ühine tõenäosus 4/7 × 3/6 = 2/7.", "skill": "dependent_events"},
              {"prompt": "Sõltumatute sündmuste A ja B tõenäosused on mõlemad 1/2. Kui suur on tõenäosus, et toimuvad mõlemad?", "options": ["1/2", "1", "0", "1/4"], "answer": 3, "explanation": "Küsitakse ühist sündmust: 1/2 × 1/2 = 1/4, mitte B tõenäosust ainult A tingimusel.", "skill": "joint_vs_conditional"},
              {"prompt": "Mudelis on loosivõidu tõenäosus 1/5 ja vihma tõenäosus 1/3; sündmused on sõltumatud. Kui suur on tõenäosus, et samal päeval nii võidad kui ka sajab?", "options": ["1/15", "1/3", "1/5", "8/15"], "answer": 0, "explanation": "Sõltumatute sündmuste ühine tõenäosus on 1/5 × 1/3 = 1/15. Vihmastel päevadel eraldi oleks võidu tõenäosus 1/5.", "skill": "joint_vs_conditional"},
              {"prompt": "Sõltumatute sündmuste A ja B tõenäosused on 1/2 ja 1/3. Mis on mõlema toimumise tõenäosus?", "options": ["5/6", "1/3", "1/6", "2/3"], "answer": 2, "explanation": "Sõltumatuse korral korruta: 1/2 × 1/3 = 1/6.", "skill": "independent_events"},
              {"prompt": "Õiglast kaheksatahulist täringut numbritega 1–8 visatakse kaks korda sõltumatult. Mis on tõenäosus saada mõlemal viskel 8?", "options": ["1/8", "1/64", "1/4", "1/16"], "answer": 1, "explanation": "Igal viskel P(8) = 1/8. Sõltumatute visete ühine tõenäosus on 1/8 × 1/8 = 1/64.", "skill": "independent_events"},
              {"prompt": "Lihtsas mudelis on vanemate genotüübid AA ja aa. Kumbki annab ühe alleeli. Mis on Aa järglase tõenäosus?", "options": ["0", "1/4", "1/2", "1"], "answer": 3, "explanation": "Esimeselt tuleb alati A ja teiselt alati a. Kõik järglaste kombinatsioonid on Aa: tõenäosus 1.", "skill": "inheritance_outcomes"},
              {"prompt": "Mudelis on vanemad Bb ja Bb. Kumbki annab sõltumatult B või b tõenäosusega 1/2. Mis on tõenäosus, et järglase genotüübis on vähemalt üks B?", "options": ["1/4", "3/4", "1/2", "1"], "answer": 1, "explanation": "Võrdselt tõenäolised kombinatsioonid on BB, Bb, bB ja bb. Esimeses kolmes on vähemalt üks B, seega 3/4.", "skill": "inheritance_outcomes"}
            ]
          },
{
  "id": "plane_geometry",
  "title": "Tasandilised kujundid: küljed, nurgad ja pindala",
  "english": "Plane geometry: perimeter, area, angles and right triangles",
  "why": "Üks väike võimalus proovida geomeetria alustalasid. Joonista soovi korral ise lihtne skeem ja märgi antud suurused; selgituse võid avada ka enne vastamist.",
  "explanation": [
    "Ümbermõõt P (perimeter) on kujundi piirjoone pikkus: liida kõigi külgede pikkused. Pindala A (area) kirjeldab kujundi sisse jääva pinna suurust. Ristküliku (rectangle) külgedega a ja b on P = 2(a + b) ning A = a × b. Pikkuse ühik võib olla cm, pindala ühik aga cm².",
    "Rööpkülikust saab lõigata ühe otsa kolmnurga ja tõsta selle teise otsa: pindala ei muutu ning tekib sama aluse ja kõrgusega ristkülik. Seetõttu A = b × h, kus h mõõdetakse alusega risti. Kaldkülg ei ole üldjuhul kõrgus. Sama aluse ja kõrgusega kolmnurga pindala on pool sellest: A = b × h / 2.",
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
  followupVersion: 1,
            followups: {
              "0": {
                "skill": "rectangle_perimeter_area",
                "title": "Ristküliku ümbermõõt ja pindala",
                "explanation": [
                  "Ümbermõõt mõõdab teed ümber kujundi serva; pindala mõõdab, kui palju pinda kujund katab. Need vastavad eri küsimustele.",
                  "Ristkülikul P = 2(a + b) ja A = a × b. Ümbermõõdu ühik on näiteks cm, pindala ühik cm². Arvuta need eraldi."
                ],
                "worked": {
                  "prompt": "Ristküliku küljed on 9 cm ja 2 cm. Leia ümbermõõt ja pindala.",
                  "steps": [
                    "Serva pikkuseks liidame neli külge; pinna katmiseks loeme ruutühikuid ridade ja veergude kaupa.",
                    "P = 2 × (9 + 2) = 22 cm.",
                    "A = 9 × 2 = 18 cm²."
                  ],
                  "answer": "P = 22 cm ja A = 18 cm²."
                },
                "simpleIndex": 6,
                "applicationIndex": 7
              },
              "1": {
                "skill": "quadrilateral_missing_angle",
                "title": "Nelinurga puuduv sisenurk",
                "explanation": [
                  "Üks diagonaal jagab kumera nelinurga kaheks kolmnurgaks. Mõlema kolmnurga nurgad kokku annavad nelinurga sisenurgad.",
                  "Kolmnurgas on 180°, seega nelinurgas 2 × 180° = 360°. Puuduva nurga leidmiseks lahuta sellest kolme teadaoleva nurga summa."
                ],
                "worked": {
                  "prompt": "Kumera nelinurga kolm nurka on 90°, 100° ja 110°. Leia neljas.",
                  "steps": [
                    "Antud nurkade summa on 90 + 100 + 110 = 300°.",
                    "Neljas nurk on 360 − 300 = 60°."
                  ],
                  "answer": "Neljas sisenurk on 60°."
                },
                "simpleIndex": 8,
                "applicationIndex": 9
              },
              "4": {
                "skill": "pythagorean_diagonal_transfer",
                "title": "Ristküliku diagonaal Pythagorase abil",
                "explanation": [
                  "Ristküliku kaks külge ja diagonaal moodustavad täisnurkse kolmnurga. Diagonaal on hüpotenuus.",
                  "Diagonaal d = √(a² + b²). Ruutude summa on pikkuse ruut; pikkuse leidmiseks on vaja ruutjuurt."
                ],
                "worked": {
                  "prompt": "Ristküliku küljed on 9 cm ja 12 cm. Leia diagonaal.",
                  "steps": [
                    "Diagonaal on kahe risti oleva külje vastas ja peab olema kummastki küljest pikem.",
                    "d² = 9² + 12² = 81 + 144 = 225 cm².",
                    "d = √225 cm = 15 cm."
                  ],
                  "answer": "Diagonaal on 15 cm."
                },
                "simpleIndex": 10,
                "applicationIndex": 11
              },
              "5": {
                "skill": "regular_polygon_angle_transfer",
                "title": "Korrapärase hulknurga sisenurk",
                "explanation": [
                  "Ühest tipust tõmmatud diagonaalid jagavad kumera hulknurga kolmnurkadeks. Iga kolmnurk lisab nurgasummasse 180°.",
                  "n-tipulises kujundis tekib n − 2 kolmnurka. Nurkade summa on (n − 2) × 180°; korrapärases hulknurgas jaga see n võrdse nurga vahel."
                ],
                "worked": {
                  "prompt": "Leia korrapärase kuusnurga üks sisenurk.",
                  "steps": [
                    "Kuusnurga saab ühest tipust jagada neljaks kolmnurgaks.",
                    "Nurkade summa on (6 − 2) × 180° = 720°.",
                    "Üks sisenurk on 720° / 6 = 120°."
                  ],
                  "answer": "Üks sisenurk on 120°."
                },
                "simpleIndex": 12,
                "applicationIndex": 13
              },
              "2": {
                "skill": "rectangle_area_supported",
                "title": "Ristküliku pindala",
                "explanation": [
                  "Kujuta ette, et katad ristküliku ühesuuruste ruutudega. Ühes reas on neid pikkuse jagu ja ridu on laiuse jagu.",
                  "Seepärast A = pikkus × laius. cm × cm = cm²; servade liitmine annaks ümbermõõdu."
                ],
                "worked": {
                  "prompt": "Ristküliku küljed on 7 cm ja 2 cm. Leia pindala.",
                  "steps": [
                    "Kahe rea seitsmest ühikruudust saame neliteist ühikruutu.",
                    "A = 7 cm × 2 cm = 14 cm²."
                  ],
                  "answer": "Pindala on 14 cm²."
                },
                "simpleIndex": 14,
                "applicationIndex": 15
              },
              "3": {
                "skill": "parallelogram_perpendicular_height",
                "title": "Rööpküliku alus ja ristuv kõrgus",
                "explanation": [
                  "Rööpküliku otsast saab kolmnurga ümber tõsta, et tekiks sama pindalaga ristkülik. Selle ristküliku kõrgus on aluste vaheline ristkaugus, mitte kaldkülg.",
                  "A = alus × sellele alusele risti mõõdetud kõrgus. Vali alusega risti mõõdetud kaugus vastasküljeni."
                ],
                "worked": {
                  "prompt": "Rööpküliku alus on 7 cm, selle aluse kõrgus 3 cm ja kaldkülg 5 cm. Leia pindala.",
                  "steps": [
                    "Valime aluse 7 cm ja sellega ristuva kõrguse 3 cm.",
                    "A = 7 × 3 = 21 cm²."
                  ],
                  "answer": "Pindala on 21 cm²."
                },
                "simpleIndex": 16,
                "applicationIndex": 17
              }
            },
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
    },
              {"prompt": "Ristküliku küljed on 3 cm ja 2 cm. Kasuta P = 2(a + b) ja A = a × b. Milline paar on õige?", "options": ["P = 5 cm; A = 6 cm²", "P = 10 cm; A = 6 cm²", "P = 6 cm; A = 10 cm²", "P = 10 cm²; A = 6 cm"], "answer": 1, "explanation": "P = 2 × (3 + 2) = 10 cm. A = 3 × 2 = 6 cm². Kontrolli mõlema ühikut.", "skill": "rectangle_perimeter_area"},
              {"prompt": "Ristkülikukujulise peenra küljed on 8 m ja 5 m. Milline paar annab serva kogupikkuse P ja kaetava pindala A?", "options": ["P = 13 m; A = 40 m²", "P = 40 m; A = 26 m²", "P = 26 m; A = 40 m²", "P = 26 m; A = 13 m²"], "answer": 2, "explanation": "Serva kogupikkus P = 2 × (8 + 5) = 26 m; pindala A = 8 × 5 = 40 m².", "skill": "rectangle_perimeter_area"},
              {"prompt": "Kumera nelinurga kolm sisenurka on igaüks 90°. Summa peab olema 360°. Leia neljas nurk.", "options": ["270°", "180°", "90°", "60°"], "answer": 2, "explanation": "360° − (90° + 90° + 90°) = 90°.", "skill": "quadrilateral_missing_angle"},
              {"prompt": "Kumera nelinurga kolm sisenurka on 65°, 105° ja 120°. Leia neljas sisenurk.", "options": ["70°", "110°", "290°", "80°"], "answer": 0, "explanation": "Antud summa on 65 + 105 + 120 = 290°. Neljas nurk on 360 − 290 = 70°.", "skill": "quadrilateral_missing_angle"},
              {"prompt": "Ristküliku küljed on 3 cm ja 4 cm. Kasuta d² = 3² + 4² = 25 cm². Kui pikk on diagonaal?", "options": ["25 cm", "7 cm", "12 cm", "5 cm"], "answer": 3, "explanation": "Diagonaal d = √25 cm = 5 cm; 25 cm² on diagonaali pikkuse ruut.", "skill": "pythagorean_diagonal_transfer"},
              {"prompt": "Ristkülikukujulise ekraani küljed on 5 cm ja 12 cm. Kui pikk on diagonaal?", "options": ["17 cm", "60 cm", "13 cm", "169 cm"], "answer": 2, "explanation": "d² = 5² + 12² = 25 + 144 = 169 cm², seega d = 13 cm.", "skill": "pythagorean_diagonal_transfer"},
              {"prompt": "Korrapärase nelinurga sisenurkade summa on 360°. Kõik neli nurka on võrdsed. Leia üks sisenurk.", "options": ["360°", "180°", "90°", "60°"], "answer": 2, "explanation": "360° / 4 = 90°.", "skill": "regular_polygon_angle_transfer"},
              {"prompt": "Leia kumera korrapärase kaheksanurga üks sisenurk.", "options": ["45°", "135°", "1080°", "144°"], "answer": 1, "explanation": "Summa on (8 − 2) × 180° = 1080°. Üks sisenurk on 1080° / 8 = 135°.", "skill": "regular_polygon_angle_transfer"},
              {"prompt": "Ristküliku küljed on 4 cm ja 2 cm. Kasuta A = pikkus × laius. Leia pindala.", "options": ["6 cm²", "12 cm²", "8 cm²", "8 cm"], "answer": 2, "explanation": "A = 4 × 2 = 8 cm².", "skill": "rectangle_area_supported"},
              {"prompt": "Ristkülikukujulise mati pikkus on 9 m ja laius 4 m. Kui suur on mati pindala?", "options": ["26 m²", "36 m²", "13 m²", "36 m"], "answer": 1, "explanation": "A = 9 m × 4 m = 36 m².", "skill": "rectangle_area_supported"},
              {"prompt": "Rööpküliku alus on 4 cm ja sellele alusele risti mõõdetud kõrgus 2 cm. Kasuta A = alus × kõrgus. Leia pindala.", "options": ["6 cm²", "4 cm²", "12 cm²", "8 cm²"], "answer": 3, "explanation": "A = 4 × 2 = 8 cm².", "skill": "parallelogram_perpendicular_height"},
              {"prompt": "Rööpküliku alus on 12 cm, sellele alusele risti mõõdetud kõrgus 5 cm ja kaldkülg 8 cm. Leia pindala.", "options": ["96 cm²", "30 cm²", "60 cm²", "40 cm²"], "answer": 2, "explanation": "A = 12 × 5 = 60 cm². Kaldkülg 8 cm ei ole selles arvutuses kõrgus.", "skill": "parallelogram_perpendicular_height"}
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
            followupVersion: 1,
            followups: {
              "0": {
                "skill": "volume_prefix",
                "title": "Milliliitritest liitriteks",
                "explanation": [
                  "Sama vedelikukogus ei muutu ühiku vahetamisel. Liiter on suurem ühik kui milliliiter, nii et liitrites peab arv olema väiksem.",
                  "Üks liiter sisaldab 1000 mL. 1 mL = 0,001 L; milliliitritest liitriteks jaga arv 1000-ga."
                ],
                "worked": {
                  "prompt": "Teisenda 8 mL liitriteks.",
                  "steps": [
                    "Ühte liitrisse mahub tuhat milliliitrit; kaheksa milliliitrit on vaid väike osa liitrist.",
                    "8 / 1000 = 0,008."
                  ],
                  "answer": "8 mL = 0,008 L."
                },
                "simpleIndex": 6,
                "applicationIndex": 7
              },
              "1": {
                "skill": "micro_to_milli",
                "title": "Mikromeetritest millimeetriteks",
                "explanation": [
                  "Millimeeter on mikromeetrist suurem ühik. Sama pikkuse väljendamiseks millimeetrites on vaja väiksemat arvu.",
                  "1 mm = 1000 µm. Mikromeetritest millimeetriteks jaga arv 1000-ga."
                ],
                "worked": {
                  "prompt": "Teisenda 800 µm millimeetriteks.",
                  "steps": [
                    "Terve millimeeter on tuhat mikromeetrit; 800 mikromeetrit peab jääma alla ühe millimeetri.",
                    "800 / 1000 = 0,8."
                  ],
                  "answer": "800 µm = 0,8 mm."
                },
                "simpleIndex": 8,
                "applicationIndex": 9
              },
              "4": {
                "skill": "area_conversion",
                "title": "Pindalaühiku teisendamine",
                "explanation": [
                  "Pindala on kahe pikkuse korrutis. Seepärast tuleb pikkuse teisendustegur rakendada mõlemale mõõtmele.",
                  "Näiteks 1 mm = 1000 µm, seega 1 mm² = 1 000 000 µm²."
                ],
                "worked": {
                  "prompt": "Ruudu külg on 500 µm. Leia pindala mm²-des.",
                  "steps": [
                    "Kõigepealt väljendame külje millimeetrites; pindala arvutamisel kasutatakse seda külgepikkust kaks korda.",
                    "500 µm = 0,5 mm.",
                    "A = 0,5 × 0,5 = 0,25 mm²."
                  ],
                  "answer": "Pindala on 0,25 mm²."
                },
                "simpleIndex": 10,
                "applicationIndex": 11
              },
              "5": {
                "skill": "cubic_volume_conversion",
                "title": "Kuupsentimeetri ja milliliitri seos",
                "explanation": [
                  "Kuupsentimeeter ja milliliiter on võrdsed mahuühikud: 1 cm³ = 1 mL.",
                  "See teisendus kirjeldab ruumala. Tihedust oleks vaja ruumalast massi leidmiseks."
                ],
                "worked": {
                  "prompt": "Anuma ruumala on 7 cm³. Leia sama ruumala milliliitrites.",
                  "steps": [
                    "Iga cm³ vastab ühele mL-le: 7 × 1 = 7."
                  ],
                  "answer": "7 cm³ = 7 mL."
                },
                "simpleIndex": 12,
                "applicationIndex": 13
              },
              "2": {
                "skill": "current_prefix",
                "title": "Ampritest milliampriteks",
                "explanation": [
                  "Milliamper on amprist väiksem ühik. Sama voolutugevuse jaoks on milliamprites kirjutatud arv suurem.",
                  "1 A = 1000 mA. Ampritest milliampriteks korruta arv 1000-ga."
                ],
                "worked": {
                  "prompt": "Teisenda 0,7 A milliampriteks.",
                  "steps": [
                    "Üks amper sisaldab tuhat milliamprit; võtame sellest seitse kümnendikku.",
                    "0,7 × 1000 = 700."
                  ],
                  "answer": "0,7 A = 700 mA."
                },
                "simpleIndex": 14,
                "applicationIndex": 15
              },
              "3": {
                "skill": "energy_prefix",
                "title": "Kilodžaulidest džaulideks",
                "explanation": [
                  "Kilo tähendab tuhandest põhiühikust koosnevat kogust. Džaulideks teisendades loeme need väiksemad ühikud kokku; energia ise ei muutu.",
                  "1 kJ = 1000 J. Korruta kilodžaulide arv 1000-ga."
                ],
                "worked": {
                  "prompt": "Teisenda 2,4 kJ džaulideks.",
                  "steps": [
                    "Iga kilodžaul sisaldab tuhat džauli.",
                    "2,4 × 1000 = 2400."
                  ],
                  "answer": "2,4 kJ = 2400 J."
                },
                "simpleIndex": 16,
                "applicationIndex": 17
              }
            },
            questions: [
              {prompt: 'Kui palju on 2,5 mL liitrites?', options: ['0,25 L', '0,0025 L', '2500 L', '0,025 L'], answer: 1, explanation: '1 mL = 0,001 L. Seega 2,5 mL = 2,5 × 0,001 L = 0,0025 L.', skill: 'volume_prefix'},
              {prompt: 'Kui palju on 3000 µm millimeetrites?', options: ['3 mm', '0,003 mm', '30 mm', '3 000 000 mm'], answer: 0, explanation: '1000 µm = 1 mm. Seega 3000 µm = 3 mm.', skill: 'micro_to_milli'},
              {prompt: 'Seadme voolutugevus on 0,4 A. Milline on sama voolutugevus milliamprites?', options: ['0,0004 mA', '4 mA', '40 mA', '400 mA'], answer: 3, explanation: '1 A = 1000 mA. 0,4 × 1000 = 400 mA.', skill: 'current_prefix'},
              {prompt: 'Ülekantud energia on 5 kJ. Mitu džauli see on?', options: ['0,005 J', '500 J', '5000 J', '50 J'], answer: 2, explanation: 'Kilo tähendab 1000. 5 kJ = 5 × 1000 J = 5000 J.', skill: 'energy_prefix'},
              {prompt: 'Mikroskoobipildil on ruudukujulise ala külg 200 µm. Kui suur on selle ala pindala mm²-des?', options: ['0,2 mm²', '0,04 mm²', '40 mm²', '4 mm²'], answer: 1, explanation: '200 µm = 0,2 mm. Ruudu pindala on 0,2 mm × 0,2 mm = 0,04 mm². Teisendada tuleb mõlemad mõõtmed.', skill: 'area_conversion'},
              {prompt: 'Väikese anuma ruumala on 2 cm³. Kui palju vett mahub sellesse milliliitrites?', options: ['2 mL', '20 mL', '0,002 mL', '2000 mL'], answer: 0, explanation: '1 cm³ = 1 mL. Seega 2 cm³ = 2 mL. See on mahuühikute seos ega sõltu vedeliku tihedusest.', skill: 'cubic_volume_conversion'},
              {"prompt": "Teisenda 10 mL liitriteks. 1 L = 1000 mL.", "options": ["0,01 L", "0,1 L", "10 000 L", "1 L"], "answer": 0, "explanation": "10 / 1000 = 0,01 L.", "skill": "volume_prefix"},
              {"prompt": "Mõõtesilindris on 75 mL vedelikku. Mis on sama maht liitrites?", "options": ["0,75 L", "0,0075 L", "0,075 L", "75 000 L"], "answer": 2, "explanation": "75 mL / 1000 = 0,075 L.", "skill": "volume_prefix"},
              {"prompt": "Kui palju on 1000 µm millimeetrites?", "options": ["100 mm", "0,001 mm", "1000 mm", "1 mm"], "answer": 3, "explanation": "1000 µm = 1 mm.", "skill": "micro_to_milli"},
              {"prompt": "Detaili läbimõõt on 650 µm. Mis on sama läbimõõt millimeetrites?", "options": ["6,5 mm", "0,65 mm", "0,065 mm", "650 000 mm"], "answer": 1, "explanation": "650 / 1000 = 0,65 mm.", "skill": "micro_to_milli"},
              {"prompt": "Ruudu külg on 1000 µm ehk 1 mm. Leia pindala mm²-des.", "options": ["1000 mm²", "1 mm²", "0,001 mm²", "100 mm²"], "answer": 1, "explanation": "A = 1 mm × 1 mm = 1 mm².", "skill": "area_conversion"},
              {"prompt": "Ristkülikukujulise ala küljed on 300 µm ja 400 µm. Leia pindala mm²-des.", "options": ["0,7 mm²", "120 mm²", "0,12 mm²", "0,012 mm²"], "answer": 2, "explanation": "Küljed on 0,3 mm ja 0,4 mm. A = 0,3 × 0,4 = 0,12 mm².", "skill": "area_conversion"},
              {"prompt": "Kui palju on 1 cm³ milliliitrites?", "options": ["1000 mL", "0,001 mL", "10 mL", "1 mL"], "answer": 3, "explanation": "1 cm³ = 1 mL on mahuühikute täpne seos.", "skill": "cubic_volume_conversion"},
              {"prompt": "Vedeliku ruumala on 12,5 cm³. Mis on sama ruumala milliliitrites?", "options": ["1,25 mL", "12,5 mL", "125 mL", "0,0125 mL"], "answer": 1, "explanation": "1 cm³ = 1 mL, seega 12,5 cm³ = 12,5 mL. Tihedust selle teisenduse jaoks ei kasutata.", "skill": "cubic_volume_conversion"},
              {"prompt": "Kui palju on 1 A milliamprites?", "options": ["0,001 mA", "1000 mA", "100 mA", "10 mA"], "answer": 1, "explanation": "1 A = 1000 mA.", "skill": "current_prefix"},
              {"prompt": "Seadme voolutugevus on 0,025 A. Kui palju on see milliamprites?", "options": ["250 mA", "0,000025 mA", "25 mA", "2,5 mA"], "answer": 2, "explanation": "0,025 × 1000 = 25 mA.", "skill": "current_prefix"},
              {"prompt": "Kui palju on 1 kJ džaulides?", "options": ["0,001 J", "100 J", "10 J", "1000 J"], "answer": 3, "explanation": "Kilo tähendab 1000: 1 kJ = 1000 J.", "skill": "energy_prefix"},
              {"prompt": "Seade kannab üle 0,35 kJ energiat. Mitu džauli see on?", "options": ["35 J", "350 J", "3500 J", "0,00035 J"], "answer": 1, "explanation": "0,35 × 1000 = 350 J.", "skill": "energy_prefix"}
            ]
          },
          {
            id: 'pressure',
            title: 'Rõhk ja rõhkude vahe',
            english: 'Pressure and pressure differences',
            why: 'Rõhk seob jõu ja pindala; rõhkude erinevused aitavad mõista ka hingamist ja vedelike liikumist.',
            explanation: [
              "Rõhk kirjeldab, kui suurele pinnale jõud jaotub. Sama jõud väiksemal pinnal mõjub igale pinnaühikule tugevamalt. Pinnale risti mõjuva jõu korral p = F / A; 1 Pa = 1 N/m².",
              "Paigalseisvas vedelikus on sügavamal kohal rohkem vedelikku peal. Ühtlase tiheduse korral annab sügavuste vahe h rõhuerinevuse Δp = rho × g × h. Kogurõhk sisaldab lisaks pinnale mõjuvat rõhku. Kui ülesanne lubab, kasuta g = 10 N/kg.",
              "Avatud ühenduse korral võib rõhkude vahe tekitada vedeliku või gaasi üldise voolu kõrgema rõhu poolt madalama poole. Hapniku difusiooni läbi membraani kirjeldab aga hapniku osarõhkude vahe; seda ei tohi samastada kogu õhu voolamisega."
            ],
            worked: {
              prompt: 'Padi jaotab 120 N suuruse pinnaga risti mõjuva jõu ühtlaselt 0,06 m² suurusele alale. Leia keskmine rõhk.',
              steps: [
                "Rõhk küsib jõudu ühe ruutmeetri kohta, seega jagame jõu selle pindalaga.",
                "Kasuta p = F / A.",
                "p = 120 N / 0,06 m².",
                "120 / 0,06 = 2000 ning N/m² = Pa."
              ],
              answer: 'Keskmine rõhk on 2000 Pa.'
            },
            sources: [
              {title: 'Füüsika 8. klassile: rõhk ja rõhk vedelikes', url: 'https://opik.fyysika.ee/index.php/book/view/36'},
              {title: 'OpenStax Biology 2e: Gas Exchange across Respiratory Surfaces', url: 'https://openstax.org/books/biology-2e/pages/39-2-gas-exchange-across-respiratory-surfaces'}
            ],
            followupVersion: 1,
            followups: {
              "0": {
                "skill": "force_area_pressure",
                "title": "Rõhk jõust ja pindalast",
                "explanation": [
                  "Rõhk näitab, kui suur risti mõjuv jõud tuleb pinnaühiku kohta. Sama jõu koondamine väiksemale pinnale suurendab rõhku.",
                  "Keskmine rõhk p = F / A. Kasuta njuutoneid ja ruutmeetreid: 1 Pa = 1 N/m²."
                ],
                "worked": {
                  "prompt": "30 N suurune risti mõjuv jõud jaotub 0,02 m² alale. Leia keskmine rõhk.",
                  "steps": [
                    "Otsime jõudu ühe ruutmeetri kohta, mitte kogu jõudu pinnal.",
                    "p = 30 N / 0,02 m² = 1500 N/m²."
                  ],
                  "answer": "Keskmine rõhk on 1500 Pa."
                },
                "simpleIndex": 2,
                "applicationIndex": 6
              },
              "1": {
                "skill": "pressure_area_relation",
                "title": "Pindala mõju rõhule",
                "explanation": [
                  "Kui sama jõud jaotub suuremale pinnale, saab iga pinnaühik väiksema osa jõust. Seetõttu rõhk väheneb.",
                  "p = F / A. Sama risti mõjuva jõu korral on rõhk pindalaga pöördvõrdeline."
                ],
                "worked": {
                  "prompt": "Sama jõud jaotatakse kolm korda suuremale alale. Kui suur on uus rõhk võrreldes vanaga?",
                  "steps": [
                    "Kolm korda suuremal pinnal jaotub sama jõud kolm korda rohkemate pinnaühikute vahel.",
                    "F ei muutu; A uus väärtus on 3 × vana A.",
                    "Uue ja vana rõhu suhe on 1/3."
                  ],
                  "answer": "Uus rõhk on kolmandik varasemast."
                },
                "simpleIndex": 7,
                "applicationIndex": 8
              },
              "4": {
                "skill": "bulk_flow_direction",
                "title": "Õhu üldise voolu suund",
                "explanation": [
                  "Avatud ühenduses suunab rõhkude vahe gaasi üldist voolu kõrgema kogurõhu poolt madalama poole.",
                  "Võrdle rõhke samades ühikutes. Siin vaatleme rõhkude vahe tekitatud voolu, muid ajendeid arvestamata."
                ],
                "worked": {
                  "prompt": "Kaks õhuanumat A ja B ühendatakse avatud toruga. A rõhk on 104 kPa, B rõhk 100 kPa. Mis suunas tekib rõhkude vahe toimel vool?",
                  "steps": [
                    "104 kPa on suurem kui 100 kPa.",
                    "Vool on kõrgema rõhuga anumast madalama rõhuga anumasse."
                  ],
                  "answer": "Õhk voolab A-st B-sse."
                },
                "simpleIndex": 9,
                "applicationIndex": 10
              },
              "5": {
                "skill": "partial_pressure_diffusion",
                "title": "Osarõhu mõju hapniku difusioonile",
                "explanation": [
                  "Gaasi osarõhk kirjeldab selle gaasi osa segu rõhus. Hapniku netodifusiooni suunda läbi hapnikku läbilaskva membraani määrab hapniku osarõhkude erinevus.",
                  "Selles mudelis liigub hapnik netona kõrgema oma osarõhu poolt madalama poole. See ei eelda kogu gaasisegu voolamist läbi membraani."
                ],
                "worked": {
                  "prompt": "Membraan laseb hapnikku läbi. Selle pooltel A ja B on hapniku osarõhud vastavalt 9 kPa ja 4 kPa. Määra hapniku netodifusiooni suund.",
                  "steps": [
                    "Võrdle sama gaasi osarõhke: 9 > 4.",
                    "Hapnik liigub netona kõrgemalt osarõhult madalamale."
                  ],
                  "answer": "Hapniku netodifusioon on A-st B-sse."
                },
                "simpleIndex": 11,
                "applicationIndex": 12
              },
              "3": {
                "skill": "hydrostatic_difference",
                "title": "Hüdrostaatiline rõhumuutus",
                "explanation": [
                  "Sügavamal on vaadeldava koha kohal paksem vedelikukiht. Selle lisakihi raskus suurendab rõhku. Ühtlase tiheduse ja paigalseisva vedeliku korral sõltub juurdekasv sügavuste vahest.",
                  "Δp = rho × g × h. See on rõhu muutus; pinnale mõjuvat rõhku muutuse leidmisel juurde ei liideta. Kogurõhu jaoks oleks seda vaja."
                ],
                "worked": {
                  "prompt": "Kui palju suureneb rõhk vees 0,3 m sügavamale liikudes? Kasuta rho = 1000 kg/m³ ja g = 10 N/kg.",
                  "steps": [
                    "Otsime 0,3 meetri paksuse lisaveekihi põhjustatud rõhku, mitte kogu rõhku koos õhurõhuga.",
                    "Δp = 1000 × 10 × 0,3 Pa = 3000 Pa."
                  ],
                  "answer": "Rõhk suureneb 3000 Pa võrra."
                },
                "simpleIndex": 13,
                "applicationIndex": 14
              }
            },
            questions: [
              {prompt: '40 N suurune jõud mõjub pinnaga risti 0,02 m² alale. Mis on keskmine rõhk?', options: ['0,8 Pa', '20 Pa', '2000 Pa', '4000 Pa'], answer: 2, explanation: 'p = F / A = 40 / 0,02 = 2000 Pa.', skill: 'force_area_pressure'},
              {prompt: 'Sama suur jõud jaotatakse kaks korda suuremale pindalale. Kuidas muutub keskmine rõhk?', options: ['Väheneb poole võrra.', 'Kahekordistub.', 'Ei muutu.', 'Suureneb neli korda.'], answer: 0, explanation: 'p = F / A. Kui jõud jääb samaks ja pindala kahekordistub, on rõhk pool varasemast.', skill: 'pressure_area_relation'},
              {prompt: 'Karp avaldab lauale pinnaga risti 90 N jõudu. Toetuspindala on 0,03 m². Leia keskmine rõhk.', options: ['2,7 Pa', '3000 Pa', '270 Pa', '30 Pa'], answer: 1, explanation: 'p = 90 N / 0,03 m² = 3000 Pa. Rõhu leidmisel jõudu pindalaga ei korrutata.', skill: 'force_area_pressure'},
              {prompt: 'Kui palju suureneb rõhk vees 0,4 m sügavamale liikudes? Kasuta rho = 1000 kg/m³ ja g = 10 N/kg.', options: ['40 Pa', '400 Pa', '25 000 Pa', '4000 Pa'], answer: 3, explanation: 'Rõhu suurenemine on rho × g × h = 1000 × 10 × 0,4 = 4000 Pa. See on muutus, mitte koos õhurõhuga arvutatud kogurõhk.', skill: 'hydrostatic_difference'},
              {prompt: 'Lihtsas hingamismudelis on avatud õhutee välisotsa rõhk 101 000 Pa ja kopsupoolse otsa rõhk 100 800 Pa. Mis suunas liigub õhk selle rõhkude vahe toimel?', options: ['Väljast kopsu poole.', 'Kopsust väljapoole.', 'Õhk ei saa liikuda, sest mõlemad rõhud on positiivsed.', 'Suunda ei saa rõhkude võrdlemisel kunagi määrata.'], answer: 0, explanation: 'Välisrõhk on 200 Pa kõrgem. Avatud õhutees suunab see rõhkude vahe üldise õhuvoolu kopsu poole.', skill: 'bulk_flow_direction'},
              {prompt: 'Hapniku osarõhk on alveoolis 13 kPa ja selle kõrval veres 5 kPa. Membraan laseb hapnikku läbi. Millises suunas toimub hapniku netodifusioon?', options: ['Verest alveooli, sest 5 on väiksem kui 13.', 'Mõlemas suunas täpselt võrdselt, sest kogurõhku pole antud.', 'Alveoolist verre, kõrgema hapniku osarõhu poolt madalama poole.', 'Hapnik saab liikuda ainult koos kogu õhuvooluga.'], answer: 2, explanation: 'Hapniku netodifusiooni suuna määrab siin hapniku osarõhkude erinevus: 13 kPa poolt 5 kPa poole. See ei ole sama protsess mis kogu õhu voolamine õhutees.', skill: 'partial_pressure_diffusion'},
              {"prompt": "Alus jaotab pinnaga risti mõjuva 140 N jõu 0,04 m² alale. Leia keskmine rõhk.", "options": ["5,6 Pa", "35 Pa", "560 Pa", "3500 Pa"], "answer": 3, "explanation": "p = 140 / 0,04 = 3500 Pa. N/m² on paskal.", "skill": "force_area_pressure"},
              {"prompt": "Sama risti mõjuva jõu all väheneb toetuspindala poolele. Kuidas muutub keskmine rõhk?", "options": ["Rõhk kahekordistub.", "Rõhk jääb samaks.", "Rõhk väheneb poolele.", "Rõhk neljakordistub."], "answer": 0, "explanation": "p = F / A. Pindala tegur 1/2 annab rõhu teguri 1 / (1/2) = 2.", "skill": "pressure_area_relation"},
              {"prompt": "Kasti raskusjõud ei muutu. Kasti pööramisel väheneb lauale toetuv pindala 0,06 m²-lt 0,02 m²-le. Kui suur on uue ja vana keskmise rõhu suhe?", "options": ["1/3", "1", "3", "9"], "answer": 2, "explanation": "Jõud jääb samaks. p_uus / p_vana = A_vana / A_uus = 0,06 / 0,02 = 3.", "skill": "pressure_area_relation"},
              {"prompt": "Avatud toru vasakus otsas on õhurõhk 102 kPa ja paremas 100 kPa. Mis suunas tekib rõhkude vahe toimel õhuvool?", "options": ["Paremalt vasakule.", "Vasakult paremale.", "Voolu pole, sest mõlemad rõhud on positiivsed.", "Alati mõlemas suunas võrdse netovooluga."], "answer": 1, "explanation": "102 kPa > 100 kPa: rõhkude vahe suunab üldise voolu vasakult paremale.", "skill": "bulk_flow_direction"},
              {"prompt": "Lihtsas mudelis ühendab avatud ventiil anuma A rõhuga 98 kPa ja anuma B rõhuga 101 kPa. Mis suunas tekib rõhkude vahe toimel õhuvool?", "options": ["A-st B-sse.", "Voolu pole, sest rõhud on peaaegu võrdsed.", "Suund sõltub ainult anuma nimest.", "B-st A-sse."], "answer": 3, "explanation": "B kogurõhk on 3 kPa kõrgem. Rõhkude vahe tekitab voolu B-st A-sse.", "skill": "bulk_flow_direction"},
              {"prompt": "Hapnikku läbilaskva membraani vasakul poolel on hapniku osarõhk 6 kPa ja paremal 2 kPa. Mis suunas toimub hapniku netodifusioon?", "options": ["Paremalt vasakule.", "Võrdselt mõlemas suunas, sest rõhud on positiivsed.", "Vasakult paremale.", "Hapnik ei läbi membraani ilma kogu õhuvooluta."], "answer": 2, "explanation": "Võrdleme hapniku osarõhke: 6 > 2. Netodifusioon on vasakult paremale.", "skill": "partial_pressure_diffusion"},
              {"prompt": "Hapnikku läbilaskva membraani pooltel A ja B on kogurõhk sama. Hapniku osarõhk on A-s 3 kPa ja B-s 7 kPa. Mis suunas toimub hapniku netodifusioon?", "options": ["A-st B-sse.", "B-st A-sse.", "Netodifusiooni pole, sest kogurõhud on võrdsed.", "Hapnik liigub ainult koos kogu gaasiseguga."], "answer": 1, "explanation": "Hapniku osarõhk on B-s kõrgem: 7 > 3. Hapnik difundeerub netona B-st A-sse ka võrdse kogurõhu korral.", "skill": "partial_pressure_diffusion"},
              {"prompt": "Kui palju suureneb rõhk paigalseisvas vees 0,1 m sügavamale liikudes? rho = 1000 kg/m³, g = 10 N/kg. Kasuta Δp = rho × g × h.", "options": ["100 Pa", "1000 Pa", "10 000 Pa", "10 Pa"], "answer": 1, "explanation": "Δp = 1000 × 10 × 0,1 = 1000 Pa. See on muutus, mitte kogurõhk.", "skill": "hydrostatic_difference"},
              {"prompt": "Paigalseisva ühtlase õli tihedus on 800 kg/m³. Kui palju suureneb rõhk 0,6 m sügavamale liikudes? g = 10 N/kg.", "options": ["480 Pa", "48 000 Pa", "4800 Pa", "8000 Pa"], "answer": 2, "explanation": "Δp = 800 × 10 × 0,6 = 4800 Pa. Pinnale mõjuv rõhk jääb muutuse arvutusest välja.", "skill": "hydrostatic_difference"}
            ]
          },
          {
            id: 'energy_power',
            title: 'Energia, töö ja võimsus',
            english: 'Energy, work and power',
            why: 'Energia kogus ja selle ülekandmise kiirus on eri asjad nii seadmes kui lihase töös.',
            explanation: [
              "Energiat ja tööd mõõdetakse džaulides (J). Kui muutumatu jõud mõjub nihkega samas suunas, on töö W = F × s. Teistes suundades ei sobi see lihtkuju ilma parandusteta.",
              "Keskmine võimsus on ülekantud energia või tehtud töö ajaühikus: P = delta E / delta t. 1 W = 1 J/s. Sama töö tegemine lühema ajaga tähendab suuremat keskmist võimsust.",
              "Energia ei kao: kasuliku töö kõrval võib energiat kanduda näiteks soojusena. Kasutegur = kasulik energia / kogu sisendenergia. ATP ei ole energia ise; rakus seovad ATP-ga seotud reaktsioonid energia ülekande teiste protsessidega."
            ],
            worked: {
              prompt: 'Mootor tõmbab koormat muutumatu 20 N jõuga 3 m jõu suunas. See võtab 10 s. Leia töö ja keskmine võimsus.',
              steps: [
                "Kõigepealt leiame jõu tehtud töö kogu teel; seejärel jagame selle kulunud sekundite peale.",
                "Töö W = F × s = 20 N × 3 m = 60 J.",
                "Keskmine võimsus P = W / t.",
                "P = 60 J / 10 s = 6 W."
              ],
              answer: 'Töö on 60 J ja keskmine võimsus 6 W.'
            },
            sources: [{title: 'Füüsika 8. klassile: mehaaniline töö, energia, võimsus ja kasutegur', url: 'https://opik.fyysika.ee/index.php/book/view/36'}],
            followupVersion: 1,
            followups: {
              "0": {
                "skill": "power_from_energy_time",
                "title": "Võimsus energiast ja ajast",
                "explanation": [
                  "Võimsus kirjeldab energia ülekandmise tempot: kui palju energiat kantakse üle ühes sekundis? Sama energia lühema ajaga tähendab suuremat võimsust.",
                  "Keskmine võimsus P = E / t. J/s on vatt W."
                ],
                "worked": {
                  "prompt": "Seade kannab 4 sekundiga üle 36 J energiat. Leia keskmine võimsus.",
                  "steps": [
                    "Jaotame 36 džauli nelja sekundi peale, et leida ühe sekundi keskmine.",
                    "P = 36 J / 4 s = 9 J/s."
                  ],
                  "answer": "Keskmine võimsus on 9 W."
                },
                "simpleIndex": 6,
                "applicationIndex": 7
              },
              "1": {
                "skill": "energy_power_units",
                "title": "Energia ja võimsuse ühikud",
                "explanation": [
                  "Energia on kogus ning selle ühik on džaul J. Võimsus on energia ülekandmise kiirus ning selle ühik on vatt W.",
                  "1 W = 1 J/s. Sama energia võib üle kanduda eri võimsusega, kui aeg on erinev."
                ],
                "worked": {
                  "prompt": "Mõõtmine annab üle kantud energiaks 24 ja keskmiseks võimsuseks 6. Millised ühikud käivad nende arvude juurde?",
                  "steps": [
                    "Energia kogus kirjutatakse džaulides.",
                    "Energia ülekandmise kiirus kirjutatakse vattides."
                  ],
                  "answer": "Energia on 24 J ja võimsus 6 W."
                },
                "simpleIndex": 8,
                "applicationIndex": 9
              },
              "4": {
                "skill": "efficiency",
                "title": "Kasuliku energia osakaal",
                "explanation": [
                  "Kasutegur küsib, milline osa saadud energiast jõuab soovitud kasulikku väljundisse. Ülejäänud energia ei kao, vaid kandub mujale või teistesse vormidesse.",
                  "Kasutegur = kasulik väljundenergia / kogu sisendenergia. Protsendi saamiseks korruta 100-ga."
                ],
                "worked": {
                  "prompt": "Seade saab 200 J energiat ja annab 80 J kasulikku väljundenergiat. Leia kasutegur.",
                  "steps": [
                    "80 džauli on kasulik osa kogu 200 džaulist; ülejäänu peab samuti väljundites arvesse minema.",
                    "80 / 200 = 0,40.",
                    "0,40 × 100% = 40%. Ülejäänud 120 J kandub muudesse väljunditesse."
                  ],
                  "answer": "Kasutegur on 40%."
                },
                "simpleIndex": 10,
                "applicationIndex": 11
              },
              "5": {
                "skill": "energy_vs_power_transfer",
                "title": "Sama töö võimsuste võrdlus",
                "explanation": [
                  "Sama töö lühema ajaga tähendab, et igas sekundis tehakse rohkem tööd. Seetõttu on kiiremini sama töö lõpetava mootori keskmine võimsus suurem.",
                  "P = W / t. Sama töö korral on võimsus ajaga pöördvõrdeline."
                ],
                "worked": {
                  "prompt": "Kaks mootorit teevad kumbki 120 J tööd. A teeb seda 12 s ja B 4 s jooksul. Mitu korda suurem on B keskmine võimsus?",
                  "steps": [
                    "B teeb sama töö kolm korda lühema ajaga, seega peab tema keskmine võimsus olema kolm korda suurem.",
                    "P_A = 120 / 12 = 10 W; P_B = 120 / 4 = 30 W.",
                    "P_B / P_A = 30 / 10 = 3."
                  ],
                  "answer": "B keskmine võimsus on 3 korda suurem."
                },
                "simpleIndex": 12,
                "applicationIndex": 13
              },
              "2": {
                "skill": "mechanical_work",
                "title": "Muutumatu jõu töö",
                "explanation": [
                  "Sama liikumissuunalise jõu pikemal teel mõjumisel tehakse rohkem tööd. Sama teepikkuse juures annab suurem selline jõud suurema töö.",
                  "Muutumatu jõu ja samasuunalise nihke korral W = F × s. N × m = J; muude suundade korral see lihtkuju ei sobi."
                ],
                "worked": {
                  "prompt": "Muutumatu 6 N jõud mõjub nihkega samas suunas 5 m jooksul. Leia selle jõu töö.",
                  "steps": [
                    "Jõud mõjub liikumise suunas kogu viiemeetrisel teel, seega saab siin kasutada jõu ja teepikkuse korrutist.",
                    "W = 6 N × 5 m = 30 J."
                  ],
                  "answer": "Jõu töö on 30 J."
                },
                "simpleIndex": 14,
                "applicationIndex": 15
              },
              "3": {
                "skill": "power_from_work_time",
                "title": "Töö keskmine võimsus",
                "explanation": [
                  "Kasuliku töö võimsus ütleb, kui palju kasulikku tööd tehakse keskmiselt ühes sekundis. Jaga kogu kasulik töö selle tegemiseks kulunud aja peale.",
                  "P = töö / aeg. Kasulik võimsus ei pruugi olla sama mis sisendvõimsus."
                ],
                "worked": {
                  "prompt": "Pump teeb 8 sekundiga 64 J kasulikku tööd. Leia kasuliku töö keskmine võimsus.",
                  "steps": [
                    "Otsime keskmist kasulikku tööd ühe sekundi kohta.",
                    "P = 64 J / 8 s = 8 W."
                  ],
                  "answer": "Kasuliku töö keskmine võimsus on 8 W."
                },
                "simpleIndex": 16,
                "applicationIndex": 17
              }
            },
            questions: [
              {prompt: 'Seade kannab 6 sekundiga üle 120 J energiat. Milline on keskmine võimsus?', options: ['720 W', '0,05 W', '20 W', '126 W'], answer: 2, explanation: 'P = delta E / delta t = 120 J / 6 s = 20 W.', skill: 'power_from_energy_time'},
              {prompt: 'Milline paar seob suuruse õige ühikuga?', options: ['Energia – J; võimsus – W.', 'Energia – W; võimsus – J.', 'Energia – N; võimsus – m.', 'Energia – Pa; võimsus – kg.'], answer: 0, explanation: 'Energia ühik on džaul (J). Võimsuse ühik on vatt (W), mis tähendab džauli sekundis.', skill: 'energy_power_units'},
              {prompt: 'Muutumatu 15 N jõud tõmbab kelku 4 m jõuga samas suunas. Kui suur on selle jõu töö?', options: ['3,75 J', '19 J', '11 J', '60 J'], answer: 3, explanation: 'Jõud on muutumatu ja nihkega samas suunas, seega W = F × s = 15 × 4 = 60 J.', skill: 'mechanical_work'},
              {prompt: 'Pump teeb 20 sekundiga 600 J kasulikku tööd. Milline on selle töö keskmine võimsus?', options: ['12 000 W', '30 W', '0,033 W', '620 W'], answer: 1, explanation: 'P = W / t = 600 J / 20 s = 30 W. Siin küsitakse kasuliku töö, mitte kogu sisendi võimsust.', skill: 'power_from_work_time'},
              {prompt: 'Seade saab 1000 J elektrienergiat ja annab 250 J kasulikku mehaanilist energiat. Kui suur on kasutegur?', options: ['4%', '75%', '25%', '400%'], answer: 2, explanation: 'Kasutegur = 250 / 1000 = 0,25 ehk 25%. Ülejäänud energia ei kao; see kandub teistesse vormidesse või mujale.', skill: 'efficiency'},
              {prompt: 'Kaks mootorit teevad kumbki 90 J tööd. Esimene teeb seda 3 s ja teine 6 s jooksul. Kuidas võrdub teise mootori keskmine võimsus esimese omaga?', options: ['See on poole väiksem.', 'See on kaks korda suurem.', 'See on sama suur, sest töö on sama.', 'See on neli korda suurem.'], answer: 0, explanation: 'Esimese võimsus on 90/3 = 30 W ja teise 90/6 = 15 W. Sama töö kaks korda pikema ajaga tähendab poolt võimsust.', skill: 'energy_vs_power_transfer'},
              {"prompt": "Seade kannab 2 sekundiga üle 10 J energiat. Kasuta P = E / t. Leia keskmine võimsus.", "options": ["20 W", "5 W", "8 W", "0,2 W"], "answer": 1, "explanation": "P = 10 J / 2 s = 5 W.", "skill": "power_from_energy_time"},
              {"prompt": "Seade kannab 12 sekundiga üle 420 J energiat. Leia keskmine võimsus.", "options": ["5040 W", "408 W", "35 W", "0,0286 W"], "answer": 2, "explanation": "P = 420 J / 12 s = 35 W.", "skill": "power_from_energy_time"},
              {"prompt": "Energiakogus on 4 džauli ja keskmine võimsus 2 vatti. Milline tähistus on õige?", "options": ["Energia 4 W; võimsus 2 J.", "Energia 4 N; võimsus 2 Pa.", "Energia 4 J; võimsus 2 J.", "Energia 4 J; võimsus 2 W."], "answer": 3, "explanation": "Energia ühik džaul on J; võimsuse ühik vatt on W. Mõlemad tähised peavad sobima oma suurusega.", "skill": "energy_power_units"},
              {"prompt": "Seade kannab igas sekundis üle 7 J energiat. Milline väide kirjeldab ühikuid õigesti?", "options": ["Energiakogus on 7 W.", "Võimsus on 7 J ja energiaühik W.", "Võimsus on 7 W, sest 1 W = 1 J/s.", "Võimsus on 7 C."], "answer": 2, "explanation": "7 J iga sekundi kohta on 7 J/s ehk 7 W. Energia kogust mõõdetakse J-des.", "skill": "energy_power_units"},
              {"prompt": "Seade saab 100 J energiat ning annab 50 J kasulikku väljundenergiat. Leia kasutegur.", "options": ["200%", "50%", "5%", "150%"], "answer": 1, "explanation": "50 / 100 × 100% = 50%. Ülejäänud 50 J ei kao, vaid kandub mujale või teistesse vormidesse.", "skill": "efficiency"},
              {"prompt": "Mootor saab 600 J elektrienergiat. Kasulik mehaaniline väljund on 180 J ja ülejäänud 420 J kandub soojusena ümbrusse. Leia kasutegur.", "options": ["70%", "333,3%", "30%", "42%"], "answer": 2, "explanation": "Kasulik energia jagatud sisendiga: 180 / 600 × 100% = 30%. Energiaarvestus: 180 + 420 = 600 J.", "skill": "efficiency"},
              {"prompt": "Kaks masinat teevad sama töö. A-l kulub 8 s, B-l 4 s. Milline on B ja A keskmiste võimsuste suhe P_B / P_A?", "options": ["1/2", "1", "4", "2"], "answer": 3, "explanation": "Sama töö korral P_B / P_A = t_A / t_B = 8 / 4 = 2.", "skill": "energy_vs_power_transfer"},
              {"prompt": "Kaks pumpa teevad kumbki 360 J kasulikku tööd. A-l kulub 9 s, B-l 12 s. Mis on kasulike keskmiste võimsuste suhe P_B / P_A?", "options": ["4/3", "3/4", "1", "3"], "answer": 1, "explanation": "P_A = 40 W ja P_B = 30 W. P_B / P_A = 30 / 40 = 3/4.", "skill": "energy_vs_power_transfer"},
              {"prompt": "Muutumatu 2 N jõud tõmbab keha 3 m jõu suunas. Leia selle jõu töö.", "options": ["1,5 J", "5 J", "6 J", "1 J"], "answer": 2, "explanation": "W = F × s = 2 × 3 = 6 J.", "skill": "mechanical_work"},
              {"prompt": "Muutumatu 35 N jõud tõmbab kasti 2,4 m jõuga samas suunas. Leia selle jõu töö.", "options": ["14,58 J", "37,4 J", "32,6 J", "84 J"], "answer": 3, "explanation": "Jõud ja nihe on samasuunalised, seega W = 35 × 2,4 = 84 J.", "skill": "mechanical_work"},
              {"prompt": "Seade teeb 2 sekundiga 12 J kasulikku tööd. Leia selle töö keskmine võimsus.", "options": ["24 W", "6 W", "10 W", "1/6 W"], "answer": 1, "explanation": "P = 12 J / 2 s = 6 W.", "skill": "power_from_work_time"},
              {"prompt": "Vints teeb 15 sekundiga 675 J kasulikku tööd. Leia kasuliku töö keskmine võimsus.", "options": ["10 125 W", "660 W", "45 W", "0,0222 W"], "answer": 2, "explanation": "P = 675 J / 15 s = 45 W. Vastus käib kasuliku töö, mitte kogu sisendi kohta.", "skill": "power_from_work_time"}
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
              steps: [
                "Pinge soodustab laengute liikumist ja takistus piirab voolu. Selle oomilise takisti puhul saame kasutada nende suhet.",
                "Kasuta I = U / R.",
                "I = 12 V / 4 oomi.",
                "12 / 4 = 3."
              ],
              answer: 'Voolutugevus on 3 A.'
            },
            sources: [
              {title: 'Füüsika 9. klassile: elektrivool, pinge ja Ohmi seadus', url: 'https://opik.fyysika.ee/index.php/book/view/70'},
              {title: 'Opiq: Elekter ja magnetism, laengukandjad ja elektrivool vedelikes (sisukord)', url: 'https://www.opiq.ee/Kit/Details/408'}
            ],
            followupVersion: 1,
            followups: {
              "0": {
                "skill": "charge_current",
                "title": "Voolutugevus laengust ja ajast",
                "explanation": [
                  "Voolutugevus näitab, kui palju laengut läbib ristlõiget ühes sekundis. Sama laengu läbiminek lühema ajaga tähendab suuremat keskmist voolu.",
                  "I = Q / t; 1 A = 1 C/s. Jaga laeng kulunud ajaga."
                ],
                "worked": {
                  "prompt": "Juhtme ristlõiget läbib 4 sekundiga 16 C laengut. Leia keskmine voolutugevus.",
                  "steps": [
                    "Jagame 16 kulonit nelja sekundi peale, et leida keskmine laeng ühe sekundi kohta.",
                    "I = 16 C / 4 s = 4 C/s."
                  ],
                  "answer": "Keskmine voolutugevus on 4 A."
                },
                "simpleIndex": 2,
                "applicationIndex": 6
              },
              "1": {
                "skill": "energy_per_charge",
                "title": "Pinge kui energia laenguühiku kohta",
                "explanation": [
                  "Pinge ütleb, kui palju energiat kantakse üle ühe laenguühiku liikumisel. Sama energia väiksema laengukoguse kohta tähendab suuremat pinget.",
                  "U = E / Q; 1 V = 1 J/C. Jaga energia laenguga."
                ],
                "worked": {
                  "prompt": "2 C laengu liikumisel kantakse üle 18 J energiat. Leia pinge.",
                  "steps": [
                    "18 džauli vastab kahele kulonile; ühe kuloni kohta tuleb pool sellest energiast.",
                    "U = 18 J / 2 C = 9 J/C."
                  ],
                  "answer": "Pinge on 9 V."
                },
                "simpleIndex": 7,
                "applicationIndex": 8
              },
              "4": {
                "skill": "voltage_current_scaling",
                "title": "Pinge mõju voolutugevusele",
                "explanation": [
                  "Sama oomilise takisti juures annab suurem pinge samas suhtes suurema voolutugevuse. Takistus ja temperatuur peavad võrdluses püsima.",
                  "I = U / R. Püsiva R korral on I pingega võrdeline."
                ],
                "worked": {
                  "prompt": "Sama oomilise takisti pinge kasvab 2 V-lt 8 V-le. Takistus ja temperatuur püsivad. Kui suur on uus voolutugevus vana suhtes?",
                  "steps": [
                    "Pinge muutustegur on 8 / 2 = 4.",
                    "Püsiva R korral kasvab I sama teguriga."
                  ],
                  "answer": "Voolutugevus on 4 korda varasem."
                },
                "simpleIndex": 9,
                "applicationIndex": 10
              },
              "5": {
                "skill": "ionic_current_transfer",
                "title": "Ioonid elektrivoolu kandjatena",
                "explanation": [
                  "Elektrivool on laengukandjate suunatud liikumine. Laengukandjad võivad olla elektronid või ioonid.",
                  "Voolu kandmiseks peavad osakesed olema laetud. Lahustes ja membraanikanalites saavad liikuda ioonid; rakus mõjutab liikumist ka kontsentratsioonide erinevus."
                ],
                "worked": {
                  "prompt": "Vesilahuses liiguvad K+ ioonid suunatult. Kas see saab kanda elektrivoolu?",
                  "steps": [
                    "K+ ioonil on positiivne elektrilaeng.",
                    "Laetud osakeste suunatud liikumine kannab elektrivoolu."
                  ],
                  "answer": "Jah, suunatult liikuvad K+ ioonid võivad kanda voolu."
                },
                "simpleIndex": 11,
                "applicationIndex": 12
              },
              "3": {
                "skill": "ohms_law",
                "title": "Ohmi seadusest voolutugevus",
                "explanation": [
                  "Suurem pinge suurendab oomilises takistis voolu; suurem takistus sama pinge juures vähendab seda. Need mõjud on jagatises eri pooltel.",
                  "I = U / R. See mudel eeldab oomilist takistit püsival temperatuuril; V / Ω = A."
                ],
                "worked": {
                  "prompt": "Oomilise takisti otstel on pinge 20 V ja takistus 5 oomi püsival temperatuuril. Leia voolutugevus.",
                  "steps": [
                    "Voolu leidmiseks jagame liikumist soodustava pinge seda piirava takistusega.",
                    "I = 20 V / 5 oomi = 4 A."
                  ],
                  "answer": "Voolutugevus on 4 A."
                },
                "simpleIndex": 13,
                "applicationIndex": 14
              }
            },
            questions: [
              {prompt: 'Juhtme ristlõiget läbib 3 sekundiga 6 C laengut. Milline on keskmine voolutugevus?', options: ['18 A', '2 A', '0,5 A', '9 A'], answer: 1, explanation: 'I = delta Q / delta t = 6 C / 3 s = 2 A.', skill: 'charge_current'},
              {prompt: '3 C laengu liikumisel kantakse üle 12 J energiat. Kui suur on pinge?', options: ['36 V', '0,25 V', '9 V', '4 V'], answer: 3, explanation: 'Pinge = energia laenguühiku kohta: 12 J / 3 C = 4 V.', skill: 'energy_per_charge'},
              {prompt: 'Teist juhet läbib 3 sekundiga 9 C laengut. Leia keskmine voolutugevus.', options: ['3 A', '27 A', '0,333 A', '6 A'], answer: 0, explanation: 'I = 9 C / 3 s = 3 A. Laeng jagatakse ajaga.', skill: 'charge_current'},
              {prompt: 'Oomilise takisti takistus on püsival temperatuuril 3 oomi ja pinge 6 V. Leia voolutugevus.', options: ['18 A', '0,5 A', '2 A', '9 A'], answer: 2, explanation: 'I = U / R = 6 V / 3 oomi = 2 A. Ülesandes on antud Ohmi seaduse kasutamiseks sobiv mudel.', skill: 'ohms_law'},
              {prompt: 'Sama oomilise takisti pinge tõuseb 4 V-lt 12 V-le. Takistus ja temperatuur ei muutu. Kuidas muutub voolutugevus?', options: ['Väheneb kolmandikuni.', 'Ei muutu.', 'Suureneb üheksa korda.', 'Suureneb kolm korda.'], answer: 3, explanation: 'I = U / R. Pinge suureneb kolm korda ja R püsib sama, seega suureneb voolutugevus kolm korda.', skill: 'voltage_current_scaling'},
              {prompt: 'Rakumembraani avatud kanalis liiguvad naatriumioonid Na+. Milline väide on õige?', options: ['Elektrivoolu pole, sest voolu saavad kanda ainult elektronid.', 'Laetud ioonide liikumine võib kanda elektrivoolu.', 'Pinge ja voolutugevus on selles kanalis sama suurus.', 'Ioonide liikumist ei saa kontsentratsioonide erinevus mõjutada.'], answer: 1, explanation: 'Elektrivool on laengukandjate suunatud liikumine; kandjad võivad olla ka ioonid. Nende liikumist rakus mõjutavad nii elektriline mõju kui kontsentratsioonide erinevus.', skill: 'ionic_current_transfer'},
              {"prompt": "Juhtme ristlõiget läbib 8 sekundiga 40 C laengut. Leia keskmine voolutugevus.", "options": ["320 A", "0,2 A", "5 A", "48 A"], "answer": 2, "explanation": "I = 40 C / 8 s = 5 A.", "skill": "charge_current"},
              {"prompt": "1 C laengu liikumisel kantakse üle 5 J energiat. Leia pinge.", "options": ["0,2 V", "6 V", "5 V", "4 V"], "answer": 2, "explanation": "U = 5 J / 1 C = 5 V.", "skill": "energy_per_charge"},
              {"prompt": "4 C laengu liikumisel kantakse üle 60 J energiat. Leia pinge.", "options": ["240 V", "15 V", "56 V", "0,0667 V"], "answer": 1, "explanation": "U = 60 J / 4 C = 15 V.", "skill": "energy_per_charge"},
              {"prompt": "Oomilise takisti pinge tõuseb 3 V-lt 6 V-le. Takistus ja temperatuur püsivad. Kuidas muutub voolutugevus?", "options": ["Kahekordistub.", "Väheneb poolele.", "Jääb samaks.", "Neljakordistub."], "answer": 0, "explanation": "I = U / R. Pinge tegur on 6 / 3 = 2, seega sama R korral ka I tegur 2.", "skill": "voltage_current_scaling"},
              {"prompt": "Oomilise takisti pinge langeb 10 V-lt 4 V-le. Takistus ja temperatuur ei muutu. Kui suur on uue ja vana voolutugevuse suhe?", "options": ["2,5", "0,4", "0,6", "4"], "answer": 1, "explanation": "Püsiva R korral I_uus / I_vana = U_uus / U_vana = 4 / 10 = 0,4.", "skill": "voltage_current_scaling"},
              {"prompt": "Lahuses liiguvad Cl− ioonid suunatult. Milline väide on õige?", "options": ["Voolu saavad kanda ainult elektronid metallis.", "Ioonidel ei ole laengut.", "Laetud kloriidioonide suunatud liikumine võib kanda elektrivoolu.", "Voolutugevus ja pinge on üks suurus."], "answer": 2, "explanation": "Cl− ioonid on laetud. Elektrivoolu võivad kanda ka negatiivsed ioonid.", "skill": "ionic_current_transfer"},
              {"prompt": "Avatud membraanikanalit läbivad Ca²+ ioonid suunatult. Miks võib see liikumine kanda elektrivoolu?", "options": ["Iga liikuv osake peab olema elektron.", "Liiguvad osakesed kannavad elektrilaengut.", "Vool tähendab üksnes vee liikumist.", "Ioonide laeng kaob kanalis alati."], "answer": 1, "explanation": "Ca²+ ioonid kannavad laengut. Suunatud ioonide liikumine võib anda elektrivoolu; kandja ei pea olema elektron.", "skill": "ionic_current_transfer"},
              {"prompt": "Oomilise takisti pinge on 5 V ja takistus püsival temperatuuril 5 oomi. Kasuta I = U / R. Leia voolutugevus.", "options": ["25 A", "10 A", "1 A", "0 A"], "answer": 2, "explanation": "I = 5 V / 5 oomi = 1 A.", "skill": "ohms_law"},
              {"prompt": "Oomilise takisti takistus püsival temperatuuril on 8 oomi. Selle otstel on pinge 12 V. Leia voolutugevus.", "options": ["96 A", "4 A", "0,6667 A", "1,5 A"], "answer": 3, "explanation": "I = 12 V / 8 oomi = 1,5 A.", "skill": "ohms_law"}
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
            followupVersion: 1,
            followups: {
              "0": {
                "skill": "photon_nm_to_metre",
                "title": "Nanomeetritest meetriteks",
                "explanation": [
                  "Nanomeeter on meetrist väga palju väiksem ühik. Sama pikkuse arvuline väärtus meetrites peab seetõttu olema palju väiksem.",
                  "1 nm = 10⁻⁹ m. Korruta nanomeetrite arv teguriga 10⁻⁹. Teaduslikus kirjaviisis säilita väärtus, kui muudad arvkordajat ja astendajat."
                ],
                "worked": {
                  "prompt": "Teisenda 700 nm meetriteks.",
                  "steps": [
                    "700 nanomeetrit on väike osa meetrist, mitte sadu meetreid.",
                    "700 × 10⁻⁹ m = 7,0 × 10² × 10⁻⁹ m.",
                    "10² × 10⁻⁹ = 10⁻⁷."
                  ],
                  "answer": "700 nm = 7,0 × 10⁻⁷ m."
                },
                "simpleIndex": 6,
                "applicationIndex": 7
              },
              "1": {
                "skill": "orbital_probability_model",
                "title": "Orbitaal ja leidmise tõenäosus",
                "explanation": [
                  "Orbitaal kirjeldab elektroni kvantolekut. Sellest saab leida elektroni asukoha tõenäosusjaotuse.",
                  "See ei anna kindlat klassikalist ringrada ega üht alati hõivatud punkti. Seotud elektroni lubatud energiatasemed on diskreetsed."
                ],
                "worked": {
                  "prompt": "Aatomipildil on ühe orbitaali tõenäosuspilv. Kas see joonistab elektroni kindla liikumistee?",
                  "steps": [
                    "Pilv kirjeldab elektroni leidmise tõenäosust eri piirkondades.",
                    "Klassikalist kindlat trajektoori sellest ei järeldata."
                  ],
                  "answer": "Pilv kujutab leidmise tõenäosust, mitte kindlat liikumisteed."
                },
                "simpleIndex": 8,
                "applicationIndex": 9
              },
              "4": {
                "skill": "photon_wavelength_energy_ratio",
                "title": "Lainepikkuste ja footonienergiate suhe",
                "explanation": [
                  "Pikem lainepikkus tähendab vaakumis väiksemat sagedust ja seega väiksemat ühe footoni energiat. Kui lainepikkus kahekordistub, väheneb energia poole võrra.",
                  "E = h × c / λ, seega E_uus / E_vana = λ_vana / λ_uus. See võrdleb üksikuid footoneid, mitte allikate koguvõimsust."
                ],
                "worked": {
                  "prompt": "Võrdle vaakumis 200 nm ja 800 nm footoneid. Kui suur on 800 nm footoni energia 200 nm footoni energia suhtes?",
                  "steps": [
                    "800 nm on neli korda pikem lainepikkus kui 200 nm, seega selle footoni energia peab olema neli korda väiksem.",
                    "E₈₀₀ / E₂₀₀ = 200 / 800 = 1/4."
                  ],
                  "answer": "800 nm footoni energia on neljandik 200 nm footoni energiast."
                },
                "simpleIndex": 10,
                "applicationIndex": 11
              },
              "5": {
                "skill": "atomic_transition_frequency",
                "title": "Aatomi üleminekust footoni sageduseni",
                "explanation": [
                  "Kui aatom läheb kõrgemalt energiatasemelt madalamale ja kiirgab ühe footoni, kannab footon ära tasemete energiavahe ΔE.",
                  "ΔE = h × f, seega f = ΔE / h. Ühik J / (J·s) = 1/s = Hz. Kasutame h = 6,6 × 10⁻³⁴ J·s."
                ],
                "worked": {
                  "prompt": "Aatom kiirgab ühe footoni üleminekul, mille energiavahe on 2,64 × 10⁻¹⁹ J. Leia sagedus.",
                  "steps": [
                    "Ühe kiiratud footoni energia peab võrduma aatomi kaotatud energiaga; sellest energiast leiame sageduse.",
                    "f = (2,64 × 10⁻¹⁹) / (6,6 × 10⁻³⁴) Hz.",
                    "f = 0,4 × 10¹⁵ Hz = 4,0 × 10¹⁴ Hz."
                  ],
                  "answer": "Footoni sagedus on 4,0 × 10¹⁴ Hz."
                },
                "simpleIndex": 12,
                "applicationIndex": 13
              },
              "2": {
                "skill": "photon_energy_from_frequency",
                "title": "Footoni energia sagedusest",
                "explanation": [
                  "Suurema sagedusega kiirguse üks footon kannab rohkem energiat. Energia suureneb sagedusega samas suhtes; võrdleme siin üht footonit.",
                  "E = h × f. Plancki konstandi ühik J·s ja sageduse ühik 1/s annavad korrutamisel J. Kümne astmete korrutamisel astendajad liidetakse."
                ],
                "worked": {
                  "prompt": "Sagedus on 2,0 × 10¹⁴ Hz. Leia footoni energia, kui h = 6,6 × 10⁻³⁴ J·s.",
                  "steps": [
                    "Sagedus määrab ühe footoni energia; selle arvutamiseks korrutame sageduse Plancki konstandiga.",
                    "E = (6,6 × 2,0) × 10⁻³⁴⁺¹⁴ J.",
                    "13,2 × 10⁻²⁰ J = 1,32 × 10⁻¹⁹ J."
                  ],
                  "answer": "Footoni energia on 1,32 × 10⁻¹⁹ J."
                },
                "simpleIndex": 14,
                "applicationIndex": 15
              },
              "3": {
                "skill": "photon_energy_from_wavelength",
                "title": "Footoni energia lainepikkusest",
                "explanation": [
                  "Vaakumis liigub valgus sama kiirusega. Lühema lainepikkuse korral möödub sekundis rohkem võnkeid: sagedus on suurem ja ühe footoni energia samuti suurem.",
                  "f = c / λ ja E = h × f, seega E = h × c / λ. Lainepikkus peab olema meetrites, kui c on m/s."
                ],
                "worked": {
                  "prompt": "Vaakumis on lainepikkus 500 nm. Leia energia, kui h = 6,6 × 10⁻³⁴ J·s ja c = 3,0 × 10⁸ m/s.",
                  "steps": [
                    "Leiame lainepikkusest sageduse kaudu ühe footoni energia; valem ühendab need kaks sammu.",
                    "λ = 500 × 10⁻⁹ m = 5,0 × 10⁻⁷ m.",
                    "E = (6,6 × 3,0 / 5,0) × 10⁻³⁴⁺⁸⁺⁷ J = 3,96 × 10⁻¹⁹ J."
                  ],
                  "answer": "Ühe footoni energia on 3,96 × 10⁻¹⁹ J."
                },
                "simpleIndex": 16,
                "applicationIndex": 17
              }
            },
            questions: [
              {prompt: 'Footoni energia arvutamiseks tahad kasutada c väärtust ühikus m/s. Lainepikkus on 450 nm. Milline on sama lainepikkus meetrites? 1 nm = 10⁻⁹ m.', options: ['4,5 × 10⁻⁹ m', '4,5 × 10⁻⁷ m', '4,5 × 10⁷ m', '4,5 × 10⁻⁶ m'], answer: 1, explanation: '450 nm = 450 × 10⁻⁹ m = 4,5 × 10⁻⁷ m. Arv muutub ühikuga koos, tegelik lainepikkus jääb samaks.', skill: 'photon_nm_to_metre'},
              {prompt: 'Milline kirjeldus sobib tänapäevase kvantmehaanilise aatomimudeliga?', options: ['Iga elektron peab liikuma mööda kindlat klassikalist ringorbiiti.', 'Orbitaal on koht aatomituumas, kus elektron alati paigal seisab.', 'Mudeli järgi puuduvad aatomil lubatud energiatasemed.', 'Mudel annab elektroni leidmise tõenäosusjaotuse, mitte kindla klassikalise ringraja.'], answer: 3, explanation: 'Orbitaal kirjeldab elektroni kvantolekut ja sellest saab leida asukoha tõenäosusjaotuse. See ei ole Bohri mudeli kindel ringorbiit. Seotud elektroni lubatud energiatasemed on diskreetsed.', skill: 'orbital_probability_model'},
              {prompt: 'Ühe footoni sagedus on 3,0 × 10¹⁴ Hz. Kasuta E = h × f ja h = 6,6 × 10⁻³⁴ J·s. Milline on selle footoni energia?', options: ['1,98 × 10⁻¹⁹ J', '1,98 × 10⁻⁴⁷ J', '2,2 × 10⁻⁴⁸ J', '1,98 × 10¹⁹ J'], answer: 0, explanation: 'E = 6,6 × 3,0 × 10⁻³⁴⁺¹⁴ J = 19,8 × 10⁻²⁰ J = 1,98 × 10⁻¹⁹ J. Sagedusega korrutatakse; astendajad liidetakse. J·s × Hz = J.', skill: 'photon_energy_from_frequency'},
              {prompt: 'Valguse lainepikkus vaakumis on 400 nm. Leia ühe footoni energia, kasutades E = h × c / λ, h = 6,6 × 10⁻³⁴ J·s ja c = 3,0 × 10⁸ m/s. 1 nm = 10⁻⁹ m.', options: ['4,95 × 10⁻²⁸ J', '1,65 × 10⁻¹⁹ J', '4,95 × 10⁻¹⁹ J', '7,92 × 10⁻³² J'], answer: 2, explanation: 'λ = 4,0 × 10⁻⁷ m. E = (6,6 × 10⁻³⁴ × 3,0 × 10⁸) / (4,0 × 10⁻⁷) J = 4,95 × 10⁻¹⁹ J. Jagamine nanomeetrite arvu 400-ga ilma ühikute teisenduseta annaks vale suurusjärgu.', skill: 'photon_energy_from_wavelength'},
              {prompt: 'Võrdled vaakumis kiirguvaid 300 nm ja 600 nm lainepikkusega footoneid. Kasuta E = h × c / λ. Kuidas võrdub ühe 600 nm footoni energia ühe 300 nm footoni energiaga?', options: ['See on kaks korda suurem.', 'See on sama suur.', 'See on neli korda suurem.', 'See on poole väiksem.'], answer: 3, explanation: 'Lainepikkus kahekordistub ja h ning c ei muutu. Energia on lainepikkusega pöördvõrdeline: E₆₀₀ / E₃₀₀ = 300 / 600 = 1/2. Võrdlus käib ühe footoni energia, mitte valgusallika koguvõimsuse kohta.', skill: 'photon_wavelength_energy_ratio'},
              {prompt: 'Aatom läheb kõrgemalt energiatasemelt madalamale ja kiirgab ühe footoni. Tasemete energiavahe on 3,96 × 10⁻¹⁹ J. Leia footoni sagedus seosest ΔE = h × f, kui h = 6,6 × 10⁻³⁴ J·s.', options: ['2,61 × 10⁻⁵² Hz', '6,0 × 10¹⁴ Hz', '1,67 × 10⁻¹⁵ Hz', '6,0 × 10⁻¹⁴ Hz'], answer: 1, explanation: 'Kiiratav footon viib ära tasemete energiavahe. f = ΔE / h = (3,96 / 6,6) × 10⁻¹⁹⁺³⁴ Hz = 0,6 × 10¹⁵ Hz = 6,0 × 10¹⁴ Hz. Energia jagatakse Plancki konstandiga; J / (J·s) = 1/s = Hz.', skill: 'atomic_transition_frequency'},
              {"prompt": "Teisenda 10 nm meetriteks. 1 nm = 10⁻⁹ m.", "options": ["1,0 × 10⁻¹⁰ m", "1,0 × 10⁻⁸ m", "1,0 × 10⁻⁹ m", "1,0 × 10⁸ m"], "answer": 1, "explanation": "10 × 10⁻⁹ = 1,0 × 10⁻⁸, seega 10 nm = 1,0 × 10⁻⁸ m.", "skill": "photon_nm_to_metre"},
              {"prompt": "Valguse lainepikkus on 520 nm. Milline on sama lainepikkus meetrites?", "options": ["5,2 × 10⁻⁹ m", "5,2 × 10⁷ m", "5,2 × 10⁻⁷ m", "5,2 × 10⁻⁶ m"], "answer": 2, "explanation": "520 × 10⁻⁹ m = 5,2 × 10² × 10⁻⁹ m = 5,2 × 10⁻⁷ m.", "skill": "photon_nm_to_metre"},
              {"prompt": "Mida kirjeldab orbitaalist saadav asukoha tõenäosusjaotus?", "options": ["Elektroni kindlat ringrada.", "Elektroni alati muutumatut asukohta.", "Tuuma trajektoori.", "Elektroni leidmise tõenäosust ruumi eri piirkondades."], "answer": 3, "explanation": "Kvantolekust saab arvutada asukoha tõenäosused; kindlat klassikalist trajektoori see ei määra.", "skill": "orbital_probability_model"},
              {"prompt": "Õppija joonistab orbitaali ja väidab, et joon on elektroni täpselt teada ringrada. Milline parandus sobib kvantmehaanilise mudeliga?", "options": ["Orbitaali kujutis näitab tõenäosusjaotust; kindlat klassikalist rada sellest ei saa.", "Elektron seisab selle joone igas punktis alati korraga paigal.", "Kõik elektronid peavad liikuma ühel kindlal ringil.", "Seotud elektronil pole lubatud energiatasemeid."], "answer": 0, "explanation": "Orbitaali kujutise mõte on elektroni leidmise tõenäosus, mitte kindel ringorbiit. Lubatud seotud energiatasemed on diskreetsed.", "skill": "orbital_probability_model"},
              {"prompt": "Vaakumis väheneb footoni lainepikkus 400 nm-lt 200 nm-le. Kui suur on uue ja vana footonienergia suhe?", "options": ["1/2", "1", "2", "4"], "answer": 2, "explanation": "E_uus / E_vana = λ_vana / λ_uus = 400 / 200 = 2.", "skill": "photon_wavelength_energy_ratio"},
              {"prompt": "Võrdle vaakumis lainepikkusi 450 nm ja 750 nm. Mis on ühe 750 nm footoni energia jagatuna ühe 450 nm footoni energiaga?", "options": ["5/3", "3/5", "1", "3"], "answer": 1, "explanation": "E₇₅₀ / E₄₅₀ = 450 / 750 = 3/5. Suurem lainepikkus annab väiksema ühe footoni energia.", "skill": "photon_wavelength_energy_ratio"},
              {"prompt": "Aatom kiirgab üleminekul ühe footoni energiaga 6,6 × 10⁻¹⁹ J. Leia sagedus seosest f = ΔE / h, kui h = 6,6 × 10⁻³⁴ J·s.", "options": ["1,0 × 10⁻¹⁵ Hz", "1,0 × 10¹⁵ Hz", "4,356 × 10⁻⁵² Hz", "1,0 × 10⁻⁵³ Hz"], "answer": 1, "explanation": "f = (6,6 / 6,6) × 10⁻¹⁹⁺³⁴ Hz = 1,0 × 10¹⁵ Hz.", "skill": "atomic_transition_frequency"},
              {"prompt": "Aatom läheb kõrgemalt energiatasemelt madalamale, kiirates ühe footoni. Energiavahe on 4,62 × 10⁻¹⁹ J. Leia sagedus; h = 6,6 × 10⁻³⁴ J·s.", "options": ["7,0 × 10⁻¹⁴ Hz", "3,0492 × 10⁻⁵² Hz", "7,0 × 10¹⁴ Hz", "1,4286 × 10⁻¹⁵ Hz"], "answer": 2, "explanation": "f = ΔE / h = (4,62 / 6,6) × 10¹⁵ Hz = 0,7 × 10¹⁵ Hz = 7,0 × 10¹⁴ Hz. Footoni energia võrdub tasemete energiavahega.", "skill": "atomic_transition_frequency"},
              {"prompt": "Footoni sagedus on 1,0 × 10¹⁴ Hz. Kasuta E = h × f ja h = 6,6 × 10⁻³⁴ J·s. Leia energia.", "options": ["6,6 × 10⁻⁴⁸ J", "6,6 × 10⁻²⁰ J", "6,6 × 10²⁰ J", "1,515 × 10⁴⁷ J"], "answer": 1, "explanation": "E = 6,6 × 1,0 × 10⁻³⁴⁺¹⁴ J = 6,6 × 10⁻²⁰ J.", "skill": "photon_energy_from_frequency"},
              {"prompt": "Footoni sagedus on 7,5 × 10¹⁴ Hz. Leia energia; h = 6,6 × 10⁻³⁴ J·s.", "options": ["4,95 × 10⁻⁴⁸ J", "8,8 × 10⁻⁴⁹ J", "4,95 × 10⁻¹⁹ J", "4,95 × 10¹⁹ J"], "answer": 2, "explanation": "E = 6,6 × 7,5 × 10⁻²⁰ J = 49,5 × 10⁻²⁰ J = 4,95 × 10⁻¹⁹ J.", "skill": "photon_energy_from_frequency"},
              {"prompt": "Vaakumis on lainepikkus juba teisendatud: λ = 1,0 × 10⁻⁶ m. Leia E = h × c / λ, kui h = 6,6 × 10⁻³⁴ J·s ja c = 3,0 × 10⁸ m/s.", "options": ["1,98 × 10⁻¹⁹ J", "1,98 × 10⁻³¹ J", "1,98 × 10¹⁹ J", "1,98 × 10⁻²⁵ J"], "answer": 0, "explanation": "E = (6,6 × 3,0 / 1,0) × 10⁻³⁴⁺⁸⁺⁶ J = 19,8 × 10⁻²⁰ J = 1,98 × 10⁻¹⁹ J.", "skill": "photon_energy_from_wavelength"},
              {"prompt": "Vaakumis on lainepikkus 300 nm. Leia ühe footoni energia. h = 6,6 × 10⁻³⁴ J·s, c = 3,0 × 10⁸ m/s ja 1 nm = 10⁻⁹ m.", "options": ["6,6 × 10⁻²⁸ J", "6,6 × 10⁻¹⁹ J", "5,94 × 10⁻³² J", "2,2 × 10⁻¹⁹ J"], "answer": 1, "explanation": "λ = 3,0 × 10⁻⁷ m. E = (6,6 × 3,0 / 3,0) × 10⁻³⁴⁺⁸⁺⁷ J = 6,6 × 10⁻¹⁹ J.", "skill": "photon_energy_from_wavelength"}
            ]
          }
        ]
      }
    }
  };
});
