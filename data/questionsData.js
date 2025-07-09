const questions = [{
    id: 1,
    question: 'Which particle is used to mark the direct object of a verb?',
    options: ['は (wa)', 'が (ga)', 'を (o)', 'に (ni)'],
    correctAnswer: 2,
    explanation: 'を (o) is used to mark the direct object of a verb. For example: りんごを食べます (I eat an apple).',
  },
  {
    id: 2,
    question: "Which grammar pattern expresses 'I want to do something'?",
    options: ['〜たい', '〜なければならない', '〜ている', '〜てもいい'],
    correctAnswer: 0,
    explanation: '〜たい is attached to the stem of a verb to express desire. For example: 日本語を勉強したいです (I want to study Japanese).',
  },
  {
    id: 3,
    question: 'What is the correct way to say "I must study"?',
    options: ['勉強します', '勉強したい', '勉強しなければなりません', '勉強してもいいです'],
    correctAnswer: 2,
    explanation: '勉強しなければなりません means "must do" or "have to do".',
  },
  {
    id: 4,
    question: 'Which particle connects two nouns to show possession?',
    options: ['は (wa)', 'が (ga)', 'を (o)', 'の (no)'],
    correctAnswer: 3,
    explanation: 'の (no) connects two nouns to show possession. For example: 私の本 (my book).',
  },
  {
    id: 5,
    question: 'What does the て-form of a verb followed by います indicate?',
    options: ['Future action', 'Past action', 'Ongoing action', 'Potential ability'],
    correctAnswer: 2,
    explanation: 'て-form + います indicates an ongoing action. For example: 食べています (I am eating).',
  },
  {
    id: 6,
    question: "Which form expresses 'I can ～'?",
    options: ["～たい", "～られる", "～できる", "～なければならない"],
    correctAnswer: 2,
    explanation: "～できる indicates ability: 日本語が話せます = I can speak Japanese."
  },
  {
    id: 7,
    question: "What particle marks location of action?",
    options: ["に (ni)", "で (de)", "を (o)", "へ (e)"],
    correctAnswer: 1,
    explanation: "で indicates location where action takes place: 学校で勉強します."
  },
  {
    id: 8,
    question: "Which grammar expresses 'even if ～'?",
    options: ["～ても", "～たら", "～ば", "～なら"],
    correctAnswer: 0,
    explanation: "～ても means 'even if': 雨が降っても行きます."
  },
  {
    id: 9,
    question: "What does ～たら form indicate?",
    options: ["Time when", "Conditional if/when", "Desire", "Permission"],
    correctAnswer: 1,
    explanation: "～たら is conditional: 雨が降ったら、行きません."
  },
  {
    id: 10,
    question: "Which form shows ongoing state from past?",
    options: ["～ている", "～た", "～てある", "～てみる"],
    correctAnswer: 2,
    explanation: "～てある indicates result of intentional action: ドアが開けてある."
  },
  {
    id: 11,
    question: "Which expresses 'I have done ～' (experience)?",
    options: ["～たことがある", "～たい", "～ている", "～ばかり"],
    correctAnswer: 0,
    explanation: "～たことがある expresses past experience: 京都に行ったことがあります."
  },
  {
    id: 12,
    question: "What is volitional form of '行く'?",
    options: ["行こう", "行きたい", "行きます", "行った"],
    correctAnswer: 0,
    explanation: "行こう is volitional: let's go."
  },
  {
    id: 13,
    question: "Which expresses prohibition 'must not ～'?",
    options: ["～なければならない", "～てはいけない", "～てもいい", "～だろう"],
    correctAnswer: 1,
    explanation: "～てはいけない means 'must not': ここで写真を撮ってはいけません."
  },
  {
    id: 14,
    question: "Which expresses 'only ～'?",
    options: ["しか…ない", "だけ", "ほど", "くらい"],
    correctAnswer: 0,
    explanation: "しか…ない emphasizes 'only (not more)': １００円しかない."
  },
  {
    id: 15,
    question: "What does ～そうです (hearsay) mean?",
    options: ["Looks like", "I hear that ～", "Should do", "Try doing"],
    correctAnswer: 1,
    explanation: "～そうです can mean hearsay: 明日は雨が降るそうです = I hear it’ll rain tomorrow."
  }
];
const grammarData = {
  basic: [{
      title: "は (wa) Particle",
      level: "N5",
      description: "Marks the topic of the sentence",
      examples: [{
        japanese: "私は学生です。",
        romaji: "Watashi wa gakusei desu.",
        english: "I am a student."
      }]
    },
    {
      title: "を (o) Particle",
      level: "N5",
      description: "Marks the direct object of the verb",
      examples: [{
        japanese: "本を読みます。",
        romaji: "Hon o yomimasu.",
        english: "I read a book."
      }]
    },
    {
      title: "に (ni) Particle",
      level: "N5",
      description: "Indicates direction, time, or indirect object",
      examples: [{
        japanese: "学校に行きます。",
        romaji: "Gakkou ni ikimasu.",
        english: "I go to school."
      }]
    },
    {
      title: "で (de) Particle",
      level: "N5",
      description: "Indicates location of action or means/method",
      examples: [{
        japanese: "図書館で勉強します。",
        romaji: "Toshokan de benkyou shimasu.",
        english: "I study at the library."
      }]
    },
    {
      title: "が (ga) Particle",
      level: "N5",
      description: "Marks the subject of the sentence",
      examples: [{
        japanese: "猫がいます。",
        romaji: "Neko ga imasu.",
        english: "There is a cat."
      }]
    },
    {
      title: "の (no) Particle",
      level: "N5",
      description: "Indicates possession or connection",
      examples: [{
        japanese: "私の本です。",
        romaji: "Watashi no hon desu.",
        english: "It's my book."
      }]
    },
    {
      title: "ます Form Verbs",
      level: "N5",
      description: "Polite present/future tense verb form",
      examples: [{
        japanese: "食べます、飲みます、行きます",
        romaji: "Tabemasu, nomimasu, ikimasu",
        english: "to eat, to drink, to go"
      }]
    },
    {
      title: "です/だ Copula",
      level: "N5",
      description: "Used with nouns and na-adjectives",
      examples: [{
        japanese: "学生です。",
        romaji: "Gakusei desu.",
        english: "I am a student."
      }]
    },
    {
      title: "い Adjectives",
      level: "N5",
      description: "Japanese i-adjectives conjugation",
      examples: [{
        japanese: "高い → 高くない → 高かった",
        romaji: "Takai → takakunai → takakatta",
        english: "expensive → not expensive → was expensive"
      }]
    },
    {
      title: "な Adjectives",
      level: "N5",
      description: "Japanese na-adjectives usage",
      examples: [{
        japanese: "静かな場所",
        romaji: "Shizuka na basho",
        english: "quiet place"
      }]
    }
  ],
  intermediate: [{
      title: "て-form (Te-form)",
      level: "N4",
      description: "Used for connecting verbs, requests, and continuous actions",
      examples: [{
        japanese: "食べてください。",
        romaji: "Tabete kudasai.",
        english: "Please eat."
      }]
    },
    {
      title: "た-form (Ta-form)",
      level: "N4",
      description: "Past tense of verbs",
      examples: [{
        japanese: "昨日、映画を見た。",
        romaji: "Kinou, eiga o mita.",
        english: "Yesterday, I watched a movie."
      }]
    },
    {
      title: "ない-form (Negative)",
      level: "N4",
      description: "Negative form of verbs",
      examples: [{
        japanese: "食べない。",
        romaji: "Tabenai.",
        english: "I don't eat."
      }]
    },
    {
      title: "Potential Form",
      level: "N4",
      description: "Expressing ability to do something",
      examples: [{
        japanese: "日本語が話せます。",
        romaji: "Nihongo ga hanasemasu.",
        english: "I can speak Japanese."
      }]
    },
    {
      title: "Volitional Form",
      level: "N4",
      description: "Expressing intention or suggestion",
      examples: [{
        japanese: "一緒に行こう。",
        romaji: "Issho ni ikou.",
        english: "Let's go together."
      }]
    },
    {
      title: "なければならない",
      level: "N3",
      description: "Must/have to do something",
      examples: [{
        japanese: "勉強しなければならない。",
        romaji: "Benkyou shinakereba naranai.",
        english: "I must study."
      }]
    },
    {
      title: "たら Conditional",
      level: "N3",
      description: "If/When conditional form",
      examples: [{
        japanese: "雨が降ったら、行きません。",
        romaji: "Ame ga futtara, ikimasen.",
        english: "If it rains, I won't go."
      }]
    },
    {
      title: "ながら",
      level: "N3",
      description: "While doing something",
      examples: [{
        japanese: "音楽を聞きながら勉強する。",
        romaji: "Ongaku o kinagara benkyou suru.",
        english: "I study while listening to music."
      }]
    },
    {
      title: "そうだ (Appearance)",
      level: "N3",
      description: "Looks like/seems like",
      examples: [{
        japanese: "おいしそうなケーキ。",
        romaji: "Oishisou na keeki.",
        english: "The cake looks delicious."
      }]
    },
    {
      title: "みたいだ",
      level: "N3",
      description: "Looks like/resembles",
      examples: [{
        japanese: "彼は先生みたいだ。",
        romaji: "Kare wa sensei mitai da.",
        english: "He looks like a teacher."
      }]
    },
    {
      title: "～てみる",
      level: "N4",
      description: "Try doing ～",
      examples: [{
        japanese: "日本料理を作ってみたい。",
        romaji: "Nihon ryouri o tsukutte mitai.",
        english: "I want to try cooking Japanese food."
      }]
    },
    {
      title: "～てはいけない",
      level: "N4",
      description: "Must not ～ (prohibition)",
      examples: [{
        japanese: "ここで泳いではいけません。",
        romaji: "Koko de oyoide wa ikemasen.",
        english: "You must not swim here."
      }]
    },
    {
      title: "～たことがある",
      level: "N4",
      description: "Have the experience of ～",
      examples: [{
        japanese: "寿司を食べたことがあります。",
        romaji: "Sushi o tabeta koto ga arimasu.",
        english: "I have eaten sushi."
      }]
    },
    {
      title: "～ながら",
      level: "N3",
      description: "While doing ～",
      examples: [{
        japanese: "音楽を聞きながら勉強します。",
        romaji: "Ongaku o kikinagara benkyou shimasu.",
        english: "I study while listening to music."
      }]
    },
    {
      title: "～させる (Causative)",
      level: "N3",
      description: "To make/let someone do ～",
      examples: [{
        japanese: "子供に勉強させる。",
        romaji: "Kodomo ni benkyou saseru.",
        english: "Make the child study."
      }]
    }
  ],
  advanced: [{
      title: "～ようにする",
      level: "N2",
      description: "Make an effort to ～ / Try to ～",
      examples: [{
        japanese: "毎日早く起きるようにしています。",
        romaji: "Mainichi hayaku okiru you ni shite imasu.",
        english: "I'm trying to wake up early every day."
      }]
    },
    {
      title: "～にしては",
      level: "N2",
      description: "Considered ~, but (unexpected)",
      examples: [{
        japanese: "彼は初心者にしては上手だ。",
        romaji: "Kare wa shoshinsha ni shite wa jouzu da.",
        english: "For a beginner, he's good."
      }]
    },
    {
      title: "～ことになっている",
      level: "N2",
      description: "Be supposed to ～ / It's rule that ～",
      examples: [{
        japanese: "明日から夏休みということになっている。",
        romaji: "Ashita kara natsuyasumi to iu koto ni natte iru.",
        english: "It is decided that summer vacation starts tomorrow."
      }]
    },
    {
      title: "ば Conditional",
      level: "N2",
      description: "Formal conditional form",
      examples: [{
        japanese: "勉強すれば、合格できる。",
        romaji: "Benkyou sureba, goukaku dekiru.",
        english: "If you study, you can pass."
      }]
    },
    {
      title: "わけだ",
      level: "N2",
      description: "Explaining reason or conclusion",
      examples: [{
        japanese: "だから遅れたわけだ。",
        romaji: "Dakara okureta wake da.",
        english: "So that's why you were late."
      }]
    },
    {
      title: "べきだ",
      level: "N2",
      description: "Should/ought to do something",
      examples: [{
        japanese: "もっと勉強するべきだ。",
        romaji: "Motto benkyou suru beki da.",
        english: "You should study more."
      }]
    },
    {
      title: "ものだ",
      level: "N2",
      description: "Expressing general truths or nostalgia",
      examples: [{
        japanese: "子供は元気なものだ。",
        romaji: "Kodomo wa genki na mono da.",
        english: "Children are usually energetic."
      }]
    },
    {
      title: "ことにする",
      level: "N2",
      description: "Decide to do something",
      examples: [{
        japanese: "毎日運動することにした。",
        romaji: "Mainichi undou suru koto ni shita.",
        english: "I decided to exercise every day."
      }]
    },
    {
      title: "に違いない",
      level: "N1",
      description: "Must be/certainly is",
      examples: [{
        japanese: "彼は知っているに違いない。",
        romaji: "Kare wa shitte iru ni chigai nai.",
        english: "He must know."
      }]
    },
    {
      title: "ばかりでなく",
      level: "N1",
      description: "Not only... but also",
      examples: [{
        japanese: "英語ばかりでなく、フランス語も話せる。",
        romaji: "Eigo bakari de naku, furansugo mo hanaseru.",
        english: "I can speak not only English but also French."
      }]
    },
    {
      title: "どころか",
      level: "N1",
      description: "Far from/not to mention",
      examples: [{
        japanese: "寒いどころか、暖かいよ。",
        romaji: "Samui dokoro ka, atatakai yo.",
        english: "It's not cold at all, rather warm."
      }]
    },
    {
      title: "ものなら",
      level: "N1",
      description: "If one can/if it's possible",
      examples: [{
        japanese: "行けるものなら行きたい。",
        romaji: "Ikeru mono nara ikitai.",
        english: "If I can go, I want to go."
      }]
    },
    {
      title: "ないではいられない",
      level: "N1",
      description: "Can't help but do something",
      examples: [{
        japanese: "笑わないではいられなかった。",
        romaji: "Warawanai de wa irarenakatta.",
        english: "I couldn't help but laugh."
      }]
    },
    {
      title: "～ようにする",
      level: "N2",
      description: "Make an effort to ～ / Try to ～",
      examples: [{
        japanese: "毎日早く起きるようにしています。",
        romaji: "Mainichi hayaku okiru you ni shite imasu.",
        english: "I'm trying to wake up early every day."
      }]
    },
    {
      title: "～にしては",
      level: "N2",
      description: "Considered ~, but (unexpected)",
      examples: [{
        japanese: "彼は初心者にしては上手だ。",
        romaji: "Kare wa shoshinsha ni shite wa jouzu da.",
        english: "For a beginner, he's good."
      }]
    },
    {
      title: "～ことになっている",
      level: "N2",
      description: "Be supposed to ～ / It's rule that ～",
      examples: [{
        japanese: "明日から夏休みということになっている。",
        romaji: "Ashita kara natsuyasumi to iu koto ni natte iru.",
        english: "It is decided that summer vacation starts tomorrow."
      }]
    }
  ]
}

export {
  questions,
  grammarData
};
