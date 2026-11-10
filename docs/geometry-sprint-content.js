globalThis.GeometrySprintContent = {
  topics: {
    angles: "Hulknurga nurgad ja diagonaalid",
    properties: "Nelinurga omadused ja põhjendamine",
    areas: "Kõrgus ja pindala",
    mixed: "Trapets, liitkujund ja trigonomeetria",
  },

  diagnostic: [
    {
      topic: "angles",
      prompt: "Leia kumera 11-nurga sisenurkade summa.",
      unit: "°",
      answer: 1620,
      explanation: "Ühest tipust tekib 11 − 2 = 9 kolmnurka. 9 · 180° = 1620°.",
    },
    {
      topic: "angles",
      prompt: "Mitu diagonaali on kokku 11-nurgal?",
      answer: 44,
      explanation: "Igast tipust läheb 11 − 3 = 8 diagonaali. Kogu kujundis on 11 · 8 : 2 = 44 diagonaali, sest igaüht loeti kahest otsast.",
    },
    {
      topic: "angles",
      prompt: "Korrapärase kumera hulknurga üks välisnurk on 40°. Mitu külge on hulknurgal?",
      answer: 9,
      explanation: "Üks sama suunaga välisnurk igast tipust annab kokku 360°. 360° : 40° = 9.",
    },
    {
      topic: "properties",
      prompt: "Nelinurga kolm sisenurka on 73°, 106° ja 95°. Leia neljas nurk.",
      unit: "°",
      answer: 86,
      explanation: "Nelinurga sisenurkade summa on 360°. 360° − (73° + 106° + 95°) = 86°.",
    },
    {
      topic: "properties",
      prompt: "Rööpküliku diagonaalid on võrdse pikkusega. Mis on kõige täpsem kindel järeldus?",
      choices: ["Kujund on ruut.", "Kujund on ristkülik.", "Kujund on romb.", "Kõik küljed on võrdse pikkusega."],
      answer: 1,
      explanation: "Võrdsed diagonaalid annavad rööpkülikus ristküliku. Ruudu järeldamiseks on vaja ka võrdseid külgi või ristuvaid diagonaale.",
    },
    {
      topic: "areas",
      prompt: "Rombi diagonaalide pikkused on 10 cm ja 12 cm. Leia rombi pindala.",
      unit: "cm²",
      answer: 60,
      explanation: "Rombi diagonaalid on risti. Korruta nende täispikkused ja jaga kahega. 10 · 12 : 2 = 60 cm².",
    },
    {
      topic: "mixed",
      prompt: "Trapetsi alused on 15 cm ja 9 cm. Kõrgus on 8 cm. Leia pindala.",
      unit: "cm²",
      answer: 96,
      explanation: "Korruta paralleelsete aluste keskmine kõrgusega. (15 + 9) · 8 : 2 = 96 cm².",
    },
    {
      topic: "areas",
      prompt: "Rööpküliku alus on 9 cm, kõrvalkülg 8 cm ja nende vaheline teravnurk 30°. Leia pindala.",
      unit: "cm²",
      answer: 36,
      explanation: "Alusega risti olev kõrgus on 8 · sin 30° = 4 cm. Pindala on 9 · 4 = 36 cm².",
    },
  ],

  lessons: [
    {
      topic: "angles",
      title: "Hulknurga nurgad ja diagonaalid",
      rules: [
        "Ühest tipust joonestatud diagonaalid jagavad kumera n-nurga n − 2 kolmnurgaks. Sisenurkade summa on 180° · (n − 2).",
        "Ühest tipust väljub n − 3 diagonaali. Kokku on n · (n − 3) / 2 diagonaali, sest tippude kaupa loendades tuleb iga diagonaal arvesse kaks korda.",
        "Kumera hulknurga üks sama suunaga välisnurk iga tipu juures annab kokku 360°. Korrapärasel n-nurgal on üks välisnurk 360° / n ja sellega kõrvuti olev sisenurk 180° − 360° / n.",
      ],
      example: [
        "Korrapärase hulknurga välisnurk on 24°.",
        "Külgi on 360° : 24° = 15. Üks sisenurk on 180° − 24° = 156°.",
        "Sisenurkade summa on 13 · 180° = 2340°. Diagonaale on 15 · 12 : 2 = 90.",
      ],
      practice: [
        {
          topic: "angles",
          prompt: "Korrapärase hulknurga sisenurk on 135°. Mitu külge on hulknurgal?",
          answer: 8,
          explanation: "Välisnurk on 180° − 135° = 45°, seega n = 360° : 45° = 8.",
        },
        {
          topic: "angles",
          prompt: "Hulknurgal on 35 diagonaali. Mitu külge on hulknurgal?",
          answer: 10,
          explanation: "n · (n − 3) = 70. Võrrandi n² − 3n − 70 = 0 tegurdus on (n − 10)(n + 7) = 0. Külgede arv on 10.",
        },
      ],
    },
    {
      topic: "properties",
      title: "Nelinurga omadused ja põhjendamine",
      rules: [
        "Rööpküliku vastasküljed on paralleelsed ja võrdsed. Vastasnurgad on võrdsed, lähisnurkade summa on 180° ning diagonaalid poolitavad teineteist.",
        "Ristküliku diagonaalid on võrdsed. Rombi diagonaalid on risti ja poolitavad tipunurki. Ruudul kehtivad mõlemad omadused.",
        "Võrdhaarsel trapetsil on võrdsed haarad, sama aluse nurgad ja diagonaalid. Sama haara juures olevate nurkade summa on paralleelsete aluste tõttu 180°.",
      ],
      example: [
        "Põhjenda, et võrdsete diagonaalidega rööpkülik ABCD on ristkülik.",
        "Kolmnurkadel ABC ja BAD on ühine külg AB, rööpküliku vastasküljed BC ja AD on võrdsed ning eeldusest AC = BD. Kolmnurgad on KKK tunnuse järgi võrdsed.",
        "Seega ∠ABC = ∠BAD. Rööpküliku lähisnurkade summa on 180°, seega on mõlemad 90° ja kujund on ristkülik.",
      ],
      practice: [
        {
          topic: "properties",
          prompt: "Rööpküliku üks nurk on 117°. Kui suur on sellega lähisnurk?",
          unit: "°",
          answer: 63,
          explanation: "Rööpküliku lähisnurgad annavad kokku 180°. 180° − 117° = 63°.",
        },
        {
          topic: "properties",
          prompt: "Rööpküliku diagonaalid on risti. Millise liigi saab kindlasti järeldada?",
          choices: ["Ristkülik", "Romb", "Ruut", "Võrdhaarne trapets"],
          answer: 1,
          explanation: "Diagonaalid poolitavad teineteist. Pooldiagonaalidest tekkinud neli täisnurkset kolmnurka on võrdsete kaatetitega, seega on nende hüpotenuusid ehk rööpküliku küljed võrdsed.",
        },
      ],
    },
    {
      topic: "areas",
      title: "Kõrgus ja pindala",
      rules: [
        "Rööpküliku pindala S = a · h, kus h on alusega risti. Külgede a ja b vahelise nurga α korral h = b · sin α ning S = a · b · sin α.",
        "Rombi pindala S = d₁ · d₂ / 2. Siin on d₁ ja d₂ diagonaalide täispikkused.",
        "Rombi külje leidmiseks kasuta Pythagorase teoreemis pooldiagonaale. Rombi ümbermõõt on nelja külje summa.",
      ],
      example: [
        "Rööpküliku alus on 11 cm, kõrvalkülg 8 cm ja nende vaheline nurk 60°. Kõrgus on 8 · sin 60° = 4√3 cm. Pindala on 44√3 cm².",
        "Rombi diagonaalid on 6 cm ja 8 cm. Pindala on 6 · 8 : 2 = 24 cm².",
        "Pooldiagonaalid 3 cm ja 4 cm moodustavad täisnurkse kolmnurga kaatetid. Rombi külg on √(3² + 4²) = 5 cm ning ümbermõõt 20 cm.",
      ],
      practice: [
        {
          topic: "areas",
          prompt: "Rööpküliku küljed on 10 cm ja 6 cm. Nende vaheline nurk on 150°. Leia pindala.",
          unit: "cm²",
          answer: 30,
          explanation: "sin 150° = sin 30° = 0,5. S = 10 · 6 · 0,5 = 30 cm².",
        },
        {
          topic: "areas",
          prompt: "Rombi diagonaalide pikkused on 16 cm ja 30 cm. Leia ühe külje pikkus.",
          unit: "cm",
          answer: 17,
          explanation: "Pooldiagonaalid on 8 cm ja 15 cm. Külg on √(8² + 15²) = 17 cm.",
        },
      ],
    },
    {
      topic: "mixed",
      title: "Trapets, liitkujund ja koosinusteoreem",
      rules: [
        "Trapetsi pindala S = (a + b) · h / 2, kus a ja b on paralleelsed alused. Kesklõigu pikkus on (a + b) / 2.",
        "Võrdhaarse trapetsi kõrguste joonestamisel jääb pikema aluse kummassegi serva lõik pikkusega (a − b) / 2. Haar on tekkinud täisnurkse kolmnurga hüpotenuus.",
        "Liitkujundi pindala leidmiseks liida osade pindalad. Ümbermõõdu arvutamisel jälgi ainult välispiiri.",
        "Koosinusteoreem annab rööpküliku külgede a ja b vahel oleva nurga α vastas asuva diagonaali pikkuse. d² = a² + b² − 2ab cos α.",
      ],
      example: [
        "Võrdhaarse trapetsi alused on 19 cm ja 7 cm ning haar 10 cm. Pikema aluse kummaski servas on lõik (19 − 7) : 2 = 6 cm.",
        "Kõrgus on √(10² − 6²) = 8 cm. Pindala on (19 + 7) · 8 : 2 = 104 cm².",
        "Lisaharjutus koosinusteoreemiga. Rööpküliku küljed on 8 cm ja 5 cm, teravnurk 60°. Selle nurga vastas oleva diagonaali ruut on 8² + 5² − 2 · 8 · 5 · cos 60° = 49, seega diagonaal on 7 cm. Nürinurga vastas oleva diagonaali ruut on 129, seega 7 cm on lühem diagonaal.",
      ],
      practice: [
        {
          topic: "mixed",
          prompt: "Võrdhaarse trapetsi alused on 22 cm ja 10 cm ning haar 10 cm. Leia pindala.",
          unit: "cm²",
          answer: 128,
          explanation: "Servalõik on (22 − 10) : 2 = 6 cm ja kõrgus √(10² − 6²) = 8 cm. Pindala on (22 + 10) · 8 : 2 = 128 cm².",
        },
        {
          topic: "mixed",
          prompt: "Rööpküliku küljed on 7 cm ja 5 cm, nende vaheline teravnurk 60°. Leia lühema diagonaali pikkus.",
          choices: ["√39 cm", "√109 cm", "√74 cm", "12 cm"],
          answer: 0,
          explanation: "Teravnurga vastas oleva diagonaali ruut on 7² + 5² − 2 · 7 · 5 · cos 60° = 39. Teise diagonaali ruut on 109.",
        },
      ],
    },
  ],

  mock: [
    {
      topic: "angles",
      title: "Hulknurga diagonaalid ja nurgad",
      prompt: "Korrapärasel kumeral hulknurgal on 54 diagonaali. Leia külgede arv, sisenurkade summa ja ühe sisenurga suurus. Näita võrrandit või põhjenda külgede arvu.",
      marks: [
        "Kirjuta diagonaalide arvu võrrand n(n − 3) / 2 = 54.",
        "Lahenda (n − 12)(n + 9) = 0 või näita, et 12 · 9 / 2 = 54 ja diagonaalide arv kasvab koos n-ga. Sobib n = 12.",
        "Leia sisenurkade summa (12 − 2) · 180° = 1800°.",
        "Leia üks sisenurk 1800° : 12 = 150°.",
      ],
    },
    {
      topic: "properties",
      title: "Võrdhaarse trapetsi nurgad",
      prompt: "Võrdhaarses trapetsis ABCD on AB ja CD paralleelsed. Nurkade A ja D suhe on 2∶3. Leia kõik neli nurka ja põhjenda kasutatud nurgaseoseid.",
      marks: [
        "Põhjenda, et ∠A + ∠D = 180°, sest AD lõikab paralleelseid aluseid ja need on ühepoolsed sisenurgad.",
        "Kirjuta 2x + 3x = 180° ja leia x = 36°.",
        "Leia ∠A = 72° ja ∠D = 108°.",
        "Kasuta võrdhaarse trapetsi sama aluse nurkade võrdsust ja leia ∠B = 72° ning ∠C = 108°.",
      ],
    },
    {
      topic: "properties",
      title: "Diagonaalid ja nelinurga liik",
      prompt: "Rööpküliku diagonaalid on võrdsed ja risti. Põhjenda, miks kujund on ruut. Selgita eraldi, mida annab diagonaalide võrdsus ning mida annab nende ristumine täisnurga all.",
      marks: [
        "Võrdsed diagonaalid annavad rööpkülikus ristküliku ja täisnurgad. Põhjenduseks sobivad ka diagonaalidega moodustatud võrdsed kolmnurgad.",
        "Risti olevad diagonaalid annavad rööpkülikus rombi ja võrdsed küljed. Põhjenduseks sobib ka nelja täisnurkse kolmnurga võrdsus pooldiagonaalide põhjal.",
        "Järelda, et nelja võrdse külje ja nelja täisnurgaga kujund on ruut.",
      ],
    },
    {
      topic: "areas",
      title: "Rombi pindala ja ümbermõõt",
      prompt: "Rombi diagonaalid on 10 cm ja 24 cm. Leia pindala, külje pikkus ja ümbermõõt. Näita, millise täisnurkse kolmnurga abil leidsid külje.",
      marks: [
        "Leia pindala 10 · 24 : 2 = 120 cm².",
        "Märgi, et diagonaalid poolitavad teineteist ja on risti. Täisnurkse kolmnurga kaatetid on 5 cm ja 12 cm.",
        "Leia rombi külg √(5² + 12²) = 13 cm.",
        "Leia ümbermõõt 4 · 13 = 52 cm.",
      ],
    },
    {
      topic: "areas",
      title: "Rööpküliku kõrgus ja pindala",
      prompt: "Rööpküliku küljed on 12 cm ja 7 cm ning nende vaheline teravnurk on 30°. Leia 12 cm küljele tõmmatud kõrgus, pindala ja nürinurk. Näita kõrguse arvutust.",
      marks: [
        "Joonista või kirjelda täisnurkset kolmnurka, mille vastaskaatet on kõrgus ja hüpotenuus 7 cm.",
        "Leia kõrgus 7 · sin 30° = 3,5 cm.",
        "Leia pindala 12 · 3,5 = 42 cm².",
        "Leia lähisnurk 180° − 30° = 150°.",
      ],
    },
    {
      topic: "mixed",
      title: "Ristkülikust ja trapetsist liitkujund",
      prompt: "Paberist kujund koosneb ristkülikust mõõtmetega 16 cm × 9 cm ja võrdhaarsest trapetsist, mille alused on 16 cm ja 6 cm ning kumbki haar 13 cm. Osad jagavad kogu 16 cm külge ja asuvad sellest eri pooltel. Leia trapetsi kõrgus ning liitkujundi pindala ja ümbermõõt.",
      marks: [
        "Leia pikema aluse kummagi serva lõik (16 − 6) : 2 = 5 cm.",
        "Leia trapetsi kõrgus √(13² − 5²) = 12 cm.",
        "Leia trapetsi pindala (16 + 6) · 12 : 2 = 132 cm².",
        "Liida osade pindalad 132 + 16 · 9 = 276 cm².",
        "Leia välispiir 16 + 9 + 9 + 13 + 13 + 6 = 66 cm. Ühine 16 cm külg jääb liitkujundi sisse.",
      ],
    },
  ],

  warmup: [
    {
      topic: "angles",
      prompt: "Mitu diagonaali on kokku kumeral üheksanurgal?",
      answer: 27,
      explanation: "9 · (9 − 3) : 2 = 27. Ühest tipust läheb kuus diagonaali.",
    },
    {
      topic: "properties",
      prompt: "Võrdhaarse trapetsi üks nurk pikema aluse juures on 65°. Kui suur on sama haara juures olev nurk lühema aluse juures?",
      unit: "°",
      answer: 115,
      explanation: "Sama haara juures olevate nurkade summa on paralleelsete aluste tõttu 180°. 180° − 65° = 115°.",
    },
    {
      topic: "areas",
      prompt: "Rombi diagonaalid on 14 cm ja 18 cm. Leia pindala.",
      unit: "cm²",
      answer: 126,
      explanation: "Kasuta diagonaalide täispikkusi. 14 · 18 : 2 = 126 cm².",
    },
    {
      topic: "mixed",
      prompt: "Võrdhaarse trapetsi alused on 20 cm ja 12 cm ning haar 5 cm. Leia pindala.",
      unit: "cm²",
      answer: 48,
      explanation: "Servalõik on (20 − 12) : 2 = 4 cm ja kõrgus √(5² − 4²) = 3 cm. Pindala on (20 + 12) · 3 : 2 = 48 cm².",
    },
  ],
};
