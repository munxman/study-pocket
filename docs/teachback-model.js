(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.StudyTeachback = model;
})(typeof window === 'undefined' ? globalThis : window, () => {
  'use strict';
  const DAY = 86400000;
  // Entry and consolidation ask for the same mechanism in different settings.
  // A concept deliberately belongs to just one field for these optional invitations.
  const fields = {
    genes: {
      basics:'dna_structure nucleus inheritance chromosomes genome proteins transcription translation gene_expression mutation',
      imat:'ribosome dna-rna translation replication biotech',
      et:['DNA, geenid ja valgud',
        'Kuidas jõuab geenis olev info rakus valmistatava valguni? Millises etapis võiks DNA muutus valku mõjutada?',
        'Kahes rakus erineb ühe geeni DNA järjestus ühe tähe võrra. Kuidas uuriksid, kas see muudab valku? Selgita teekonda DNA-st valguni.'],
      en:['DNA, genes and proteins',
        'How does information in a gene reach a protein? Where along that route might a DNA change affect the result?',
        'Two cells differ at one DNA base in a gene. How would you work out whether their proteins differ? Trace the information through the cell.']
    },
    inheritance: {
      basics:'alleles genotype dominance inheritance_probability',
      imat:'mendel autosomal xlinked',
      et:['Alleelide pärandumine',
        'Kuidas võivad kaks haigustunnuseta vanemat saada lapse, kellel avaldub retsessiivne tunnus? Jälgi ühe alleeli teed kummaltki vanemalt.',
        'Kooliaias annavad kaks punaste õitega hernetaime vahel valgete õitega järglasi. Üks geen määrab värvi ja valge on retsessiivne. Kuidas jälgiksid alleele?'],
      en:['Patterns of inheritance',
        'How could two unaffected parents have a child who expresses a recessive trait? Trace one allele from each parent.',
        'Two red-flowered pea plants produce a white-flowered offspring. One gene controls the colour and white is recessive. How do the inherited alleles explain this?']
    },
    division: {
      basics:'chromosome_pairs mitosis meiosis fertilisation', imat:'division cell-cycle-control',
      et:['Kromosoomid ja raku jagunemine',
        'Kuidas hoiab organism kromosoomide arvu naharakkude jagunemisel ja põlvkondade vahetumisel? Mis peab juhtuma sugurakkudes?',
        'Looma keharakus on 12 kromosoomi. Kuidas selgitaksid kromosoomide arvu uues naharakus, munarakus ja pärast viljastumist?'],
      en:['Chromosomes and cell division',
        'How can skin cells divide while keeping the same chromosome number? What needs to happen differently when eggs or sperm form?',
        'An animal has 12 chromosomes in each body cell. Explain how chromosome number changes, or stays the same, in skin repair, egg production and fertilisation.']
    },
    energy: {
      basics:'energy nutrients molecules enzymes atp respiration photosynthesis', imat:'biomolecules enzyme krebs glycolysis photosynthesis respiration-coupling',
      et:['Ained ja energia rakus',
        'Kuidas saab rakk kasutada glükoosi näiteks liikumiseks? Millist rolli mängib ATP?',
        'Idaneva seemne rakk kasutab varutoitu uute ainete valmistamiseks. Kuidas on omavahel seotud glükoos, ATP ja raku töö?'],
      en:['Energy in cells',
        'How can a cell use glucose to power movement? What role does ATP play?',
        'A cell in a germinating seed uses stored food to build new molecules. Explain the connection between glucose, ATP and the work the cell does.']
    },
    exchange: {
      basics:'membrane diffusion osmosis roots', imat:'transport osmosis',
      et:['Liikumine läbi membraani',
        'Miks võib vee liikumine muuta raku suurust? Millist infot vajaksid liikumissuuna ennustamiseks?',
        'Kaks taimerakku satuvad erineva lahustunud ainete sisaldusega vette. Kuidas ennustad, kumba rakku liigub rohkem vett ja miks?'],
      en:['Movement across membranes',
        'Why can water moving across a membrane change a cell’s volume? What do you need to know to predict the direction?',
        'The same type of cell is placed in two solutions, each containing a different concentration of an impermeable solute. How would you predict the initial direction of water movement?']
    },
    regulation: {
      basics:'balance kidneys hormones feedback', imat:'homeostasis adh glucose-control nephron-filtration',
      et:['Organismi tasakaal',
        'Millise muutuse märkab keha pärast tugevat higistamist? Kuidas võiks keha sellele reageerida?',
        'Pärast trenni kaotab jooksja higiga vett. Jälgi, kuidas muutus kutsub esile vastuse, mis aitab vee hulka taastada.'],
      en:['Regulation and feedback',
        'After heavy sweating, what change could the body detect and how could it respond?',
        'A runner loses water during exercise. Trace one response from detecting the change to conserving water. Why should the response weaken as balance returns?']
    },
    circulation: {
      basics:'gas_exchange circulation blood', imat:'circulation gas-exchange',
      et:['Gaasivahetus ja vereringe',
        'Kuidas jõuab sissehingatud hapnik jalalihase rakuni? Millistes kohtades peab see teel ühest keskkonnast teise liikuma?',
        'Ujuja õlalihas vajab hapnikku. Kuidas on omavahel seotud selle jõudmine kopsust verre ning verest töötavasse rakku?'],
      en:['Gas exchange and circulation',
        'How does oxygen in inhaled air reach a leg muscle cell? Where does it cross from one place into another?',
        'A swimmer’s shoulder muscle needs oxygen. Trace one oxygen molecule from the lung to the cell and explain what drives movement across each exchange surface.']
    },
    digestion: {
      basics:'digestion absorption', imat:'digestion-absorption',
      et:['Seedimine ja imendumine',
        'Kuidas jõuavad toiduvalgu koostisosad verre? Mille poolest erinevad seedimine ja imendumine?',
        'Toiduvalk laguneb sooles tavapäraselt, kuid selle koostisosi jõuab verre vähe. Millist sammu uuriksid ja miks?'],
      en:['Digestion and absorption',
        'How do the building blocks of food proteins reach the blood? Where do digestion and absorption fit in?',
        'A meal’s proteins are broken down normally, yet few of their building blocks reach the blood. Which step would you investigate, and why?']
    },
    signals: {
      basics:'muscle nerve', imat:'nerve-signals neuromuscular',
      et:['Närvid ja lihased',
        'Kuidas võiks närvirakus alguse saanud signaal panna lihase liikuma?',
        'Närvisignaal jõuab lihase lähedale, aga lihas ei tõmbu kokku. Millist sammu kontrolliksid järgmisena ja miks?'],
      en:['Nerve signals and muscles',
        'How might a signal in a nerve cell make a muscle move?',
        'A nerve impulse arrives at the end of a motor neuron, but the muscle does not contract. Which step would you check next, and why?']
    },
    ecology: {
      basics:'ecosystem food_web matter_energy natural_selection', imat:'selection',
      et:['Keskkond ja populatsioonid',
        'Putukad erinevad üksteisest. Kuidas võiks keskkonnamuutus mõjutada seda, millised tunnused muutuvad põlvkondade jooksul tavalisemaks?',
        'Kuivus muudab saarel lindude toiduvalikut. Millistel tingimustel võiks nokakuju põlvkondade jooksul muutuda ja miks?'],
      en:['Populations and their environment',
        'Insects differ within a population. How could an environmental change affect which traits become common over generations?',
        'A drought changes the seeds available to a bird population. Under what conditions might beak shape change over generations, and why?']
    },
    structure: {
      basics:'cell tissue organ system plant_cell', imat:'prokaryote',
      et:['Rakkudest organismiks',
        'Kuidas on raku ehitus seotud tema ülesandega? Too üks näide.',
        'Mõtle ühele taimerakule. Kuidas aitavad tema ehitus ja koostöö teiste rakkudega taimel toime tulla?'],
      en:['Cells and organisation',
        'How can a cell’s structure help it do its job? Choose one example.',
        'Choose a specialised cell. Explain how one feature helps it perform its role within the larger organism.']
    },
    immunity: {
      basics:'immunity', imat:'immunity',
      et:['Immuunvastus','Mis juhtub kehas pärast kokkupuudet haigustekitajaga?','Kuidas võiks keha reaktsioon sama haigustekitaja teisel kohtamisel esimesest erineda ja miks?'],
      en:['Immune responses','What happens when the body encounters a pathogen?','How might the response to a second encounter with the same pathogen differ, and why?']
    },
    terminology: {
      basics:'reading_inter_intra', imat:'',
      et:['Sõnaosad teadustekstis','Mis vahe on sõnadel rakusisene ja rakkudevaheline? Milline osa sõnast aitab sul seda otsustada?','Kui kirjeldus võrdleb protsesse ühe koe sees ja kudede vahel, kuidas kasutaksid eesliiteid intra- ja inter- ning kontrolliksid tähendust lauses?'],
      en:['Scientific terminology','How can a prefix help you distinguish within a cell from between cells?','How would you distinguish processes within a tissue from processes between tissues using both word parts and the sentence?']
    },
    evidence: {
      basics:'reasoning_data reasoning_experiment reasoning_correlation reasoning_proportion reading_evidence reading_percent',
      imat:'',
      et:['Andmed ja põhjendamine','Kaks taimerühma kasvavad erineva kiirusega. Mida peaksid teadma, et erinevust selgitada?','Ühe klassi õpilaste mõõdetud taimed kasvasid valguse käes kiiremini. Kuidas eristaksid valguse mõju muudest võimalikest põhjustest?'],
      en:['Data and evidence','Two groups of plants grow at different rates. What would you need to know to explain the difference?','Students find that plants grow faster in brighter light. How would you distinguish the effect of light from other possible causes?']
    }
  };
  const repairPrompts = {
    genes:['Vali üks samm DNA ja valmis valgu vahel. Mis selles sammus toimub ja kuidas võiks muutus mõjutada järgmist sammu?', 'Pick one step between DNA and a finished protein. What happens there, and how could a change affect the next step?'],
    inheritance:['Millise alleeli saab järglane kummaltki vanemalt? Kuidas muudab see sinu ennustust tunnuse avaldumise kohta?', 'Which allele can each parent pass on here, and how does that change your prediction for the offspring?'],
    division:['Mida rakk enne jagunemist kopeerib ja mis jagunemisel eraldub? Kas kromosoomikomplektide arv muutub?', 'What is copied, and what separates in this type of division? What happens to the number of chromosome sets?'],
    exchange:['Mis liigub läbi membraani ning mis määrab liikumissuuna?', 'What crosses the membrane in this example, and what determines its direction?'],
    digestion:['Mis muutub seedimisel ja mis liigub imendumisel? Kuidas eristaksid neid samme selles näites?', 'What changes during digestion, and what moves during absorption? How would you tell the steps apart here?'],
    regulation:['Mis muutus organismis ning kuidas peaks vastus seda muutust vähendama?', 'What changed inside the body, and how would the response reduce that change?']
  };
  const langFor = module => module==='basics' ? 'et' : 'en';
  const moduleFor = module => ({basics:'basics',imat:'imat','hendrik-bio-basics-v1':'basics','hendrik-imat-bio-v1':'imat'})[module];
  const fieldMaps = {basics:new Map(),imat:new Map()};
  for(const [group, field] of Object.entries(fields)) {
    for(const module of Object.keys(fieldMaps)){
      for(const id of field[module].split(' ').filter(Boolean)) fieldMaps[module].set(id,group);
    }
  }
  const groupFor = (module,id) => fieldMaps[moduleFor(module)]?.get(id) || null;
  const dayFormat = new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Tallinn',year:'numeric',month:'2-digit',day:'2-digit'});
  const day = time => dayFormat.format(time);
  const evidence = s => s.answeredAt>0 || s.completedAt>0 || s.taughtAt>0 || s.englishHelp===true || s.assisted===true || s.familyExampleSeen===true || s.stage==='lesson';
  function priorExposure(module,group,state) {
    return (state?.sessions||[]).some(s=>groupFor(module,s.concept)===group&&evidence(s))
      || Object.entries(state?.cards||{}).some(([id,c])=>groupFor(module,id)===group&&(c?.attempts>0||c?.lastExposure>0||c?.lastAt>0));
  }
  function isEntryFresh({module,group,state,otherState,sessionId}) {
    module=moduleFor(module);
    if(!module||!fields[group]||!Array.isArray(state?.sessions)||!Array.isArray(otherState?.sessions))return false;
    const session=state.sessions.find(s=>s.id===sessionId);
    if(!session||session.stage!=='question'||session.review||session.firstLesson||session.selected!=null||session.closed||groupFor(module,session.concept)!==group)return false;
    return !priorExposure(module,group,state)&&!priorExposure(module==='imat'?'basics':'imat',group,otherState);
  }
  function mistakeAt(s){
    if(s.answeredAt>0&&s.correct===false)return s.answeredAt;
    return s.completedAt>0&&s.checkCorrect===false?s.completedAt:0;
  }
  function delayedSuccess(s){
    return s.answeredAt>0&&s.delayedProbe===true&&s.correct===true&&s.assisted!==true&&!s.extraPractice&&!s.initialProbe;
  }
  function recommend({module,state,otherState,session,history=[],now=Date.now()}){
    module=moduleFor(module);
    if(!module||!session||!Array.isArray(state?.sessions)||!Number.isFinite(now))return null;
    const group=groupFor(module,session.concept);
    if(!group)return null;
    const field=fields[group][langFor(module)];
    const saved=history.filter(h=>h&&Number.isFinite(h.at)&&h.at>0);
    const prior=saved.filter(h=>moduleFor(h.module)===module&&h.group===group);
    const completedBaseline=prior.some(h=>h.stage==='entry'&&h.completed===true&&h.entryFresh===true);
    function offer(stage){
      const existing=prior.find(h=>h.sessionId===session.id&&h.stage===stage);
      if(existing&&(existing.completed||existing.skipped))return null;
      if(!existing&&saved.some(h=>day(h.at)===day(now)))return null;
      if(!existing&&prior.some(h=>h.stage===stage&&(stage==='entry'||now-h.at<(stage==='repair'?7:21)*DAY)))return null;
      const lang=langFor(module);
      let prompt=field[stage==='consolidation'?2:1];
      if(stage==='repair')prompt=repairPrompts[group]?.[lang==='et'?0:1] || field[1];
      if(stage==='repair'&&session.concept==='xlinked')prompt='Trace the X chromosome from each parent. How would your calculation change if the question specified a son instead of any child?';
      return {group,groupTitle:field[0],stage,prompt,lang:lang==='et'?'et-EE':'en-GB',baseline:stage==='entry'?'current':completedBaseline?'available':'missing'};
    }
    if(isEntryFresh({module,group,state,otherState,sessionId:session.id}))return offer('entry');
    const attempts=[...new Map(state.sessions.filter(s=>s.id).map(s=>[s.id,s])).values()];
    const currentMiss=mistakeAt(session)>0 || (session.stage==='retry'&&session.retrySubmitted===true&&!session.completedAt);
    if(currentMiss&&['feedback','explanation','check','retry','done'].includes(session.stage)){
      const missDays=new Set(attempts.filter(s=>s.concept===session.concept).map(mistakeAt).filter(t=>t>0&&t<=now&&t>=now-21*DAY).map(day));
      if(missDays.size>=2)return offer('repair');
    }
    if(session.stage!=='done'||!session.completedAt||!delayedSuccess(session)||session.checkCorrect===false)return null;
    const card=state.cards?.[session.concept];
    if(!card||card.needsHelp||card.failures>0||!(card.interval>=2*DAY)||!(card.due>=session.completedAt+DAY))return null;
    const studied=attempts.filter(s=>groupFor(module,s.concept)===group&&s.completedAt>0);
    const touched=attempts.filter(s=>groupFor(module,s.concept)===group&&(s.completedAt>0||s.answeredAt>0));
    const latest=new Map();
    for(const s of touched.sort((a,b)=>(a.completedAt||a.answeredAt)-(b.completedAt||b.answeredAt)))latest.set(s.concept,s);
    const recalled=studied.filter(s=>delayedSuccess(s)&&s.checkCorrect!==false&&s.answeredAt>=now-30*DAY);
    const size=fields[group][module].split(' ').filter(Boolean).length;
    if(new Set(studied.map(s=>s.concept)).size<Math.min(3,size)||new Set(recalled.map(s=>day(s.answeredAt))).size<2)return null;
    if(size===1){
      // A second correct answer on one familiar or unknown item cannot establish breadth.
      if(new Set(recalled.filter(s=>Number.isInteger(s.questionIndex)).map(s=>s.questionIndex)).size<2)return null;
    }else if(new Set(recalled.map(s=>s.concept)).size<2)return null;
    if([...latest.values()].some(s=>s.correct===false||s.checkCorrect===false))return null;
    return offer('consolidation');
  }
  return {groupFor,isEntryFresh,recommend};
});
