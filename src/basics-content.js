'use strict';
(function(root){
 const sources={school:{title:'Tiina Kapten · Inimene on funktsioneeriv tervik',url:'./materials/inimene.pdf',language:'et'},nerve:{title:'Tiina Kapten · Närvisüsteemi ehitus ja talitlus',url:'./materials/narvisusteem.pdf',language:'et'},cell:{title:'Avita · Taime- ja loomarakk (Opiqu tutvumispeatükk)',url:'https://www.opiq.ee/kit/535/chapter/29693',language:'et'},tissue:{title:'Koolibri · Rakud ja koed (Opiqu tutvumispeatükk)',url:'https://www.opiq.ee/kit/557/chapter/31327',language:'et'},life:{title:'Avita · Elu tunnused (Opiqu tutvumispeatükk)',url:'https://www.opiq.ee/kit/521/chapter/29076',language:'et'}};
 const concepts=[];
 function add(id,title,requires,source,reference,lesson,anchor,questions){const index=concepts.length;concepts.push({id,title,requires,source,reference,lesson,anchor,language:'et',questions:questions.map(([prompt,correct,w1,w2],j)=>{const shift=(index+j)%3,options=[correct,w1,w2];return {prompt,options:options.slice(shift).concat(options.slice(0,shift)),answer:(3-shift)%3};})});}
 add('cell','Rakk: keha väike ehitusüksus',[],'school','Slaid 2; lisalugemine: Opiq „Rakud ja koed”.','Inimese keha koosneb rakkudest. Rakud on elusad üksused, millel on erinevad ülesanded. Näiteks lihasrakk saab kokku tõmbuda ja närvirakk infot edasi anda.','Üks mängija ei ole terve meeskond. Samuti on rakk keha osa, mitte terve elund.',[
 ['Millistest väikestest elusatest üksustest koosneb inimese keha?','Rakkudest','Ainult veest','Väikestest elunditest'],
 ['Lihasrakk ja närvirakk täidavad erinevaid ülesandeid. Mis on neil siiski ühist?','Mõlemad on rakud','Mõlemad on terved elundid','Mõlemad pumpavad verd'],
 ['Mikroskoobis on näha üht inimese lihasrakku. Mida sa vaatled?','Üht keha elusat ehitusüksust','Tervet lihast','Tervet elundkonda']]);
 add('tissue','Sarnase ülesandega rakud teevad koostööd',['cell'],'tissue','„Rakud ja koed”; õpetaja esitluse slaidid 6–18.','Koe moodustavad sarnase ehituse ja ülesandega rakud koos rakuvaheainega. Lihaskude tõmbub kokku. Närvikude aitab infot vastu võtta ja edasi anda.','Rakk → kude. Üks rakk ja temast suurem koostöötav kude on erinevad tasandid.',[
 ['Lihasrakud koos neid ümbritseva rakuvaheainega moodustavad…','lihaskoe','kogu inimese','ühe rakutuuma'],
 ['Mis on kude?','Sarnase ülesandega rakkude ja rakuvaheaine kogum','Üksainus rakuosa','Kõik keha elundid kokku'],
 ['Proovis on palju kokkutõmbumiseks kohastunud rakke. Millise koega on kõige tõenäolisemalt tegu?','Lihaskoega','Närvikoega','Luukoega']]);
 add('organ','Süda on elund',['tissue'],'tissue','„Rakud ja koed”; õpetaja esitluse slaid 24.','Elundis töötavad mitu kude koos kindla ülesande täitmiseks. Süda on elund, mis pumpab verd. Südames on lisaks lihaskoele ka näiteks närvi- ja sidekude.','Rakk → kude → elund. Terve süda on suurem koostöötav tervik kui üks südamelihasrakk.',[
 ['Mis tasandile kuulub süda?','Elund','Üks rakk','Üks rakutuum'],
 ['Mitu erinevat kude töötab koos ja moodustab verd pumpava südame. Süda on…','elund','üksainus kude','üksainus rakk'],
 ['Miks ei ole terve magu lihtsalt üks kude?','Selles töötavad koos erinevad koed','Selles ei ole ühtegi rakku','Iga kude on terve organism']]);
 add('system','Elundid töötavad meeskonnana',['organ'],'school','Slaidid 24–25.','Elundkond koosneb ühise suurema ülesande jaoks töötavatest elunditest. Süda ja veresooned kuuluvad vereringeelundkonda. Elundkonnad omakorda teevad koostööd, et organism püsiks elus.','Rakk → kude → elund → elundkond → organism. Sina oled organism.',[
 ['Süda ja veresooned töötavad koos. Koos kuuluvad need…','vereringeelundkonda','ühte rakku','ühte rakutuuma'],
 ['Milline on kogu elus inimene nende tasandite seas?','Organism','Üks kude','Üks elund'],
 ['Joostes jõuab kopsudes saadud hapnik verega lihastesse. Mida see näitab?','Hingamis- ja vereringeelundkond teevad koostööd','Iga elundkond töötab täiesti eraldi','Lihased ei vaja verevarustust']]);
 add('membrane','Rakul on piir',['cell'],'cell','Alajaotus „Kõiki rakke ümbritseb rakumembraan”.','Rakumembraan eraldab raku sisemust väliskeskkonnast ja aitab reguleerida ainete liikumist nende vahel. See ei ole täiesti suletud sein: osa aineid pääseb läbi, osa vajab sobivat transporti.','Mõtle väravale, mille läbimine sõltub sisenejast. Membraan ei mõtle ega otsusta nagu inimene.',[
 ['Mis eraldab rakusisu väliskeskkonnast?','Rakumembraan','Terve elundkond','Süda'],
 ['Mis kirjeldab rakumembraani ülesannet?','Aitab reguleerida ainete liikumist rakku ja rakust välja','Laseb alati kõik ained vabalt läbi','Takistab alati kõigi ainete liikumist'],
 ['Aine ei saa otse läbi rakumembraani liikuda. Milline järeldus on mõistlik?','Selle liikumiseks võib olla vaja sobivat membraanivalku','Rakul ei ole sisemust','Ükski aine ei saa sellest rakust väljuda']]);
 add('nucleus','DNA kannab pärilikku infot',['cell'],'cell','Alajaotus „Rakutuum”; õpetaja esitluse slaid 3.','DNA-s on pärilik info. Enamik inimese raku DNA-st asub rakutuumas. Kõigil rakkudel ei ole tuuma: näiteks bakteritel puudub rakutuum, kuid neil on DNA.','DNA ja rakutuum ei ole sama asi: üks kannab infot, teine on raku osa, kus suur osa sellest paikneb.',[
 ['Milline aine kannab pärilikku infot?','DNA','Vesi','Hapnik'],
 ['Kus paikneb enamik tüüpilise inimese raku DNA-st?','Rakutuumas','Väljaspool keha','Ainult rakumembraanis'],
 ['Bakteril ei ole rakutuuma. Kas sellest järeldub, et tal pole DNA-d?','Ei, DNA võib rakus olla ka ilma rakutuumata','Jah, DNA saab olla ainult tuumas','Jah, bakter ei koosne rakust']]);
 add('muscle','Liikumine algab kokkutõmbest',['tissue'],'school','Slaidid 8–11.','Lihaskoe põhiomadus on võime kokku tõmbuda. Skeletilihaste abil saad teha tahtlikke liigutusi, näiteks palli lüüa. Südamelihas töötab ka siis, kui sa sellele teadlikult käsku ei anna.','Jalalöök ja südamelöök kasutavad lihaskude, kuid neid ei juhita ühtemoodi.',[
 ['Milline omadus võimaldab lihaskoel liikumist tekitada?','Võime kokku tõmbuda','Võime valgust püüda','Võime DNA-d kehast välja saata'],
 ['Milline tegevus kasutab tahtlikult juhitavaid skeletilihaseid?','Palli löömine','Südame iga löögi teadlik käivitamine','Juuste värvuse valimine'],
 ['Magades lööb süda edasi. Milline järeldus sobib?','Südamelihase iga kokkutõmme ei vaja teadlikku käsku','Süda polegi lihaskoega seotud','Kõik lihased töötavad ainult ärkvel olles']]);
 add('nerve','Närvirakud kannavad infot',['cell'],'nerve','Slaidid 2, 5–8; sissejuhatava esitluse slaidid 18–19.','Närvisüsteem aitab infot vastu võtta, töödelda ja edasi anda. Meeleelunditest jõuab info kesknärvisüsteemi. Sealt liiguvad signaalid muu hulgas lihastesse. Kesknärvisüsteemi kuuluvad peaaju ja seljaaju.','Palli nägemine ja jala liigutamine vajavad keha eri osade vahelist infovahetust.',[
 ['Milline on närvirakkude oluline ülesanne?','Info vastuvõtmine ja edastamine','Vere pumpamine läbi kogu keha','Valguse muutmine suhkruks'],
 ['Millised osad moodustavad kesknärvisüsteemi?','Peaaju ja seljaaju','Süda ja veresooned','Magu ja soolestik'],
 ['Näed värava poole liikuvat palli ja liigud sellele ette. Mis aitab nägemisinfo liigutusega siduda?','Närvisüsteem','Ainult luukude','Ainult naha välispind']]);
 add('balance','Keha hoiab sisekeskkonda sobivana',['system'],'school','Slaidid 25–28; vereanalüüside vana ühikutabelit siin ei kasutata.','Homöostaas tähendab sisekeskkonna suhtelist püsivust. Kui kehatemperatuur tõuseb, võib higistamine aidata keha jahutada: nahalt aurustuv vesi viib soojust ära. Näitajad ei püsi alati täpselt samal arvul.','Trennis tekib soojust. Jahutav vastus aitab tõusu piirata.',[
 ['Kehatemperatuur tõuseb ja higi aurustub nahalt. Mis on selle jahutav mõju?','See aitab kehatemperatuuri tõusu vähendada','See peab kehatemperatuuri veel tõstma','See muudab kogu keha lihaskoeks'],
 ['Mida tähendab sisekeskkonna suhteline püsivus?','Keha hoiab tingimusi eluks sobivas vahemikus','Kõik näitajad on alati täpselt muutumatud','Keha ei reageeri muutustele'],
 ['Külmaga värised ja lihaste töö tekitab soojust. Mida see aitab teha?','Piirata kehatemperatuuri langust','Peatada kogu ainevahetuse','Vähendada soojuse teket nullini']]);
 add('energy','Rakud vajavad energiat',['cell'],'life','Alajaotus „Aine- ja energiavahetus”.','Inimene saab toidust nii ehitusmaterjali kui ka keemilist energiat. Rakud kasutavad energiat näiteks liikumiseks, ainete valmistamiseks ja ainete transpordiks. Puhates jätkub rakkude töö.','Puhkepäev ei lülita keha välja. Ka siis töötavad süda ja teised elundid.',[
 ['Miks vajab keha toitu?','Nii ainete kui ka energia saamiseks','Ainult mao täitmiseks','Et kõik rakud lõpetaksid töö'],
 ['Kas magava inimese rakud vajavad energiat?','Jah, elutegevus jätkub','Ei, kõik rakud on välja lülitatud','Ainult siis, kui inimene jookseb unes'],
 ['Lihas töötab joostes rohkem. Milleks kulub muu hulgas toidust saadud energia?','Lihasrakkude tööks','Energia tühjast tekitamiseks','Kõigi keharakkude peatamiseks']]);
 add('photosynthesis','Taim kasutab valgusenergiat',['energy'],'life','Alajaotus „Aine- ja energiavahetus”; Opiq „Taime- ja loomarakk”: kloroplastid.','Fotosünteesil kasutab taim valgusenergiat, et valmistada süsihappegaasist ja veest orgaanilisi aineid, näiteks suhkruid. See toimub roheliste taimeosade kloroplastides. Taimed hingavad samuti rakutasandil.','Valgus annab energiat; süsihappegaas ja vesi on lähteained. Need ei ole sama roll.',[
 ['Millist energiaallikat kasutab roheline taim fotosünteesiks?','Valgust','Ainult mulla soojust','Ainult tuule liikumist'],
 ['Milline rakuosa on seotud rohelise lehe fotosünteesiga?','Kloroplast','Inimese süda','Loomaraku närvijätke'],
 ['Milline väide eristab fotosünteesi lähteaineid energiaallikast?','Valgus annab energiat; süsihappegaas ja vesi on lähteained','Valgus on sama aine mis vesi','Fotosüntees ei vaja mingit energiaallikat']]);
 add('inheritance','Pärilik info kandub edasi',['nucleus'],'life','Alajaotus „Pärilikkus ja muutlikkus”; õpetaja esitluse slaid 3.','Paljunemisel kandub pärilik info vanematelt järglastele. Inimene saab pärilikku infot mõlemalt bioloogiliselt vanemalt. Kõik elu jooksul õpitud oskused ei kandu DNA kaudu edasi; näiteks pallilööki tuleb harjutada.','Pärilik info ja treenides õpitud oskus on erinevad asjad.',[
 ['Kellelt saab laps pärilikku infot?','Mõlemalt bioloogiliselt vanemalt','Ainult oma treenerilt','Ainult söödud toidust'],
 ['Isa õpib täpsemalt palli lööma. Kas laps saab selle harjutatud oskuse automaatselt DNA kaudu?','Ei, seda oskust tuleb ise õppida','Jah, iga õpitud oskus kirjutatakse lapse DNA-sse','Jah, laps ei pea kunagi harjutama'],
 ['Õed-vennad ei ole kõiges ühesugused. Kas see on päriliku info saamisega kooskõlas?','Jah, päritud info kombinatsioon ja keskkond võivad erineda','Ei, kõigil lastel peavad olema täpselt samad omadused','Ei, pärilikkus välistab kõik erinevused']]);
 // Original foundation lessons, based on selected Estonian source topics.
 const enrichment={
 "cell": {
  "example": "Kui lööd palli, tõmbuvad jalas lihasrakud kokku ja närvirakud aitavad käsku edasi anda. Need rakud on erineva kujuga ja teevad erinevat tööd, kuid mõlemad on keha elusad ehitusüksused. Üks lihasrakk ei ole terve jalalihas.",
  "takeaway": "Keha koosneb rakkudest, mille kuju ja ülesanded võivad erineda.",
  "questions": [
   {
    "prompt": "Joonisel on lihasrakk piklik ja närvirakk haruline. Milline järeldus sobib?",
    "options": [
     "Ainult üks neist saab olla rakk, sest rakud peavad olema ühesugused.",
     "Mõlemad võivad olla rakud, mille ehitus sobib erinevate ülesannetega.",
     "Haruline kuju tähendab, et närvirakk on terve elundkond."
    ],
    "answer": 1,
    "explanation": "Kõik rakud ei ole sama kujuga. Erinev ehitus aitab neil täita erinevaid ülesandeid, näiteks kokku tõmbuda või infot edasi anda."
   },
   {
    "prompt": "Millises paaris on mõlemad nimetatud osad üksikud rakud?",
    "options": [
     "Süda ja kops",
     "Lihaskude ja inimene",
     "Sooleseina rakk ja närvirakk"
    ],
    "answer": 2,
    "explanation": "Sooleseina üks rakk ja üks närvirakk on keha väikesed elusad ehitusüksused. Süda ja kops sisaldavad paljusid rakke, kude on rakkude kogum ning inimene terve organism."
   }
  ]
 },
 "tissue": {
  "example": "Kui painutad käsivart, ei tee kogu tööd üksainus lihasrakk. Paljud lihasrakud töötavad koos ja moodustavad lihaskoe. Koe juurde kuulub ka rakkude vahel olev aine. Terve lihas sisaldab lisaks lihaskoele veel teisi kudesid.",
  "takeaway": "Kude koosneb sarnase ehituse ja ülesandega rakkudest ning rakuvaheainest.",
  "questions": [
   {
    "prompt": "Koemudelis on näidatud palju rakke, kuid nende vahele jäetud aine on välja jäetud. Mis tuleks mudelile lisada?",
    "options": [
     "Rakuvaheaine",
     "Terve elundkond",
     "Iga raku ümber eraldi süda"
    ],
    "answer": 0,
    "explanation": "Kude ei koosne ainult rakkudest. Selle juurde kuulub ka rakke ümbritsev rakuvaheaine, mille hulk ja omadused sõltuvad koest."
   },
   {
    "prompt": "Üks koetükk aitab infot vastu võtta ja edasi anda, teine tõmbub kokku. Mida saad nende kohta järeldada?",
    "options": [
     "Mõlemad peavad olema sama kude, sest mõlemad koosnevad rakkudest.",
     "Need võivad olla eri koed, sest nende ülesanded erinevad.",
     "Kude saab täita ülesannet ainult siis, kui selles on üksainus rakk."
    ],
    "answer": 1,
    "explanation": "Närvikoe ja lihaskoe rakud on kohastunud erinevaks tööks. Ühine rakuline ehitus ei tähenda, et kõik koed täidaksid sama ülesannet."
   }
  ]
 },
 "organ": {
  "example": "Magu aitab toitu segada ja seedida. Selle seinas ei ole ainult lihaskude: seal töötavad koos ka kattekude, sidekude ja närvikude. Erinevate kudede koostööst moodustub üks elund, mille osad aitavad täita mao ülesandeid.",
  "takeaway": "Elundis töötavad erinevad koed koos kindlate ülesannete täitmiseks.",
  "questions": [
   {
    "prompt": "Nahk sisaldab mitut kude, mis aitavad keha katta ja kaitsta. Miks saab nahka nimetada elundiks?",
    "options": [
     "Sest nahas on ainult üht tüüpi rakud.",
     "Sest iga nähtav kehaosa on üksainus kude.",
     "Sest selles töötavad eri koed koos ühiste ülesannete täitmiseks."
    ],
    "answer": 2,
    "explanation": "Elundi tunnus on erinevate kudede koostöö. Naha kaitseülesanded ei sõltu ühestainsast rakust ega ainult ühest koest."
   },
   {
    "prompt": "Südame väikesest proovist leitakse lihaskude. Kas see tõendab, et kogu süda koosneb ainult lihaskoest?",
    "options": [
     "Ei, väike proov ei näita kõiki tervet elundit moodustavaid kudesid.",
     "Jah, elund saab sisaldada ainult üht kude.",
     "Jah, lihaskoe olemasolu välistab südames närvikoe."
    ],
    "answer": 0,
    "explanation": "Ühe koe leidmine näitab selle koe olemasolu. Sellest ei järeldu teiste kudede puudumine: südames teevad lihaskoega koostööd ka muud koed."
   }
  ]
 },
 "system": {
  "example": "Jalgrattaga sõites jõuab kopsudes hapnik õhust verre ja süda hoiab vere liikumas. Veri kannab hapniku töötavate lihasteni. Hingamiselundkond ja vereringeelundkond täidavad erinevaid ülesandeid, kuid sinu liikumine sõltub nende koostööst. Üks elundkond ei ole terve organism.",
  "takeaway": "Elundkonna elundid ja keha eri elundkonnad teevad omavahel koostööd.",
  "questions": [
   {
    "prompt": "Soolestikust jõuavad imendunud toitained verre ja veri viib neid edasi keha rakkudeni. Millist koostööd see kirjeldab?",
    "options": [
     "Ühe rakutuuma ja selle DNA koostööd",
     "Seedeelundkonna ja vereringeelundkonna koostööd",
     "Ainult närvikoe tööd"
    ],
    "answer": 1,
    "explanation": "Toitainete kättesaamine ja nende jaotamine on erinevad ülesanded. Soolestik kuulub seedeelundkonda, vere ringlust tagavad vereringeelundkonna elundid."
   },
   {
    "prompt": "Süda pumpab verd ja veresooned on vere liikumisteed. Kas erinevad ülesanded takistavad neil samasse elundkonda kuulumast?",
    "options": [
     "Jah, sama elundkonna kõik osad peavad tegema täpselt sama tööd.",
     "Jah, elundkonda saab kuuluda ainult üks elund.",
     "Ei, nende erinevad ülesanded aitavad koos tagada vereringet."
    ],
    "answer": 2,
    "explanation": "Ühise suurema ülesande täitmiseks võivad elundid teha erinevat tööd. Pumpamisest ja vere liikumisteedest on kasu koos."
   }
  ]
 },
 "membrane": {
  "example": "Koolimaja uks eraldab sisemust õuest, kuid lubab inimestel liikuda sisse ja välja. Rakumembraan eraldab samuti kahte keskkonda ja võimaldab ainete vahetust. Võrdlus on piiratud: membraan ei tunne inimesi ega tee teadlikke otsuseid, ainete liikumine sõltub nende omadustest ja membraani ehitusest.",
  "takeaway": "Rakumembraan hoiab raku sisemuse eraldi, võimaldades samal ajal ainete vahetust.",
  "questions": [
   {
    "prompt": "Rakk vajab väliskeskkonnas olevat ainet. Kas aine rakku jõudmiseks peab rakumembraan kaduma?",
    "options": [
     "Ei, ained võivad sobival viisil membraani läbida.",
     "Jah, terve membraan takistab alati kõigi ainete liikumist.",
     "Jah, membraan saab eraldada keskkondi ainult siis, kui see puudub."
    ],
    "answer": 0,
    "explanation": "Membraani ülesanne ei ole raku täielik sulgemine. Selle ehitus võimaldab mõnel ainel otse läbi liikuda ja teistel kasutada sobivaid transpordivõimalusi."
   },
   {
    "prompt": "Aine A läbib rakumembraani kergesti. Kas sellest saab järeldada, et aine B läbib sama membraani sama kergesti?",
    "options": [
     "Jah, ühe aine läbipääs tähendab, et kõik ained pääsevad võrdselt läbi.",
     "Ei, ainete erinevad omadused võivad nende läbipääsu mõjutada.",
     "Ei, pärast aine A liikumist ei saa membraani enam ükski aine läbida."
    ],
    "answer": 1,
    "explanation": "Membraan on valikuliselt läbilaskev. Ühe aine liikumise põhjal ei saa otsustada teise aine liikumist, sest nende omadused ja vajalik transport võivad erineda."
   }
  ]
 },
 "nucleus": {
  "example": "Mõtle juhendile, mida hoitakse kapis: juhend sisaldab infot, kapp on selle asukoht. Samamoodi ei ole DNA ja rakutuum üks ja sama asi. Võrdlus aitab neid eristada, kuid rakutuum ei ole päris kapp ning DNA ei ole paberile kirjutatud tekst.",
  "takeaway": "DNA kannab pärilikku infot ja rakutuum on üks selle paiknemiskoht.",
  "questions": [
   {
    "prompt": "Raku mudelis tähistab sinine ala rakutuuma ja punane joon DNA-d. Milline mudeli kirjeldus sobib tüüpilise inimese raku kohta?",
    "options": [
     "Punane joon ja sinine ala peavad tähendama täpselt sama asja.",
     "DNA peab paiknema tervenisti väljaspool rakku.",
     "Suur osa punasest joonest paikneb sinise ala sees."
    ],
    "answer": 2,
    "explanation": "DNA on pärilikku infot kandev aine, rakutuum aga raku osa. Suurem osa tüüpilise inimese raku DNA-st paikneb tuumas, mistõttu saab mudel näidata ühte teise sees."
   },
   {
    "prompt": "Tekst ütleb: „Enamik tüüpilise inimese raku DNA-st asub rakutuumas.” Milline järeldus on selle lausega kooskõlas?",
    "options": [
     "Osa DNA-st võib paikneda rakus ka väljaspool tuuma.",
     "Kogu DNA peab paiknema ainult tuumas.",
     "Rakutuumas on DNA-st kõige väiksem osa."
    ],
    "answer": 0,
    "explanation": "Sõna „enamik” tähendab suuremat osa, mitte tingimata kõike. Seega ei välista lause väiksema osa DNA paiknemist mujal rakus."
   }
  ]
 },
 "muscle": {
  "example": "Kui tõstad joogipudeli laualt suhu, teevad skeletilihased sinu soovitud liigutuse. Samal ajal pumpab süda verd, ilma et peaksid iga löögi eraldi käivitama. Mõlemas olukorras töötab lihaskude, kuid tahtlik käe liigutamine ja südame töö on erinevalt juhitud.",
  "takeaway": "Lihaskude võib tekitada liikumist või hoida asendit ning kõik lihased ei vaja teadlikku käsku.",
  "questions": [
   {
    "prompt": "Hoiad rasket kotti paigal ja tunned, et käelihased pingutavad. Kas koti paigalseismine tähendab, et lihased ei tööta?",
    "options": [
     "Jah, lihas saab töötada ainult siis, kui käsi liigub.",
     "Ei, lihased võivad töötada ka asendi hoidmiseks.",
     "Jah, koti hoidmise ajal muutub lihaskude närvikoeks."
    ],
    "answer": 1,
    "explanation": "Lihased võivad jõudu avaldada ka nähtava liikumiseta. Kotti paigal hoides aitavad nad takistada selle allapoole vajumist."
   },
   {
    "prompt": "Otsustad visata palli sõbrale. Milline lihaskoe omadus aitab selle otsuse käe liikumiseks muuta?",
    "options": [
     "Lihaskude asendab käes kõik luud.",
     "Lihaskude muudab valguse liikumiseks.",
     "Lihaskude suudab kokku tõmbuda ja jõudu avaldada."
    ],
    "answer": 2,
    "explanation": "Liigutamiseks on vaja jõudu, mida annavad kokku tõmbuvad skeletilihased. Tahtlik otsus vajab teostamiseks lihaste tööd; otsus üksi kätt ei liiguta."
   }
  ]
 },
 "nerve": {
  "example": "Kuuled uksekella ja lähed ust avama. Kuulmisega seotud info jõuab kesknärvisüsteemi, kus seda töödeldakse. Seejärel aitavad lihastesse liikuvad signaalid sul liikuda. Närvisüsteem seob omavahel sündmuse märkamise ja vastuse, kuigi sa ei juhi teadlikult iga üksiku närviraku tööd.",
  "takeaway": "Närvisüsteem seob kehast ja ümbrusest saadud info sobivate vastustega.",
  "questions": [
   {
    "prompt": "Puudutad jahedat joogipudelit. Mis suunas liigub info käe jahtumise kohta, et saaksid külma tunda?",
    "options": [
     "Käest kesknärvisüsteemi",
     "Südamest joogipudeli sisse",
     "Ainult ühelt luult teisele"
    ],
    "answer": 0,
    "explanation": "Kehast saadud info peab jõudma kesknärvisüsteemi, et seda saaks töödelda. Närvisignaal kannab infot jahtumise kohta; see ei ole ise pudelist liikuv külm."
   },
   {
    "prompt": "Näed trepiastet ja tõstad jalga. Milline järjestus kirjeldab seda kõige paremini?",
    "options": [
     "Lihas pumpab nägemisinfo südamesse ja süda näeb astet.",
     "Nägemisinfo jõuab kesknärvisüsteemi ning sealt liiguvad lihastesse liigutust juhtivad signaalid.",
     "Aste saadab käskluse otse jalaluule, ilma et närvisüsteemi oleks vaja."
    ],
    "answer": 1,
    "explanation": "Nägemine annab infot ümbruse kohta, kesknärvisüsteem aitab seda kasutada liigutuse juhtimiseks ja lihastesse jõudvad signaalid aitavad vastust teostada."
   }
  ]
 },
 "balance": {
  "example": "Pärast pallimängu on sul palav ja sa higistad. Kui istud varjus ning keha jahtub, võib higistamine väheneda. Keha vastus muutub koos olukorraga. Homöostaas ei tähenda üht muutumatut näitu, vaid tingimuste hoidmist elutegevuseks sobivas vahemikus.",
  "takeaway": "Homöostaasi korral aitavad keha vastused hoida sisekeskkonda sobivas vahemikus.",
  "questions": [
   {
    "prompt": "Päeva jooksul muutub kehatemperatuur veidi. Kas väike muutus üksi tõendab, et homöostaas ei tööta?",
    "options": [
     "Jah, toimiva homöostaasi korral ei saa ükski näit üldse muutuda.",
     "Jah, iga muutus tähendab, et keha on reguleerimise lõpetanud.",
     "Ei, suhteline püsivus lubab näitajatel sobivas vahemikus muutuda."
    ],
    "answer": 2,
    "explanation": "Reguleerimine ei lukusta kehatemperatuuri ühe täpse arvu juurde. Väike kõikumine ei näita iseenesest reguleerimise puudumist."
   },
   {
    "prompt": "Keha on pärast pingutust jahtunud ja higistamine väheneb. Miks sobib see sisekeskkonna reguleerimisega?",
    "options": [
     "Jahutavat vastust võib vähendada, kui jahutamise vajadus väheneb.",
     "Keha peab alati higistama sama palju, olenemata temperatuurist.",
     "Higistamise vähenemine tähendab, et kõik keharakud on töö lõpetanud."
    ],
    "answer": 0,
    "explanation": "Kui temperatuuri tõusu on juba piiratud, ei ole sama tugevat jahutavat vastust tingimata vaja. Reguleerimise tugevus saab muutuda koos olukorraga."
   }
  ]
 },
 "energy": {
  "example": "Istud laua taga ja lahendad ülesannet. Kuigi jalad ei jookse, töötavad närvirakud, süda pumpab verd ja rakud valmistavad vajalikke aineid. Toidust saadud ained aitavad keha üles ehitada ning nende keemiline energia toetab rakkude tööd.",
  "takeaway": "Toit annab kehale nii ehitusmaterjali kui ka rakkude tööks kasutatavat keemilist energiat.",
  "questions": [
   {
    "prompt": "Lahendad mõttes matemaatikaülesannet ja istud liikumatult. Milline väide sobib sinu energiavajaduse kohta?",
    "options": [
     "Energiat vajavad ainult liikuvad jalalihased.",
     "Ka paigal istudes vajavad töötavad rakud energiat.",
     "Mõtlemine lülitab teiste elundite energiavajaduse välja."
    ],
    "answer": 1,
    "explanation": "Nähtav liikumine on ainult üks rakkude töö liik. Info töötlemine, ainete transport ja elundite talitlus jätkuvad ka istudes."
   },
   {
    "prompt": "Keha kasutab toidust saadud aineid uute rakuosade valmistamiseks. Millist toidu rolli see näide esile toob?",
    "options": [
     "Toit toimib ainult mao täitjana.",
     "Toit eemaldab vajaduse rakkude töö järele.",
     "Toit annab kehale ehitusmaterjali."
    ],
    "answer": 2,
    "explanation": "Uute rakuosade ehitamiseks on vaja aineid, mitte ainult energiat. Toidul on mõlemad rollid: sellest saadakse ehituseks aineid ja tööks kasutatavat keemilist energiat."
   }
  ]
 },
 "photosynthesis": {
  "example": "Aknalaual kasvava taime lehed saavad valgust. Leherakkude kloroplastides aitab see energia valmistada veest ja süsihappegaasist suhkruid. Pimedaks minnes ei saa fotosüntees valgust kasutada, kuid taim ei lakka elamast: ka tema rakud kasutavad oma tööks keemilist energiat.",
  "takeaway": "Fotosüntees kasutab valgusenergiat suhkru valmistamiseks ja taim vajab ka rakuhingamist.",
  "questions": [
   {
    "prompt": "Roheline taim viiakse mõneks ajaks pimedasse. Millise protsessi jaoks jääb puudu vahetult kasutatav valgusenergia?",
    "options": [
     "Fotosünteesi jaoks",
     "Kõigi rakkude rakuhingamise jaoks",
     "Päriliku info säilitamise jaoks DNA-s"
    ],
    "answer": 0,
    "explanation": "Fotosüntees vajab valgusenergiat ainete valmistamiseks. Rakuhingamine kasutab keemilist energiat ega vaja valgust vahetu energiaallikana."
   },
   {
    "prompt": "Sõber ütleb: „Taim fotosünteesib, järelikult pole tal rakuhingamist vaja.” Mis on selles järelduses puudu?",
    "options": [
     "Taimed vajavad ainult vett, seega pole kumbagi protsessi vaja.",
     "Taim vajab valmistatud ainetes oleva energia kasutamiseks samuti rakuhingamist.",
     "Fotosüntees muudab taime rakud elutuks ja lõpetab nende töö."
    ],
    "answer": 1,
    "explanation": "Suhkru valmistamine ja selles talletatud energia kasutamine on erinevad ülesanded. Taimerakud teevad tööd ning rakuhingamine aitab muuta ainete keemilise energia nende jaoks kasutatavaks."
   }
  ]
 },
 "inheritance": {
  "reference": "Avita „Elu tunnused” (Bioloogia gümnaasiumile I, peatükk 1.1): üldine käsitlus paljunemisest ja pärilikkusest; õpetaja sissejuhatava esitluse slaid 3.",
  "example": "Kaks õde või venda võivad saada samadelt vanematelt erineva päriliku info kombinatsiooni. Lisaks mõjutavad nende kujunemist toit, harjutamine ja muud kasvutingimused. Näiteks ühe osavam pallilöök võib tuleneda rohkemast treenimisest, mitte tõendada, et ta päris valmis oskuse.",
  "takeaway": "Pärilik info tuleb vanematelt, kuid inimese tunnuseid ja oskusi mõjutab ka keskkond.",
  "questions": [
   {
    "prompt": "Kaks sama sordi taime kasvavad erineva valguse käes erineva pikkusega. Milline järeldus on põhjendatud?",
    "options": [
     "Pikkuse erinevus tõendab, et üks taim ei saanud vanematelt pärilikku infot.",
     "Keskkond ei saa kasvu mõjutada, seega on vaatlus võimatu.",
     "Kasvutingimused võivad mõjutada seda, milliseks taim kujuneb."
    ],
    "answer": 2,
    "explanation": "Tunnuse kujunemist võib mõjutada keskkond, näiteks valguse kättesaadavus. Erinev pikkus ei tõenda pärilikkuse puudumist ega näita üksi, milline oli kummagi taime pärilik info."
   },
   {
    "prompt": "Laps sarnaneb ühe tunnuse poolest emaga. Kas sellest järeldub, et kogu tema pärilik info pärineb ainult emalt?",
    "options": [
     "Ei, ühe tunnuse sarnasus ei muuda seda, et laps saab pärilikku infot mõlemalt bioloogiliselt vanemalt.",
     "Jah, iga sarnane tunnus näitab, et teiselt vanemalt ei saadud DNA-d.",
     "Jah, laps saab pärilikku infot ainult sellelt vanemalt, kellega ta rohkem sarnaneb."
    ],
    "answer": 0,
    "explanation": "Ühe nähtava sarnasuse järgi ei saa otsustada kogu päriliku info päritolu. Lapse pärilik info sisaldab mõlema bioloogilise vanema panust."
   }
  ]
 }
};
 const additions=[
 {
  "id": "plant_cell",
  "title": "Taimerakk ja loomarakk",
  "requires": [
   "cell",
   "membrane"
  ],
  "unit": "cells",
  "source": {
   "title": "Avita · Taime- ja loomarakk",
   "url": "https://www.opiq.ee/kit/535/chapter/29693",
   "language": "et"
  },
  "reference": "Opiqu peatüki „Taime- ja loomarakk” põhjal koostatud iseseisev õppetekst ja küsimused.",
  "lesson": "Taime- ja loomarakkudel on ühiseid osi, näiteks rakumembraan. Taimeraku membraani ümbritseb lisaks rakukest, mis toetab rakku. Roheliste taimeosade rakkudes on fotosünteesiks vajalikud kloroplastid. Kõik taimerakud ei ole rohelised: juure rakkudes tavaliselt kloroplaste pole. Loomarakkudel rakukesta ega kloroplaste ei ole.",
  "example": "Vaatled rohelise lehe rakku ja juure rakku. Mõlemad on taimerakud ning neil on rakukest. Kloroplaste ootad eelkõige lehe rakust, sest leht saab fotosünteesiks valgust.",
  "takeaway": "Taimerakul on rakumembraan ja rakukest, kuid kloroplaste leidub eelkõige rohelistes osades.",
  "questions": [
   {
    "prompt": "Milline rakuosa toetab taimerakku väljastpoolt rakumembraani?",
    "options": [
     "Rakukest",
     "Rakutuum",
     "Kloroplast"
    ],
    "answer": 0,
    "explanation": "Rakukest paikneb rakumembraanist väljaspool ja aitab taimerakku toetada."
   },
   {
    "prompt": "Millisest rakust ootad kõige tõenäolisemalt kloroplaste?",
    "options": [
     "Inimese lihasrakust",
     "Rohelise lehe rakust",
     "Maa sees kasvava juure rakust"
    ],
    "answer": 1,
    "explanation": "Rohelise lehe rakkudes olevad kloroplastid kasutavad fotosünteesil valgusenergiat."
   },
   {
    "prompt": "Juure rakus ei ole kloroplaste. Mida saad sellest järeldada?",
    "options": [
     "See peab olema loomarakk",
     "Sellel ei saa olla rakumembraani",
     "Ka taimerakk võib olla kloroplastideta"
    ],
    "answer": 2,
    "explanation": "Kõik taimerakud ei fotosünteesi. Näiteks maa sees kasvava juure rakus tavaliselt kloroplaste pole."
   },
   {
    "prompt": "Milline osa on olemas nii taime- kui ka loomarakul?",
    "options": [
     "Rakukest",
     "Rakumembraan",
     "Kloroplast"
    ],
    "answer": 1,
    "explanation": "Mõlemat rakku piirab rakumembraan. Loomarakul rakukesta ega kloroplaste pole."
   },
   {
    "prompt": "Sibula maa-aluse osa rakul on rakukest. Milline väide sobib?",
    "options": [
     "Rakukest välistab rakumembraani olemasolu",
     "Kõik rakukestaga rakud peavad olema rohelised",
     "Taimerakul võib olla rakukest ka ilma kloroplastideta"
    ],
    "answer": 2,
    "explanation": "Rakukest ja kloroplastid täidavad eri ülesandeid. Rakukesta olemasolu ei tähenda, et rakk fotosünteesib."
   }
  ]
 },
 {
  "id": "molecules",
  "title": "Aatomitest moodustuvad molekulid",
  "requires": [
   "cell"
  ],
  "unit": "energy",
  "source": {
   "title": "Avita · Millest organismid koosnevad?",
   "url": "https://www.opiq.ee/kit/521/chapter/29080",
   "language": "et"
  },
  "reference": "Opiqu peatükk „Millest organismid koosnevad?”; aatomite, molekulide ja organismi koostise sissejuhatus.",
  "lesson": "Organism koosneb ainetest. Ainete ehitusosad on aatomid ning omavahel keemiliselt seotud aatomitest võivad moodustuda molekulid. Näiteks üks veemolekul koosneb kahest vesiniku aatomist ja ühest hapniku aatomist. Rakk sisaldab väga palju eri molekule. Molekul on rakust palju väiksem ega ole ise rakk.",
  "example": "Kujutle veemolekuli mudelit kolme ühendatud kuulina: kaks tähistavad vesinikku ja üks hapnikku. Mudel aitab koostist näha, kuid päris aatomid ei ole värvilised mängukuulid.",
  "takeaway": "Molekul koosneb seotud aatomitest; rakk sisaldab väga palju molekule.",
  "questions": [
   {
    "prompt": "Millest koosneb üks veemolekul?",
    "options": [
     "Paljudest väikestest rakkudest",
     "Keemiliselt seotud aatomitest",
     "Ühest tervest elundist"
    ],
    "answer": 1,
    "explanation": "Veemolekulis on keemiliselt seotud kaks vesiniku aatomit ja üks hapniku aatom."
   },
   {
    "prompt": "Milline järjestus liigub väiksemast suurema poole?",
    "options": [
     "Rakk → molekul → aatom",
     "Molekul → rakk → aatom",
     "Aatom → molekul → rakk"
    ],
    "answer": 2,
    "explanation": "Aatomid võivad moodustada molekule ning rakk sisaldab väga palju molekule."
   },
   {
    "prompt": "Veemolekuli mudelis on kaks vesiniku aatomit ja üks hapniku aatom. Mitu aatomit on kokku?",
    "options": [
     "Kolm",
     "Kaks",
     "Üks"
    ],
    "answer": 0,
    "explanation": "Kaks vesiniku aatomit ja üks hapniku aatom annavad kokku kolm aatomit."
   },
   {
    "prompt": "Lihasrakk sisaldab vett. Kumb kirjeldus sobib?",
    "options": [
     "Iga veemolekul on üks lihasrakk",
     "Üks veemolekul sisaldab mitut lihasrakku",
     "Ühes lihasrakus on väga palju veemolekule"
    ],
    "answer": 2,
    "explanation": "Rakk on molekulidest palju suurem ja sisaldab väga palju veemolekule ning muid aineid."
   },
   {
    "prompt": "Glükoos on üks rakkudes kasutatav aine. Üks glükoosimolekul koosneb…",
    "options": [
     "keemiliselt seotud aatomitest",
     "paljudest kudedest",
     "mitmest rakutuumast"
    ],
    "answer": 0,
    "explanation": "Glükoosimolekul koosneb süsiniku, vesiniku ja hapniku aatomitest, mitte rakkudest ega kudedest."
   }
  ]
 },
 {
  "id": "nutrients",
  "title": "Toidust saab aineid ja energiat",
  "requires": [
   "molecules",
   "energy"
  ],
  "unit": "energy",
  "source": {
   "title": "Avita · Millest organismid koosnevad?",
   "url": "https://www.opiq.ee/kit/521/chapter/29080",
   "language": "et"
  },
  "reference": "Opiqu peatükk „Millest organismid koosnevad?”; organismi peamiste ainete rollid.",
  "lesson": "Süsivesikud, rasvad ja valgud on organismile vajalikud toitained. Süsivesikud ja rasvad annavad muu hulgas energiat. Valkudest saab keha uute valkude valmistamiseks ehitusmaterjali. Ka valgud võivad anda energiat. Vesi, vitamiinid ja mineraalained on samuti vajalikud, kuid neist keha energiat ei saa. Toitainetel võib olla mitu ülesannet.",
  "example": "Pärast jalgpallitrenni vajab keha nii energiat kui ka kudede uuendamiseks aineid. Veepudel aitab vett juurde saada, kuid vesi ei asenda toidust saadavat energiat.",
  "takeaway": "Keha vajab nii energiat andvaid toitaineid kui ka vett, vitamiine ja mineraalaineid.",
  "questions": [
   {
    "prompt": "Milline toitainete rühm saab anda kehale energiat?",
    "options": [
     "Vitamiinid",
     "Mineraalained",
     "Süsivesikud"
    ],
    "answer": 2,
    "explanation": "Süsivesikute keemilist energiat saab rakkudes kasutada. Vitamiinid ja mineraalained ise energiat ei anna."
   },
   {
    "prompt": "Miks vajab keha lisaks toiduenergiale ka valke?",
    "options": [
     "Et saada uute valkude valmistamiseks ehitusmaterjali",
     "Et muuta vesi valguseks",
     "Et kogu ainevahetus peatuks"
    ],
    "answer": 0,
    "explanation": "Toiduvalkude lagundamisel saadud aminohapetest saab keha ehitada enda valke."
   },
   {
    "prompt": "Õpilane joob pärast trenni puhast vett. Milline vajadus saab sellest otseselt abi?",
    "options": [
     "Toiduenergia taastamine veest",
     "Veevaru taastamine",
     "Kõigi vajalike valkude saamine"
    ],
    "answer": 1,
    "explanation": "Puhas vesi aitab taastada veevaru, kuid ei anna toiduenergiat ega valke."
   },
   {
    "prompt": "Milline aine on vajalik, kuigi keha sellest energiat ei saa?",
    "options": [
     "Rasv",
     "Glükoos",
     "Vesi"
    ],
    "answer": 2,
    "explanation": "Vesi on rakkude tööks vajalik. Rasvad ja glükoos saavad lisaks oma teistele rollidele anda energiat."
   },
   {
    "prompt": "Milline väide kirjeldab toitainete ülesandeid kõige paremini?",
    "options": [
     "Igal toitainel saab olla ainult üks ülesanne",
     "Üks toitainete rühm võib täita mitut ülesannet",
     "Kõik vajalikud toitained annavad energiat"
    ],
    "answer": 1,
    "explanation": "Näiteks valgud täidavad kehas palju ülesandeid ning võivad vajaduse korral anda ka energiat."
   }
  ]
 },
 {
  "id": "enzymes",
  "title": "Ensüüm aitab reaktsioonil toimuda",
  "requires": [
   "molecules",
   "energy"
  ],
  "unit": "energy",
  "source": {
   "title": "Avita · Valgud osalevad kõikides rakus toimuvates protsessides",
   "url": "https://www.opiq.ee/kit/521/chapter/29085",
   "language": "et"
  },
  "reference": "Opiqu peatüki ensüümide osa; küsimused ja näited on selle rakenduse jaoks loodud.",
  "lesson": "Ensüüm kiirendab keemilist reaktsiooni, ise selle käigus püsivalt ära kulumata. Enamik ensüüme on valgud. Iga ensüüm sobib teatud ainete ja reaktsioonidega. Selle tööd mõjutavad näiteks temperatuur ja keskkonna happelisus. Liiga suur kuumus võib ensüümi ehitust muuta ning selle töövõimet vähendada. Eri ensüümidele sobivad tingimused võivad erineda.",
  "example": "Süljes olev amülaas aitab tärklist väiksemateks osadeks lagundada. See ensüüm ei sobi kõigi toiduainete lagundamiseks: näiteks rasva lagundamisel on tarvis teistsuguseid ensüüme. Ensüümide ülesanded on erinevad.",
  "takeaway": "Ensüüm kiirendab sobivat reaktsiooni ning vajab tööks sobivaid tingimusi.",
  "questions": [
   {
    "prompt": "Mida ensüüm keemilise reaktsiooniga teeb?",
    "options": [
     "Kiirendab sobiva reaktsiooni toimumist",
     "Muudab iga reaktsiooni fotosünteesiks",
     "Asendab kõik reaktsiooniks vajalikud ained"
    ],
    "answer": 0,
    "explanation": "Ensüüm aitab reaktsioonil kiiremini toimuda, kuid reaktsioon vajab endiselt sobivaid lähteaineid."
   },
   {
    "prompt": "Miks ei saa üks seedeensüüm lagundada kõiki toitaineid ühtemoodi?",
    "options": [
     "Ensüümid töötavad ainult väljaspool keha",
     "Ensüüm sobib kindlate ainete ja reaktsioonidega",
     "Kõik toitained on täpselt sama ehitusega"
    ],
    "answer": 1,
    "explanation": "Ensüümi ehitus sobib teatud ainete ja reaktsioonidega. Eri toitainete lagundamiseks kasutatakse eri ensüüme."
   },
   {
    "prompt": "Ensüümi kuumutatakse tugevalt ning pärast jahutamist töötab see palju halvemini. Milline selgitus sobib?",
    "options": [
     "Jahutamine muudab kõik ained veeks",
     "Ensüüm õppis reaktsiooni vältima",
     "Kuumus võis ensüümi ehitust muuta"
    ],
    "answer": 2,
    "explanation": "Tugev kuumus võib muuta ensüümi ruumilist ehitust nii, et see ei sobi enam oma ülesandega."
   },
   {
    "prompt": "Ensüüm kiirendas ühe sobiva molekuli muundumist. Mis on tavaliselt võimalik järgmisena?",
    "options": [
     "Sama ensüüm saab aidata järgmist sobivat reaktsiooni",
     "Ensüüm on alati täielikult ära kulunud",
     "Ensüüm muutub alati reaktsiooni lähteaineks"
    ],
    "answer": 0,
    "explanation": "Ensüüm ei kulu ühe reaktsiooni käigus püsivalt ära ning saab sobivates tingimustes uuesti toimida."
   },
   {
    "prompt": "Kaht eri ensüümi võrreldakse eri temperatuuridel. Milline ootus on põhjendatud?",
    "options": [
     "Mõlemad töötavad alati kõige paremini keemistemperatuuril",
     "Kõik ensüümid vajavad täpselt sama temperatuuri",
     "Neile sobivaim temperatuur võib erineda"
    ],
    "answer": 2,
    "explanation": "Ensüümid ja nende tavapärased keskkonnad erinevad. Kõigile ei sobi üks ja sama temperatuur."
   }
  ]
 },
 {
  "id": "atp",
  "title": "ATP vahendab raku energiakasutust",
  "requires": [
   "energy",
   "molecules"
  ],
  "unit": "energy",
  "source": {
   "title": "Avita · Millest organismid koosnevad?",
   "url": "https://www.opiq.ee/kit/521/chapter/29080",
   "language": "et"
  },
  "reference": "Opiqu peatüki ATP mõiste; raku energia muundumise esmane selgitus.",
  "lesson": "ATP on aine, mille muundumist kasutavad rakud paljude energiat vajavate tegevuste käivitamiseks. Näiteks vajavad ATP-d lihaste kokkutõmme ja osa ainete transpordist. Rakud valmistavad ATP-d pidevalt uuesti, kasutades selleks energiat. ATP aitab energiat raku tööga siduda; see ei tekita energiat tühjast ega ole raku peamine pikaajaline energiavaru.",
  "example": "Jooksu ajal kasutavad lihasrakud ATP-d ja valmistavad seda samal ajal juurde. Võid mõelda käepärasele maksevahendile: võrdlus näitab vahendamist, kuid ATP ei ole päris raha.",
  "takeaway": "ATP seob energia muundumise raku tööga ja seda valmistatakse pidevalt uuesti.",
  "questions": [
   {
    "prompt": "Milline aine vahendab paljude raku energiat vajavate tegevuste toimumist?",
    "options": [
     "DNA",
     "ATP",
     "Vesi"
    ],
    "answer": 1,
    "explanation": "ATP muundumine aitab käivitada paljusid raku energiat vajavaid tegevusi."
   },
   {
    "prompt": "Lihas kasutab liikumisel ATP-d. Mida peavad rakud samal ajal tegema?",
    "options": [
     "Loobuma kõigist muudest ainetest",
     "Muutma kogu DNA ATP-ks",
     "Valmistama energiat kasutades ATP-d uuesti"
    ],
    "answer": 2,
    "explanation": "ATP-d kasutatakse ja taastatakse rakkudes pidevalt. Selle uuesti valmistamiseks on vaja energiat."
   },
   {
    "prompt": "Jooksja lihastes suureneb energiavajadus. Milline protsess aitab seda vajadust katta?",
    "options": [
     "ATP kiirem kasutamine ja taastamine",
     "Energia loomine eimillestki",
     "ATP kasutamise täielik peatamine"
    ],
    "answer": 0,
    "explanation": "Töötavas lihases kiireneb nii ATP kasutamine kui ka selle taastamine. Energia saadakse teiste protsesside kaudu."
   },
   {
    "prompt": "Milline kirjeldus sobib ATP-le?",
    "options": [
     "See on keha peamine kuude pikkune energiavaru",
     "See aitab siduda energia muundumist raku tööga",
     "See on hapniku teine nimetus"
    ],
    "answer": 1,
    "explanation": "ATP toimib vahetu vahendajana paljudes rakuprotsessides. Pikaajalisi energiavarusid hoitakse peamiselt teisel kujul."
   },
   {
    "prompt": "Rakk peab valmistama kasutatud ATP-d uuesti. Mida selleks muu hulgas vaja on?",
    "options": [
     "Ainult uut rakutuuma",
     "Ainult eredamat valgust igas rakus",
     "Energiat"
    ],
    "answer": 2,
    "explanation": "ATP taastamine nõuab energiat. Inimese rakkudes saadakse seda muu hulgas toitainete muundamisel."
   }
  ]
 },
 {
  "id": "respiration",
  "title": "Rakuhingamine aitab ATP-d valmistada",
  "requires": [
   "atp"
  ],
  "unit": "energy",
  "source": {
   "title": "Avita · Rakuorganellid tagavad raku elutegevuse",
   "url": "https://www.opiq.ee/kit/521/chapter/29090",
   "language": "et"
  },
  "reference": "Opiqu peatüki mitokondrite osa; raku energia muundumine koos varasema ainevahetuse teemaga.",
  "lesson": "Hapnikku kasutaval rakuhingamisel muundatakse näiteks glükoosi ja saadavat energiat kasutatakse ATP valmistamiseks. Lõppsaaduste hulka kuuluvad süsihappegaas ja vesi. Inimese rakkudes algab glükoosi lagundamine tsütoplasmas ning suur osa ATP-st valmib mitokondrites. Ka taimerakud hingavad. Rakuhingamine ei ole sama mis õhu liikumine kopsudesse ja sealt välja.",
  "example": "Palli järel joostes jõuab hapnik kopsudest verega lihastesse. Lihasrakud saavad kasutada hapnikku rakuhingamisel, et toitaineid muundades ATP-d valmistada. Kopsude töö ja rakkude töö on seotud.",
  "takeaway": "Rakuhingamine toimub rakkudes ja aitab toitainete energiat ATP kaudu kasutatavaks muuta.",
  "questions": [
   {
    "prompt": "Mis on hapnikku kasutava rakuhingamise üks oluline tulemus?",
    "options": [
     "ATP valmistamine",
     "Kõigi rakkude muutumine kopsudeks",
     "Valgusenergia püüdmine kloroplastides"
    ],
    "answer": 0,
    "explanation": "Rakuhingamisel saadavat energiat kasutatakse ATP valmistamiseks, et rakk saaks tööd teha."
   },
   {
    "prompt": "Kas taime rakud hingavad rakutasandil?",
    "options": [
     "Ei, fotosüntees asendab alati kogu rakuhingamise",
     "Jah, ka taime rakud valmistavad rakuhingamisel ATP-d",
     "Ainult siis, kui taimel puuduvad kõik lehed"
    ],
    "answer": 1,
    "explanation": "Ka taimerakud vajavad ATP-d ning kasutavad rakuhingamist. Fotosüntees ja rakuhingamine on eri protsessid."
   },
   {
    "prompt": "Lihasrakk teeb palju tööd. Milline rakuosa aitab hapnikku kasutades suure hulga ATP-d valmistada?",
    "options": [
     "Ainult rakukest",
     "Ainult rakutuum",
     "Mitokonder"
    ],
    "answer": 2,
    "explanation": "Mitokondrites toimub suur osa hapnikku kasutavast energia muundumisest. Glükoosi lagundamine algab siiski tsütoplasmas."
   },
   {
    "prompt": "Milline protsess toimub lihasrakus, mitte kopsu õhuteedes?",
    "options": [
     "Õhu liikumine hingetorust bronhidesse",
     "Rakuhingamine ja ATP valmistamine",
     "Õhu väljahingamine läbi nina"
    ],
    "answer": 1,
    "explanation": "Rakuhingamine toimub rakkudes. Hingamisliigutused aitavad keha hapniku ja süsihappegaasi vahetust tagada."
   },
   {
    "prompt": "Millised ained kuuluvad glükoosi hapnikuga täieliku lagundamise lõppsaaduste hulka?",
    "options": [
     "Glükoos ja hapnik",
     "Ainult valgus ja DNA",
     "Süsihappegaas ja vesi"
    ],
    "answer": 2,
    "explanation": "Glükoosi täielikul hapnikku kasutaval lagundamisel tekivad süsihappegaas ja vesi ning energia muundumist kasutatakse ATP valmistamiseks."
   }
  ]
 },
 {
  "id": "diffusion",
  "title": "Difusioon: osakeste hajumine",
  "requires": [
   "molecules",
   "membrane"
  ],
  "unit": "energy",
  "source": {
   "title": "Avita · Kõiki rakke ümbritseb rakumembraan",
   "url": "https://www.opiq.ee/kit/521/chapter/29089",
   "language": "et"
  },
  "reference": "Opiqu peatüki difusiooni osa; juhusliku liikumise ja netoliikumise eristamine.",
  "lesson": "Aineosakesed liiguvad juhuslikult. Difusioonil liigub osakesi kokkuvõttes rohkem sealt, kus nende kontsentratsioon on suurem, sinna, kus see on väiksem. Kontsentratsioon näitab aine hulka ruumala kohta. Liikumist toimub mõlemas suunas. Tasakaalu saabudes jätkub osakeste liikumine, kuid enam pole ülekaalus liikumist ühes suunas.",
  "example": "Tilgutad vette värvainet. Algul on seda tilga ümbruses rohkem, hiljem hajuvad osakesed laiemalt. Osakeste liikumine jätkub ka siis, kui vee värvus paistab ühtlane.",
  "takeaway": "Difusiooni netosuund on suuremalt kontsentratsioonilt väiksemale; osakesed ei peatu tasakaalus.",
  "questions": [
   {
    "prompt": "Mis suunas toimub difusioonil osakeste netoliikumine?",
    "options": [
     "Väiksemalt kontsentratsioonilt suuremale",
     "Alati ainult ülalt alla",
     "Suuremalt kontsentratsioonilt väiksemale"
    ],
    "answer": 2,
    "explanation": "Juhuslikult liigutakse mõlemas suunas, kuid kokkuvõttes liigub rohkem osakesi suuremalt kontsentratsioonilt väiksemale."
   },
   {
    "prompt": "Värvaine on vees ühtlaselt jaotunud. Mis toimub osakestega?",
    "options": [
     "Nende juhuslik liikumine jätkub",
     "Kõik osakesed jäävad seisma",
     "Kõik osakesed kogunevad kohe ühte punkti"
    ],
    "answer": 0,
    "explanation": "Ühtlane jaotus ei peata osakeste juhuslikku liikumist. Netoliikumine ühes suunas ei ole enam ülekaalus."
   },
   {
    "prompt": "Membraan laseb hapnikku läbi. Hapniku kontsentratsioon on rakust väljas suurem kui sees. Milline on hapniku netoliikumise suund?",
    "options": [
     "Rakust välja",
     "Rakku sisse",
     "Ainult mööda membraani, mitte läbi selle"
    ],
    "answer": 1,
    "explanation": "Läbitava membraani korral liigub hapnik difusioonil kokkuvõttes suurema kontsentratsiooniga väliskeskkonnast rakku."
   },
   {
    "prompt": "Mida võrdled, kui võrdled aine kontsentratsiooni kahes lahuses?",
    "options": [
     "Ainult anumate kõrgust",
     "Ainult aineosakeste värvi",
     "Aine hulka samas ruumalas"
    ],
    "answer": 2,
    "explanation": "Kontsentratsioon kirjeldab aine hulka ruumala kohta. Seetõttu saab võrrelda ka eri suurusega lahuseid."
   },
   {
    "prompt": "Difusioonil liigub osakesi kokkuvõttes vasakult paremale. Kas mõni osake võib liikuda ka paremalt vasakule?",
    "options": [
     "Jah, liikumist toimub mõlemas suunas",
     "Ei, kõik osakesed liiguvad alati ühtemoodi",
     "Ainult siis, kui osake muutub rakuks"
    ],
    "answer": 0,
    "explanation": "Netoliikumine kirjeldab ülekaalus suunda. Üksikute osakeste juhuslik liikumine toimub mõlemas suunas."
   }
  ]
 },
 {
  "id": "osmosis",
  "title": "Osmoos: vee liikumine läbi membraani",
  "requires": [
   "diffusion"
  ],
  "unit": "energy",
  "source": {
   "title": "Avita · Kõiki rakke ümbritseb rakumembraan",
   "url": "https://www.opiq.ee/kit/521/chapter/29089",
   "language": "et"
  },
  "reference": "Opiqu peatüki osmoosi osa; lihtmudel sama rõhu ja membraani mitteläbiva lahustunud ainega.",
  "lesson": "Osmoos on vee netoliikumine läbi valikuliselt läbilaskva membraani. Lihtsas näites pääseb vesi läbi, kuid lahustunud aine mitte. Kui rõhk on mõlemal pool sama, liigub vesi kokkuvõttes lahjema lahuse poolt kontsentreerituma poole. Vesi liigub tegelikult mõlemas suunas; netoliikumine näitab, kummale poole liigub seda rohkem.",
  "example": "Kaht lahust eraldab membraan, mis laseb läbi vett, kuid mitte suhkrut. Kui rõhk on sama, liigub vett kokkuvõttes rohkem selle poole, kus suhkrulahus on kontsentreeritum.",
  "takeaway": "Osmoos kirjeldab vee netoliikumist läbi valikuliselt läbilaskva membraani.",
  "questions": [
   {
    "prompt": "Millise aine liikumist kirjeldab osmoos?",
    "options": [
     "Vee",
     "Ainult DNA",
     "Ainult ensüümide"
    ],
    "answer": 0,
    "explanation": "Osmoos kirjeldab vee netoliikumist läbi valikuliselt läbilaskva membraani."
   },
   {
    "prompt": "Membraan laseb läbi vett, kuid mitte suhkrut. Rõhk on sama. Kuhu liigub vett kokkuvõttes rohkem?",
    "options": [
     "Lahjema suhkrulahuse poole",
     "Kontsentreerituma suhkrulahuse poole",
     "Alati ainult väiksemasse anumasse"
    ],
    "answer": 1,
    "explanation": "Selles lihtmudelis liigub vesi kokkuvõttes lahjemast lahusest kontsentreerituma poole."
   },
   {
    "prompt": "Rakust väljas on membraani mitteläbiva lahustunud aine kontsentratsioon suurem kui rakus. Rõhk on algul sama. Mis võib rakuga juhtuda?",
    "options": [
     "Vesi liigub kokkuvõttes sisse ja rakk paisub",
     "Lahustunud aine muutub kohe veeks",
     "Vesi liigub kokkuvõttes välja ja rakk kahaneb"
    ],
    "answer": 2,
    "explanation": "Kui väljaspool on rohkem membraani mitteläbivat lahustunud ainet, võib vesi rakust väljuda ja rakk kahaneda."
   },
   {
    "prompt": "Mida tähendab osmoosi puhul sõna „netoliikumine”?",
    "options": [
     "Vesi liigub ainult ühes suunas",
     "Vee liikumine on ühes suunas ülekaalus",
     "Kõik veemolekulid seisavad paigal"
    ],
    "answer": 1,
    "explanation": "Vesi liigub mõlemas suunas, kuid netoliikumine näitab ülekaalus suunda."
   },
   {
    "prompt": "Vesi saab rakumembraani läbida. Rakus ja väljaspool pole enam vee netoliikumist. Mis toimub veemolekulidega?",
    "options": [
     "Need kõik peatuvad",
     "Need kõik muutuvad soolaks",
     "Liikumine mõlemas suunas jätkub"
    ],
    "answer": 2,
    "explanation": "Netoliikumise puudumine ei tähenda molekulide peatumist. Vett liigub mõlemas suunas, ilma et üks suund oleks ülekaalus."
   }
  ]
 },
 {
  "id": "roots",
  "title": "Juur võtab mullast vett ja mineraalaineid",
  "requires": [
   "plant_cell",
   "photosynthesis"
  ],
  "unit": "nature",
  "source": {
   "title": "Avita · Juur",
   "url": "https://www.opiq.ee/kit/535/chapter/29697",
   "language": "et"
  },
  "reference": "Opiqu peatükk „Juur”; kinnitumine, imendumine ja juurekarvade roll.",
  "lesson": "Juur kinnitab taime kasvukohta ning võtab mullast vett ja mineraalaineid. Peened juurekarvad suurendavad mullaga kokkupuutuvat pinda ning aitavad imendumisel. Suhkruid valmistab roheline taim fotosünteesil; juur ei võta mullast valmis suhkrutoitu. Mõne taime juur talletab varuaineid, mis on valmistatud taime teistes osades.",
  "example": "Porgandi jäme juur sisaldab varuaineid. Need on seotud taime lehtedes toimunud fotosünteesiga. Mullast sai taim vett ja mineraalaineid, mitte valmis porgandisse kogunevat suhkrutoitu.",
  "takeaway": "Juur aitab saada vett ja mineraalaineid, kuid taime suhkrud tekivad fotosünteesil.",
  "questions": [
   {
    "prompt": "Mida võtab juur mullast taimede põhivajaduste jaoks?",
    "options": [
     "Valmis lehti",
     "Vett ja mineraalaineid",
     "Ainult valgusenergiat"
    ],
    "answer": 1,
    "explanation": "Juur võtab mullast vett ja mineraalaineid ning aitab taime kasvukohta kinnitada."
   },
   {
    "prompt": "Miks on peened juurekarvad kasulikud?",
    "options": [
     "Need asendavad kõik lehed",
     "Need toodavad päikesevalgust",
     "Need suurendavad imendumiseks sobivat pinda"
    ],
    "answer": 2,
    "explanation": "Juurekarvad suurendavad kokkupuutepinda mullaga ja aitavad vett ning mineraalaineid omastada."
   },
   {
    "prompt": "Porgandi juures on suhkruid ja muid varuaineid. Kust on pärit nende valmistamiseks vajalik orgaaniline aine?",
    "options": [
     "Taime fotosünteesist",
     "Valmis suhkrutoiduna mullast",
     "Ainult vihmaveest"
    ],
    "answer": 0,
    "explanation": "Taime rohelised osad valmistavad fotosünteesil orgaanilisi aineid, mida saab juures varuks talletada."
   },
   {
    "prompt": "Tugev vihm ei vii taime kergesti kasvukohast ära. Milline juure ülesanne aitab sellele kaasa?",
    "options": [
     "Õhu pumpamine kopsudesse",
     "Taime kinnitamine kasvukohta",
     "Kõigi õite tolmeldamine"
    ],
    "answer": 1,
    "explanation": "Juurestik ankurdab taime kasvukohta. Vee ja mineraalainete omastamine on selle teine tähtis ülesanne."
   },
   {
    "prompt": "Taime juurekarvad saavad tugevalt kahjustada. Milline tegevus võib vahetult raskemaks muutuda?",
    "options": [
     "Valguse jõudmine lehtedeni",
     "Õite värvi nägemine",
     "Vee ja mineraalainete omastamine"
    ],
    "answer": 2,
    "explanation": "Juurekarvade kahjustus vähendab imendumiseks sobivat pinda ning võib raskendada vee ja mineraalainete omastamist."
   }
  ]
 },
 {
  "id": "ecosystem",
  "title": "Ökosüsteem ühendab elusa ja eluta",
  "requires": [
   "cell"
  ],
  "unit": "nature",
  "source": {
   "title": "Avita · Liik, kooslus, populatsioon, ökosüsteem, biosfäär",
   "url": "https://www.opiq.ee/kit/535/chapter/30980",
   "language": "et"
  },
  "reference": "Opiqu peatükk „Liik, kooslus, populatsioon, ökosüsteem, biosfäär”; mõisted ja keskkonnaseosed.",
  "lesson": "Ühes piirkonnas elavad sama liigi isendid moodustavad populatsiooni. Eri liikide populatsioonid moodustavad seal koosluse. Ökosüsteemi kuuluvad kooslus ja selle eluta keskkond, näiteks vesi, muld ning temperatuuritingimused. Elus ja eluta osad mõjutavad üksteist. Ökosüsteem muutub ajas; see ei ole alati täpselt samas seisundis.",
  "example": "Tiigis elavad kalad, taimed ja mikroorganismid. Tiigi ökosüsteemi mõistmiseks vaatled lisaks elusolenditele ka vett, valgust ja temperatuuri. Pikk põud võib kõiki neid suhteid muuta.",
  "takeaway": "Ökosüsteemis toimivad koos elusolendid ja nende eluta keskkond.",
  "questions": [
   {
    "prompt": "Mis kuulub ökosüsteemi?",
    "options": [
     "Elusolendite kooslus ja eluta keskkond",
     "Ainult ühe liigi isendid",
     "Ainult loomad, taimed välja arvatud"
    ],
    "answer": 0,
    "explanation": "Ökosüsteem hõlmab nii elusolendite kooslust kui ka selle eluta keskkonda ja nende seoseid."
   },
   {
    "prompt": "Kuidas nimetatakse ühes tiigis elavaid sama liigi konni?",
    "options": [
     "Üheks elundkonnaks",
     "Selle liigi populatsiooniks",
     "Kogu biosfääriks"
    ],
    "answer": 1,
    "explanation": "Populatsioon koosneb ühes piirkonnas elavatest sama liigi isenditest."
   },
   {
    "prompt": "Põud vähendab tiigi veehulka. Miks on see ökosüsteemi muutus?",
    "options": [
     "Sest vesi muutus loomaliigiks",
     "Sest ökosüsteemis on ainult eluta osi",
     "Sest eluta keskkonna muutus mõjutab elusolendeid"
    ],
    "answer": 2,
    "explanation": "Vesi on eluta keskkonna osa. Selle hulga muutus mõjutab tiigis elavaid organisme."
   },
   {
    "prompt": "Mida nimetatakse metsas elavate eri liikide populatsioonide kogumiks?",
    "options": [
     "Koosluseks",
     "Üheks rakuks",
     "Üheks populatsiooniks"
    ],
    "answer": 0,
    "explanation": "Eri liikide populatsioonid moodustavad koosluse. Koos eluta keskkonnaga moodustab see ökosüsteemi."
   },
   {
    "prompt": "Milline väide sobib ökosüsteemi kohta?",
    "options": [
     "Kõik ökosüsteemid on alati muutumatud",
     "Eluta tingimused ei mõjuta elusolendeid",
     "Ökosüsteem võib aastaaegade ja teiste muutuste tõttu muutuda"
    ],
    "answer": 2,
    "explanation": "Ökosüsteem on muutuv. Temperatuur, veehulk, liigid ja nendevahelised suhted võivad ajas erineda."
   }
  ]
 },
 {
  "id": "food_web",
  "title": "Toiduvõrk näitab söömisseoseid",
  "requires": [
   "ecosystem",
   "photosynthesis"
  ],
  "unit": "nature",
  "source": {
   "title": "Avita · Ökoloogiline püramiid",
   "url": "https://www.opiq.ee/kit/535/chapter/30982",
   "language": "et"
  },
  "reference": "Opiqu peatüki tootjate, tarbijate ja toitumistasemete mõisted; oma toiduahela näited.",
  "lesson": "Tootjad, näiteks rohelised taimed, valmistavad orgaanilist ainet. Tarbijad saavad seda teisi organisme süües. Toiduahel näitab üht rada, toiduvõrk aga mitut omavahel seotud rada. Siin suuname noole toidust sööja poole: rohi → rohutirts. Nool näitab, kuhu toit ja selles sisalduv energia liiguvad. Ühel sööjal võib olla mitu toiduallikat.",
  "example": "Rohutirts sööb rohtu ja konn sööb rohutirtsu: rohi → rohutirts → konn. Konn võib süüa teisigi loomi, seega üks toiduahel ei näita kõiki tema toitumissuhteid.",
  "takeaway": "Toiduvõrk ühendab toiduahelaid; siin näitab nool teed toidust sööjani.",
  "questions": [
   {
    "prompt": "Milline organism on selles toiduahelas tootja: rohi → rohutirts → konn?",
    "options": [
     "Konn",
     "Rohutirts",
     "Rohi"
    ],
    "answer": 2,
    "explanation": "Roheline rohi valmistab fotosünteesil orgaanilist ainet. Rohutirts ja konn on selles ahelas tarbijad."
   },
   {
    "prompt": "Siin tähendab nool liikumist toidust sööja poole. Mida ütleb „rohi → rohutirts”?",
    "options": [
     "Rohutirts sööb rohtu",
     "Rohi sööb rohutirtsu",
     "Rohutirts muudab rohu loomaks"
    ],
    "answer": 0,
    "explanation": "Nool algab toidust ja lõpeb selle sööja juures. Rohutirts saab rohust aineid ja energiat."
   },
   {
    "prompt": "Lind sööb nii seemneid kui ka röövikuid. Milline kujutis näitab tema söömisseoseid paremini?",
    "options": [
     "Ainult üks rada, mis kõik muu välistab",
     "Toiduvõrk mitme ühendatud rajaga",
     "Joonis, milles toiduallikaid pole"
    ],
    "answer": 1,
    "explanation": "Toiduvõrk saab näidata mitut toiduallikat ja nende seoseid teiste organismidega."
   },
   {
    "prompt": "Jänes sööb rohelisi taimi. Milline roll on jänesel selles seoses?",
    "options": [
     "Tootja",
     "Eluta keskkond",
     "Tarbija"
    ],
    "answer": 2,
    "explanation": "Jänes saab orgaanilist ainet teisi organisme süües ning on seetõttu tarbija."
   },
   {
    "prompt": "Röövikuid söövad nii linnud kui ka ämblikud. Mida see näitab?",
    "options": [
     "Sama organism võib olla mitme toiduahela osa",
     "Iga liik saab kuuluda ainult ühte toiduahelasse",
     "Kõik sööjad peavad sööma ainult üht liiki"
    ],
    "answer": 0,
    "explanation": "Toiduvõrgus seovad ühised toiduallikad ja sööjad eri toiduahelaid omavahel."
   }
  ]
 },
 {
  "id": "matter_energy",
  "title": "Aine ringleb, energia liigub läbi",
  "requires": [
   "food_web",
   "respiration"
  ],
  "unit": "nature",
  "source": {
   "title": "Avita · Ökoloogiline püramiid",
   "url": "https://www.opiq.ee/kit/535/chapter/30982",
   "language": "et"
  },
  "reference": "Opiqu peatüki energia liikumise ja toitumistasemete selgitus; aineringe ning energiavoo eristus.",
  "lesson": "Ökosüsteemis saavad ained ringelda: lagundajad aitavad surnud organismide aineid taas kasutatavaks muuta. Energia liigub aga läbi ökosüsteemi. Osa toiduga saadud energiast kasutatakse elutegevuseks ja muundub soojuseks. Seetõttu jõuab järgmise toitumistaseme organismidele toiduna edasi ainult osa energiast. Energiat ei hävitata, kuid kogu energia ei jää uueks toiduks.",
  "example": "Mahakukkunud leht laguneb ning selle mineraalained võivad uuesti taimede kasutusse jõuda. Lehe energiast osa muundub lagundajate elutegevuses soojuseks; see ei ringle sama moodi nagu mineraalained.",
  "takeaway": "Lagundajad aitavad ainetel ringelda, kuid toiduahelas kandub edasi vaid osa energiast.",
  "questions": [
   {
    "prompt": "Mis on lagundajate oluline roll?",
    "options": [
     "Muuta surnud organismide aineid taas kasutatavaks",
     "Tekitada energiat täiesti tühjast",
     "Peatada kõik aineringed"
    ],
    "answer": 0,
    "explanation": "Lagundajad muundavad surnud organismide orgaanilist ainet ja aitavad toitainetel keskkonnas ringelda."
   },
   {
    "prompt": "Miks ei jõua kogu söödud toidu energia järgmisele sööjale?",
    "options": [
     "Sest energia kaob täielikult olematuks",
     "Osa kasutatakse elutegevuseks ja muundub soojuseks",
     "Sest ükski organism ei kasuta energiat"
    ],
    "answer": 1,
    "explanation": "Organism kasutab energiat enda elutegevuseks ning osa energiast hajub soojusena. Ainult osa jääb järgmisele sööjale kättesaadavasse toitu."
   },
   {
    "prompt": "Lehe lagunemisel jõuavad mineraalained mulda ja sealt taime. Millist nähtust see illustreerib?",
    "options": [
     "Energia tekkimist eimillestki",
     "Kõigi ainete lõplikku kadumist",
     "Ainete ringlust"
    ],
    "answer": 2,
    "explanation": "Sama aine koostisosad saavad liikuda organismidest keskkonda ja sealt uuesti organismidesse."
   },
   {
    "prompt": "Milline väide eristab ökosüsteemis aineid ja energiat?",
    "options": [
     "Ained võivad ringelda, energia liigub läbi ja osa hajub soojusena",
     "Nii ained kui ka kogu energia ringlevad ühtemoodi lõputult",
     "Energia on lihtsalt mineraalaine teine nimi"
    ],
    "answer": 0,
    "explanation": "Ainete koostisosi saab taas kasutada. Energiavoo käigus muundub osa energiast soojuseks ja ökosüsteem vajab uut energiavoolu."
   },
   {
    "prompt": "Enamikus maismaaökosüsteemides seovad taimed pidevalt uut valgusenergiat. Miks on uus energiavoog vajalik?",
    "options": [
     "Sest ained ei saa kunagi ringelda",
     "Sest tarbijad loovad energiat tühjast",
     "Sest elutegevuses muundub osa energiast soojuseks"
    ],
    "answer": 2,
    "explanation": "Taimed seovad uut valgusenergiat. Varem seotud energia muundub elutegevuses järk-järgult soojuseks ega ringle samal viisil nagu ained."
   }
  ]
 },
 {
  "id": "natural_selection",
  "title": "Looduslik valik toimib põlvkondade jooksul",
  "requires": [
   "inheritance",
   "ecosystem"
  ],
  "unit": "nature",
  "source": {
   "title": "Koolibri · Olelusvõitlus ja looduslik valik",
   "url": "https://www.opiq.ee/kit/557/chapter/31352",
   "language": "et"
  },
  "reference": "Opiqu peatükk „Olelusvõitlus ja looduslik valik”; algtaseme päriliku varieeruvuse näide.",
  "lesson": "Sama liigi isendid erinevad üksteisest ning osa erinevusi on pärilikud. Kui mõni pärilik tunnus aitab teatud keskkonnas ellu jääda ja järglasi saada, võib see tunnus põlvkondade jooksul populatsioonis sageneda. Seda nimetatakse looduslikuks valikuks. Isend ei muuda end teadlikult vajalikuks. Kasulik tunnus sõltub keskkonnast, sama tunnus ei anna eelist igas olukorras.",
  "example": "Mardikate populatsioonis on pärilikke värvuserinevusi. Tumedal taustal märkavad linnud tumedaid mardikaid harvem. Kui need saavad rohkem järglasi, võib tume värvus põlvkondade jooksul sageneda.",
  "takeaway": "Looduslik valik võib muuta pärilike tunnuste sagedust populatsioonis põlvkondade jooksul.",
  "questions": [
   {
    "prompt": "Mida võib looduslik valik põlvkondade jooksul muuta?",
    "options": [
     "Ühe isendi teadlikku soovi",
     "Päriliku tunnuse sagedust populatsioonis",
     "Kõik tunnused kohe kõigil isenditel samaks"
    ],
    "answer": 1,
    "explanation": "Kui mõne päriliku tunnusega isendid jätavad rohkem järglasi, võib see tunnus populatsioonis sageneda."
   },
   {
    "prompt": "Miks võib hästi varjav pärilik värvus populatsioonis sageneda?",
    "options": [
     "Sest kõik isendid otsustavad sama värvi olla",
     "Sest varjav värvus peab igas keskkonnas alati parim olema",
     "Sest sellise värvusega isendid võivad jätta rohkem järglasi"
    ],
    "answer": 2,
    "explanation": "Parem varjumine võib aidata ellu jääda ja paljuneda. Pärilik tunnus kandub siis sagedamini järgmisse põlvkonda."
   },
   {
    "prompt": "Tume värvus aitab mardikal tumedal taustal varjuda. Taust muutub heledaks. Milline järeldus on mõistlik?",
    "options": [
     "Värvuse eelis võib muutuda, sest keskkond muutus",
     "Kõik mardikad muutuvad kohe tahtlikult heledaks",
     "Tume värvus peab alati ja kõikjal parim olema"
    ],
    "answer": 0,
    "explanation": "Tunnuse kasulikkus sõltub keskkonnast. Muutunud taustal võib varjamiseks sobida teine värvus."
   },
   {
    "prompt": "Mida on vaja, et tunnus saaks loodusliku valiku tõttu järglaste hulgas sageneda?",
    "options": [
     "Tunnus peab olema kõigil täpselt sama",
     "Tunnus peab olema vähemalt osaliselt pärilik",
     "Tunnus peab olema isendi teadlik valik"
    ],
    "answer": 1,
    "explanation": "Looduslik valik saab tunnuse sagedust põlvkondades muuta, kui erinevus on pärilik ja seostub järglaste saamisega."
   },
   {
    "prompt": "Jalgpallur parandab harjutades oma löögitäpsust. Milline kirjeldus sobib kõige paremini?",
    "options": [
     "See on juba iseenesest looduslik valik põlvkondades",
     "Tema järglased saavad harjutatud oskuse automaatselt DNA-ga",
     "See on ühe inimese õpitud oskuse paranemine"
    ],
    "answer": 2,
    "explanation": "Harjutades omandatud oskus ei ole sama mis pärilike tunnuste sageduse muutus populatsioonis põlvkondade jooksul."
   }
  ]
 },
 {
  "id": "digestion",
  "title": "Seedimine teeb suured toidumolekulid väiksemaks",
  "requires": [
   "system",
   "nutrients",
   "enzymes"
  ],
  "unit": "body",
  "source": {
   "title": "Koolibri · Seede- ja erituselundkond",
   "url": "https://www.opiq.ee/kit/557/chapter/31335",
   "language": "et"
  },
  "reference": "Seedimise ja eritamise teema. Seletus, näide ja küsimused on koostatud selle õpiruumi jaoks.",
  "lesson": "Seedimisel peenestatakse toit ning suured toidumolekulid lõhustatakse väiksemateks. Näiteks tärklisest tekivad lõpuks lihtsuhkrud ja valkudest aminohapped. Keemilist lõhustamist kiirendavad seedeensüümid. See valmistab ained ette imendumiseks läbi sooleseina. Kõik toitained ei vaja sellist lõhustamist: näiteks vesi saab imenduda muutumatul kujul.",
  "example": "Enne trenni sööd leiba. Närimine teeb leivatüki väiksemaks, kuid tärklisemolekulide lõhustamiseks on vaja ka ensüüme. Terve leivatükk ei liigu soolest otse lihasrakku.",
  "takeaway": "Seedimine lõhustab toidu; imendumine viib sobivad ained läbi sooleseina.",
  "questions": [
   {
    "prompt": "Mis toimub tärklise keemilisel seedimisel?",
    "options": [
     "Tärklisemolekulidest tekivad väiksemad suhkrumolekulid",
     "Tärklis liigub muutumatult otse lihaskoesse",
     "Tärklisest tekivad uued soolerakud ilma lõhustamiseta"
    ],
    "answer": 0,
    "explanation": "Seedimine lõhustab suuri toidumolekule. Tärklise seedimise lõppsaaduste hulka kuulub glükoos."
   },
   {
    "prompt": "Mis on seedeensüümi ülesanne?",
    "options": [
     "Pumbata verd soolest südamesse",
     "Kiirendada kindlate toidumolekulide lõhustamist",
     "Viia terve toidutükk läbi sooleseina"
    ],
    "answer": 1,
    "explanation": "Seedeensüüm on katalüsaator: see kiirendab talle sobivat lõhustumisreaktsiooni."
   },
   {
    "prompt": "Õpilane närib saia väikesteks tükkideks. Kas sellest üksi piisab kogu tärklise muutmiseks lihtsuhkruteks?",
    "options": [
     "Jah, kõik väikesed toidutükid on juba lihtsuhkrud",
     "Jah, molekulide lõhustamine toimub ainult närimisel",
     "Ei, tärklisemolekulide lõhustamiseks on vaja keemilist seedimist"
    ],
    "answer": 2,
    "explanation": "Toidutüki suurus ja selle molekulide suurus on eri asjad. Närimine aitab, kuid ei asenda ensüümide tööd."
   },
   {
    "prompt": "Toiduvalgud on muutunud aminohapeteks. Millist protsessi see kirjeldab?",
    "options": [
     "Keemilist seedimist",
     "Vere pumpamist",
     "Gaasivahetust kopsudes"
    ],
    "answer": 0,
    "explanation": "Valkude lõhustamine aminohapeteks on keemiline seedimine. Aminohapete imendumine on järgmine eraldi samm."
   },
   {
    "prompt": "Milline aine saab soolest imenduda ilma, et see tuleks esmalt väiksemateks molekulideks seedida?",
    "options": [
     "Tärklis",
     "Vesi",
     "Suur toiduvalgu molekul"
    ],
    "answer": 1,
    "explanation": "Vesi ei vaja seedimist. Suuri tärklise- ja valgumolekule tuleb enne nende koostisosade imendumist lõhustada."
   }
  ]
 },
 {
  "id": "absorption",
  "title": "Imendumine viib toitained läbi sooleseina",
  "requires": [
   "digestion",
   "membrane"
  ],
  "unit": "body",
  "source": {
   "title": "Koolibri · Seede- ja erituselundkond",
   "url": "https://www.opiq.ee/kit/557/chapter/31335",
   "language": "et"
  },
  "reference": "Seedimise ja eritamise teema; fookus on seedimise ja imendumise eristamisel. Originaalsed õpiülesanded.",
  "lesson": "Imendumisel liiguvad ained seedekulgla sisust läbi sooleseina verre või lümfi. Enamik toitaineid imendub peensooles, mille hattudega sisepinnal on suur pindala. Glükoos ja aminohapped jõuavad verre, paljud rasvade koostisosad esmalt lümfi. Seedimine ja imendumine on seega järjestikused, kuid erinevad protsessid.",
  "example": "Pasta tärklis on lõhustatud glükoosiks. Seni on glükoos veel soole sisus. Alles läbi sooleseina liikumine võimaldab sellel verega jõuda näiteks sinu jalalihastesse.",
  "takeaway": "Imendumine tähendab aine liikumist läbi sooleseina, mitte selle lõhustamist.",
  "questions": [
   {
    "prompt": "Milline kirjeldus tähendab imendumist?",
    "options": [
     "Valk lõhustub aminohapeteks",
     "Aminohapped liiguvad läbi sooleseina verre",
     "Süda pumpab verd kopsudesse"
    ],
    "answer": 1,
    "explanation": "Imendumise tunnus on sooleseina läbimine. Molekuli lõhustamine on seedimine."
   },
   {
    "prompt": "Kus imendub enamik toitaineid?",
    "options": [
     "Söögitorus",
     "Hingetorus",
     "Peensooles"
    ],
    "answer": 2,
    "explanation": "Peensool on peamine toitainete imendumise koht. Selle suur sisepind toetab ainevahetust soole sisu ja keha vahel."
   },
   {
    "prompt": "Miks on peensoole arvukad hatud imendumisele kasulikud?",
    "options": [
     "Need suurendavad imendumiseks kasutatavat pindala",
     "Need muudavad kõik toitained hapnikuks",
     "Need asendavad vere liikumise kehas"
    ],
    "answer": 0,
    "explanation": "Suurem pindala annab rohkem pinda, mille kaudu ained saavad sooleseina läbida."
   },
   {
    "prompt": "Peensooles on glükoos juba olemas, kuid see ei ole veel sooleseina läbinud. Milline samm on veel toimumata?",
    "options": [
     "Glükoosi muutmine terveks toidutükiks",
     "Imendumine",
     "Toidu närimine"
    ],
    "answer": 1,
    "explanation": "Glükoosi olemasolu soole sisus ei tähenda veel, et see oleks verre imendunud."
   },
   {
    "prompt": "Glükoos liigub peensoolest verre ja seejärel jalalihasesse. Milline osa sellest teekonnast on imendumine?",
    "options": [
     "Vere voolamine läbi südame",
     "Lihase kokkutõmbumine",
     "Glükoosi liikumine läbi sooleseina verre"
    ],
    "answer": 2,
    "explanation": "Sooleseina läbimine on imendumine. Järgnev liikumine verega on ainete transport kehas."
   }
  ]
 },
 {
  "id": "gas_exchange",
  "title": "Kopsudes liigub hapnik õhust verre",
  "requires": [
   "system",
   "diffusion",
   "respiration"
  ],
  "unit": "body",
  "source": {
   "title": "Koolibri · Hingamiselundkond",
   "url": "https://www.opiq.ee/kit/557/chapter/31336",
   "language": "et"
  },
  "reference": "Hingamise ja gaasivahetuse teema. Originaalne selgitus eristab õhu liikumist, gaasivahetust ja rakuhingamist.",
  "lesson": "Sissehingamine toob õhu kopsudesse. Kopsusompude ehk alveoolide õhu ja vere vahel toimub gaasivahetus: hapnik liigub verre ning süsihappegaas verest kopsusompudesse. Gaasid liiguvad difusiooni teel läbi õhukese vahetuspinna. Verega saab hapnik edasi kudedesse. Rakuhingamine toimub rakkudes ja on sellest eraldi protsess.",
  "example": "Kiire jooksu ajal hingad sagedamini. Õhu kopsudesse toomisest üksi ei piisa: hapnik peab ületama kopsusombu ja vere vahelise pinna ning jõudma verega lihasteni.",
  "takeaway": "Sissehingamine liigutab õhku; gaasivahetus viib hapniku kopsuõhust verre.",
  "questions": [
   {
    "prompt": "Mis suunas liigub hapnik tavaliselt kopsude gaasivahetusel?",
    "options": [
     "Verest söögitorru",
     "Kopsuõhust otse jalalihasesse ilma vereta",
     "Kopsusombu õhust verre"
    ],
    "answer": 2,
    "explanation": "Kopsudes läbib hapnik õhukese vahetuspinna ja jõuab verre. Veri kannab selle edasi kudedesse."
   },
   {
    "prompt": "Mis suunas liigub süsihappegaas tavaliselt kopsude gaasivahetusel?",
    "options": [
     "Verest kopsusompude õhku",
     "Kopsuõhust ainult luudesse",
     "Söögitorust otse verre"
    ],
    "answer": 0,
    "explanation": "Veri toob kudedes tekkinud süsihappegaasi kopsudesse. Sealt liigub see õhku ja väljub väljahingamisel."
   },
   {
    "prompt": "Milline omadus aitab kopsusompudel gaase verega vahetada?",
    "options": [
     "Väga paks vahetuspind",
     "Õhuke vahetuspind ja suur kogupindala",
     "Täielik eraldatus veresoontest"
    ],
    "answer": 1,
    "explanation": "Õhuke pind lühendab gaaside liikumisteed. Suur kogupindala võimaldab ulatuslikku gaasivahetust."
   },
   {
    "prompt": "Hapnikumolekul on just liikunud kopsusombu õhust kapillaariverre. Mis toimus?",
    "options": [
     "Toitaine imendumine soolest",
     "Rakuhingamine lihasrakus",
     "Gaasivahetus kopsudes"
    ],
    "answer": 2,
    "explanation": "Gaas liikus kopsuõhu ja vere vahel. See on gaasivahetus, mitte raku energia vabastamise protsess."
   },
   {
    "prompt": "Õpilane ütleb: „Õhu kopsudesse tõmbamine ja rakuhingamine on sama protsess.” Milline parandus sobib?",
    "options": [
     "Õhu liikumine toimub hingamisteedes, rakuhingamise reaktsioonid rakkudes",
     "Rakuhingamine toimub ainult kopsus olevas õhus",
     "Rakuhingamine tähendab üksnes väljahingamist"
    ],
    "answer": 0,
    "explanation": "Kopsude ventilatsioon toob ja eemaldab õhku. Rakuhingamine on rakkudes toimuv ainete lagundamine ja energia ülekandmine."
   }
  ]
 },
 {
  "id": "circulation",
  "title": "Süda hoiab vere liikumas",
  "requires": [
   "system",
   "gas_exchange"
  ],
  "unit": "body",
  "source": {
   "title": "Koolibri · Veresoonkond",
   "url": "https://www.opiq.ee/kit/557/chapter/31333",
   "language": "et"
  },
  "reference": "Vereringe teema. Keskendume vere teekonnale ja veresoonte suunale, mitte kõigi osade päheõppimisele.",
  "lesson": "Süda pumpab verd mööda veresooni. Kopsuvereringes liigub veri südamest kopsudesse ja tagasi; kehavereringes südamest keha kudedesse ja tagasi. Arter viib verd südamest eemale, veen südame poole. Peentes kapillaarides vahetab veri ümbritsevate kudedega aineid. Veresoone nimi ei sõltu sellest, kui hapnikurikas veri seal on.",
  "example": "Kopsudest hapnikku saanud veri jõuab kõigepealt tagasi südamesse ja sealt töötavatesse lihastesse. Süda ei valmista hapnikku: selle pumpav töö aitab hapnikku sisaldaval verel kehas liikuda.",
  "takeaway": "Arter viib verd südamest eemale ja veen südame poole.",
  "questions": [
   {
    "prompt": "Milline veresoon viib verd südamest eemale?",
    "options": [
     "Arter",
     "Veen",
     "Ainult selline veresoon, milles pole hapnikku"
    ],
    "answer": 0,
    "explanation": "Arterit määratleb vere liikumise suund südame suhtes, mitte vere hapnikusisaldus."
   },
   {
    "prompt": "Milline teekond kirjeldab kopsuvereringet?",
    "options": [
     "Kopsud → jalalihas → magu",
     "Süda → kopsud → süda",
     "Peensool → neerud → peensool"
    ],
    "answer": 1,
    "explanation": "Kopsuvereringe viib vere südamest kopsude gaasivahetuspinnani ja sealt tagasi südamesse."
   },
   {
    "prompt": "Kopsuarter viib suhteliselt hapnikuvaest verd südamest kopsudesse. Miks on see siiski arter?",
    "options": [
     "Kõik kopsude veresooned on arterid",
     "Arter tähendab alati hapnikuvaest verd",
     "Veri liigub selles südamest eemale"
    ],
    "answer": 2,
    "explanation": "Arteri määrab suund: südamest eemale. Seetõttu on hapnikusisalduse järgi nimetamine eksitav."
   },
   {
    "prompt": "Millistes veresoontes toimub peamine ainete vahetus vere ja kudede vahel?",
    "options": [
     "Kapillaarides",
     "Ainult kõige suuremas arteris",
     "Ainult südamesse suubuvates suurtes veenides"
    ],
    "answer": 0,
    "explanation": "Kapillaaride õhukesed seinad võimaldavad ainete vahetust vere ja kudesid ümbritseva vedeliku vahel."
   },
   {
    "prompt": "Veri liigub jalast tagasi südame poole. Millistesse veresoontesse kuuluvad selle tagasitee suuremad sooned?",
    "options": [
     "Arteritesse, sest jalad vajavad hapnikku",
     "Veenidesse, sest veri liigub südame poole",
     "Kopsusompudesse, sest veri liigub ülespoole"
    ],
    "answer": 1,
    "explanation": "Südame poole verd juhtivad veresooned on veenid. Kehaasend ega liikumine ülespoole ei määra veresoone liiki."
   }
  ]
 },
 {
  "id": "blood",
  "title": "Vere osadel on erinevad ülesanded",
  "requires": [
   "circulation",
   "tissue"
  ],
  "unit": "body",
  "source": {
   "title": "Koolibri · Veri",
   "url": "https://www.opiq.ee/kit/557/chapter/31334",
   "language": "et"
  },
  "reference": "Vere ja immuunsuse teema. Inimese vereliistakuid käsitleme rakufragmentidena. Küsimused on originaalsed.",
  "lesson": "Veri sisaldab vedelat vereplasmat ja selles paiknevaid vormelemente. Punaste vereliblede hemoglobiin kannab hapnikku. Valged verelibled osalevad organismi kaitses. Vereliistakud aitavad kahjustatud veresoones verejooksu peatada; inimesel on need rakufragmendid. Plasma kannab muu hulgas vett ja lahustunud aineid. Need osad töötavad koos, kuid ei täida üht ja sama ülesannet.",
  "example": "Töötava lihaseni jõuab verega nii hapnikku kui ka glükoosi. Hapniku kandmises on tähtis punaste vereliblede hemoglobiin, glükoos aga liigub veres peamiselt plasmas lahustunult.",
  "takeaway": "Punased verelibled kannavad hapnikku, valged kaitsevad ja vereliistakud aitavad verejooksu peatada.",
  "questions": [
   {
    "prompt": "Milline vere osa kannab hemoglobiini abil suuremat osa vere hapnikust?",
    "options": [
     "Vereliistakud",
     "Punased verelibled",
     "Valged verelibled"
    ],
    "answer": 1,
    "explanation": "Punaste vereliblede hemoglobiin seob hapnikku ja aitab seda kopsudest kudedesse kanda."
   },
   {
    "prompt": "Milline paar on õigesti ühendatud?",
    "options": [
     "Valged verelibled — vere pumpamine",
     "Vereplasma — luude liigutamine",
     "Vereliistakud — verejooksu peatamises osalemine"
    ],
    "answer": 2,
    "explanation": "Vereliistakud osalevad kahjustuskoha sulgemisel koos teiste hüübimissüsteemi osadega. Süda pumpab verd."
   },
   {
    "prompt": "Vereproovis uuritakse plasmas lahustunud glükoosi. Millist vere osa uuritakse?",
    "options": [
     "Vere vedelat osa",
     "Ainult punaste vereliblede tuumi",
     "Ainult vereliistakute pinda"
    ],
    "answer": 0,
    "explanation": "Plasma on vere vedel osa, milles liiguvad paljud lahustunud ained, sealhulgas glükoos."
   },
   {
    "prompt": "Millised vere rakud osalevad muu hulgas haigustekitajate vastu suunatud kaitses?",
    "options": [
     "Punased verelibled",
     "Valged verelibled",
     "Kõik vere rakud üksnes hapniku kandmisega"
    ],
    "answer": 1,
    "explanation": "Valgete vereliblede hulka kuuluvad mitmesugused kaitseülesandeid täitvad rakud."
   },
   {
    "prompt": "Õpilane nimetab inimese vereliistakut terveks tuumaga rakuks. Milline parandus on õige?",
    "options": [
     "Vereliistak on hapnikumolekul",
     "Vereliistak on vedel plasma",
     "Vereliistak on suuremast rakust tekkinud rakufragment"
    ],
    "answer": 2,
    "explanation": "Inimese vereliistakud on rakufragmendid. Neil on oluline roll verejooksu peatamisel, kuigi need ei ole terved tuumaga rakud."
   }
  ]
 },
 {
  "id": "kidneys",
  "title": "Neerud eritavad ja hoiavad tasakaalu",
  "requires": [
   "circulation",
   "molecules",
   "balance"
  ],
  "unit": "body",
  "source": {
   "title": "Koolibri · Seede- ja erituselundkond",
   "url": "https://www.opiq.ee/kit/557/chapter/31335",
   "language": "et"
  },
  "reference": "Seedimise ja eritamise teema. Fookus on uriini päritolul ning vee ja lahustunud ainete reguleerimisel.",
  "lesson": "Neerud moodustavad verest filtreeritud vedeliku töötlemisel uriini. Palju vett ja kehale vajalikke aineid võetakse tagasi verre; osa jääkaineid ning liigset vett ja soolasid eritatakse. Nii aitavad neerud hoida sisekeskkonda sobivana. Uriin ja väljaheide tekivad erinevalt: uriin ei ole lihtsalt seedimata toit.",
  "example": "Jooksutrennis kaotad higiga vett. Keha saab neerude kaudu vee eritamist vähendada, säilitades rohkem vett. Neerud ei otsusta ise teadlikult: nende tööd reguleerivad keha signaalid.",
  "takeaway": "Neerud töötlevad verest pärinevat vedelikku ning reguleerivad uriiniga väljuvaid aineid ja vett.",
  "questions": [
   {
    "prompt": "Millest neerud uriini moodustavad?",
    "options": [
     "Otse seedimata toidutükkidest",
     "Ainult kopsudesse jõudnud õhust",
     "Verest filtreeritud vedelikku töödeldes"
    ],
    "answer": 2,
    "explanation": "Neerud filtreerivad verest vedelikku ning muudavad selle koostist ainete tagasiimendumise ja eritamise kaudu."
   },
   {
    "prompt": "Mis juhtub suure osaga neerudes filtreeritud veest?",
    "options": [
     "See imendub tagasi verre",
     "See muutub alati väljaheiteks",
     "See peab kõik kohe kehast väljuma"
    ],
    "answer": 0,
    "explanation": "Neerud võtavad suure osa filtreeritud veest tagasi verre. Kõik filtreeritu ei välju uriinina."
   },
   {
    "prompt": "Keha vajab pärast higistamist vee säästmist. Milline neerude vastus aitaks sellele kaasa?",
    "options": [
     "Kogu filtreeritud vee kohene eritamine",
     "Rohkema vee tagasiimendumine verre",
     "Uriini muutmine seedimata toiduks"
    ],
    "answer": 1,
    "explanation": "Suurem vee tagasiimendumine vähendab veekadu uriiniga. See on üks keha veetasakaalu reguleerimise viise."
   },
   {
    "prompt": "Milline erinevus uriini ja väljaheite vahel on õige?",
    "options": [
     "Mõlemad on üksnes seedimata toit",
     "Uriin tekib jämesooles ja väljaheide neerudes",
     "Uriin tekib neerudes, väljaheide kujuneb seedekulglas"
    ],
    "answer": 2,
    "explanation": "Neerud töötlevad verest pärinevat vedelikku. Väljaheide kujuneb seedekulgla sisust ning sisaldab muu hulgas seedimata jääke ja mikroobe."
   },
   {
    "prompt": "Miks ei kirjelda lause „neerud lasevad kogu filtreeritu välja” nende tööd õigesti?",
    "options": [
     "Paljud ained ja suur osa veest võetakse tagasi verre",
     "Neerud ei puutu verega kokku",
     "Kõik filtreeritud ained muutuvad hapnikuks"
    ],
    "answer": 0,
    "explanation": "Filtreerimisele järgneb vedeliku koostise muutmine. Tagasiimendumine aitab vältida vajalike ainete ja liiga suure veekoguse kaotamist."
   }
  ]
 },
 {
  "id": "hormones",
  "title": "Hormoon mõjub sobivale sihtrakule",
  "requires": [
   "circulation",
   "membrane"
  ],
  "unit": "body",
  "source": {
   "title": "Koolibri · Sisenõrenäärmed",
   "url": "https://www.opiq.ee/kit/557/chapter/31338",
   "language": "et"
  },
  "reference": "Hormoonide teema. Retseptoripõhine originaalne selgitus ei eelda kõigi keharakkude ühesugust vastust.",
  "lesson": "Hormoon on keemiline signaalaine. Sisenõrenääre eritab hormooni verre, mis kannab seda keha eri piirkondadesse. Vastus tekib rakkudes, millel on selle hormooni jaoks sobiv retseptor ehk signaali siduv valk. Neid nimetatakse sihtrakkudeks. Sama hormoon ei pane kõiki keha rakke ühtemoodi tegutsema.",
  "example": "Treeneri sõnum võib jõuda terve meeskonnani, kuigi ülesanne on mõeldud väravavahile. Samamoodi kannab veri hormooni laiali, kuid bioloogilise vastuse eelduseks on rakus sobiv retseptor.",
  "takeaway": "Hormoon võib jõuda paljude rakkudeni, kuid vastamiseks on vaja sobivat retseptorit.",
  "questions": [
   {
    "prompt": "Mida vajab rakk, et hormooni signaali vastu võtta?",
    "options": [
     "Selle hormooni jaoks sobivat retseptorit",
     "Alati uut tervet elundit",
     "Võimet ise verd pumbata"
    ],
    "answer": 0,
    "explanation": "Retseptor seob sobiva signaalaine ja võimaldab rakul sellele reageerida."
   },
   {
    "prompt": "Kuidas jõuab sisenõrenäärme verre eritatud hormoon keha kaugematesse piirkondadesse?",
    "options": [
     "Ainult mööda luude välispinda",
     "Verega",
     "Ainult seedekulgla sisu kaudu"
    ],
    "answer": 1,
    "explanation": "Sisenõrenäärmed eritavad hormoone verre. Vereringe kannab neid sihtrakkude juurde."
   },
   {
    "prompt": "Hormoon jõuab kahe rakuni. Ainult ühel on sellele sobiv retseptor. Kummas saab see hormoon retseptori kaudu vastuse käivitada?",
    "options": [
     "Ainult retseptorita rakus",
     "Mõlemas tingimata täpselt samasuguse vastuse",
     "Sobiva retseptoriga rakus"
    ],
    "answer": 2,
    "explanation": "Hormooni kohalolekust üksi ei piisa. Sobiv retseptor on signaali vastuvõtmise eeltingimus."
   },
   {
    "prompt": "Miks ei pea kõik sama verega varustatud rakud ühele hormoonile samamoodi vastama?",
    "options": [
     "Rakkude retseptorid ja vastusmehhanismid võivad erineda",
     "Veri kannab korraga ainult ühte hormoonimolekuli",
     "Hormoonid ei jõua kunagi veresoontest välja"
    ],
    "answer": 0,
    "explanation": "Eri rakkudel võib olla erinev retseptorite ja rakusiseste mehhanismide valik. Seetõttu võivad vastused erineda."
   },
   {
    "prompt": "Mida tähendab hormooni sihtrakk?",
    "options": [
     "Iga rakk, mis asub südamele kõige lähemal",
     "Rakk, mis saab sellele hormoonile sobiva retseptori kaudu vastata",
     "Rakk, mis tingimata toodab sama hormooni"
    ],
    "answer": 1,
    "explanation": "Sihtrakku määrab võime hormonaalset signaali vastu võtta ja sellele vastata, mitte kaugus südamest."
   }
  ]
 },
 {
  "id": "immunity",
  "title": "Immuunsüsteem võib varasema kohtumise meelde jätta",
  "requires": [
   "blood"
  ],
  "unit": "body",
  "source": {
   "title": "Koolibri · Veri",
   "url": "https://www.opiq.ee/kit/557/chapter/31334",
   "language": "et"
  },
  "reference": "Vere ja immuunsuse teema. Sissejuhatus kaitsebarjääridesse ja immuunmällu; ei käsitle individuaalseid raviotsuseid.",
  "lesson": "Nahk ja limaskestad takistavad paljude haigustekitajate sisenemist. Kehasse jõudnud haigustekitajate vastu töötavad muu hulgas valged verelibled. Omandatud immuunsuses võivad tekkida mälurakud, mis aitavad hilisemal kohtumisel sama haigustekitajaga kiiremini vastata. See mälu on valikuline: ühe haigustekitaja tundmine ei tähenda kaitset kõigi teiste vastu ega taga alati eluaegset kaitset.",
  "example": "Meeskond tunneb varem nähtud vastase mängumustrit ja valmistub järgmisel korral kiiremini. Immuunmälu on samuti kindla varasema kokkupuutega seotud, kuid selle töö põhineb rakkudel ja molekulidel, mitte teadlikul meenutamisel.",
  "takeaway": "Immuunmälu võib kiirendada vastust tuttavale haigustekitajale, kuid pole universaalne kaitsekilp.",
  "questions": [
   {
    "prompt": "Mida tähendab immuunmälu?",
    "options": [
     "Kõigi haigustekitajate teadlikku meenutamist ajus",
     "Võimet varasema kokkupuute järel kindlale haigustekitajale tõhusamalt vastata",
     "Seda, et organism ei puutu enam kunagi haigustekitajatega kokku"
    ],
    "answer": 1,
    "explanation": "Immuunmälu seostub varasema kokkupuute käigus kujunenud kaitsega, sealhulgas mälurakkudega."
   },
   {
    "prompt": "Milline kaitse aitab haigustekitajate sisenemist juba keha piiril takistada?",
    "options": [
     "Ainult südamelihase kokkutõmme",
     "Ainult punaste vereliblede hapnik",
     "Terve nahk"
    ],
    "answer": 2,
    "explanation": "Terve nahk on oluline kaitsebarjäär. See vähendab haigustekitajate võimalust kudedesse pääseda."
   },
   {
    "prompt": "Organismil on immuunmälu ühe haigustekitaja suhtes. Mida saab sellest järeldada?",
    "options": [
     "See võib aidata samale haigustekitajale hiljem kiiremini vastata",
     "See tagab eluaegse kaitse kõigi haiguste vastu",
     "See muudab naha kaitseülesande tarbetuks"
    ],
    "answer": 0,
    "explanation": "Immuunmälu on valikuline ning selle kestus ja kaitsev toime võivad erineda. Kõigi haiguste kaitset sellest ei järeldu."
   },
   {
    "prompt": "Uurija leiab pärast varasemat kokkupuudet säilinud mälurakke. Millist hilisemat tulemust need võivad toetada?",
    "options": [
     "Hapniku tootmist kopsudes",
     "Kiiremat kaitsevastust sama haigustekitaja uuel kohtamisel",
     "Kõigi organismi geenide muutmist"
    ],
    "answer": 1,
    "explanation": "Mälurakud võivad toetada kiiremat omandatud immuunvastust tuttava haigustekitaja korral."
   },
   {
    "prompt": "Milline väide keha kaitse kohta sobib?",
    "options": [
     "Nahabarjäär ja immuunrakud täidavad täpselt sama ülesannet",
     "Kui on olemas mälurakud, puudub teistel kaitseviisidel roll",
     "Barjäärid ja kehasisesed kaitsemehhanismid täiendavad üksteist"
    ],
    "answer": 2,
    "explanation": "Barjäärid vähendavad sisenemist; teised kaitsemehhanismid aitavad juba kehasse jõudnud haigustekitajatega toime tulla."
   }
  ]
 },
 {
  "id": "chromosomes",
  "title": "Geen on DNA lõik kromosoomis",
  "requires": [
   "nucleus",
   "inheritance"
  ],
  "unit": "inheritance",
  "source": {
   "title": "Koolibri · Pärilikkuse alused",
   "url": "https://www.opiq.ee/kit/557/chapter/31348",
   "language": "et"
  },
  "reference": "Pärilikkuse teema. Geeni käsitleme DNA lõiguna, mitte iga tunnuse üheainsa lülitina. Originaalsed küsimused.",
  "lesson": "Tüüpilise inimese keharaku tuumas on DNA koos valkudega pakitud kromosoomidesse. Geen on DNA lõik, milles on info RNA või selle kaudu valgu valmistamiseks. Ühes kromosoomis on palju geene. Kromosoom, DNA ja geen ei ole sünonüümid. Paljud tunnused kujunevad mitme geeni ja keskkonna koosmõjul.",
  "example": "Mõtle pikale infolindile, millel on palju eri juhiseid. DNA on see informatsiooni kandev aine; geen on üks selle lõik. Kromosoom hõlmab DNA-d koos seda korraldavate valkudega.",
  "takeaway": "Kromosoom sisaldab DNA-d ja valke; geen on kindel DNA lõik.",
  "questions": [
   {
    "prompt": "Milline kirjeldus sobib geenile?",
    "options": [
     "Terve elund, mis toodab verd",
     "Iga kord terve kromosoom",
     "DNA lõik, milles on info RNA või valgu valmistamiseks"
    ],
    "answer": 2,
    "explanation": "Geen on DNA lõik. Ühes kromosoomis leidub palju geene ning kõik geenid ei määra eraldi üht nähtavat tunnust."
   },
   {
    "prompt": "Milline seos on õige?",
    "options": [
     "Kromosoom sisaldab DNA-d, mille lõigud võivad olla geenid",
     "Iga geen sisaldab alati kõiki inimese kromosoome",
     "DNA ja kromosoom tähendavad täpselt sama ainet"
    ],
    "answer": 0,
    "explanation": "Kromosoom on DNA-st ja valkudest koosnev struktuur. Geen on üks funktsionaalse infoga DNA lõik."
   },
   {
    "prompt": "Uurija leiab samast kromosoomist mitu eri geeni. Kas see sobib kromosoomi ehitusega?",
    "options": [
     "Ei, ühes kromosoomis saab olla ainult üks geen",
     "Jah, üks kromosoom võib sisaldada palju geene",
     "Ei, geenid asuvad ainult väljaspool rakke"
    ],
    "answer": 1,
    "explanation": "Kromosoomi pikk DNA sisaldab paljusid geene ja ka teisi DNA piirkondi."
   },
   {
    "prompt": "Miks on väide „igal inimese tunnusel on täpselt üks geen” eksitav?",
    "options": [
     "Sest geenides ei ole üldse infot",
     "Sest keskkond asendab alati kõik geenid",
     "Sest paljud tunnused sõltuvad mitmest geenist ja keskkonnast"
    ],
    "answer": 2,
    "explanation": "Ühe geeni mudel sobib mõne lihtsa pärandumisnäite jaoks. Seda ei saa üldistada kõigile inimese tunnustele."
   },
   {
    "prompt": "Kromosoomi DNA-st uuritakse lühikest lõiku, mille info järgi valmistatakse RNA-d. Milline mõiste võib seda lõiku kirjeldada?",
    "options": [
     "Geen",
     "Terve elundkond",
     "Vereplasma"
    ],
    "answer": 0,
    "explanation": "Geenis olevat infot kasutatakse RNA valmistamiseks; mõne sellise RNA järgi valmistatakse omakorda valk."
   }
  ]
 },
 {
  "id": "mitosis",
  "title": "Enne keharaku jagunemist kopeeritakse DNA",
  "requires": [
   "chromosomes"
  ],
  "unit": "inheritance",
  "source": {
   "title": "Avita · Rakutsükkel ja rakkude mitootiline jagunemine",
   "url": "https://www.opiq.ee/kit/521/chapter/29095",
   "language": "et"
  },
  "reference": "Mitoosi teema. Üks eesmärk: DNA kopeerimine enne jagunemist ja kromosoomikomplekti säilimine. Originaalsed ülesanded.",
  "lesson": "Kasvamiseks ja rakkude asendamiseks tekivad kehas uued rakud. Enne mitoosi kopeeritakse DNA. Mitoosi käigus jaotatakse kopeeritud kromosoomid kahe uue rakutuuma vahel; tavaliselt järgneb raku jagunemine kaheks. Tüüpilisel juhul saavad tütarrakud sama kromosoomikomplekti ja sama geneetilise info. DNA kopeerimist ei tohi segi ajada kromosoomide jaotamisega.",
  "example": "Naha pinnalt kaob vanu rakke ning sügavamal tekib uusi. Jagunev lähterakk valmistab enne jagunemist DNA koopiad, et mõlemad uued rakud saaksid vajaliku geneetilise info.",
  "takeaway": "DNA kopeeritakse enne mitoosi; mitoos jaotab kopeeritud kromosoomid uute tuumade vahel.",
  "questions": [
   {
    "prompt": "Millal kopeeritakse mitoosiga seotud DNA?",
    "options": [
     "Enne mitoosi",
     "Alles pärast mõlema tütarraku hävimist",
     "Ainult siis, kui rakk on juba jagunemise lõpetanud"
    ],
    "answer": 0,
    "explanation": "DNA kopeerimine eelneb mitoosile. Mitoos jaotab juba kopeeritud kromosoomid kahe tuuma vahel."
   },
   {
    "prompt": "Mis on mitoosi oluline tulemus tüüpilise keharaku jagunemisel?",
    "options": [
     "Kõigi geenide kadumine ühest uuest rakust",
     "Sama kromosoomikomplektiga uute tuumade teke",
     "Kromosoomikomplektide arvu poolitumine nagu sugurakkude moodustumisel"
    ],
    "answer": 1,
    "explanation": "Mitoos säilitab tavaliselt kromosoomikomplektide arvu. Komplektide arvu vähendamine on meioosi ülesanne."
   },
   {
    "prompt": "Miks kopeerib kasvava koe rakk DNA enne jagunemist?",
    "options": [
     "Et eemaldada kogu pärilik info",
     "Et muuta DNA veres lahustuvaks toiduks",
     "Et mõlemad uued rakud saaksid vajaliku geneetilise info"
    ],
    "answer": 2,
    "explanation": "Kopeerimine loob DNA koopiad, mida saab jagunemise käigus uute rakkude vahel jaotada."
   },
   {
    "prompt": "Tüüpiline kahe kromosoomikomplektiga keharakk jaguneb mitoosi ja raku jagunemise teel. Mitu komplekti on tavaliselt kummaski tütarrakus?",
    "options": [
     "Kaks",
     "Üks",
     "Null"
    ],
    "answer": 0,
    "explanation": "Mitoos säilitab lähteraku kromosoomikomplektide arvu. Kahe komplektiga rakust tekivad tavaliselt kahe komplektiga tütarrakud."
   },
   {
    "prompt": "Kasvavas koes on mõlemal äsja tekkinud rakul vajalik geneetiline info. Milline ettevalmistus võimaldas seda infot mõlemale jaotada?",
    "options": [
     "DNA eemaldamine enne jagunemist",
     "DNA kopeerimine enne mitoosi",
     "Kahe suguraku ühinemine iga uue naharaku jaoks"
    ],
    "answer": 1,
    "explanation": "DNA kopeerimine loob koopiad enne mitoosi. Nii saab geneetilist infot jagada uute rakkude vahel."
   }
  ]
 },
 {
  "id": "meiosis",
  "title": "Meioos vähendab kromosoomikomplektide arvu",
  "requires": [
   "mitosis"
  ],
  "unit": "inheritance",
  "source": {
   "title": "Avita · Meioos võimaldab suguliselt sigida",
   "url": "https://www.opiq.ee/kit/521/chapter/29096",
   "language": "et"
  },
  "reference": "Meioosi teema. Esmane eesmärk on mõista komplektide arvu vähenemist, mitte pähe õppida jagunemisfaase.",
  "lesson": "Inimese sugurakkude tekkimisel vähendab meioos kromosoomikomplektide arvu kahelt ühele. Tüüpilises inimese keharakus on kaks komplekti, munarakus või seemnerakus üks. Enne meioosi kopeeritakse DNA üks kord, seejärel toimuvad kaks jagunemist. Sugurakud võivad saada erinevaid päriliku info kombinatsioone. Nii erineb meioos kromosoomikomplekte säilitavast mitoosist.",
  "example": "Tüüpilises inimese keharakus on 46 kromosoomi, seemnerakus 23. Need arvud näitavad siin kahte ja ühte kromosoomikomplekti; need ei tähenda, et seemnerakul puuduks pärilik info.",
  "takeaway": "Meioos annab inimese sugurakkudele ühe kromosoomikomplekti.",
  "questions": [
   {
    "prompt": "Mitu kromosoomikomplekti on tüüpilises inimese seemnerakus?",
    "options": [
     "Kaks",
     "Üks",
     "Neli"
    ],
    "answer": 1,
    "explanation": "Inimese seemnerakk on ühe kromosoomikomplektiga. Tüüpilises keharakus on kaks komplekti."
   },
   {
    "prompt": "Milline muutus iseloomustab inimese sugurakkude tekkimisel meioosi?",
    "options": [
     "Kaks kromosoomikomplekti muutuvad neljaks",
     "Kõik kromosoomid kaovad",
     "Kromosoomikomplektide arv väheneb kahelt ühele"
    ],
    "answer": 2,
    "explanation": "Meioosi põhitulemus on kromosoomikomplektide arvu vähenemine. See valmistab ette sugulist paljunemist."
   },
   {
    "prompt": "Võrdled tüüpilist inimese naharakku ja munarakku. Milline võrdlus on õige?",
    "options": [
     "Naharakus on tavaliselt kaks kromosoomikomplekti, munarakus üks",
     "Mõlemas on alati neli kromosoomikomplekti",
     "Munarakus ei ole DNA-d"
    ],
    "answer": 0,
    "explanation": "Keharakkude ja sugurakkude komplektide arv erineb. Munarakk kannab pärilikku infot ühe komplektina."
   },
   {
    "prompt": "Milline protsess on seotud ühe kromosoomikomplektiga inimese sugurakkude tekkimisega?",
    "options": [
     "Ainult naharakkude mitoos",
     "Meioos",
     "Glükoosi imendumine soolest"
    ],
    "answer": 1,
    "explanation": "Meioos vähendab sugurakkude moodustumisel kromosoomikomplektide arvu. Tavaline mitoos seda ei tee."
   },
   {
    "prompt": "Milline erinevus mitoosi ja meioosi vahel on õige?",
    "options": [
     "Mitoos eemaldab kogu DNA, meioos valmistab DNA tühjast",
     "Mõlemad tähendavad kahe suguraku ühinemist",
     "Mitoos säilitab tavaliselt komplektide arvu, meioos vähendab seda"
    ],
    "answer": 2,
    "explanation": "Mitoos toetab sama komplektide arvuga rakkude teket. Meioos vähendab komplektide arvu sugulise paljunemise eel."
   }
  ]
 },
 {
  "id": "fertilisation",
  "title": "Viljastumisel ühinevad kaks kromosoomikomplekti",
  "requires": [
   "meiosis"
  ],
  "unit": "inheritance",
  "source": {
   "title": "Koolibri · Pärilikkuse alused",
   "url": "https://www.opiq.ee/kit/557/chapter/31348",
   "language": "et"
  },
  "reference": "Pärilikkuse teema; ühendus meioosis õpitud ühe kromosoomikomplekti ja järglase päritud info vahel.",
  "lesson": "Inimesel ühinevad viljastumisel munarakk ja seemnerakk. Tekib viljastatud munarakk ehk sügoot, millel on üks kromosoomikomplekt kummaltki bioloogiliselt vanemalt. Nii taastub tavaliselt kahe komplekti seisund. Meioos vähendab komplektide arvu, viljastumine ühendab need taas. Sügoot võib seejärel hakata mitoosi ja raku jagunemise kaudu arenema paljurakuliseks organismiks.",
  "example": "Kui munarakus on 23 ja seemnerakus 23 kromosoomi, saab sügoot kokku 46. Hilisem kasv vajab uusi rakujagunemisi; iga uus keharakk ei teki uuest viljastumisest.",
  "takeaway": "Viljastumine ühendab ühe kromosoomikomplekti kummaltki vanemalt.",
  "questions": [
   {
    "prompt": "Mis tekib munaraku ja seemneraku ühinemisel?",
    "options": [
     "Kaks uut seemnerakku",
     "Kohe valmis täiskasvanud organism",
     "Viljastatud munarakk ehk sügoot"
    ],
    "answer": 2,
    "explanation": "Viljastumise tulemus on sügoot. Sellele järgneb areng ja paljude uute rakkude teke."
   },
   {
    "prompt": "Kust pärinevad tüüpilise inimese sügoodi kaks kromosoomikomplekti?",
    "options": [
     "Üks munarakust ja teine seemnerakust",
     "Mõlemad ainult munarakust",
     "Mõlemad ainult seemnerakust"
    ],
    "answer": 0,
    "explanation": "Mõlemad sugurakud annavad tavaliselt ühe komplekti. Nii saab sügoot pärilikku infot mõlemalt vanemalt."
   },
   {
    "prompt": "Munarakk ja seemnerakk sisaldavad kumbki ühe kromosoomikomplekti. Mitu komplekti saab nende ühinemisel sügoot?",
    "options": [
     "Ühe",
     "Kaks",
     "Null"
    ],
    "answer": 1,
    "explanation": "Üks komplekt kummastki sugurakust annab kokku kaks komplekti. Viljastumine taastab selle arvu."
   },
   {
    "prompt": "Milline paar kirjeldab meioosi ja viljastumise seost?",
    "options": [
     "Mõlemad eemaldavad kõik kromosoomid",
     "Mõlemad säilitavad sugurakkudes kaks komplekti",
     "Meioos vähendab komplektide arvu, viljastumine ühendab komplektid"
    ],
    "answer": 2,
    "explanation": "Need protsessid täiendavad teineteist: sugurakud saavad ühe komplekti ja viljastumine taastab kaks."
   },
   {
    "prompt": "Sügoodist areneb paljurakuline embrüo. Milline protsess lisab selleks tavaliselt uusi keharakke?",
    "options": [
     "Mitoos koos raku jagunemisega",
     "Iga uue raku jaoks eraldi viljastumine",
     "Kromosoomide täielik kadumine"
    ],
    "answer": 0,
    "explanation": "Pärast viljastumist suureneb rakkude arv jagunemiste kaudu. Iga uus keharakk ei vaja uut sugurakkude ühinemist."
   }
  ]
 },
 {
  "id": "alleles",
  "title": "Alleelid on ühe geeni eri variandid",
  "requires": [
   "fertilisation",
   "chromosomes"
  ],
  "unit": "inheritance",
  "source": {
   "title": "Koolibri · Pärilikkuse alused",
   "url": "https://www.opiq.ee/kit/557/chapter/31348",
   "language": "et"
  },
  "reference": "Pärilikkuse teema. Väljamõeldud taimenäide on teadlikult lihtne ühe geeni mudel, mitte inimese keeruka tunnuse kirjeldus.",
  "lesson": "Alleelid on ühe geeni erinevad variandid. Lihtsas kahe kromosoomikomplektiga taime mudelis saab järglane uuritavast geenist ühe alleeli kummaltki vanemalt. Need võivad olla ühesugused või erinevad. Tähistame variante näiteks A ja a. Tähed aitavad pärandumist jälgida; suure algustähe kasutamine ei tähenda, et variant oleks parem või sagedasem.",
  "example": "Väljamõeldud taime õielehtede mustrit mõjutava geeni variandid on A ja a. Kui seemnerakk annab A ning munarakk a, on järglase kombinatsioon Aa. Teisi tunnuseid see lihtne mudel ei kirjelda.",
  "takeaway": "Lihtsas kahe komplektiga mudelis saab järglane ühe geeni ühe alleeli kummaltki vanemalt.",
  "questions": [
   {
    "prompt": "Mis on alleelid?",
    "options": [
     "Ühe geeni erinevad variandid",
     "Alati kaks täiesti erinevat elundit",
     "Kõik organismi kromosoomid kokku"
    ],
    "answer": 0,
    "explanation": "Alleel on geeni variant. Eri alleelid võivad paikneda vastavate kromosoomide samas piirkonnas."
   },
   {
    "prompt": "Lihtsas taime mudelis annab üks vanem alleeli A ja teine a. Milline kombinatsioon tekib järglasel?",
    "options": [
     "A, sest teise vanema info kaob alati",
     "Aa",
     "aaaa"
    ],
    "answer": 1,
    "explanation": "Järglane saab kummaltki vanemalt ühe alleeli. A ja a annavad kombinatsiooni Aa."
   },
   {
    "prompt": "Väljamõeldud taime mõlemad vanemad annavad uuritavast geenist alleeli a. Milline kombinatsioon tekib?",
    "options": [
     "Aa",
     "AA",
     "aa"
    ],
    "answer": 2,
    "explanation": "Üks a kummaltki vanemalt annab aa. Selle konkreetse järglase puhul on mõlemad alleelid ühesugused."
   },
   {
    "prompt": "Mida saab järeldada üksnes sellest, et alleel on tähistatud suure tähega A?",
    "options": [
     "Selle tähise põhjal ei saa öelda, et alleel oleks parem või sagedasem",
     "A peab alati olema kasulikum kui a",
     "Kõigil liigi isenditel peab olema A"
    ],
    "answer": 0,
    "explanation": "Suur täht on kokkuleppeline tähistus. Ka dominantsus, kui see on mudelis määratud, ei tähenda paremust ega sagedust."
   },
   {
    "prompt": "Taime kahe vastava kromosoomi samas geenipiirkonnas on erinevad variandid A ja a. Kuidas neid variante nimetatakse?",
    "options": [
     "Kaheks eri elundkonnaks",
     "Sama geeni alleelideks",
     "Kaheks eri liigiks"
    ],
    "answer": 1,
    "explanation": "A ja a tähistavad selles mudelis sama geeni eri variante ehk alleele."
   }
  ]
 },
 {
  "id": "mutation",
  "title": "Mutatsioon on DNA muutus",
  "requires": [
   "chromosomes",
   "meiosis"
  ],
  "unit": "inheritance",
  "source": {
   "title": "Koolibri · Pärilikkus ja muutlikkus",
   "url": "https://www.opiq.ee/kit/557/chapter/31349",
   "language": "et"
  },
  "reference": "Muutlikkuse teema. Originaalne selgitus eristab DNA muutust õpitud oskusest ja väldib eesmärgipärast mutatsioonikäsitlust.",
  "lesson": "Mutatsioon on muutus DNA-s. See võib tekkida näiteks DNA kopeerimisel või kahjustuse tagajärjel. Mõju võib olla kahjulik, neutraalne või mõnes olukorras kasulik. Inimesel ei kandu tavalise keharaku muutus sugulisel paljunemisel lapsele. Järglasele saab muutus kanduda suguraku kaudu. Vajadus mingi omaduse järele ei tekita sihipäraselt just sobivat mutatsiooni.",
  "example": "Päevitamisel võib DNA muutus tekkida naharakus. See ei tähenda, et sama muutus oleks ka sugurakkudes või kanduks lapsele. Keha eri rakkude DNA muutused tuleb eraldi mõelda.",
  "takeaway": "Mutatsioon muudab DNA-d; sugulisel paljunemisel saab see järglasele kanduda suguraku kaudu.",
  "questions": [
   {
    "prompt": "Milline muutus on mutatsioon?",
    "options": [
     "Pallilöögi parem ajastamine harjutamise järel",
     "DNA järjestuse muutumine rakus",
     "Südame löögisageduse ajutine tõus joostes"
    ],
    "answer": 1,
    "explanation": "Mutatsioon tähendab DNA muutust. Õpitud oskus ja ajutine füsioloogiline vastus ei ole iseenesest mutatsioonid."
   },
   {
    "prompt": "Millise raku kaudu saab DNA muutus inimese sugulisel paljunemisel järglasele kanduda?",
    "options": [
     "Ainult tavalise naharaku kaudu",
     "Ainult küpses lihaskiurakus",
     "Suguraku kaudu"
    ],
    "answer": 2,
    "explanation": "Järglane saab päriliku info munarakust ja seemnerakust. Tavalise naharaku mutatsioon ei kandu otse lapsele."
   },
   {
    "prompt": "Mutatsioon ei muuda organismi toimetulekut märgatavalt. Kas selline tulemus on võimalik?",
    "options": [
     "Jah, mutatsiooni mõju võib olla neutraalne",
     "Ei, iga mutatsioon peab olema kohe surmav",
     "Ei, iga mutatsioon peab parandama sooritusvõimet"
    ],
    "answer": 0,
    "explanation": "Mutatsioonide mõju sõltub muutusest ja olukorrast. Kõik muutused ei ole kahjulikud ega kasulikud."
   },
   {
    "prompt": "Jooksjal oleks kasu suuremast vastupidavusest. Kas vajadus tekitab sihipäraselt just selleks sobiva DNA mutatsiooni?",
    "options": [
     "Jah, soov määrab alati DNA muutuse suuna",
     "Ei, vajalik omadus ei tekita eesmärgipäraselt sobivat mutatsiooni",
     "Jah, iga treening kirjutab soovitud päriliku juhise"
    ],
    "answer": 1,
    "explanation": "Mutatsioonid ei teki organismi tulevase vajaduse täitmiseks. Treening võib muuta sooritusvõimet ilma sellise päriliku muutuseta."
   },
   {
    "prompt": "DNA muutus leitakse inimese ühest naharakkude rühmast, kuid mitte tema sugurakkudest. Milline järeldus sobib?",
    "options": [
     "Muutus peab päranduma kõigile lastele",
     "See tõestab muutust kõigis keha rakkudes",
     "Sellest naharakkude muutusest ei järeldu selle pärandumine lapsele"
    ],
    "answer": 2,
    "explanation": "Kehasisene mutatsioon ja järglasele päranduv mutatsioon ei ole sama asi. Sugulisel paljunemisel on otsustav sugurakkude info."
   }
  ]
 },
 {
  "id": "feedback",
  "title": "Negatiivne tagasiside vähendab kõrvalekallet",
  "requires": [
   "balance",
   "hormones"
  ],
  "unit": "body",
  "source": {
   "title": "Koolibri · Sisenõrenäärmed",
   "url": "https://www.opiq.ee/kit/557/chapter/31338",
   "language": "et"
  },
  "reference": "Hormoonide teema koos varasema homöostaasi õpieesmärgiga. Esmane tagasisidenäide on kehatemperatuur; küsimused on originaalsed.",
  "lesson": "Negatiivse tagasiside korral vähendab keha vastus algset kõrvalekallet. Kui kehatemperatuur tõuseb, aitab naha pinnalt aurustuv higi seda langetada. Sobivama taseme taastudes jahutav vastus väheneb. Sõna „negatiivne” tähendab siin muutusele vastutöötamist, mitte halba mõju. Reguleerimine hoiab tingimusi sobivas vahemikus, mitte alati täpselt ühel arvul.",
  "example": "Trennis keha soojeneb ja higistamine suureneb. Pärast koormuse lõppu väheneb soojuse teke ning keha jahtudes taandub ka higistamine. Jahutav vastus ei pea järjest tugevamaks muutuma.",
  "takeaway": "Negatiivne tagasiside vähendab kõrvalekallet ja nõrgeneb sobiva taseme taastudes.",
  "questions": [
   {
    "prompt": "Mida teeb negatiivse tagasiside vastus algse kõrvalekaldega?",
    "options": [
     "Suurendab seda alati",
     "Eirab seda täielikult",
     "Aitab seda vähendada"
    ],
    "answer": 2,
    "explanation": "Negatiivse tagasiside korral toimib vastus algsele muutusele vastassuunas."
   },
   {
    "prompt": "Kehatemperatuur tõuseb ning higi aurustumine aitab keha jahutada. Miks on see negatiivse tagasiside näide?",
    "options": [
     "Jahutamine töötab temperatuuri tõusule vastu",
     "Higistamine on alati organismile kahjulik",
     "Vastus peab temperatuuri veel tõstma"
    ],
    "answer": 0,
    "explanation": "Algne muutus on temperatuuri tõus; jahutav vastus aitab seda vähendada. „Negatiivne” ei tähenda siin kahjulikku."
   },
   {
    "prompt": "Kehatemperatuur on pärast soojenemist taas sobivas vahemikus. Mis peaks tavaliselt juhtuma liigset soojust eemaldava vastusega?",
    "options": [
     "See peaks tingimata lõputult tugevnema",
     "See peaks nõrgenema",
     "See peaks muutma kõik rakud närvirakkudeks"
    ],
    "answer": 1,
    "explanation": "Kui kõrvalekalle väheneb, väheneb tavaliselt ka seda korrigeeriv vastus."
   },
   {
    "prompt": "Külmas hakkavad lihased värisema ning toodavad rohkem soojust. Kuidas on see seotud negatiivse tagasisidega?",
    "options": [
     "See suurendab tingimata algset jahtumist",
     "See tõestab, et kehatemperatuur ei muutu kunagi",
     "Soojuse teke aitab temperatuuri langusele vastu töötada"
    ],
    "answer": 2,
    "explanation": "Algne kõrvalekalle on jahtumine. Lihastööga lisanduv soojus aitab seda vähendada."
   },
   {
    "prompt": "Kujuteldavas süsteemis põhjustab näitaja tõus vastuse, mis tõstab näitajat veelgi. Kas see kirjeldab negatiivset tagasisidet?",
    "options": [
     "Ei, sest vastus võimendab algset muutust",
     "Jah, sest iga keha vastus on negatiivne tagasiside",
     "Jah, sest sõna „negatiivne” tähendab ükskõik millist muutust"
    ],
    "answer": 0,
    "explanation": "Negatiivne tagasiside vähendab algset kõrvalekallet. Muutuse võimendamine kirjeldab teistsugust tagasisidet."
   }
  ]
 }
];
 // Old question positions and answer keys are immutable for saved learner history.
 for(const c of concepts){const e=enrichment[c.id];c.example=e.example;c.takeaway=e.takeaway;if(e.reference)c.reference=e.reference;c.questions.push(...e.questions);}
 for(const c of additions){const k='foundation_'+c.id;sources[k]=c.source;c.source=k;c.language='et';c.anchor=c.takeaway;concepts.push(c);}
 // Genetics bridge: original Estonian explanations and practice, 20 October 2026.
 // Existing question positions are never changed: saved answers stay meaningful.
 sources.genetics_et={title:'Opiq · DNA ja RNA on päriliku info kandjad',url:'https://www.opiq.ee/kit/31/chapter/1453',language:'et'};
 sources.biochemistry_et={title:'Eesti Biokeemia Selts · Sõnastik',url:'https://biokeemiaselts.ee/sonastik/',language:'et'};
 sources.molecular_et={title:'Tartu Ülikool · Molekulaarbioloogia lühikonspekt',url:'https://loengud.ebc.ee/jaanus/molbi.html',language:'et'};
 sources.inheritance_et={title:'Tartu Ülikool · Triin Marandi, geneetika õppematerjal',url:'https://kodu.ut.ee/~triinm/bioloogia/geneetika2.pdf',language:'et'};
 function genetics(id,title,requires,source,lesson,example,takeaway,rows){
  const n=concepts.length;
  concepts.push({id,title,requires,source,reference:'Algupärane eestikeelne alustund ja küsimused. Mõisted kontrollitud viidatud eestikeelsest allikast; mitte õpikuteksti koopia ega ametlik eksamiülesanne.',language:'et',unit:'inheritance',lesson,example,takeaway,anchor:takeaway,reviewQuestions:[0,3,4],applicationQuestions:[2],questions:rows.map(([prompt,correct,w1,w2,explanation],j)=>{const shift=(n+j)%3,opts=[correct,w1,w2];return {prompt,options:opts.slice(shift).concat(opts.slice(0,shift)),answer:(3-shift)%3,explanation};})});
 }
 genetics('dna_structure','DNA info peitub järjestuses',['nucleus'],'genetics_et',
 'DNA koosneb nukleotiididest. Nende nelja lämmastikalust tähistatakse tähtedega A, T, C ja G. Pärilik info sõltub nende järjestusest. DNA kahes ahelas paarub A T-ga ning C G-ga. DNA ei ole valk: DNA ja valk koosnevad erinevatest ehitusüksustest.',
 'Tähed KALA ja LAKA on samad, kuid järjekord muudab sõna. Ka DNA-s loeb järjestus. Tähtede võrdlus aitab mõista infot; DNA on päris molekul, mitte paberile kirjutatud tekst.',
 'DNA: nukleotiidid ja nende järjestus; aluspaarid A–T ning C–G.',[
 ['Millest koosneb DNA ahel?','Nukleotiididest','Aminohapetest','Kromosoomipaaridest','Nukleotiidid on DNA ehitusüksused. Aminohapped on valkude ehitusüksused.'],
 ['Milline alus paarub DNA-s A-ga?','T','C','G','DNA tavapärane aluspaar on A–T; teine paar on C–G.'],
 ['DNA ühes ahelas on ülalt alla A, C, T. Millised alused on nende vastas teises ahelas samas järjekorras?','T, G, A','A, C, T','U, G, A','Kasuta iga koha juures paarilist: A vastas T, C vastas G ja T vastas A. Siin loeme vastaskohti, mitte ahela 5′→3′ suunda.'],
 ['Kahel DNA lõigul on sama palju aluseid, kuid erinev järjestus. Kas neis olev info võib erineda?','Jah, järjestus on oluline','Ei, loeb ainult pikkus','Ei, kõik DNA lõigud on sama infoga','Sama pikkus ei tähenda sama järjestust ega sama infot.'],
 ['Milline paar seob aine õigesti ehitusüksusega?','DNA – nukleotiid','DNA – aminohape','Valk – kromosoom','DNA ahel koosneb nukleotiididest. Valkude ahelad koosnevad aminohapetest.']]);
 genetics('genome','Genoom on kogu päriliku info kogum',['chromosomes'],'genetics_et',
 'Genoom tähendab organismi kogu geneetilise materjali kogumit. Inimese puhul on see DNA: nii geenid kui ka DNA piirkonnad geenide vahel. Enamik DNA-st asub tuumas, väike osa mitokondrites. Koolis räägitakse ka ühes kromosoomikomplektis olevast pärilikust infost. Genoom ei tähenda üht geeni ega üksnes valke kodeerivaid lõike.',
 'Kui geen on üks juhend, siis genoom on kogu juhendikogu koos muude DNA piirkondadega. Üks geen võib olla tuhandete nukleotiidide pikkune; kogu genoom on palju ulatuslikum.',
 'Geen on DNA lõik; genoom hõlmab kogu geneetilist materjali.',[
 ['Milline mõiste hõlmab kogu geneetilist materjali?','Genoom','Üks alleel','Üks valk','Genoom on tervik, geen ja alleel kirjeldavad väiksemaid osi või variante.'],
 ['Kas genoomi kuulub ka geenide vahel olev DNA?','Jah','Ei, ainult valke kodeerivad lõigud','Ei, genoom koosneb valkudest','Genoom ei piirdu valke kodeerivate geenidega.'],
 ['Uuringus loetakse ühe geeni järjestus. Kas sellega on loetud kogu inimese genoom?','Ei, uuritud on vaid osa geneetilisest materjalist','Jah, üks geen on kogu genoom','Jah, kõigil geenidel on sama järjestus','Ühe geeni uurimine jätab ülejäänud DNA uurimata.'],
 ['Kus leidub inimese rakus lisaks tuumale oma DNA-d?','Mitokondrites','Igas valgus','Ainult rakust väljaspool','Mitokondrites on väike osa inimese DNA-st. Enamik asub tuumas.'],
 ['Milline võrdlus sobib?','Geen on osa DNA-st, genoom hõlmab kogu geneetilist materjali','Genoom on ühe valgu teine nimi','Iga geen sisaldab kogu genoomi','Osa ja tervik tuleb lahus hoida: üks geen ei ole kogu genoom.']]);
 genetics('chromosome_pairs','Kromosoomipaar: üks emalt, üks isalt',['chromosomes','inheritance'],'genetics_et',
 'Tüüpilise inimese keharaku tuumas on 46 kromosoomi ehk 23 paari. Paarilise päritolu on üks emalt ja teine isalt. Autosoomipaari kromosoomidel on samades kohtades samad geenid, kuid nende variandid võivad erineda. Sugurakus on 23 kromosoomi, igast paarist üks. See ei tähenda 23 geeni: igas kromosoomis on palju geene.',
 'Kujutle ühe autosoomipaari kahte kromosoomi. Mõlemal on samas piirkonnas sama geen, kuid ühe DNA järjestus võib sellest kohast veidi erineda. Neid geeni variante nimetame alleelideks.',
 '46 kromosoomi = 23 paari; 23 kromosoomi ei tähenda 23 geeni.',[
 ['Mitu kromosoomipaari on tüüpilise inimese keharaku tuumas?','23','46','2','46 kromosoomi moodustavad 23 paari.'],
 ['Kas 23 kromosoomiga sugurakus on ainult 23 geeni?','Ei, ühes kromosoomis on palju geene','Jah, igas kromosoomis on üks geen','Ei, sugurakus pole geene','Kromosoomide arv ja geenide arv on erinevad suurused.'],
 ['Autosoomipaari samas piirkonnas on ühel kromosoomil alleel A ja teisel a. Kas see on võimalik?','Jah, sama geeni variandid võivad paarilistel erineda','Ei, paarilised peavad olema igas DNA kohas identsed','Ei, alleelid saavad olla ainult valkudes','Homoloogilised kromosoomid kannavad samu geene, kuid ei pea kandma samu alleele.'],
 ['Kust pärinevad tüüpilise autosoomipaari kaks kromosoomi?','Üks emalt ja teine isalt','Mõlemad alati ainult emalt','Mõlemad tekivad toiduvalkudest','Sugurakkude ühinemisel saadakse üks komplekt kummaltki bioloogiliselt vanemalt.'],
 ['Milline kirjeldus sobib tüüpilisele inimese sugurakule?','23 kromosoomi, igast paarist üks','23 kromosoomipaari','DNA puudub','Sugurakul on üks kromosoomikomplekt; viljastumisel saavad kaks komplekti kokku.']]);
 genetics('proteins','Valk on aminohapetest töövahend',['chromosomes'],'molecular_et',
 'Valgu ehitusüksused on aminohapped. Aminohappeahel voldib kindlasse ruumilisse kujusse, mis aitab täita valgu ülesannet. Mõned valgud on ensüümid, teised aitavad aineid transportida või rakul liikuda. Valku kodeeriva geeni info juhib aminohapete järjestust RNA vahendusel. Geen ise ei muutu valguks.',
 'Lihase kokkutõmbes töötavad valgud aktiin ja müosiin. DNA sisaldab juhiseid, kuid liigutust teevad valgud. Nagu mänguplaan ja seda ellu viivad mängijad: juhis ja töötegija on eri asjad.',
 'DNA kannab juhist; valk koosneb aminohapetest ja täidab ülesannet.',[
 ['Millest koosneb valgu ahel?','Aminohapetest','DNA kromosoomidest','Ainult rasvadest','Aminohapped liidetakse ahelaks, millest kujuneb valgu ruumiline struktuur.'],
 ['Mis eristab geeni ja selle info põhjal valmistatud valku?','Geen kannab infot, valk täidab rakus ülesannet','Geen ja valk on täpselt sama molekul','Valk on alati terve kromosoom','Valku kodeeriv geen on DNA lõik, selle saadus on teistsugustest ehitusüksustest valk.'],
 ['Valgu aminohapete järjestus muutub ja valk voldib teisiti. Mis võib juhtuda?','Valgu ülesande täitmine võib muutuda','Valgust saab tingimata terve genoom','Mitte midagi ei saa kunagi muutuda','Järjestus mõjutab kuju, kuju omakorda talitlust. Mõne muutuse mõju on väike või puudub.'],
 ['Milline on valgu võimalik ülesanne?','Keemilise reaktsiooni kiirendamine ensüümina','Kõigi kromosoomide asendamine','Kogu organismi genoomiks olemine','Paljud ensüümid on valgud; valgud täidavad ka muid ülesandeid.'],
 ['Kas DNA muutub füüsiliselt valguks, kui rakk valku valmistab?','Ei, kasutatakse DNA-s olevat infot','Jah, kogu kromosoom kulub ära','Jah, nukleotiidid ongi aminohapped','Info kasutamine ei tähenda, et DNA molekulist ehitatakse valk.']]);
 genetics('transcription','DNA-st RNA: transkriptsioon',['proteins','dna_structure'],'molecular_et',
 'Transkriptsioon on RNA süntees DNA lõigu järgi. Valku kodeeriva geeni puhul tekib informatsiooni-RNA ehk mRNA eellane, mida inimese rakus töödeldakse. Valmis mRNA kannab infot ribosoomini. Tuumageeni transkriptsioon toimub tuumas. RNA-s on T asemel U. DNA kopeerimine DNA-ks on teine protsess: replikatsioon.',
 'Retseptiraamat jääb riiulisse, kuid ühest retseptist tehakse töökoopia. Nii võib mõelda DNA ja mRNA seosest. See võrdlus kirjeldab info kasutamist, mitte tervet kromosoomi kopeerivat replikatsiooni.',
 'Transkriptsioon: DNA järgi RNA. Replikatsioon: DNA järgi DNA.',[
 ['Mis valmib transkriptsioonil?','RNA','Kohe valmis valk','Uus elund','Transkriptsiooni saadus on RNA; valgu ahela süntees on järgmine protsess.'],
 ['Milline protsess valmistab DNA lõigu järgi RNA-d?','Transkriptsioon','Replikatsioon','Mitoos','Replikatsioon kopeerib DNA-d, mitoos jaotab kromosoome, transkriptsioon valmistab RNA-d.'],
 ['Rakk vajab ühe tuumageeni info põhjal valku, kuid ei jagune. Kas selleks peab kopeerima kogu genoomi?','Ei, geeni info saab transkribeerida RNA-ks','Jah, iga valgu jaoks kopeeritakse kogu genoom','Ei, valk tekib ilma ühegi juhiseta','Geeni avaldumine ja kogu DNA kopeerimine enne jagunemist on eri ülesanded.'],
 ['Milline alus on RNA-s tümiini T asemel?','Uratsiil U','Veel üks T','Üks aminohape','RNA kasutab aluseid A, U, C ja G.'],
 ['Mis kannab tuumageenist saadud valgu valmistamise infot ribosoomini?','mRNA','Terve kromosoom','Valmis lihaskude','Informatsiooni-RNA vahendab juhist; kromosoom jääb tuuma.']]);
 genetics('translation','RNA-st aminohappeahel: translatsioon',['transcription'],'molecular_et',
 'Translatsioon toimub ribosoomil: mRNA info järgi ühendatakse aminohapped ahelaks. Ribosoom loeb mRNA-d kolme nukleotiidi kaupa; selline kolmik on koodon. tRNA aitab tuua sobiva aminohappe. Osa koodoneid annab lõpetamissignaali. Tekkinud ahel voldib ja võib vajada töötlemist, et saada toimivaks valguks.',
 'DNA → mRNA → aminohappeahel → toimiv valk. Nooled näitavad info kasutamise samme. mRNA ega DNA ei ole valgu ehitusmaterjal; aminohapped on.',
 'Ribosoom kasutab mRNA juhist, et liita aminohappeid.',[
 ['Kus toimub translatsioon?','Ribosoomil','Kromosoomipaaride vahel mitoosis','Ainult väljaspool rakku','Ribosoom on koht, kus mRNA järgi sünteesitakse aminohappeahel.'],
 ['Mida ribosoom mRNA juhise järgi kokku liidab?','Aminohappeid','Terveid kromosoome','Rakutuumasid','mRNA on juhis ja aminohapped on ahela ehitusmaterjal.'],
 ['mRNA lõigus on kuus koodonit, millest viimane on stoppkoodon. Mitu aminohapet määravad viis ülejäänud koodonit?','Viis','Kuus','Kaheksateist','Iga nimetatud mitte-lõpetav koodon määrab ühe aminohappe; stoppkoodon aminohapet ei määra.'],
 ['Mis on mRNA koodon?','Kolmest nukleotiidist koosnev üksus','Terve kromosoom','Kolmest elundist koosnev süsteem','Ribosoom loeb mRNA järjestust kolmikutena.'],
 ['Milline seos on õige?','Transkriptsioon valmistab RNA; translatsioon aminohappeahela','Translatsioon kopeerib kogu DNA','Transkriptsioon ühendab otse aminohappeid','Kahe sammu saadused on erinevad: RNA ja aminohappeahel.']]);
 genetics('gene_expression','Sama DNA, erinev raku töö',['translation','tissue'],'genetics_et',
 'Enamik sama inimese tuumaga keharakke sisaldab üldjoontes sama DNA-d. Ometi täidavad lihasrakk ja närvirakk eri ülesandeid: neis avalduvad geenid erinevalt ning valmistatakse erinevas koguses valke. Kõik geenid ei kodeeri valke; mõne geeni lõppsaadus on toimiv RNA. Geenide avaldumine sõltub raku vajadustest ja signaalidest.',
 'Kahes töökojas võib olla sama juhendikogu. Ühes kasutatakse rohkem ühe töö juhiseid, teises teisi. Erinev tegevus ei nõua tervenisti erinevat juhendikogu.',
 'Erinevad rakud kasutavad sama DNA eri osi erineval määral.',[
 ['Miks teevad lihasrakk ja närvirakk erinevat tööd, kuigi nende DNA on üldjoontes sama?','Geenid avalduvad neis erinevalt','Närvirakus ei ole kunagi DNA-d','Igal rakul peab olema täiesti teine genoom','Erinev geenide avaldumine muudab rakkude valkude koosseisu ja talitlust.'],
 ['Kas iga geeni järgi valmistatakse tingimata valk?','Ei, osa geene annab toimiva RNA','Jah, erandeid ei ole','Ei, ükski geen pole valkudega seotud','Näiteks ribosomaalne RNA ja transpordi-RNA on ise toimivad RNA-d.'],
 ['Rakus valmistatakse ühe ensüümi mRNA-d vähem. Mis võib selle tagajärjel väheneda?','Selle ensüümi tootmine','Kõigi kromosoomide arv poole võrra','Kõigi teiste geenide olemasolu','Vähem mRNA-d võib tähendada vähem selle valgu sünteesi; geen ise võib alles olla.'],
 ['Mida tähendab, et geen avaldub?','Selle infot kasutatakse RNA ja vajaduse korral valgu valmistamiseks','Geen lahkub alati rakust','Geenist saab terve elund','Avaldumine tähendab info kasutamist, mitte geeni füüsilist muutumist elundiks.'],
 ['Kas raku töö muutus tähendab alati DNA järjestuse muutust?','Ei, muutuda võib geenide avaldumise aktiivsus','Jah, iga vastus signaalile nõuab mutatsiooni','Jah, RNA ja DNA on üks ja sama','Geenide avaldumist saab reguleerida DNA järjestust muutmata.']]);
 genetics('genotype','Genotüüp ja fenotüüp on eri vaated',['alleles','gene_expression'],'inheritance_et',
 'Ühe geeni ülesandes näitab genotüüp alleelide kombinatsiooni, näiteks AA, Aa või aa. AA ja aa on selle geeni suhtes homosügootsed, Aa heterosügootne. Fenotüüp tähendab avalduvaid tunnuseid. Neid mõjutavad genotüüp ja keskkond. Ühe geeni lihtne mudel ei kirjelda näiteks kogu inimese pikkust või sportlikkust.',
 'Kujuteldaval taimel on genotüüp Aa, kuid õie nähtav värvus on fenotüübi osa. Samade alleelidega taimede kasv võib erineda, kui üks saab vähem vett.',
 'Genotüüp: alleelide kombinatsioon. Fenotüüp: avalduvad tunnused.',[
 ['Mida tähistab Aa ühe geeni ülesandes?','Genotüüpi','Terve genoomi pikkust','Kaht eri liiki','Aa näitab selles ülesandes uuritava geeni kahe alleeli kombinatsiooni.'],
 ['Kumb kirjeldab fenotüübi osa?','Taime nähtav õievärvus','Tähis Aa iseenesest','Ainult kromosoomide nimetused','Fenotüüp on avalduvate tunnuste kogum, mitte alleelide tähistus.'],
 ['Sama genotüübiga taimi kastetakse erinevalt ja nende kasv erineb. Mida see näitab?','Keskkond võib fenotüüpi mõjutada','Nende genotüüp peab tingimata erinema','Vesi asendab kõik geenid','Tunnuse kujunemisel on tähtsad nii pärilikud tegurid kui keskkond.'],
 ['Milline kombinatsioon on uuritava geeni suhtes heterosügootne?','Aa','AA','aa','Heterosügoodil on selle geeni kaks erinevat alleeli.'],
 ['Milline kirjeldus sobib nii AA kui ka aa kohta?','Mõlemad on selle geeni suhtes homosügootsed','Mõlemal on kaks erinevat alleeli','Mõlemad on tingimata sama fenotüübiga','Homosügootsus tähendab kahe alleeli ühesugusust, mitte ühesugust fenotüüpi eri genotüüpide vahel.']]);
 genetics('dominance','Dominantne ei tähenda parem',['genotype'],'inheritance_et',
 'Lihtsas täieliku dominantsusega mudelis on Aa ja AA uuritava tunnuse poolest ühesugused. A on selles mudelis dominantne ning a retsessiivne alleel; retsessiivne tunnus avaldub aa korral. Alleel a ei kao Aa organismist ja saab kanduda järglasele. Dominantsus ei näita alleeli kasulikkust ega sagedust. Kõik pärandumisviisid ei ole sellised.',
 'Kujuteldavas taimes annab AA või Aa lilla õie ja aa valge õie. See on ülesande reegel, mitte kõigi taimede või inimese silmavärvi üldseadus.',
 'Täieliku dominantsuse mudelis: AA ja Aa sama tunnus, aa teine.',[
 ['Täieliku dominantsuse mudelis annab AA lilla ning aa valge õie. Milline on Aa õis?','Lilla','Alati roosa','Alati valge','Mudelis avaldub Aa korral dominantse alleeliga seotud tunnus.'],
 ['Kas dominantne alleel peab olema kasulikum või sagedasem?','Ei','Jah, alati mõlemat','Jah, alati sagedasem','Dominantsus kirjeldab heterosügoodi tunnust, mitte paremust või levikut.'],
 ['Lillal taimel võib olla AA või Aa. Kas ainult värvuse järgi saab neil vahet teha?','Ei, selles mudelis on mõlema õis lilla','Jah, lilla tähendab alati AA','Jah, lilla tähendab alati Aa','Sama fenotüübi taga võivad olla erinevad genotüübid.'],
 ['Kas retsessiivne alleel kaob Aa organismist?','Ei, see on alles ja võib päranduda','Jah, A kustutab selle DNA-st','Jah, seda saab juurde ainult toidust','Dominantsus ei kustuta teist alleeli.'],
 ['Millal avaldub selle lihtsa mudeli retsessiivne tunnus?','aa korral','Ainult AA korral','Kõigil genotüüpidel alati ühtmoodi','Täieliku dominantsuse mudelis on retsessiivne tunnus nähtav aa korral.']]);
 genetics('inheritance_probability','Pärandumise tõenäosus, üks geen korraga',['dominance','meiosis'],'inheritance_et',
 'Vaatame üht autosoomset geeni lihtsas mudelis. Aa vanema sugurakk kannab A või a, kumbagi tõenäosusega 1/2. Kahe Aa vanema puhul on võimalused AA, Aa, aA ja aa. Seega aa tõenäosus on 1/4. Iga järglane on uus juhuslik kombinatsioon; neli järglast ei pea jagunema täpselt nende nelja võimaluse vahel.',
 'Aa × Aa: üks vanem annab A või a ning teine samuti A või a. Neljast võrdselt tõenäolisest kombinatsioonist üks on aa. Aa ja aA tähistavad sama alleelide kombinatsiooni.',
 '1/4 tähendab iga järglase tõenäosust, mitte kohustuslikku tulemust nelja seas.',[
 ['Millist alleeli kannab Aa vanema üks sugurakk selle geeni suhtes?','A või a','Alati mõlemat: Aa','Mitte kumbagi','Meioosil lahknevad paarilised; üks sugurakk saab selle geeni ühe alleeli.'],
 ['Aa × Aa mudelis on kombinatsioonid AA, Aa, aA ja aa võrdselt tõenäolised. Kui suur on aa tõenäosus?','1/4 ehk 25%','1/2 ehk 50%','Kindlasti 100%','Üks neljast võrdselt tõenäolisest kombinatsioonist on aa.'],
 ['Aa × Aa paari kolm esimest järglast ei ole aa. Kas neljas peab olema aa?','Ei, neljanda aa tõenäosus on ikka 1/4','Jah, neljast peab üks olema aa','Ei, nüüd on aa võimatu','Eelmised tulemused ei sunni järgmise viljastumise tulemust.'],
 ['Kas Aa ja aA tähistavad selles ülesandes erinevat genotüüpi?','Ei, mõlemal on üks A ja üks a','Jah, aA tähendab kaht a-d','Jah, Aa tähendab kaht A-d','Tähtede järjekord ei muuda siin alleelide kombinatsiooni.'],
 ['AA vanem ja aa vanem saavad selles lihtsas mudelis järglase. Milline on tema genotüüp?','Aa','AA','aa','Esimene vanem annab A, teine a; järglane saab mõlemad.']]);
 const geneticsPath=['nucleus','dna_structure','inheritance','chromosomes','genome','chromosome_pairs','proteins','transcription','translation','gene_expression','mitosis','meiosis','fertilisation','alleles','genotype','dominance','inheritance_probability','mutation'];
 // Strengthen prerequisites without altering saved questions, cards or active attempts.
 concepts.find(c=>c.id==='chromosomes').requires.push('dna_structure');
 concepts.find(c=>c.id==='alleles').requires.push('chromosome_pairs');

 const groups={cells:['cell','tissue','organ','system','membrane','nucleus','plant_cell'],energy:['energy','molecules','nutrients','enzymes','atp','respiration','diffusion','osmosis','photosynthesis','roots'],body:['muscle','nerve','balance','digestion','absorption','gas_exchange','circulation','blood','kidneys','hormones','feedback','immunity'],inheritance:['inheritance','chromosomes','mitosis','meiosis','fertilisation','alleles','mutation'],nature:['ecosystem','food_web','matter_energy','natural_selection']};
 for(const [unit,ids]of Object.entries(groups))for(const id of ids){const c=concepts.find(x=>x.id===id);c.unit=unit;c.reviewQuestions=[0,3,4];c.applicationQuestions=[2];}
 const preferred=['cell','tissue','organ',...geneticsPath,'system','membrane','nucleus','muscle','nerve','balance','energy','plant_cell','molecules','nutrients','enzymes','atp','respiration','diffusion','osmosis','photosynthesis','roots','digestion','absorption','gas_exchange','circulation','blood','kidneys','hormones','feedback','immunity','inheritance','chromosomes','mitosis','meiosis','fertilisation','alleles','mutation','ecosystem','food_web','matter_energy','natural_selection'];
 // Topological ordering allows future prerequisite edits without hiding a lesson.
 const pending=concepts.slice().sort((a,b)=>preferred.indexOf(a.id)-preferred.indexOf(b.id)),ordered=[],seen=new Set();
 while(pending.length){const i=pending.findIndex(c=>c.requires.every(id=>seen.has(id)));if(i<0)throw Error('Unreachable biology prerequisite');const c=pending.splice(i,1)[0];ordered.push(c);seen.add(c.id);}
 concepts.splice(0,concepts.length,...ordered);
 const units=[{id:'cells',title:'Rakk ja keha ehitus'},{id:'energy',title:'Ained ja energia'},{id:'body',title:'Keha koostöö'},{id:'inheritance',title:'Pärilikkus ja jagunemine'},{id:'nature',title:'Elu ja keskkond'}];
 // Original, small reasoning activities. Existing question indices stay unchanged.
 sources.reasoning_et={title:'Koolibri · Bioloogia peamised uurimismeetodid, lk 12–15',url:'https://www.koolibri.ee/storage/pdf/d9005632-8c7f-3cc6-be9d-fba117362bf7.pdf',language:'et'};
 sources.probability_et={title:'Koolibri · Matemaatika 11: tõenäosus (Opiq)',url:'https://www.opiq.ee/kit/490/chapter/27026',language:'et'};
 sources.correlation_et={title:'Koolibri · Matemaatika 11: korrelatsiooniväli (Opiq)',url:'https://www.opiq.ee/kit/490/chapter/27037',language:'et'};
 genetics('reasoning_data','Loe andmeid: mida tegelikult mõõdeti?',[],'reasoning_et',
 'Enne arvutamist loe, mida mõõdeti ja mis ühikutes. Tabeli rida seob ühe olukorra selle tulemusega. Graafikul näitab rõhttelg sageli aega ja püsttelg mõõdetud suurust; kontrolli alati telgede nimetusi. Mõõtmised näitavad, mis juhtus uuritud tingimustes. Need ei ütle üksinda, mis oli põhjus või mis juhtub edasi.',
 'Harjutuse väljamõeldud andmed: sama taime kõrgus oli 1. päeval 4 cm, 3. päeval 6 cm ja 5. päeval 8 cm. Esimesest viienda päevani lisandus 4 cm, mitte 8 cm.',
 'Nimetus → ühik → kaks võrreldavat väärtust.',[
 ['Taime kõrgus oli alguses 4 cm ja hiljem 8 cm. Kui palju kõrgus suurenes?','4 cm','8 cm','12 cm','Muutus on lõppväärtus miinus algväärtus: 8 − 4 = 4 cm.'],
 ['Tabelis on 1. päeval 4 cm, 3. päeval 6 cm ja 5. päeval 8 cm. Kui kõrge oli taim 3. päeval?','6 cm','3 cm','8 cm','Leia 3. päeva rida ja loe sellega seotud kõrgus. Päevade arv ei ole kõrgus.'],
 ['Taim kasvas 1.–5. päeval 4 cm võrra. Kas sellest piisab väiteks, et ta kasvab igal järgmisel neljal päeval täpselt 4 cm?','Ei, edasise kasvu kohta on vaja uusi mõõtmisi','Jah, kasv peab alati samaks jääma','Jah, iga taim kasvab nii','Senised mõõtmised ei määra tulevasi tingimusi ega kasvukiirust.'],
 ['Graafiku püstteljel on „kõrgus (cm)”. Mida tähendab seal arv 10?','Kõrgust 10 sentimeetrit','Aega 10 päeva','Kümmet taime','Telje nimetus ja ühik ütlevad, mida selle arvud tähendavad.'],
 ['Pulss on enne liikumist 70 ja pärast 100 lööki minutis. Milline muutus on andmetes?','Suurenemine 30 lööki minutis','Suurenemine 100 lööki minutis','Vähenemine 30 lööki minutis','100 − 70 = 30. Mõlemad väärtused peavad olema samas ühikus.']]);
 const dataConcept=concepts.at(-1);
 dataConcept.table={caption:'Harjutusandmed: ühe taime kõrgus',headers:['Päev','Kõrgus (cm)'],rows:[[1,4],[3,6],[5,8]]};
 genetics('reasoning_experiment','Katse: muuda üht tegurit korraga',[],'reasoning_et',
 'Kui tahame uurida ühe teguri mõju, püüame muud olulised tingimused hoida võrreldavad. Valguse mõju uurides muudame valguse hulka ja mõõdame näiteks kasvu. Võrdlusrühm aitab tulemust tõlgendada. Mitu taime ja kordused annavad kindlama pildi kui üks taim kummaski rühmas.',
 'Kaks rühma sama liigi sarnaseid taimi saavad sama palju vett, sama mulda ja sama temperatuuri. Üks rühm saab rohkem valgust. Mõlemas mõõdetakse kõrguse muutust ühe nädala jooksul.',
 'Mida muudan? Mida mõõdan? Mida hoian võrreldavana?',[
 ['Uurid valguse mõju taimede kasvule. Millist tegurit muudad rühmade vahel teadlikult?','Valguse hulka','Valgust, vett ja mulda korraga','Taimeliiki ja temperatuuri korraga','Kui muudad korraga paljut, ei saa erinevust kindlalt valgusega seostada.'],
 ['Uurid valguse mõju kasvule. Miks peaksid rühmad saama võrreldavalt vett?','Vee erinevus võiks samuti kasvu mõjutada','Vesi ei mõjuta kunagi kasvu','Kõik taimed peavad olema sama nimega','Vesi on siin üks muu tegur, mida tahame hoida võrreldavana.'],
 ['Rühm A saab rohkem valgust ja rohkem väetist kui B ning kasvab rohkem. Kas tulemus eristab valguse mõju väetise mõjust?','Ei, mõlemad tegurid muutusid','Jah, põhjus peab olema valgus','Jah, põhjus peab olema väetis','Katse ei eralda kahe koos muudetud teguri mõju.'],
 ['Mida võiks selles valguse katses mõõta?','Taime kõrguse muutust sama aja jooksul','Ainult siltide värvi','Uurija lemmiktaime nime','Mõõdetav tulemus peab seostuma uurimisküsimusega.'],
 ['Miks kasutada kummaski rühmas mitut taime?','Ühe taime eripära mõjutab siis järeldust vähem','Siis on iga võimalik viga välistatud','Siis pole tingimuste võrdlemist vaja','Rohkem kordusi aitab näha varieeruvust, kuid ei paranda iseenesest halba katseplaani.']]);
 genetics('reasoning_correlation','Koosesinemine ei tõesta põhjust',[],'correlation_et',
 'Kui kaks näitajat muutuvad koos, võib nende vahel olla seos ehk korrelatsioon. See ei tõesta veel, et üks põhjustab teist. Mõlemat võib mõjutada kolmas tegur. Põhjuse hindamiseks vajame lisatõendeid, näiteks hästi kavandatud katset või teiste võimalike seletuste kontrollimist.',
 'Vaatluses on suuremad lehed taimedel, mis said rohkem väetist. Kuid need taimed olid ka valgemas kohas. Tulemus sobib mitme seletusega; väetise mõju tuleks uurida võrreldavates tingimustes.',
 'Küsi: mis muu võiks mõlemat näitajat mõjutada?',[
 ['Vaatluses käivad suurem valgushulk ja kiirem taimekasv koos. Mida andmed esialgu näitavad?','Seost nende näitajate vahel','Et kõik muud põhjused on välistatud','Et valgus on ainus võimalik kasvutegur','Koos muutumine on seos; põhjuslik järeldus vajab täiendavat kontrolli.'],
 ['Väetatud taimed olid ka valgemas kohas. Mis võib väetise ja kasvu seost segada?','Erinev valgushulk','Pottide siltidel olev kuupäev iseenesest','Sõna „taim” kasutamine','Valgus võib samuti kasvu mõjutada ja oli rühmade vahel erinev.'],
 ['Milline järgmine samm aitaks väetise mõju eristada?','Võrdle väetatud ja väetamata taimi muus osas sarnastes tingimustes','Muuda korraga ka valgust ja kastmist','Järelda ühe suure taime põhjal, et väetis alati aitab','Võrreldavad rühmad aitavad eraldada uuritava teguri mõju.'],
 ['Kui põhjuse kohta tõendeid veel napib, milline sõnastus on täpsem?','Näitajad olid selles vaatluses seotud','Esimene näitaja põhjustas kindlasti teise','Teist võimalikku seletust ei ole','Järelduse kindlus peab vastama tõendite tugevusele.'],
 ['Kas korrelatsiooni leidmine on kasutu?','Ei, see võib anda idee, mida edasi uurida','Jah, vaatlusest ei saa midagi õppida','Ei, see tõestab alati põhjuse','Seos võib suunata uurimist, isegi kui põhjus pole veel selge.']]);
 genetics('reasoning_proportion','Osa ja tervik bioloogias',[],'probability_et',
 'Osakaalu leidmiseks jaga uuritava osa arv kogu rühma arvuga. Kui 20 seemnest idaneb 5, on idanenud osa 5/20 ehk 1/4 ehk 25%. Rühmade võrdlemisel vaata osakaalu, mitte ainult arvu. Suuremas rühmas võib olla rohkem idanenud seemneid, kuigi idanenute osakaal on väiksem.',
 'Karbis A idaneb 5 seemet 20-st, karbis B 8 seemet 40-st. A: 25%, B: 20%. B-s on rohkem idanenud seemneid, aga A-s suurem osakaal. Need on väljamõeldud harjutusandmed.',
 'Osa ÷ tervik; protsendiks korruta sajaga.',[
 ['20 seemnest idaneb 5. Milline murd näitab idanenud osa?','5/20','20/5','5/5','Lugejas on uuritav osa, nimetajas kõik vaadeldud seemned.'],
 ['Üks neljast võrdsest osast on…','25%','4%','75%','Tervik on 100%; 100 ÷ 4 = 25.'],
 ['A-s idaneb 5 seemet 20-st ja B-s 8 seemet 40-st. Kus on idanenute osakaal suurem?','A-s: 25% võrreldes 20%-ga','B-s, sest 8 on suurem kui 5','Mõlemas peab see olema sama','Võrdle 5/20 ja 8/40; rühmade suurused on erinevad.'],
 ['Mis on tervik lauses „30 seemnest idaneb 12”?','30 seemet','12 seemet','18 seemet','Tervik on kõik uuritud seemned, ka need, mis ei idanenud.'],
 ['10 seemnest idaneb 5 ja 20 seemnest 10. Kuidas osakaalud erinevad?','Ei erine: mõlemas 50%','Teises on osakaal kaks korda suurem','Esimeses on osakaal 5%','5/10 ja 10/20 on mõlemad 1/2.']]);
 const reasoningPath=['reasoning_data','reasoning_experiment','reasoning_correlation','reasoning_proportion'];
 for(const id of reasoningPath)concepts.find(c=>c.id===id).unit='reasoning';
 units.push({id:'reasoning',title:'Väikesed bioloogia mõtlemisülesanded'});
 const supports={};
 function support(id,title,target,source,prompt,options,answer,explanation,example){
   supports[id]={title,concept:target,source,question:{prompt,options,answer},explanation,example};
 }
 support('one_allele','Üks sugurakk, üks alleel','meiosis','inheritance_et',
 'Vanema genotüüp on Aa. Mitu selle geeni alleeli on tema ühes tavalises sugurakus?',['Kaks: A ja a','Üks: A või a','Mitte ühtegi'],1,
 'Aa kirjeldab selle geeni kahte alleeli vanema paarilistel kromosoomidel. Meioosis lahknevad paarilised: sugurakku jõuab selle geeni üks alleel.',
 'Mõtle kahele eraldi kaardile A ja a. Üks sugurakk saab selles lihtsas mudelis ühe kaardi.');
 support('quarter','Murd ja protsent','reasoning_proportion','probability_et',
 'Neli võimalust on võrdselt tõenäolised. Üks neist vastab tingimusele. Kui suur on selle tõenäosus?',['4%','25%','75%'],1,
 'Üks neljast tähendab 1/4. Tervik on 100%, seega 100 ÷ 4 = 25%.',
 'Aa × Aa puhul on võimalused AA, Aa, aA ja aa. Üks neljast on aa.');
 support('independent_birth','Iga järglane on uus kombinatsioon','inheritance_probability','inheritance_et',
 'Mudelis on aa tõenäosus igal järglasel 1/4. Kas eelmine aa järglane muudab järgmise aa võimatuks?',['Jah, aa on nüüd ära kasutatud','Ei, järgmise tõenäosus on ikka 1/4','Jah, tõenäosus muutub alati nulliks'],1,
 'Tõenäosus ei ole tulemuste jagamise kava. Eelmise viljastumise tulemus ei võta järgmiselt võimalikku kombinatsiooni ära.',
 'Neli võrdselt tõenäolist kombinatsiooni ei tähenda, et nelja järglase seas peab iga kombinatsioon esinema ühe korra.');
 concepts.find(c=>c.id==='inheritance_probability').supports=['one_allele','quarter','independent_birth'];
 // v22: append fresh application contexts; preserve all historical question indices.
 const transferQuestions={
  "cell":["Ühes proovis on naharakk, teises närvirakk. Mida saab nende erinevast kujust hoolimata mõlema kohta öelda?", ["Mõlemad on terved elundid", "Mõlemad on keha elusad ehitusüksused", "Mõlemad täidavad täpselt sama ülesannet"], 1, "Raku kuju ja ülesanne võivad erineda. Nii naha- kui ka närvirakk on siiski rakk."],
  "tissue":["Vaatled paljusid infot edasi andvaid rakke koos nendevahelise ainega. Millisele tasemele see kirjeldus kõige paremini vastab?", ["Kude", "Üks rakuosa", "Terve organism"], 0, "Koos töötavad sarnase ülesandega rakud ja rakuvaheaine moodustavad koe; siin on juttu närvikoest."],
  "organ":["Südame ehituses eristatakse lihaskude, sidekude ja närvikude. Mis põhjendab südame nimetamist elundiks?", ["Kõik selle rakud on ühesugused", "Iga nimetatud kude on omaette organism", "Erinevad koed töötavad koos ühiste ülesannete täitmiseks"], 2, "Ühes elundis teevad koostööd mitut tüüpi koed. Elund ei pea koosnema ainult ühest koest."],
  "nucleus":["Rakus puudub tuumamembraaniga ümbritsetud rakutuum, kuid leitakse DNA-d. Milline seletus sobib?", ["DNA leidmine tõestab, et rakutuum peab olemas olema", "See võib olla bakterirakk, mille DNA pole rakutuumas", "DNA saab sellises rakus olla ainult väljaspool membraani"], 1, "DNA olemasolu ja rakutuuma olemasolu on eri tunnused. Bakteri DNA asub rakus, kuigi rakutuuma ei ole."],
  "dna_structure":["DNA ühes ahelas on kolm järjestikust alust G, A, C. Millised alused paiknevad täpselt nende vastas?", ["G, A, C", "C, U, G", "C, T, G"], 2, "DNA-s paarituvad G ja C ning A ja T. Küsimus küsib vastaspaiknevaid aluseid, mitte ahela 5′→3′ suunda."],
  "inheritance":["Kaks sama taime pistikut kasvavad eri tingimustes ja on erineva kõrgusega. Kas erinev kõrgus üksi tõestab erinevat pärilikku infot?", ["Ei, kasvutingimused võivad tunnust mõjutada", "Jah, iga nähtav erinevus peab tulema geenidest", "Jah, keskkond ei saa kõrgust mõjutada"], 0, "Nähtava tunnuse erinevus võib tuleneda keskkonnast. Üks tähelepanek ei erista veel kõiki võimalikke põhjuseid."],
  "chromosomes":["Ühes kromosoomis muutub ühe geeni väike DNA lõik. Milline järeldus on põhjendatud?", ["Kõik sama kromosoomi geenid pidid muutuma", "Muutus võib piirduda ühe piirkonnaga; teised geenid võivad jääda samaks", "Kromosoomist kaovad tingimata kõik valgud"], 1, "Kromosoom sisaldab palju DNA piirkondi. Ühe piirkonna muutus ei tähenda kõigi teiste piirkondade muutumist."],
  "genome":["Test uurib inimese kaht kindlat geeni. Tulemuses pole neis muutusi. Kas see välistab muutuse mujal genoomis?", ["Jah, kaks geeni esindavad kogu DNA-d", "Jah, kõik geenid muutuvad alati koos", "Ei, uurimata DNA kohta see tulemus vastust ei anna"], 2, "Üksikud geenid on ainult osa genoomist. Uuringu ulatus piirab seda, mida saab tulemusest järeldada."],
  "chromosome_pairs":["Rakumudelis on autosoomipaari ühel kromosoomil uuritava geeni variant B. Mida peab sama paari teine kromosoom tavaliselt kandma?", ["Sama geeni, kuid selle variant võib olla B või b", "Tingimata täpselt sama varianti B", "Ainult teiste tunnuste geene, mitte seda geeni"], 0, "Homoloogilistel kromosoomidel paiknevad samad geenid vastavates kohtades; alleelid võivad erineda."],
  "proteins":["Ensüümi kuju muutub nii, et tema töös osalev aine enam hästi ei seondu. Mis on kõige otsesem võimalik tagajärg?", ["Ensüümi kodeeriv geen kaob tingimata", "Ensüümi kiirendatav reaktsioon võib aeglustuda", "Kõigi raku valkude järjestused muutuvad"], 1, "Valgu kuju aitab tal ülesannet täita. Kuju muutus võib häirida seondumist ja seeläbi ensüümi tööd."],
  "transcription":["Rakus blokeeritakse ühe geeni transkriptsioon. Millise uue molekuli valmistamine on kõige otsesemalt takistatud?", ["Selle geeni järgi valmistatava RNA", "Kõigi raku valkude aminohapete", "Kogu raku DNA iga koopia"], 0, "Transkriptsioon valmistab DNA info järgi RNA-d. Valgu valmistamine on järgmine, eraldi samm."],
  "translation":["mRNA lõigus on neli aminohapet määravat koodonit ja seejärel stoppkoodon. Mitu aminohapet lisatakse nende nelja koodoni järgi?", ["Viis, sest stoppkoodon lisab ühe", "Kaksteist, sest koodonis on kolm alust", "Neli"], 2, "Iga aminohapet määrav koodon vastab ühele aminohappele. Kolm alust ei tähenda kolme aminohapet ja stoppkoodon aminohapet ei lisa."],
  "gene_expression":["Kahel rakul on sama ensüümi geen, kuid ühes leidub selle ensüümi mRNA-d palju rohkem. Milline seletus sobib?", ["Teises rakus peab see geen puuduma", "Sama geeni saab eri rakkudes erineval määral kasutada", "Esimeses rakus peab olema kaks korda rohkem kõiki kromosoome"], 1, "Sama DNA olemasolu ei tähenda, et kõiki geene kasutatakse võrdselt. mRNA hulk võib näidata erinevust geeni avaldumises."],
  "mitosis":["Lähterakus on 8 kromosoomi. Pärast DNA kopeerimist ja tavapärast mitoosi tekib kaks tütarrakku. Mitu kromosoomi on kummaski?", ["8", "4", "16"], 0, "Tavapärane mitoos säilitab kromosoomide arvu tütarrakus. Kopeeritud info jaotatakse kahe raku vahel."],
  "meiosis":["Ühe loomaliigi tavalises keharakus on 12 kromosoomi. Mitu on tavaliselt selle liigi meioosi tulemusena tekkinud sugurakus?", ["24", "12", "6"], 2, "Sugurakus on üks kromosoomikomplekt, keharakus kaks. Antud mudelis on pool 12-st 6."],
  "fertilisation":["Ühe loomaliigi mõlemas ühinevas sugurakus on 7 kromosoomi. Mitu kromosoomi saab sügoot?", ["7", "14", "28"], 1, "Viljastumisel liituvad kahe suguraku komplektid: 7 + 7 = 14."],
  "alleles":["Väljamõeldud taime üks sugurakk annab uuritava geeni variandi B ja teine b. Milline kombinatsioon on sügoodis?", ["Bb", "BB", "bb"], 0, "Sügoot saab ühe alleeli kummastki sugurakust. Erinevad variandid jäävad kombinatsiooni Bb."],
  "genotype":["Kahes taimes leitakse uuritava geeni kombinatsioon Bb. Üks kasvab varjus, teine valguses. Milline väide on põhjendatud?", ["Neil peab olema sama kõrgus, sest genotüüp on sama", "Varjus kasvades muutub kombinatsioon tingimata bb-ks", "Selle geeni genotüüp on sama, kuid kasv võib keskkonna tõttu erineda"], 2, "Genotüüp kirjeldab alleele. Tunnuse kujunemises võib osaleda ka keskkond."],
  "dominance":["Mudelis annab BB või Bb musta seemne ja bb heleda. Kahe musta seemnega taime ristamisel tekib hele järglane. Millised võivad vanemate kombinatsioonid olla?", ["Ainult BB ja BB", "Bb ja Bb", "Ainult BB ja Bb"], 1, "Hele bb järglane saab b kummaltki vanemalt. Musta tunnusega vanem saab selles mudelis b-d kanda kombinatsioonis Bb."],
  "inheritance_probability":["Lihtsas mudelis annab Aa vanem sugurakku A või a võrdse tõenäosusega; aa vanem annab alati a. Kui suur on aa järglase tõenäosus?", ["1/2", "1/4", "1"], 0, "Esimese vanema a koos teise vanema a-ga annab aa. See juhtub pooltel võrdselt tõenäolistel võimalustel; teine pool on Aa."],
  "mutation":["Ühes lihasrakus tekib DNA muutus. Sugurakkudes seda muutust ei leita. Kas üksnes lihasraku muutus kandub tavapärasel sugulisel paljunemisel järglasele?", ["Jah, kõik keharaku muutused kanduvad edasi", "Jah, sest lihasrakus on DNA", "Ei, pärandumiseks peab muutunud info jõudma järglasele suguraku kaudu"], 2, "Keharaku ja suguraku muutusi tuleb eristada. DNA olemasolu lihasrakus üksi ei tee muutust pärandatavaks."],
  "system":["Seedimisel tekkinud glükoos imendub verre ja jõuab käelihasesse. Milline koostöö on selles kirjelduses vajalik?", ["Ainult seedimine; transporti pole vaja", "Seedeelundkonna ja vereringeelundkonna koostöö", "Ainult vereringe; glükoos peab tekkima südames"], 1, "Toitaine peab esmalt seedekulglast imenduma ja seejärel verega koeni jõudma. Eri elundkonnad täidavad teekonna eri osi."],
  "membrane":["Kahel rakul on sama väliskeskkond. Ühel on aine X transpordiks sobiv membraanivalk, teisel mitte. Kas X sisenemine võib erineda?", ["Jah, membraani ehitus võib ainete liikumist mõjutada", "Ei, sama väliskeskkond tagab alati sama sisenemise", "Ei, membraan saab ainult kõike läbi lasta või kõike peatada"], 0, "Ainete vahetus sõltub nii ainest kui membraanist. Sobiv transportvalk võib võimaldada liikumist, mida muidu ei toimuks."],
  "muscle":["Pärast sööki liigub toit sooles edasi, kuigi sa seda liigutust teadlikult ei juhi. Milline järeldus sobib?", ["Liikumises ei saa osaleda lihased", "Kõik lihaskokkutõmbed peavad olema teadlikud", "Osa lihaste tööst toimub tahtest sõltumatult"], 2, "Sooleseina silelihased töötavad tahtest sõltumatult. Lihaskoe töö ei piirdu teadlike käe- ja jalaliigutustega."],
  "nerve":["Kuumast esemest käe eemaldamine vajab nii ärrituse märkamist kui ka lihaste vastust. Mis seob need sammud tervikuks?", ["Ainult luude kuju", "Närvisüsteemis liikuvad ja töödeldavad signaalid", "Ainult vere hapnikusisaldus"], 1, "Närvisüsteem võtab infot vastu, töötleb seda ning juhib vastust. Lihas teostab liigutuse."],
  "balance":["Pärast vee kaotust vähendab keha vee eritamist uriiniga. Mis ühine eesmärk on sellel ja külmaga soojuse tekke suurendamisel?", ["Sisekeskkonna tingimuste hoidmine sobivas vahemikus", "Kõigi näitajate muutumatuna hoidmine igas olukorras", "Väliskeskkonna muutmise vältimine"], 0, "Eri vastused võivad vähendada eri kõrvalekaldeid. Homöostaas hoiab tingimusi sobivas vahemikus, mitte alati täpselt ühe väärtuse juures."],
  "energy":["Puhkav rakk valmistab uusi valke ja viib aineid aktiivselt läbi membraani. Mida saab selle energiavajaduse kohta öelda?", ["Energiat on vaja ainult nähtava liikumise ajal", "Puhkamine peatab kõik energiat nõudvad protsessid", "Ka nähtava liikumiseta rakutöö vajab energiat"], 2, "Keemilised sünteesid ja aktiivne transport on rakutöö. Keha paigalolek ei tähenda rakkude tegevusetust."],
  "plant_cell":["Proovil on rakumembraan ja sellest väljaspool rakukest, kuid kloroplaste pole näha. Kas kloroplastide puudumine üksi välistab taimeraku?", ["Jah, igas taimerakus peab olema kloroplast", "Ei, osa taimerakke ei fotosünteesi", "Jah, rakukest esineb ainult loomarakkudel"], 1, "Kloroplastide puudumine ei välista taimerakku. Samas ei tõesta üksnes rakukest veel, et proov on kindlasti taimelt."],
  "molecules":["Süsihappegaasi molekuli mudelis on üks süsiniku aatom ja kaks hapniku aatomit. Mitu aatomit on kahes sellises molekulis kokku?", ["Kuus", "Kolm", "Kaks"], 0, "Ühes molekulis on kolm aatomit. Kahe molekuli korral on kokku 2 × 3 = 6 aatomit."],
  "nutrients":["Kaks jooki sisaldavad sama palju vett. Üks sisaldab ka suhkrut. Milline väide eristab nende võimalikku panust?", ["Mõlemad annavad tingimata sama palju toiduenergiat", "Suhkur kõrvaldab joogi veevaru taastava mõju", "Mõlemad võivad anda vett; suhkur lisab ühele ka toiduenergiat"], 2, "Vesi ja toiduenergia on erinevad vajadused. Suhkur on energiaallikas, puhas vesi seda ei ole."],
  "enzymes":["Ensüüm E aitab lagundada ainet X. Lisatakse sama ensüümi ainele Y, kuid reaktsioon ei kiirene. Milline seletus on võimalik?", ["Ükski ensüüm ei saa lagundamist kiirendada", "Y ei sobi selle ensüümi ehitusega", "Ensüüm pidi Y olemasolul kohe DNA-ks muutuma"], 1, "Ensüümid ei sobi võrdselt kõigile ainetele. Reaktsiooni kiirendamine eeldab sobivat koostoimet."],
  "atp":["Rakus peatub ATP taastamine, kuid energiat nõudev töö jätkub. Mis juhtub olemasoleva kasutatava ATP varuga?", ["See võib väheneda, sest ATP-d kasutatakse juurde taastamata", "See suureneb automaatselt, sest rakk teeb tööd", "See peab püsima sama, sest ATP-d kasutatakse korduvalt"], 0, "ATP pidev kasutamine vajab pidevat taastamist. ATP ringlus ei tähenda, et taastamiseks pole energiat vaja."],
  "respiration":["Rakuni jõuab hapnik, kuid mitokondrite töö on tugevalt häiritud. Kas hapniku olemasolu üksi tagab tavapärase suure ATP toodangu?", ["Jah, hapnik ise ongi ATP", "Jah, rakuosade töö ei mõjuta ATP tootmist", "Ei, vaja on ka toimivaid energia muundamise protsesse"], 2, "Hapnik on vajalik paljudele rakuhingamise etappidele, kuid selle kohalolek üksi ei asenda töötavaid raku protsesse."],
  "diffusion":["Membraan laseb ainet X läbi. X kontsentratsioon on rakus suurem kui väljas. Milline on algne netoliikumine difusioonil?", ["Väljast rakku", "Rakust välja", "Mõlemas suunas täpselt võrdselt, sõltumata erinevusest"], 1, "Netoliikumine toimub suurema kontsentratsiooni poolt väiksema poole. Üksikud osakesed võivad liikuda mõlemas suunas."],
  "osmosis":["Rakust väljas on membraani mitteläbiva lahustunud aine kontsentratsioon väiksem kui sees. Rõhk on algul sama ja membraan laseb vett läbi. Mis on vee algne netoliikumine?", ["Rakku sisse", "Rakust välja", "Vesi ei saa liikuda, sest lahustunud aine ei läbi membraani"], 0, "Antud tingimustes liigub vesi kokkuvõttes kontsentreerituma lahuse poole ehk rakku."],
  "photosynthesis":["Taimele antakse vett ja süsihappegaasi, kuid ta on pimedas. Milline fotosünteesi jaoks vajalik sisend on puudu?", ["Hapnik kui peamine energiaallikas", "Valmis suhkur kui fotosünteesi lähteaine", "Valgusenergia"], 2, "Vesi ja süsihappegaas on lähteained. Valgusenergia aitab neist orgaanilist ainet valmistada."],
  "roots":["Taime juured saavad vett ja mineraalaineid, kuid kõik lehed hoitakse pikalt pimedas. Miks ei asenda mullast saadav tavaliselt fotosünteesi?", ["Juured ei võta mullast üldse aineid", "Vesi ja mineraalained ei ole valmis suhkrud ega fotosünteesi valgusenergia", "Muld annab alati kõik vajalikud suhkrud"], 1, "Mullast saadavad ained on vajalikud, kuid ei täida sama rolli kui valguse toel orgaanilise aine valmistamine."],
  "digestion":["Rasvatilk jagatakse paljudeks väiksemateks tilkadeks, kuid rasvamolekulid jäävad terveks. Mis on seni muutunud?", ["Tilkade suurus, kuid molekulide keemiline lõhustamine pole veel toimunud", "Kõik rasvamolekulid on muutunud lihtsuhkruteks", "Kõik rasv on juba läbi sooleseina imendunud"], 0, "Tüki või tilga ja molekuli suurus on eri tasemed. Väiksemad tilgad ei tähenda veel keemiliselt lõhustatud molekule."],
  "absorption":["Toitained on sooles väikesteks molekulideks lõhustatud, kuid nende läbipääs sooleseinast on häiritud. Milline samm on kõige otsesemalt takistatud?", ["Toidu närimine", "Molekulide esialgne lõhustamine", "Toitainete jõudmine soole sisust organismi sisekeskkonda"], 2, "Seedimine ja imendumine on erinevad sammud. Lõhustatud aine peab organismi jõudmiseks veel sooleseina läbima."],
  "gas_exchange":["Kahel vahetuspinnal on sama pindala ja sama hapnikuerinevus, kuid üks on paksem. Millisel on hapnikul üldiselt lühem läbimistee?", ["Paksemal pinnal", "Õhemal pinnal", "Paksus ei mõjuta läbimisteed"], 1, "Õhem pind vähendab difusiooniteed. Suur pindala ja lühike läbimistee on eraldi gaasivahetust toetavad omadused."],
  "circulation":["Kopsuveenis liigub hapnikurikas veri kopsudest südamesse. Miks nimetatakse seda veeniks?", ["Vere liikumissuuna tõttu: südame poole", "Sest veenis peab veri olema hapnikuvaene", "Sest iga kopsu veresoon on veen"], 0, "Veen suundub südame poole. Hapnikusisaldus üksi ei määra, kas veresoon on arter või veen."],
  "blood":["Vereproovis on punaseid vereliblesid palju vähem, kuid plasma maht on sama. Milline ülesanne võib kõige otsesemalt nõrgeneda?", ["Kõigi ainete lahustumine plasmas", "Kõigi valgete vereliblede kaitsefunktsioon kaob tingimata", "Hapniku transport hemoglobiiniga"], 2, "Hemoglobiin paikneb punastes verelibledes. Nende vähenemine võib vähendada vere hapnikukandevõimet."],
  "kidneys":["Neerus imendub samast filtreeritud veehulgast tavalisest vähem vett verre tagasi. Muud tingimused on samad. Mis juhtub uriiniga väljuva vee hulgaga?", ["See väheneb", "See suureneb", "See jääb tingimata samaks"], 1, "Kui vähem vett võetakse tagasi, jääb rohkem vett eritamiseks. Filtreerimine ja tagasiimendumine on erinevad sammud."],
  "hormones":["Rakk kaotab hormooni X retseptori, kuid hormooni hulk veres ei muutu. Mis võib juhtuda X vahendatud vastusega selles rakus?", ["Vastus võib nõrgeneda või puududa", "Vastus peab tugevnema, sest retseptorit pole vaja", "Kõik teised hormoonid peavad samuti verest kaduma"], 0, "Signaal vajab vastuvõtmiseks sobivat retseptorit. Hormooni hulk ja raku tundlikkus on eri asjaolud."],
  "feedback":["Mingi näitaja langeb alla sobiva vahemiku. Milline vastus sobiks seda kõrvalekallet vähendava negatiivse tagasisidega?", ["Vastus, mis langetab näitajat veel rohkem", "Vastus, mis eirab näitaja muutumist", "Vastus, mis aitab näitajat sobiva vahemiku poole tõsta"], 2, "Negatiivne tagasiside vähendab algset kõrvalekallet. See ei tähenda, et vastus peab alati näitajat langetama."],
  "immunity":["Pärast kokkupuudet haigustekitajaga X tekib X-i suhtes immuunmälu. Hiljem kohatakse teistsugust haigustekitajat Y. Mida saab kindlalt öelda?", ["X-i mälu tagab sama tugeva kaitse Y vastu", "Ainuüksi X-i mälu põhjal ei saa eeldada kaitset Y vastu", "X-i mälu tähendab, et kaasasündinud kaitset pole enam vaja"], 1, "Immuunmälu seostub kindlate tunnuste äratundmisega. Ühe haigustekitaja mälu ei tõesta kaitset teise vastu."],
  "ecosystem":["Järve vee temperatuur tõuseb ning mõne kalaliigi arvukus väheneb. Millist seost see näide kirjeldab?", ["Eluta keskkonna ja elusolendite seost", "Ainult kahe loomaliigi omavahelist toitumist", "Muutust, mis jääb ökosüsteemist välja"], 0, "Temperatuur on eluta keskkonna omadus ja võib mõjutada seal elavaid organisme. Näide üksi ei tõesta, et muid põhjuseid polnud."],
  "food_web":["Hiir sööb nii seemneid kui putukaid. Putukate arvukus väheneb. Miks ei piisa hiire saatuse ennustamiseks ühest putukale toetuvast toiduahelast?", ["Hiire toit ei ole ühegi organismiga seotud", "Kõik hiired peavad kohe kaduma", "Hiirel on ka teine toiduallikas ning tulemus sõltub mitmest seosest"], 2, "Toiduvõrk näitab alternatiivseid toiduallikaid ja mitut seost. Üks ahel võib neid varjata."],
  "matter_energy":["Lagundajad vabastavad surnud organismidest mineraalaineid ja nende elutegevuses eraldub soojust. Kumb saab uuesti taime koostisesse jõuda aineringe kaudu?", ["Ainult eraldunud soojus", "Mineraalainete koostisosad", "Mitte kumbki, sest kõik kaob lõplikult"], 1, "Aine koostisosad saavad ringelda. Eraldunud soojus ei taastu sama ringe kaudu taime keemiliseks energiaks."],
  "natural_selection":["Populatsioonis on juba olemas pärilik erinevus põuataluvuses. Põuaga saavad taluvamad taimed rohkem järglasi. Mis võib paljude põlvkondade jooksul juhtuda?", ["Põuataluvust toetavate pärilike variantide sagedus võib suureneda", "Iga taim omandab põua tõttu kohe täpselt sama uue alleeli", "Pärilikud erinevused kaovad tingimata ühe põlvkonnaga"], 0, "Valik muudab olemasolevate pärilike variantide sagedusi erineva järglaste saamise kaudu. Taimed ei vali endale teadlikult alleele."],
  "reasoning_data":["Seemik oli esimesel mõõtmisel 7 cm ja kolm päeva hiljem 12 cm kõrge. Milline väide kirjeldab mõõdetud muutust?", ["Ta kasvas selle aja jooksul 12 cm", "Ta kasvab edaspidi kindlasti 5 cm iga kolme päevaga", "Ta kasvas nende mõõtmiste vahel 5 cm"], 2, "Muutus on 12 − 7 = 5 cm. See ei võrdu lõppkõrgusega ega tõesta tulevast kasvukiirust."],
  "reasoning_experiment":["Uurid temperatuuri mõju seemnete idanemisele. Milline võrdlus eristaks temperatuuri mõju kõige paremini?", ["Eri temperatuur, erinev seemneliik ja erinev veehulk", "Sama liigi sarnased seemned ja sama veehulk, kuid eri temperatuur", "Sama temperatuur, kuid erinev veehulk"], 1, "Muuda uuritavat tegurit ja hoia teised olulised tingimused võimalikult võrreldavad. Igas rühmas on vaja mitut seemet."],
  "reasoning_correlation":["Rohkem päikest saanud taimed kasvasid kõrgemaks, kuid said ka rohkem vett. Mida need andmed üksi lubavad öelda?", ["Kõrguse erinevus on täheldatud, kuid valguse mõju pole vee mõjust eraldatud", "Kõrguse erinevuse põhjustas kindlasti ainult valgus", "Vesi ei saa kasvuga seotud olla"], 0, "Kaks tingimust erinesid koos. Vaatlus ei näita veel, kui palju kumbki tulemust mõjutas."],
  "reasoning_proportion":["Karbis C idaneb 6 seemet 12-st ja D-s 9 seemet 30-st. Kummas on idanenute osakaal suurem?", ["D-s, sest 9 on suurem kui 6", "Mõlemas sama, sest mõlemas idaneb osa seemneid", "C-s: 50% võrreldes D 30%-ga"], 2, "Võrdle osa tervikuga: 6/12 = 1/2, kuid 9/30 = 3/10. Suurem arv ei tähenda suuremat osakaalu."]
 };
 for(const c of concepts){const [prompt,options,answer,explanation]=transferQuestions[c.id];c.followupQuestions=[c.questions.length];c.questions.push({prompt,options,answer,explanation});}

 // v30: original optional reading tasks. Existing concepts/questions stay unchanged.
 const readingPath=['reading_evidence','reading_percent','reading_inter_intra'];
 units.push({id:'reading',title:'Loe ja mõtle · tekst, arvud ja seosed'});
 function reading(id,title,source,lesson,example,takeaway,rows){
   concepts.push({id,title,source,requires:[],language:'et',unit:'reading',minutes:'3–5',
    reference:'Meie koostatud eestikeelsed tekstid ja küsimused. Arvud ja katsed on väljamõeldud harjutusandmed, mitte uuringutulemused ega ametlikud eksamiülesanded.',
    lesson,example,takeaway,anchor:takeaway,reviewQuestions:[0,3,4],applicationQuestions:[2],followupQuestions:[5],
    questions:rows.map(([passage,prompt,options,answer,explanation])=>({passage,prompt,options,answer,explanation}))});
 }
 reading('reading_evidence','Mida tekst lubab järeldada?','reasoning_et',
 'Erista tähelepanekut ja seletust. Küsi: mida mõõdeti, millised tingimused erinesid ja kui laia järeldust andmed lubavad? Kui korraga erinevad valgus ja veehulk, ei saa tulemuse erinevust kindlalt omistada ainult valgusele. Kahe rühma keskmine ei kirjelda tingimata iga üksikut taime.',
 'Näites on rühma A keskmine kõrgus 10 cm ja B-l 7 cm. Mõõdetud keskmised erinevad 3 cm. See üksi ei tõesta, et iga A taim on igast B taimest pikem või et erinevus tuleb ainult ühest kasvutingimusest.',
 'Hea järeldus ei ütle rohkem, kui tekst ja andmed toetavad.',[
 ['Klass kasvatab sama liigi seemneid kahes rühmas. Mõlemas on 20 seemet. A-rühm on akna juures ja saab iga päev 30 ml vett. B-rühm on varjulisemas kohas ja saab 15 ml vett. Kümnendal päeval on A-rühma taimede keskmine kõrgus 10 cm ja B-rühmal 7 cm. Õpilane kirjutab: „Rohkem valgust põhjustas kiirema kasvu.” Katset ei korratud. Kõigi üksikute taimede kõrgusi kokkuvõttes ei esitata.',
 'Milline parandus teeb õpilase järelduse andmetega kooskõlaliseks?',
 ['A-rühm oli keskmiselt kõrgem, kuid valguse mõju ei saa veehulga mõjust eraldada.','Valgus ei mõjuta kasvu, sest ka veehulk oli erinev.','Iga A-rühma taim oli täpselt 3 cm kõrgem kui iga B-rühma taim.'],0,
 'Keskmiste erinevus on mõõdetud, kuid korraga erinesid kaks tingimust. Valguse mõju ei saa veehulgast eraldada; üksikute taimede kohta ei ole piisavalt infot.'],
 ['Kahes rühmas erinesid korraga valgus ja veehulk. Ühe rühma taimed kasvasid kõrgemaks.',
 'Miks ei saa erinevust kindlalt ainult valgusega seletada?',
 ['Sest kõrgust ei saa üldse mõõta.','Sest ka veehulk võis tulemust mõjutada.','Sest erinevad rühmad annavad alati sama tulemuse.'],1,'Muutus rohkem kui üks tingimus. Mõõdetud erinevus ei näita, kui palju kumbki tingimus seda mõjutas.'],
 ['Õpilased loendavad ühes tiigis kolm päeva putukaid: 18, 25 ja 21. Teisi tiike ei uurita. Aruandes öeldakse: „Kõigis piirkonna tiikides on iga päev vähemalt 18 putukat.”',
 'Milline väide jääb kogutud andmete piiridesse?',
 ['Kõigis tiikides on kindlasti vähemalt 18 putukat.','Piirkonna putukate arv ei saa kunagi langeda.','Selles tiigis loendati neil kolmel päeval 18–25 putukat.'],2,'Andmed puudutavad üht tiiki ja kolme vaatluspäeva. Neid ei saa automaatselt laiendada kõigile tiikidele ega tulevastele päevadele.'],
 ['Kahte sama liigi taimerühma mõõdeti nädala lõpus. A-rühma keskmine kõrgus oli 14 cm ja B-rühmal 11 cm. Taimede algkõrgusi üles ei märgitud. Raport väidab: „A taimed kasvasid nädalaga rohkem.”',
 'Milline info on kasvamise võrdlemiseks veel vajalik?',
 ['Ainult pottide värvus.','Taimede kõrgus nädala alguses.','Ainult mõõtmise nädalapäev.'],1,'Kasv on lõpp- ja algkõrguse vahe. Kõrgem lõpptulemus ei tõesta suuremat juurdekasvu, kui algkõrgused on teadmata.'],
 ['Ühes rühmas idaneb 8 seemet 10-st. Järgmisel nädalal pole uusi seemneid katsetatud. Kokkuvõttes on lause: „Selle liigi seemnetest idaneb alati täpselt 80%.”',
 'Milline ümberkirjutus säilitab tulemuse ja eemaldab põhjendamatu üldistuse?',
 ['Selle liigi kõik seemned idanevad alati.','Järgmisel nädalal idaneb kindlasti 80% seemnetest.','Selles katses idanes 80% uuritud seemnetest.'],2,'Sõnad „selles katses” piiravad väite tegelikult vaadeldud seemnetega. Üks tulemus ei tõesta muutumatut osakaalu kõigis olukordades.'],
 ['Klass uurib kahte sama liigi taimerühma. Mõlemas on sama muld ja sama palju valgust. Rühm A saab iga päev 20 ml vett, B aga 40 ml. Kahe nädala pärast on B-rühma keskmine kõrgus suurem. Õpilane väidab: „Mida rohkem vett anda, seda kõrgemaks kasvab see taim alati.”',
 'Milline lause sobib selle väite asemele kõige paremini?',
 ['Nendes katsetingimustes oli 40 ml vett saanud rühma keskmine kõrgus suurem kui 20 ml saanud rühmal.','Iga täiendav veekogus teeb taime alati kõrgemaks.','Kuna keskmised erinevad, ei ole vett vaja edaspidi mõõta.'],0,
 'Võrreldi ainult kaht veekogust kindlates tingimustes. Tulemuse täpne kirjeldus ei luba väita, et vee lisamine parandab kasvu piiramatult.']
 ]);
 reading('reading_percent','Protsenti millest?','probability_et',
 'Kõigepealt leia võrdluse algarv. „Mitu protsenti algarvust?” tähendab uus arv ÷ algarv × 100. „Mitu protsenti rohkem?” tähendab juurdekasv ÷ algarv × 100. Juurdekasv on uus arv miinus algarv. Sama lõpptulemust saab kirjeldada kahel viisil, kuid nende protsendiarvud ei ole samad.',
 'Kui arv muutub 20-st 40-ks, on lõpparv 200% algarvust. Juurde tuli 20 ehk 100% algarvust. Seega on uus arv 100% suurem, mitte 200% suurem.',
 'Lõpparvu ja juurdekasvu võrdlemine algarvuga on eri küsimused.',[
 ['Harjutusmudelis loendatakse algul 200 bakterit ja hiljem 2000 bakterit. Loendused kirjeldavad ainult neid kahte ajahetke; kasvukiirust vahepeal ei mõõdetud. Aruandes on lause: „Bakterite arv on 1000% suurem kui alguses.” Sul palutakse kontrollida just sõnu „suurem kui”, mitte ennustada järgmist loendust.',
 'Milline parandus on arvutuslikult õige?',
 ['2000 on 1000% suurem kui 200.','2000 on 1000% algarvust ja 900% suurem kui 200.','2000 on 900% algarvust ja 1000% suurem kui 200.'],1,
 'Lõpparv: 2000/200 × 100 = 1000%. Juurdekasv: (2000 − 200)/200 × 100 = 900%. Küsimused kasutavad erinevat lugejat.'],
 ['Arv suureneb 10-st 20-ni. Juurde tuleb 10.',
 'Mitu protsenti algarvust moodustab juurdekasv?',
 ['50%','200%','100%'],2,'Juurdekasv 10 jagatud algarvuga 10 annab 1 ehk 100%. Lõpparv on samal ajal 200% algarvust.'],
 ['Taime lehtede arv suureneb harjutusandmetes 8-lt 12-le. Järelduses küsitakse suurenemist protsentides.',
 'Milline vastus kirjeldab juurdekasvu?',
 ['50%','150%','4%'],0,'Juurde tuli 4 lehte. 4/8 × 100 = 50%; 150% kirjeldab lõpparvu osakaalu algarvust.'],
 ['Proovis on algul 50 rakku. Hiljem on rakkude arv algarvust 300%.',
 'Kui palju rakke on juurde tulnud?',
 ['150 rakku','100 rakku','300 rakku'],1,'Lõpparv on 3 × 50 = 150. Juurde tuli 150 − 50 = 100 rakku.'],
 ['Harjutuses suureneb seemikute arv 40-lt 60-le. Kokkuvõte peab kirjeldama nii lõpparvu kui ka kasvu.',
 'Milline lause on täpne?',
 ['Lõpparv on 50% algarvust ja kasv 150%.','Lõpparv on 150% algarvust ja kasv 150%.','Lõpparv on 150% algarvust ja kasv 50%.'],2,'60/40 = 1,5 ehk 150%. Kasv on 20/40 = 0,5 ehk 50%.'],
 ['Uues harjutusproovis on algul 30 rakku ja hiljem 90. Teised mõõtmised puuduvad. Õpilane kirjutab: „Rakkude arv suurenes 300%.”',
 'Milline lause parandab protsendi tähenduse?',
 ['Rakkude arv suurenes 200%; lõpparv oli 300% algarvust.','Rakkude arv suurenes 300%; lõpparv oli 200% algarvust.','Rakkude arv suurenes 60%; lõpparv oli 90% algarvust.'],0,'Lõpparv on kolm korda algarv. Juurdekasv on 60 ja 60/30 × 100 = 200%.']
 ]);
 reading('reading_inter_intra','Inter- ja intra-: vahel või sees?','cell',
 'Rakumembraan piiritleb raku. Rakusisene protsess toimub ühe raku sees; rakkudevaheline suhtlus ühendab eri rakke. Inglise meditsiiniterminoloogias aitab inter- märgata tähendust „vahel” ja intra- tähendust „sees”. intercellular tähendab rakkudevahelist ning intracellular rakusisest. Loe alati ka ülejäänud lauset.',
 'Inter Milan võib meenutada sõnaosa inter-. Võrdle eri klubide vahelist kohtumist ja ühe klubi sisest harjutust. Rakus aitab sama vahel/sees-eristus asukohta mõista. Jalgpallivõrdlus ei kirjelda rakkude tegelikku tööviisi.',
 'Otsi lauses piiri: ühe raku sees või ühelt rakult teisele?',[
 ['Vaatleme kaht rakumembraaniga piiritletud rakku A ja B. Rakk A vabastab signaalmolekuli, mis seondub raku B pinnal oleva vastuvõtjaga. Seejärel käivitub B sees sündmuste ahel. Kirjelduse all on kaks silti: „rakkudevaheline signaal” ja „rakusisene vastus”. Küsimus puudutab ainult viimast etappi, mis toimub B sees.',
 'Milline silt sobib küsitud etapile?',
 ['Rakkudevaheline signaal, sest alguses osales kaks rakku.','Raku jagunemine, sest kirjelduses on kaks rakku.','Rakusisene vastus, sest see etapp toimub ühe raku sees.'],2,
 'Loe, millist etappi küsitakse. A ja B suhtlus on rakkudevaheline, kuid B sees toimuv vastus on rakusisene.'],
 ['Kirjelduses toimub üks sündmus täielikult ühe raku sees.',
 'Kuidas nimetada selle sündmuse asukohta eesti keeles?',
 ['Rakusisene','Rakkudevaheline','Kehaväline'],0,'Rakusisene tähendab ühe raku sees. Rakumembraan aitab eristada raku sisemust väliskeskkonnast.'],
 ['Rakumudelis asub üks märgis kahe kõrvuti oleva raku vahel, teine ühe raku sees. Esimese juurde tuleb ingliskeelne silt.',
 'Milline silt sobib rakkude vahel olevale märgisele?',
 ['intracellular','intercellular','Mõlemad tähendavad alati sama kohta.'],1,'inter- viitab siin „vahel”, intra- „sees”. intercellular sobib rakkudevahelise asukoha kirjeldamiseks.'],
 ['Õppetekstis on kirjas: „Aine muundub ühe maksaraku sees.” Naaberrakke selles etapis ei kirjeldata.',
 'Milline ingliskeelne termin sobib asukoha kirjeldamiseks?',
 ['intercellular','extracellular','intracellular'],2,'Ühe raku sees tähendab intracellular. Ainuüksi maksas toimumine ei muudaks protsessi rakkudevaheliseks.'],
 ['Õpilane kirjutab: „Rakkudevaheline suhtlus toimub alati ühe raku sisemuses.” Ta soovib parandada asukoha tähendust.',
 'Milline ümberkirjutus on täpne?',
 ['Rakkudevaheline suhtlus toimub eri rakkude vahel.','Rakkudevaheline suhtlus tähendab, et rakumembraani pole olemas.','Rakkudevaheline ja rakusisene tähendavad sama asja.'],0,'Rakkudevaheline ühendab eri rakke; rakusisene kirjeldab ühe raku sisemust.'],
 ['Teises näites muudab retseptoriga seondumine rakus C ühe valgu aktiivsust. See valgu muutus toimub C sees. Hiljem võib C saata signaali teisele rakule, kuid praegune küsimus puudutab ainult valgu aktiivsuse muutust.',
 'Milline kirjeldus sobib just küsitud sündmusele?',
 ['Rakkudevaheline, sest hiljem võib tulla teine signaal.','Rakusisene ehk intracellular, sest muutus toimub C sees.','Rakkudevaheline ehk intercellular, sest mõlemad sõnad algavad i-ga.'],1,'Hilisem võimalik sündmus ei määra praegu küsitud etapi asukohta. C sees toimuv muutus on rakusisene.']
 ]);
 concepts.find(c=>c.id==='reading_inter_intra').extraSource={title:'MedlinePlus · inter-/intra- tähendused (inglise keeles)',url:'https://medlineplus.gov/appendixa.html'};
 const focusedVariants={"mitosis": [["Enne DNA kopeerimist on emarakus 4 kromosoomi. Pärast normaalset mitoosi ja raku jagunemist on tekkinud kaks tütarrakku. Mitu kromosoomi on kummaski?", ["4", "2", "8"], 0, "Mitoos säilitab kromosoomide arvu: enne jagunemist kopeeritakse DNA ja koopiad jaotatakse kahe raku vahel."], ["Skeem: üks keharakk → DNA kopeerimine → kaks tütarrakku. Milline samm annab mõlemale tütarrakule vajaliku päriliku info?", ["Kogu DNA jääb ühte tütarrakku", "DNA koopiad jaotatakse mõlemasse tütarrakku", "Pooled geenid eemaldatakse enne jagunemist"], 1, "DNA kopeerimine valmistab ette kaks komplekti. Mitoosis jaotatakse need kahe tuuma vahel; raku jagunemisel saab kumbki tütarrakk oma komplekti."], ["Nahakahjustuse paranemisel tekib olemasolevatest keharakkudest uusi rakke. Miks sobib selleks mitoos?", ["See vähendab kromosoomide arvu poole võrra", "See muudab iga keharaku sugurakuks", "See annab sama kromosoomide arvuga tütarrakud"], 2, "Koe kasvuks ja taastumiseks on vaja sama kromosoomide arvuga rakke. Sugurakkude teke ja arvu poolitamine kuuluvad meioosi juurde."], ["Rakuliinis on enne jagunemist rakus 6 kromosoomi. DNA on kopeeritud ja normaalne mitoos lõpeb. Vali tütarrakkude skeem.", ["3 + 3", "6 + 6", "12 + 12"], 1, "Kummaski tütarrakus on 6 kromosoomi. DNA kopeerimine ei tähenda, et lõplikud tütarrakud jäävad kahekordse kromosoomide arvuga."], ["Kaks tütarrakku saavad pärast normaalset mitoosi ja raku jagunemist päriliku info. Kuidas see tavaliselt emaraku infoga seostub, kui uut mutatsiooni ei tekkinud?", ["Kumbki saab tavaliselt sama päriliku info", "Üks saab kõik geenid ja teine mitte ühtegi", "Kumbki saab juhuslikult ainult poole geenidest"], 0, "DNA kopeerimine ja koopiate eraldamine annavad mõlemale tütarrakule tavaliselt sama päriliku info."], ["Üks rakk jaguneb mitoosiga kaheks, kumbki seejärel veel kord. Kõik jagunemised ja DNA kopeerimised on normaalsed. Algses rakus oli 8 kromosoomi. Mis tekib?", ["Neli rakku, igaühes 2 kromosoomi", "Kaks rakku, igaühes 16 kromosoomi", "Neli rakku, igaühes 8 kromosoomi"], 2, "Rakkude arv kahekordistub igal jagunemisel: 1 → 2 → 4. Kromosoomide arv rakus säilib mitoosis: igas lõplikus rakus on 8."]], "inheritance_probability": [["Ühe geeni mudelis on vanemad Aa ja aa. Milline on iga järgmise lapse tõenäosus saada aa?", ["1/2", "1/4", "Kõik lapsed saavad aa"], 0, "Aa-vanem annab A või a võrdse tõenäosusega, aa-vanem alati a. Võimalused on Aa ja aa; kumbki 1/2."], ["Vanemate genotüübid on Aa ja Aa. Üks laps on aa. Milline on järgmise lapse aa-tõenäosus samas lihtsas mudelis?", ["0, sest aa-laps on juba sündinud", "1/4", "3/4"], 1, "Iga sünd on selles mudelis uus sõltumatu võimalus. Eelmise lapse tulemus ei muuda järgmise lapse 1/4 tõenäosust."], ["Sugurakk saab ühe alleeli. Kui mõlemad vanemad on Aa, millised kombinatsioonid moodustuvad võrdselt tõenäolistest alleelivalikutest?", ["AA ja aa; kumbki 1/2", "Ainult Aa", "AA, Aa, aA ja aa"], 2, "Neli võrdselt tõenäolist kombinatsiooni on AA, Aa, aA, aa. Aa ja aA kirjeldavad sama genotüüpi, mistõttu heterosügootse järglase tõenäosus on 1/2."], ["Üks vanem annab alati a-alleeli. Teine annab A või a, kumbagi tõenäosusega 1/2. Milline on Aa-järglase tõenäosus?", ["1/4", "1/2", "1"], 1, "Aa tekib siis, kui muutliku valikuga vanem annab A. Selle võimaluse tõenäosus on 1/2."], ["AA × aa ristamisel saab iga järglane ühe alleeli kummaltki vanemalt. Milline genotüüp tekib?", ["Aa", "AA", "aa"], 0, "AA-vanem annab alati A, aa-vanem alati a. Kõik järglased on selles mudelis Aa."], ["Lihtsas autosoomse retsessiivse tunnuse mudelis avaldub tunnus ainult aa korral. Aa × Aa järglaste seas on AA : Aa : aa = 1 : 2 : 1. Kui suur osa on kandjad Aa?", ["1/4", "3/4", "1/2"], 2, "Kandjad on kaks Aa-võimalust neljast. Tunnusega aa-järglasi on üks neljast; need on erinevad küsimused."]]};
 for(const [id,rows] of Object.entries(focusedVariants)){const c=concepts.find(c=>c.id===id),base=c.questions.length;c.targeted=true;c.probeQuestions=[base,base+1,base+2];c.supportQuestions=[base+3,base+4];c.transferQuestions=[base+5,base+3];c.questions.push(...rows.map(([prompt,options,answer,explanation])=>({prompt,options,answer,explanation})));}
 const bank={sources,concepts,units,geneticsPath,reasoningPath,readingPath,supports,language:'et',teachFirst:false,questionFirst:true,edition:'2026-10-25-functional-reading'};root.BASICS_CONTENT=bank;if(typeof module==='object'&&module.exports)module.exports=bank;
})(typeof window!=='undefined'?window:globalThis);
