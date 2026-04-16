import type { Meal } from "@/types/domain";

export const meals: Meal[] = [
  {
    id: "pasta-med-tomatsaus",
    name: "Pasta med tomatsaus",
    servings: 4,
    baseCostPerAdult: 24,
    prepTimeMinutes: 20,
    difficulty: "easy",
    tags: ["rask", "billig", "barnevennlig", "hverdagsmiddag", "basisvarer"],
    categorySignals: {
      budget: true,
      family: true,
      vegetarian: true,
      protein: false,
      premium: false,
      leftovers: true
    },
    ingredients: [
      { ingredientId: "pasta", quantity: 500 },
      { ingredientId: "tomatoes-canned", quantity: 2 },
      { ingredientId: "onion", quantity: 150 },
      { ingredientId: "frozen-peas", quantity: 250 },
      { ingredientId: "cheese", quantity: 100 }
    ],
    instructions: [
      "Kok pasta i lettsaltet vann etter pakken, vanligvis 10-12 minutter. Spar gjerne litt pastavann før du heller av.",
      "Stek finhakket løk i litt olje på middels varme i 4-5 minutter til den er myk. Rør inn tomat og la sausen småkoke i 8-10 minutter.",
      "Vend inn erter de siste 2 minuttene så de blir varme uten å bli grå. Bland sausen med pastaen og topp med ost før servering."
    ],
    savingsNote: "En rimelig basisrett som tåler å få inn grønnsaksrester."
  },
  {
    id: "kylling-med-ris-og-gronnsaker",
    name: "Kylling med ris og grønnsaker",
    servings: 4,
    baseCostPerAdult: 42,
    prepTimeMinutes: 30,
    difficulty: "easy",
    tags: ["protein", "familie", "ris", "hverdagsmiddag", "matpakkerest"],
    categorySignals: {
      budget: false,
      family: true,
      vegetarian: false,
      protein: true,
      premium: false,
      leftovers: true
    },
    ingredients: [
      { ingredientId: "chicken-thigh", quantity: 600 },
      { ingredientId: "rice", quantity: 360 },
      { ingredientId: "carrots", quantity: 450 },
      { ingredientId: "broccoli", quantity: 1 },
      { ingredientId: "yogurt", quantity: 1 }
    ],
    instructions: [
      "Kok ris i lettsaltet vann eller etter pakken i ca. 18 minutter. La risen hvile et par minutter med lokk når den er ferdig.",
      "Stek kylling i biter i litt olje på middels høy varme i 8-10 minutter. Vend bitene underveis til de er gylne og gjennomstekte.",
      "Damp eller kok gulrot og brokkoli møre i 4-6 minutter, så de fortsatt har litt tyggemotstand. Rør yoghurt med litt salt og pepper til en enkel saus."
    ],
    savingsNote: "Lårfilet gir mye middag for pengene og holder seg saftig som rest."
  },
  {
    id: "laksefilet-med-poteter",
    name: "Laksefilet med poteter",
    servings: 4,
    baseCostPerAdult: 58,
    prepTimeMinutes: 30,
    difficulty: "easy",
    tags: ["fisk", "protein", "norsk", "poteter", "helg"],
    categorySignals: {
      budget: false,
      family: true,
      vegetarian: false,
      protein: true,
      premium: true,
      leftovers: false
    },
    ingredients: [
      { ingredientId: "salmon", quantity: 500 },
      { ingredientId: "potatoes", quantity: 900 },
      { ingredientId: "carrots", quantity: 400 },
      { ingredientId: "frozen-peas", quantity: 300 },
      { ingredientId: "yogurt", quantity: 1 }
    ],
    instructions: [
      "Kok poteter i lettsaltet vann i ca. 18-20 minutter, til de slipper lett når du stikker i dem med en kniv.",
      "Stek laks i panne på middels varme i 3-4 minutter per side. Fisken er klar når den flaker seg lett i midten.",
      "Kok gulrot og erter møre i 3-5 minutter. Server med poteter og en enkel yoghurtsaus rørt med litt salt og pepper."
    ],
    savingsNote: "Planlegg fisk én gang i uken og balanser med rimeligere middager rundt."
  },
  {
    id: "torsk-med-gulrot-og-potet",
    name: "Torsk med gulrot og potet",
    servings: 4,
    baseCostPerAdult: 46,
    prepTimeMinutes: 35,
    difficulty: "medium",
    tags: ["fisk", "protein", "norsk", "poteter", "familie"],
    categorySignals: {
      budget: false,
      family: true,
      vegetarian: false,
      protein: true,
      premium: false,
      leftovers: false
    },
    ingredients: [
      { ingredientId: "cod", quantity: 500 },
      { ingredientId: "potatoes", quantity: 1000 },
      { ingredientId: "carrots", quantity: 650 },
      { ingredientId: "yogurt", quantity: 1 }
    ],
    instructions: [
      "Kok poteter og gulrot i lettsaltet vann i ca. 15-20 minutter, til alt er mørt men ikke faller helt fra hverandre.",
      "Legg torsken i en kjele med varmt vann som nesten koker, og trekk den forsiktig i 6-8 minutter. Fisken skal være fast og flake seg lett.",
      "Server med yoghurt, litt pepper og gjerne litt sitron hvis du har. Drypp litt av kokevannet over fisken hvis du vil ha den saftigere."
    ],
    savingsNote: "Bruk samme tilbehør som andre potetmiddager for mindre svinn."
  },
  {
    id: "tomatsuppe-med-egg",
    name: "Tomatsuppe med egg",
    servings: 4,
    baseCostPerAdult: 22,
    prepTimeMinutes: 25,
    difficulty: "easy",
    tags: ["billig", "vegetar", "egg", "suppe", "barnevennlig"],
    categorySignals: {
      budget: true,
      family: true,
      vegetarian: true,
      protein: true,
      premium: false,
      leftovers: true
    },
    ingredients: [
      { ingredientId: "tomatoes-canned", quantity: 3 },
      { ingredientId: "eggs", quantity: 8 },
      { ingredientId: "onion", quantity: 200 },
      { ingredientId: "bread", quantity: 1 },
      { ingredientId: "yogurt", quantity: 1 }
    ],
    instructions: [
      "Kok egg i 8-9 minutter, og avkjøl dem raskt i kaldt vann så de blir lettere å skrelle.",
      "Stek finhakket løk i litt olje på middels varme i 4 minutter til den er blank. Tilsett tomat og la suppen småkoke i 10-12 minutter.",
      "Del eggene i to og legg dem i suppen ved servering. Server med brød og en skje yoghurt på toppen."
    ],
    savingsNote: "Egg løfter en enkel suppe til en mettende middag."
  },
  {
    id: "chili-sin-carne",
    name: "Chili sin carne",
    servings: 4,
    baseCostPerAdult: 28,
    prepTimeMinutes: 35,
    difficulty: "easy",
    tags: ["vegetar", "protein", "billig", "gryte", "frysevennlig"],
    categorySignals: {
      budget: true,
      family: true,
      vegetarian: true,
      protein: true,
      premium: false,
      leftovers: true
    },
    ingredients: [
      { ingredientId: "lentils", quantity: 1 },
      { ingredientId: "rice", quantity: 360 },
      { ingredientId: "tomatoes-canned", quantity: 2 },
      { ingredientId: "onion", quantity: 250 },
      { ingredientId: "carrots", quantity: 350 },
      { ingredientId: "yogurt", quantity: 1 }
    ],
    instructions: [
      "Kok ris i lettsaltet vann etter pakken, vanligvis 18 minutter. Hold den varm med lokk mens resten blir ferdig.",
      "Stek løk og gulrot i litt olje på middels varme i 5 minutter. Tilsett linser og tomat, og la gryten småkoke i 15-20 minutter til linsene er møre.",
      "Smak til med salt og pepper før servering. Topp med yoghurt for å runde av smaken."
    ],
    savingsNote: "Linser gir protein uten at handlekurven løper fra budsjettet."
  },
  {
    id: "fiskekaker-med-rakost",
    name: "Fiskekaker med råkost",
    servings: 4,
    baseCostPerAdult: 39,
    prepTimeMinutes: 25,
    difficulty: "easy",
    tags: ["fisk", "familie", "rask", "norsk", "hverdagsmiddag"],
    categorySignals: {
      budget: false,
      family: true,
      vegetarian: false,
      protein: true,
      premium: false,
      leftovers: false
    },
    ingredients: [
      { ingredientId: "fish-cakes", quantity: 600 },
      { ingredientId: "potatoes", quantity: 900 },
      { ingredientId: "carrots", quantity: 700 },
      { ingredientId: "cabbage", quantity: 1 },
      { ingredientId: "yogurt", quantity: 1 }
    ],
    instructions: [
      "Kok poteter i lettsaltet vann i ca. 18 minutter, til de er møre hele veien gjennom.",
      "Stek fiskekakene i litt smør eller olje på middels varme i 3-4 minutter per side, til de er gjennomvarme og har fått litt stekeskorpe.",
      "Riv gulrot og finsnitt kål til råkost. Bland gjerne med litt yoghurt, salt og pepper for en mykere salat."
    ],
    savingsNote: "Råkost av gulrot og kål er billig, friskt og holder lenge i kjøleskapet."
  },
  {
    id: "taco-fredag",
    name: "Taco fredag",
    servings: 4,
    baseCostPerAdult: 48,
    prepTimeMinutes: 25,
    difficulty: "easy",
    tags: ["fredag", "familie", "protein", "helgekos", "barnevennlig"],
    categorySignals: {
      budget: false,
      family: true,
      vegetarian: false,
      protein: true,
      premium: false,
      leftovers: true
    },
    ingredients: [
      { ingredientId: "minced-beef", quantity: 400 },
      { ingredientId: "tortilla", quantity: 1 },
      { ingredientId: "cabbage", quantity: 1 },
      { ingredientId: "carrots", quantity: 300 },
      { ingredientId: "tomatoes-canned", quantity: 1 },
      { ingredientId: "yogurt", quantity: 1 },
      { ingredientId: "cheese", quantity: 150 }
    ],
    instructions: [
      "Stek karbonadedeig i panne på middels varme i 5-7 minutter, og del kjøttet opp med en stekespade underveis.",
      "Snitt kål fint og riv gulrot grovt. La grønnsakene ligge klare i en bolle så de holder seg sprø.",
      "Varm lefsene raskt i panne eller ovn, og fyll dem med tomat, yoghurt og ost. Server mens alt fortsatt er varmt."
    ],
    savingsNote: "Kål og gulrot gir tacofølelse uten mange små dyre tillegg."
  },
  {
    id: "pytt-i-panne",
    name: "Pytt i panne",
    servings: 4,
    baseCostPerAdult: 25,
    prepTimeMinutes: 30,
    difficulty: "easy",
    tags: ["restevennlig", "billig", "poteter", "egg", "hverdagsmiddag"],
    categorySignals: {
      budget: true,
      family: true,
      vegetarian: true,
      protein: true,
      premium: false,
      leftovers: true
    },
    ingredients: [
      { ingredientId: "potatoes", quantity: 1000 },
      { ingredientId: "eggs", quantity: 8 },
      { ingredientId: "onion", quantity: 200 },
      { ingredientId: "carrots", quantity: 350 },
      { ingredientId: "frozen-peas", quantity: 300 }
    ],
    instructions: [
      "Skjær poteter i små terninger og stek dem i panne med litt olje på middels høy varme i 12-15 minutter. Vend ofte så de blir gylne på flere sider.",
      "Tilsett løk og gulrot i små biter, og stek videre i 5 minutter. Vend inn erter helt til slutt så de bare blir varme.",
      "Stek speilegg i egen panne på middels varme i 2-3 minutter. Server eggene over pytt i panne mens alt fortsatt er varmt."
    ],
    savingsNote: "En god planlagt restemiddag når poteter og grønnsaker må brukes opp."
  },
  {
    id: "ovnsbakt-laks",
    name: "Ovnsbakt laks",
    servings: 4,
    baseCostPerAdult: 61,
    prepTimeMinutes: 35,
    difficulty: "easy",
    tags: ["fisk", "protein", "premium", "ovnsrett", "helg"],
    categorySignals: {
      budget: false,
      family: true,
      vegetarian: false,
      protein: true,
      premium: true,
      leftovers: false
    },
    ingredients: [
      { ingredientId: "salmon", quantity: 600 },
      { ingredientId: "potatoes", quantity: 900 },
      { ingredientId: "broccoli", quantity: 1 },
      { ingredientId: "yogurt", quantity: 1 }
    ],
    instructions: [
      "Forvarm ovnen til 200°C. Bak poteter i båter i ca. 25 minutter, og legg inn laksen de siste 12-15 minuttene.",
      "Damp eller kok brokkoli i 4-5 minutter, til den er mør men fortsatt frisk i fargen.",
      "Rør yoghurt med litt salt og pepper til dressing. Server med en gang så laksen holder seg saftig."
    ],
    savingsNote: "Hold denne som ukens premiummiddag og la resten av planen være rimelig."
  },
  {
    id: "omelett-med-gronnsaker",
    name: "Omelett med grønnsaker",
    servings: 4,
    baseCostPerAdult: 23,
    prepTimeMinutes: 20,
    difficulty: "easy",
    tags: ["egg", "vegetar", "protein", "billig", "rask"],
    categorySignals: {
      budget: true,
      family: true,
      vegetarian: true,
      protein: true,
      premium: false,
      leftovers: false
    },
    ingredients: [
      { ingredientId: "eggs", quantity: 10 },
      { ingredientId: "broccoli", quantity: 1 },
      { ingredientId: "onion", quantity: 150 },
      { ingredientId: "cheese", quantity: 100 },
      { ingredientId: "bread", quantity: 1 }
    ],
    instructions: [
      "Stek løk og brokkoli i små biter i litt olje på middels varme i 4-5 minutter, til grønnsakene er myke.",
      "Visp eggene lett sammen og hell dem over grønnsakene. La omeletten stivne på middels lav varme i 5-6 minutter.",
      "Strø ost over mot slutten og legg på lokk i 1-2 minutter så osten smelter. Server med brød ved siden av."
    ],
    savingsNote: "Egg er en sterk budsjettbase når uken trenger mer protein."
  },
  {
    id: "spaghetti-bolognese",
    name: "Spaghetti bolognese",
    servings: 4,
    baseCostPerAdult: 38,
    prepTimeMinutes: 35,
    difficulty: "easy",
    tags: ["familie", "protein", "pasta", "barnevennlig", "restevennlig"],
    categorySignals: {
      budget: false,
      family: true,
      vegetarian: false,
      protein: true,
      premium: false,
      leftovers: true
    },
    ingredients: [
      { ingredientId: "minced-beef", quantity: 400 },
      { ingredientId: "pasta", quantity: 500 },
      { ingredientId: "tomatoes-canned", quantity: 2 },
      { ingredientId: "onion", quantity: 200 },
      { ingredientId: "carrots", quantity: 300 },
      { ingredientId: "cheese", quantity: 100 }
    ],
    instructions: [
      "Kok pasta i lettsaltet vann etter pakken, vanligvis 10-12 minutter. Hell av vannet når pastaen fortsatt har litt tyggemotstand.",
      "Stek kjøttdeig med løk og gulrot i litt olje på middels høy varme i 6-8 minutter. Tilsett tomat og la sausen småkoke i 10-12 minutter.",
      "Vend pastaen inn i sausen eller server ved siden av. Topp med litt ost rett før servering."
    ],
    savingsNote: "Gulrot i sausen gir sødme, volum og lavere porsjonspris."
  },
  {
    id: "linsesuppe-med-brod",
    name: "Linsesuppe med brød",
    servings: 4,
    baseCostPerAdult: 21,
    prepTimeMinutes: 30,
    difficulty: "easy",
    tags: ["suppe", "vegetar", "protein", "billig", "restevennlig"],
    categorySignals: {
      budget: true,
      family: true,
      vegetarian: true,
      protein: true,
      premium: false,
      leftovers: true
    },
    ingredients: [
      { ingredientId: "lentils", quantity: 1 },
      { ingredientId: "tomatoes-canned", quantity: 2 },
      { ingredientId: "carrots", quantity: 500 },
      { ingredientId: "onion", quantity: 250 },
      { ingredientId: "bread", quantity: 1 },
      { ingredientId: "yogurt", quantity: 1 }
    ],
    instructions: [
      "Stek løk og gulrot i litt olje på middels varme i 4-5 minutter, til grønnsakene begynner å bli myke.",
      "Tilsett linser og tomat, og la suppen småkoke i 15-20 minutter til linsene er møre. Rør et par ganger underveis så den ikke setter seg i bunnen.",
      "Smak til med salt og pepper før servering. Server med brød og en skje yoghurt på toppen."
    ],
    savingsNote: "En av de billigste fullverdige middagene i planen."
  },
  {
    id: "kyllingwraps-med-spro-kal",
    name: "Kyllingwraps med sprø kål",
    servings: 4,
    baseCostPerAdult: 40,
    prepTimeMinutes: 22,
    difficulty: "easy",
    tags: ["rask", "protein", "familie", "wraps", "kål"],
    categorySignals: {
      budget: false,
      family: true,
      vegetarian: false,
      protein: true,
      premium: false,
      leftovers: true
    },
    ingredients: [
      { ingredientId: "chicken-thigh", quantity: 500 },
      { ingredientId: "tortilla", quantity: 1 },
      { ingredientId: "cabbage", quantity: 1 },
      { ingredientId: "carrots", quantity: 300 },
      { ingredientId: "yogurt", quantity: 1 }
    ],
    instructions: [
      "Stek kylling i strimler i litt olje på middels høy varme i 6-8 minutter, til kjøttet er gyllent og gjennomstekt.",
      "Snitt kål fint og riv gulrot grovt. Bland gjerne yoghurt med litt salt og pepper til en rask dressing.",
      "Varm lefsene raskt i tørr panne eller ovn. Fyll dem med kylling, grønnsaker og dressing rett før servering."
    ],
    savingsNote: "Deler råvarer godt med taco og råkostmiddager."
  },
  {
    id: "kyllingform-med-potet-og-gulrot",
    name: "Kyllingform med potet og gulrot",
    servings: 4,
    baseCostPerAdult: 43,
    prepTimeMinutes: 40,
    difficulty: "easy",
    tags: ["ovnsrett", "familie", "protein", "poteter", "restevennlig"],
    categorySignals: {
      budget: false,
      family: true,
      vegetarian: false,
      protein: true,
      premium: false,
      leftovers: true
    },
    ingredients: [
      { ingredientId: "chicken-thigh", quantity: 600 },
      { ingredientId: "potatoes", quantity: 1000 },
      { ingredientId: "carrots", quantity: 500 },
      { ingredientId: "onion", quantity: 200 },
      { ingredientId: "yogurt", quantity: 1 }
    ],
    instructions: [
      "Forvarm ovnen til 200°C. Legg kylling, potet og gulrot i en ildfast form og vend alt med litt olje, salt og pepper.",
      "Stek midt i ovnen i 30-35 minutter. Vend grønnsakene én gang underveis, og sjekk at kyllingen er gjennomstekt før servering.",
      "Rør yoghurt med litt salt og pepper til en enkel saus. Server formen rett fra ovnen mens alt fortsatt er varmt."
    ],
    savingsNote: "Alt stekes samlet, og restene fungerer godt til lunsj."
  },
  {
    id: "pastafrittata-med-brokkoli",
    name: "Pastafrittata med brokkoli",
    servings: 4,
    baseCostPerAdult: 27,
    prepTimeMinutes: 26,
    difficulty: "medium",
    tags: ["egg", "pasta", "vegetar", "restevennlig", "billig"],
    categorySignals: {
      budget: true,
      family: true,
      vegetarian: true,
      protein: true,
      premium: false,
      leftovers: true
    },
    ingredients: [
      { ingredientId: "eggs", quantity: 8 },
      { ingredientId: "pasta", quantity: 300 },
      { ingredientId: "broccoli", quantity: 1 },
      { ingredientId: "cheese", quantity: 150 },
      { ingredientId: "onion", quantity: 150 }
    ],
    instructions: [
      "Kok pasta i lettsaltet vann i ca. 8-10 minutter, og la brokkoli koke med de siste 3 minuttene.",
      "Visp egg lett sammen og bland med pasta, brokkoli og ost mens alt fortsatt er varmt. Rør godt så egget fordeler seg jevnt.",
      "Stek blandingen på middels lav varme i panne i 8-10 minutter, eller bak den i ovn på 190°C i ca. 15 minutter. Den er klar når midten har satt seg."
    ],
    savingsNote: "Perfekt for å bruke opp smårester før ny handletur."
  },
  {
    id: "potetsuppe-med-brod",
    name: "Potetsuppe med brød",
    servings: 4,
    baseCostPerAdult: 18,
    prepTimeMinutes: 18,
    difficulty: "easy",
    tags: ["bytteforslag", "billig", "vegetar", "suppe", "rask"],
    categorySignals: {
      budget: true,
      family: true,
      vegetarian: true,
      protein: false,
      premium: false,
      leftovers: true
    },
    ingredients: [
      { ingredientId: "potatoes", quantity: 800 },
      { ingredientId: "onion", quantity: 150 },
      { ingredientId: "carrots", quantity: 300 },
      { ingredientId: "bread", quantity: 1 },
      { ingredientId: "yogurt", quantity: 1 }
    ],
    instructions: [
      "Kok potet, løk og gulrot i vann eller buljong i 15-18 minutter, til grønnsakene er helt møre.",
      "Mos suppen glatt med stavmikser eller potetmoser. La den småkoke 2-3 minutter til hvis du vil ha den litt tykkere.",
      "Server med brød og en skje yoghurt på toppen. Dryss gjerne over litt pepper rett før servering."
    ],
    savingsNote: "Et svært rimelig bytte når ukesbudsjettet trenger litt luft."
  },
  {
    id: "egg-og-brod-med-rakost",
    name: "Egg og brød med råkost",
    servings: 4,
    baseCostPerAdult: 19,
    prepTimeMinutes: 12,
    difficulty: "easy",
    tags: ["bytteforslag", "rask", "protein", "billig", "vegetar"],
    categorySignals: {
      budget: true,
      family: true,
      vegetarian: true,
      protein: true,
      premium: false,
      leftovers: false
    },
    ingredients: [
      { ingredientId: "eggs", quantity: 8 },
      { ingredientId: "bread", quantity: 1 },
      { ingredientId: "carrots", quantity: 400 },
      { ingredientId: "cabbage", quantity: 1 },
      { ingredientId: "yogurt", quantity: 1 }
    ],
    instructions: [
      "Kok egg i 8 minutter eller stek dem i panne på middels varme i 2-3 minutter, avhengig av hva du liker best.",
      "Riv gulrot og finsnitt kål. Bland gjerne med litt yoghurt, salt og pepper så råkosten blir saftigere.",
      "Server eggene med grovt brød og yoghurt-dressing ved siden av. Legg alt på bordet med en gang så det er enkelt å forsyne seg."
    ],
    savingsNote: "Raskt, mettende og billig uten at det føles som en nødløsning."
  }
];
