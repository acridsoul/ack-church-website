export interface SermonService {
  preacher: string;
  bibleVerses: string[];
  notes: string;
  pdfUrl?: string;
}

export interface Sermon {
  id: string;
  date: string;
  sundayName: string;
  theme?: string;
  englishService: SermonService;
  kikuyuService: SermonService;
}

export const sermons: Sermon[] = [
  {
    id: "2025-01-05",
    date: "2025-01-05",
    sundayName: "2nd Sunday After Christmas",
    theme: "Walking in the Light",
    englishService: {
      preacher: "Rev. James Mwangi",
      bibleVerses: ["John 1:1-14", "Ephesians 5:8-14"],
      notes: `## Walking in the Light of Christ

As we begin this new year, we are called to reflect on what it means to walk in the light of Christ.

### Key Points

1. **Christ is the Light of the World** - In John 1, we see that Jesus is the true light that gives light to everyone. This light has come into the world, and darkness has not overcome it.

2. **We are Children of Light** - Ephesians reminds us that we were once darkness, but now we are light in the Lord. We must live as children of light.

3. **The Fruit of Light** - Walking in the light produces goodness, righteousness, and truth in our lives.

### Application

- Start each day with prayer and Scripture reading
- Let your actions reflect Christ's love to others
- Be a beacon of hope in your community

> "For you were once darkness, but now you are light in the Lord. Live as children of light." - Ephesians 5:8`,
      pdfUrl: "/sermons/2025-01-05-english.pdf",
    },
    kikuyuService: {
      preacher: "Rev. Peter Kamau",
      bibleVerses: ["Johana 1:1-14", "Aefeso 5:8-14"],
      notes: `## Gũthiĩ na Ũtheri wa Kristũ

Tũkĩambĩrĩria mwaka mũerũ ũyũ, nĩtũĩtĩtwo kũrĩkana ũhoro wa gũthiĩ na ũtheri wa Kristũ.

### Maũndũ ma Bata

1. **Kristũ nĩ Ũtheri wa Thĩ** - Johana 1, tũkũona atĩ Jesũ nĩwe ũtheri wa ma ũrĩa ũheaga andũ othe ũtheri.

2. **Nĩtũrĩ Ciana cia Ũtheri** - Aefeso ĩtũrĩkanagia atĩ twarĩ nduma, no rĩu nĩtũrĩ ũtheri thĩinĩ wa Mwathani.

3. **Maciaro ma Ũtheri** - Gũthiĩ na ũtheri gũciaraga wega, ũthingu, na ma mĩoyo-inĩ itũ.

### Kũhũthĩra

- Ambĩrĩria mũthenya o wothe na kũhoya na gũthoma Ibuku rĩa Ngai
- Reka mahĩtia maku maonanie andũ arĩa angĩ wendani wa Kristũ
- Ũrĩe mũmũnĩki wa mwĩhoko gĩkeno-inĩ gĩaku`,
      pdfUrl: "/sermons/2025-01-05-kikuyu.pdf",
    },
  },
  {
    id: "2024-12-29",
    date: "2024-12-29",
    sundayName: "1st Sunday After Christmas",
    theme: "The Gift of Emmanuel",
    englishService: {
      preacher: "Rev. James Mwangi",
      bibleVerses: ["Matthew 1:18-25", "Isaiah 7:14"],
      notes: `## The Gift of Emmanuel - God With Us

Christmas reminds us of the greatest gift ever given - Emmanuel, God with us.

### Understanding Emmanuel

1. **A Promise Fulfilled** - The prophecy in Isaiah 7:14 was fulfilled in the birth of Jesus. God keeps His promises.

2. **God's Presence** - Emmanuel means "God with us." Through Christ, God chose to dwell among His people.

3. **Our Response** - Like Joseph, we are called to obedience even when we don't understand God's plan.

### Living with Emmanuel

- Remember that God is always with you
- Trust in His promises for your life
- Share the good news of Emmanuel with others

> "She will give birth to a son, and you are to give him the name Jesus, because he will save his people from their sins." - Matthew 1:21`,
    },
    kikuyuService: {
      preacher: "Canon Samuel Njoroge",
      bibleVerses: ["Mathayo 1:18-25", "Isaia 7:14"],
      notes: `## Kĩheo gĩa Emanueli - Ngai Hamwe Naitũ

Kĩrĩsĩmasi ĩtũrĩkanagia kĩheo kĩrĩa kĩnene gũkĩra icio ingĩ ciothe - Emanueli, Ngai hamwe naitũ.

### Kũmenya Emanueli

1. **Kĩĩranĩro Gĩakĩritwo** - Ũhoro ũrĩa waragĩrwo nĩ Isaia 7:14 wakĩritwo na gũciarwo kwa Jesũ.

2. **Kũrĩ Kwa Ngai** - Emanueli nĩ kuuga "Ngai hamwe naitũ." Na Kristũ, Ngai athuurire gũikara na andũ ake.

3. **Gĩcokio Giitũ** - Ta Jusefu, nĩtũĩtĩtwo kũathĩkĩra o na rĩrĩa tũtamenya mũrĩĩri wa Ngai.

### Gũtũũra na Emanueli

- Rĩkana atĩ Ngai arĩ nawe matukũ mothe
- Ũgĩrĩre kĩĩranĩro giake mũtũũro-inĩ waku
- Taũria andũ arĩa angĩ ũhoro mwega wa Emanueli`,
    },
  },
  {
    id: "2024-12-22",
    date: "2024-12-22",
    sundayName: "4th Sunday of Advent",
    theme: "Joy to the World",
    englishService: {
      preacher: "Rev. Dr. Joseph Mũturi",
      bibleVerses: ["Luke 1:39-56", "Psalm 98"],
      notes: `## Joy to the World - Mary's Song of Praise

On this final Sunday of Advent, we celebrate the joy that comes from knowing our Savior is near.

### Mary's Magnificat

1. **Personal Joy** - "My soul glorifies the Lord" - Mary's joy begins with a personal relationship with God.

2. **Recognition of Grace** - Mary acknowledges that she is blessed not because of her own merit, but because of God's grace.

3. **God's Justice** - The Magnificat speaks of God lifting up the humble and filling the hungry with good things.

### Sharing the Joy

- Let your joy overflow to those around you
- Remember the less fortunate during this season
- Prepare your heart for Christ's coming

> "My soul glorifies the Lord and my spirit rejoices in God my Savior." - Luke 1:46-47`,
      pdfUrl: "/sermons/2024-12-22-english.pdf",
    },
    kikuyuService: {
      preacher: "Rev. Peter Kamau",
      bibleVerses: ["Luka 1:39-56", "Thaburi 98"],
      notes: `## Gĩkeno Thĩ Yothe - Rwĩmbo rwa Maria wa Gũkũna

Kiumia gĩkĩ kĩa mũico kĩa Adventi, tũrenda gĩkeno kĩrĩa gĩũkaga na kũmenya atĩ Mũhonokia witũ arĩ hakuhĩ.

### Rwĩmbo rwa Maria

1. **Gĩkeno Gĩa Mũndũ** - "Ngoro yakwa ĩkũnaga Mwathani" - Gĩkeno kĩa Maria gĩambĩrĩirie na ũheanĩri na Ngai.

2. **Kũmenya Tha** - Maria amenyaga atĩ nĩarathimĩtwo ti nĩ ũndũ wa mahĩtia make, no nĩ tha cia Ngai.

3. **Kĩhooto kĩa Ngai** - Rwĩmbo rwa Maria rũraaria ũhoro wa Ngai kũruranĩra arĩa menyenyetie.

### Gũtũũrania Gĩkeno

- Reke gĩkeno gĩaku kĩruranĩrĩre arĩa marĩ hakuhĩ nawe
- Rĩkana arĩa matarĩ na indo hĩndĩ ĩno
- Tũũra ngoro yaku Kristũ auke`,
      pdfUrl: "/sermons/2024-12-22-kikuyu.pdf",
    },
  },
  {
    id: "2024-12-15",
    date: "2024-12-15",
    sundayName: "3rd Sunday of Advent",
    theme: "Rejoice in the Lord",
    englishService: {
      preacher: "Rev. James Mwangi",
      bibleVerses: ["Philippians 4:4-7", "Isaiah 35:1-10"],
      notes: `## Rejoice in the Lord Always

The third Sunday of Advent is traditionally known as "Gaudete Sunday" - a day of rejoicing.

### Why We Rejoice

1. **The Lord is Near** - Paul reminds us to rejoice because the Lord is near. His coming brings hope and peace.

2. **Peace that Surpasses Understanding** - When we bring our anxieties to God in prayer, He gives us a peace that guards our hearts.

3. **The Desert Will Bloom** - Isaiah prophesies that even the wilderness will rejoice at the coming of the Lord.

### Practical Rejoicing

- Choose joy even in difficult circumstances
- Practice gratitude daily
- Share your joy with those who are struggling

> "Rejoice in the Lord always. I will say it again: Rejoice!" - Philippians 4:4`,
    },
    kikuyuService: {
      preacher: "Rev. Peter Kamau",
      bibleVerses: ["Afilipi 4:4-7", "Isaia 35:1-10"],
      notes: `## Kenera Mwathani Hĩndĩ Ciothe

Kiumia gĩkĩ kĩa gatatũ kĩa Adventi nĩgĩũĩkĩkaga ta "Gaudete Sunday" - mũthenya wa gũkena.

### Nĩkĩ Tũkenagĩra

1. **Mwathani Arĩ Hakuhĩ** - Paulo atũrĩkanagia gũkena tondũ Mwathani arĩ hakuhĩ.

2. **Thayũ Ũrĩa Ũtooĩkĩka** - Rĩrĩa tũreheaga mathĩĩna maitũ kũrĩ Ngai na kũhoya, atũheaga thayũ.

3. **Werũ Nĩũkarahũka** - Isaia araaria atĩ o na werũ nĩũkakena rĩrĩa Mwathani akũũka.

### Gũkena kwa Ma

- Thuura gĩkeno o na ũrĩ na mathĩĩna
- Heana ngatho o mũthenya
- Tũũrania gĩkeno gĩaku na arĩa marĩ na thĩĩna`,
    },
  },
];

export const getSermonById = (id: string): Sermon | undefined => {
  return sermons.find((sermon) => sermon.id === id);
};

export const getSermonsByYear = (year: number): Sermon[] => {
  return sermons.filter((sermon) => new Date(sermon.date).getFullYear() === year);
};

export const getAvailableYears = (): number[] => {
  const years = sermons.map((sermon) => new Date(sermon.date).getFullYear());
  return [...new Set(years)].sort((a, b) => b - a);
};
