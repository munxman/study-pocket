'use strict';
// Original biology transfer questions. Not an official paper, calibrated test, or full IMAT.
// This separate paper must not replace the frozen official-2025 trial bank or ordinary practice.
(function(root){
 const base='https://openstax.org/books/biology-2e/pages/';
 const data={
  id:'imat-biology-transfer-2026-11-06',year:2026,version:1,minutes:20,
  title:'Biology transfer simulation · 12 original IMAT-style questions',
  origin:'original',label:'Original biology simulation — not an official or full IMAT',
  description:'Twelve fresh biology questions in 20 minutes. The maximum is 18 points. This original, uncalibrated sample cannot establish exam readiness or be extrapolated to a full IMAT score.',
  source:'https://openstax.org/details/books/biology-2e',
  sourceLabel:'Original questions; biological principles checked against OpenStax Biology 2e',
  scoring:{correct:1.5,wrong:-0.4,blank:0,maximum:18},
  questions:[
   {
    id:'OPITASKU-TRANSFER-20261106-01',number:1,topic:'Enzyme action',concept:'enzyme',extension:false,
    prompt:'A reaction is drawn as an energy profile: reactants on the left, a peak in the middle, and products on the right. An enzyme is added without changing the reaction or temperature. Which change should the profile show?',
    options:[
     'A higher peak, with the reactant and product levels unchanged',
     'A lower peak, with the reactant and product levels unchanged',
     'The same peak, but products moved to a lower energy level',
     'The reactants and products changing places',
     'The products reaching a higher level because the enzyme supplies their energy'
    ],answer:1,
    explanation:'The enzyme provides a pathway with a lower activation-energy barrier. It does not change the energies of the reactants and products or their overall free-energy difference. The peak changes; the endpoints do not.',
    source:base+'6-5-enzymes'
   },
   {
    id:'OPITASKU-TRANSFER-20261106-02',number:2,topic:'Kidney reabsorption',concept:'nephron-filtration',extension:false,
    prompt:'A labelled substance is followed through a model nephron. Of 24 units entering the tubule by filtration, 6 leave in urine. None is secreted, stored, produced or broken down during passage. What accounts for the other 18 units?',
    options:[
     'They were secreted from blood into the tubule',
     'They were never filtered into the tubule',
     'They were converted into water by filtration',
     'They were reabsorbed from the tubule towards the blood',
     'They must also have left in the same urine sample'
    ],answer:3,
    explanation:'With no secretion, storage or chemical change, the balance is filtered amount minus reabsorbed amount equals excreted amount. Thus 24 − 6 = 18 units returned from the tubule towards the blood. That direction is reabsorption.',
    source:base+'41-2-the-kidneys-and-osmoregulatory-organs'
   },
   {
    id:'OPITASKU-TRANSFER-20261106-03',number:3,topic:'Autosomal carriers',concept:'autosomal',extension:false,
    prompt:'In a simple autosomal recessive model, every bb offspring expresses a trait; BB and Bb do not. A Bb parent is crossed with a BB parent. Which pair gives (1) the probability of expressing the trait and (2) the probability of being a Bb carrier?',
    options:['0 and 1/2','1/2 and 1/2','0 and 1','1/4 and 1/2','1/2 and 0'],answer:0,
    explanation:'The BB parent always contributes B. The Bb parent contributes B or b with equal probability, giving BB and Bb equally often. No offspring is bb, so none expresses the trait in this model; half are Bb carriers. All are unaffected, but not all are carriers.',
    source:base+'12-2-characteristics-and-traits'
   },
   {
    id:'OPITASKU-TRANSFER-20261106-04',number:4,topic:'Separate gas gradients',concept:'gas-exchange',extension:false,
    prompt:'At one instant, a model lung surface has oxygen partial pressure of 80 units on BOTH sides. Carbon dioxide partial pressure is 7 units in the blood and 5 in the alveolar air. Considering diffusion alone at that instant, what is predicted?',
    options:[
     'Both gases have net movement from blood into alveolar air',
     'Oxygen has net movement into blood; carbon dioxide has no net movement',
     'Neither gas has net movement because oxygen is at equilibrium',
     'Oxygen has no net movement; carbon dioxide has net movement into blood',
     'Oxygen has no net movement; carbon dioxide has net movement into alveolar air'
    ],answer:4,
    explanation:'Equal oxygen partial pressures give no net oxygen diffusion at that instant, although molecules still move in both directions. Carbon dioxide has its own gradient, from 7 in blood to 5 in alveolar air, so it has net diffusion towards the air.',
    source:base+'39-2-gas-exchange-across-respiratory-surfaces'
   },
   {
    id:'OPITASKU-TRANSFER-20261106-05',number:5,topic:'Using a genetic message',concept:'translation',extension:false,
    prompt:'A cell-free preparation contains a suitable mRNA, functional ribosomes, enough tRNAs already loaded with their amino acids, all other required translation factors, and an energy supply. It contains no DNA. What can this preparation do?',
    options:[
     'Copy a DNA chromosome before it can make any protein',
     'Make protein only after turning every tRNA into DNA',
     'Make the polypeptide encoded by the supplied mRNA',
     'Make the polypeptide only if a nucleus is added',
     'Use amino-acid order to choose which mRNA sequence to create'
    ],answer:2,
    explanation:'Translation reads an existing mRNA to assemble a polypeptide. DNA does not have to be present in this prepared translation reaction: the message, amino-acid-loaded tRNAs and required protein-making machinery have already been supplied.',
    source:base+'15-5-ribosomes-and-protein-synthesis'
   },
   {
    id:'OPITASKU-TRANSFER-20261106-06',number:6,topic:'Chromosomes versus DNA amount',concept:'division',extension:false,
    prompt:'In G1, a diploid cell has 10 chromosomes and 6 pg of nuclear DNA. It completes one S phase, then normal mitosis and cytokinesis without mutation or chromosome loss. Before any further S phase, what does EACH daughter nucleus contain?',
    options:[
     '5 chromosomes and 3 pg of DNA',
     '10 chromosomes and 12 pg of DNA',
     '20 chromosomes and 12 pg of DNA',
     '10 chromosomes and 6 pg of DNA',
     '5 chromosomes and 6 pg of DNA'
    ],answer:3,
    explanation:'S phase doubles the DNA before division. Mitosis separates sister copies, and each daughter nucleus receives the original chromosome complement and G1 DNA amount: 10 chromosomes and 6 pg. This is not the reduction in chromosome sets associated with meiosis.',
    source:base+'10-2-the-cell-cycle'
   },
   {
    id:'OPITASKU-TRANSFER-20261106-07',number:7,topic:'X-linked denominators',concept:'xlinked',extension:false,
    prompt:'A hypothetical animal follows the simple XX/XY model. For an X-linked recessive trait, a female is XᴳXᵍ and a male is XᵍY. The trait is expressed whenever no G allele is present. Sons and daughters are equally likely, with equal survival. What proportion of DAUGHTERS express the trait, and what proportion of ALL offspring are daughters expressing it?',
    options:['1/4 and 1/4','1/2 and 1/4','1 and 1/2','1/2 and 1/2','0 and 0'],answer:1,
    explanation:'Every daughter receives paternal Xᵍ. Half also receive maternal Xᵍ and are XᵍXᵍ, so half of daughters express the trait. Among all offspring, the daughter branch has probability 1/2, giving 1/2 × 1/2 = 1/4 for a daughter expressing it. Sons instead receive paternal Y.',
    source:base+'12-2-characteristics-and-traits'
   },
   {
    id:'OPITASKU-TRANSFER-20261106-08',number:8,topic:'What drives ATP synthase?',concept:'respiration-coupling',extension:false,
    prompt:'An artificial membrane contains correctly oriented, functional ATP synthase. ADP and phosphate are available on its ATP-producing side. A proton electrochemical gradient like that used by mitochondria is imposed, but no electron transport chain maintains it. Which outcome is possible?',
    options:[
     'ATP production continues indefinitely after the gradient disappears',
     'ADP must first be converted into oxygen before ATP can form',
     'ATP cannot form because ATP synthase directly consumes electrons',
     'Protons must move against their gradient to make ATP in this setup',
     'ATP can form while proton flow supplies energy, then production falls as the gradient dissipates'
    ],answer:4,
    explanation:'ATP synthase can use energy from proton flow down an electrochemical gradient to join ADP and phosphate. The respiratory chain normally helps maintain that gradient; it is not the direct substrate of ATP synthase. Here the imposed gradient is a finite energy supply, so sustained ATP production is not guaranteed.',
    source:base+'7-4-oxidative-phosphorylation'
   },
   {
    id:'OPITASKU-TRANSFER-20261106-09',number:9,topic:'Comparing exchange surfaces',concept:'gas-exchange',extension:false,
    prompt:'For the same gas and the same non-zero partial-pressure difference, three model exchange surfaces differ only in area and thickness: P has area 8 and thickness 2; Q has area 12 and thickness 4; R has area 5 and thickness 1. Use rate proportional to area divided by thickness. Which ranks their transfer rates from greatest to least?',
    options:['R > P > Q','Q > P > R','P > R > Q','P = Q = R','Q > R > P'],answer:0,
    explanation:'Compare the ratios, not area alone: P is 8/2 = 4, Q is 12/4 = 3, and R is 5/1 = 5. Therefore R has the greatest predicted transfer rate, followed by P and Q. The surface with the greatest area is not necessarily fastest when thickness differs.',
    source:base+'39-2-gas-exchange-across-respiratory-surfaces'
   },
   {
    id:'OPITASKU-TRANSFER-20261106-10',number:10,topic:'Selection from existing variation',concept:'selection',extension:false,
    prompt:'Before a drought, a plant population already contains a heritable variant that reduces water loss. During the drought, plants with this variant leave more surviving offspring than other plants. Its frequency rises over several generations. Which interpretation is best supported?',
    options:[
     'Every plant developed the variant because it needed to save water',
     'The drought proved that all mutations improve survival',
     'Selection favoured an existing heritable variant; its rise did not require the drought to create it',
     'Individual plants changed their inherited DNA in a directed way before reproducing',
     'Different reproductive success cannot affect variant frequencies'
    ],answer:2,
    explanation:'The variant existed before the environmental change. Its carriers contributed more surviving offspring, so selection could increase its frequency. The observation does not show that need produced a directed mutation or that all mutations are beneficial.',
    source:base+'19-3-adaptive-evolution'
   },
   {
    id:'OPITASKU-TRANSFER-20261106-11',number:11,topic:'Digestion versus absorption',concept:'digestion-absorption',extension:false,
    prompt:'In an intestinal model, enzymes successfully split dietary proteins into amino acids. A separate intervention blocks those amino acids from crossing the intestinal epithelium. Which conclusion follows?',
    options:[
     'Protein digestion must also have stopped',
     'Chemical digestion occurred, but absorption of those amino acids is impaired',
     'All amino acids must already be in the blood because proteins were split',
     'The amino acids must be changed back into intact dietary proteins',
     'The intestine no longer needs a blood supply for nutrient delivery'
    ],answer:1,
    explanation:'Digestion breaks large food molecules into smaller molecules. Absorption is their movement across the intestinal lining towards the internal transport system. Successful breakdown does not guarantee successful transport across the epithelium.',
    source:base+'34-3-digestive-system-processes'
   },
   {
    id:'OPITASKU-TRANSFER-20261106-12',number:12,topic:'Specificity of immune memory',concept:'immunity',extension:false,
    prompt:'After exposure to antigen A, a person has memory lymphocytes specific to A. The person later encounters an unrelated antigen B that those cells do not recognise. Why does memory for A not guarantee a rapid memory response to B?',
    options:[
     'Memory lymphocytes only change the number of red blood cells',
     'All antigens have exactly the same molecular shape',
     'Adaptive immunity can respond only once in a lifetime',
     'Immune memory is specific to recognised antigens, rather than a universal response to every new antigen',
     'The presence of memory cells disables innate immunity'
    ],answer:3,
    explanation:'Memory B and T cells are selected for particular antigen recognition. Memory for one antigen does not automatically supply matching memory cells for an unrelated antigen. A response to the new antigen can still develop; it is not guaranteed the same head start.',
    source:base+'42-2-adaptive-immune-response'
   }
  ]
 };
 root.IMAT_TRIAL_TRANSFER=data;
 if(typeof module==='object'&&module.exports)module.exports=data;
})(typeof window!=='undefined'?window:globalThis);
