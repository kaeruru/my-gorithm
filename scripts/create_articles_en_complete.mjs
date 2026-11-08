// scripts/create_articles_en_complete.mjs
import fs from 'fs';
import { CONTENT_DATA } from '../data.js';

// 공통 날짜 및 출처 변환 맵
const SOURCE_MAP = {
  '토스 테크 · Toss Tech': 'Toss Tech',
  '하버드 비즈니스 리뷰 · 뇌과학 아카이브': 'Harvard Business Review · Neuroscience Archive',
  '씨네21 · 독립·예술 기획': 'Cine21 · Independent & Art Cinema',
  '스포츠의학 저널 · 운동생리학 아카이브': 'Journal of Sports Medicine · Exercise Physiology',
  '대한민국 정책브리핑': 'Korea Policy Briefing',
  '한국어 위키백과 · 비디오 게임 콘솔': 'Wikipedia · Video Game Consoles',
  '한국어 위키백과 · 알고리즘': 'Wikipedia · Algorithms',
  '한국어 위키백과 · 인공지능': 'Wikipedia · Artificial Intelligence',
  '한국어 위키백과 · 로봇': 'Wikipedia · Robotics',
  '한국어 위키백과 · 악성 소프트웨어': 'Wikipedia · Malware Analysis',
  '한국어 위키백과 · 자연어 처리': 'Wikipedia · Natural Language Processing',
  '한국어 위키백과 · 로봇 수술': 'Wikipedia · Robotic Surgery',
  '한국어 위키백과 · 제미나이 (언어 모델)': 'Wikipedia · Gemini (Language Model)',
  '한국어 위키백과 · 2차원 컴퓨터 그래픽스': 'Wikipedia · 2D Computer Graphics',
  '한국어 위키백과 · 컴퓨터 그래픽스': 'Wikipedia · Computer Graphics',
  '한국어 위키백과 · 중화인민공화국의 인공지능 산업': 'Wikipedia · AI Industry in China',
  '한국어 위키백과 · 수중사진': 'Wikipedia · Underwater Photography',
  '한국어 위키백과 · 갈릴레오 갈릴레이': 'Wikipedia · Galileo Galilei',
  '한국어 위키백과 · 기억': 'Wikipedia · Human Memory',
  '한국어 위키백과 · 천문학': 'Wikipedia · Astronomy',
  '한국어 위키백과 · 불쾌한 골짜기': 'Wikipedia · Uncanny Valley',
  '한국어 위키백과 · 퍼즐': 'Wikipedia · Puzzles & Cognition',
  '한국어 위키백과 · 조리 (음식)': 'Wikipedia · Culinary Science',
  '한국어 위키백과 · 한국의 전통문화': 'Wikipedia · Korean Traditional Culture',
  '한국어 위키백과 · 포켓몬스터': 'Wikipedia · Pokémon Franchise',
  '한국어 위키백과 · 텔레비전 드라마': 'Wikipedia · Television Drama',
  '한국어 위키백과 · 청소년': 'Wikipedia · Adolescent Psychology',
  '한국어 위키백과 · 미국의 문화': 'Wikipedia · American Culture',
  '한국어 위키백과 · 숭늉': 'Wikipedia · Sungnyung (Scorched Rice Tea)',
  '한국어 위키백과 · 음식 배달': 'Wikipedia · Food Delivery Platforms',
  '한국어 위키백과 · 태국 요리': 'Wikipedia · Thai Cuisine',
  '한국어 위키백과 · 중국 요리': 'Wikipedia · Chinese Culinary Traditions',
  '한국어 위키백과 · 일본 요리': 'Wikipedia · Japanese Gastronomy',
  '한국어 위키백과 · 로봇의 눈물': 'Wikipedia · Tears of Steel (Open Movie)',
  '한국어 위키백과 · 노래': 'Wikipedia · History of Song & Singing',
  '한국어 위키백과 · 여성주의': 'Wikipedia · Feminist Movements',
  '한국어 위키백과 · 오마카세': 'Wikipedia · Omakase Dining Culture',
  '한국어 위키백과 · 네모바지 스폰지밥': 'Wikipedia · SpongeBob SquarePants',
  '삼성전자 고객지원 · 배터리 케어': 'Samsung Support · Battery Care',
  '카카오 테크 · Kakao Tech': 'Kakao Tech',
  '인디스페이스 독립영화 아카이브': 'IndieSpace · Art Film Archive',
  '국립중앙박물관 · 큐레이터 토크': 'National Museum of Korea · Curator Talk',
  '스페셜티 커피 협회(SCA) 코리아': 'Specialty Coffee Association (SCA) Korea',
  '국립산림과학원 생활원예 가이드': 'National Institute of Forest Science · Indoor Gardening',
  '어반스케쳐스 코리아 아카이브': 'Urban Sketchers Archive',
  '홈베이킹 연구소': 'Home Baking Laboratory',
  '국제기능올림픽 한식 조리 아카이브': 'WorldSkills Korean Cuisine Archive',
  '스마트폰 사진 아카데미': 'Smartphone Photography Academy',
  'YouTube · 토스 테크': 'YouTube · Toss Tech',
  'YouTube · 얄팍한 코딩사전': 'YouTube · Quick Coding Guide',
  'YouTube · 조코딩 JoCoding': 'YouTube · JoCoding',
  'YouTube · 세바시': 'YouTube · Sebasi Talk (15 Min to Change the World)',
  'YouTube · 삼프로TV': 'YouTube · Sampro TV',
  'YouTube · 널 위한 문화예술': 'YouTube · Art for You',
  'YouTube · 마라톤 정석': 'YouTube · Running Fundamentals',
  'YouTube · 백종원의 요리비책': 'YouTube · Paik Jong-won Cooking',
  'Lofi Girl · ChilledCow': 'Lofi Girl · ChilledCow'
};

const DATE_MAP = {
  '최신 칼럼': 'Latest Column',
  '오늘': 'Today',
  '어제': 'Yesterday',
  '2일 전': '2d ago',
  '3일 전': '3d ago',
  '4일 전': '4d ago',
  '5일 전': '5d ago',
  '6일 전': '6d ago',
  '1주일 전': '1w ago',
  '신규 등록': 'Just Added',
  '추천 영상': 'Featured Video',
  '인기 영상': 'Trending Video',
  '필수 시청': 'Must Watch',
  '정책 브리핑': 'Policy Briefing',
  '미래 기술': 'Future Tech',
  '뇌과학 아카이브': 'Neuroscience Archive',
  '역사 아카이브': 'History Archive',
  '인지과학': 'Cognitive Science',
  '천체물리학': 'Astrophysics',
  '심리학 실험': 'Psychology Lab',
  '인지심리학': 'Cognitive Psychology',
  '조리과학': 'Culinary Science',
  '문화유산': 'Cultural Heritage',
  '전통체험': 'Living Heritage',
  '팝컬처 아카이브': 'Pop Culture Archive',
  '미디어 연구': 'Media Studies',
  '발달심리학': 'Developmental Psychology',
  '문화인류학': 'Cultural Anthropology',
  '식문화사': 'Culinary History',
  '도시사회학': 'Urban Sociology',
  '음식문화': 'Gastronomy Culture',
  '동아시아 음식문화': 'East Asian Food Culture',
  '일본 식문화': 'Japanese Culinary Heritage',
  '오픈소스 무비': 'Open Source Cinema',
  '음악사': 'Music History',
  '사회운동사': 'Social History',
  '미식 트렌드': 'Gourmet Trends',
  '러닝 기초': 'Running Basics',
  'K-푸드 레시피': 'K-Food Recipe',
  '커피 사이언스': 'Coffee Science',
  '홈가드닝': 'Home Gardening',
  '취미 미술': 'Creative Art',
  '홈베이킹': 'Home Baking',
  '요리 꿀팁': 'Cooking Tips',
  '사진 테크닉': 'Photography Tips',
  '애니메이션 역사': 'Animation History'
};

function translateDuration(dur) {
  if (!dur) return '5 min read';
  if (dur.includes(':')) return dur;
  return dur.replace('분 읽기', ' min read').replace('분 분량', ' min read');
}

function translateDate(d) {
  if (!d) return 'Recent';
  return DATE_MAP[d] || d.replace('일 전', 'd ago');
}

function translateSource(s) {
  if (!s) return 'Recommended Article';
  return SOURCE_MAP[s] || s;
}

// 각 카테고리별 번역 데이터
const TECH_EN = JSON.parse(fs.readFileSync('scripts/temp_tech_translations.json', 'utf8'));

// 나머지 수동 데이터 맵 로드 및 통합
const ALL_EN = {
  ...TECH_EN,
  // --- STUDY ---
  'study-1': {
    title: 'Unlocking Inner Potential with Metacognition: The Psychology of Learning',
    summary: 'Cognitive psychologist Prof. Lisa Son explains how knowing what you truly know vs what you don\'t transforms learning speed.',
    source: 'YouTube · Sebasi Talk (15 Min to Change the World)',
    date: 'Must Watch',
    recommendationReason: 'Understand the difference between surface familiarity and genuine metacognitive mastery.'
  },
  'study-2': {
    title: 'Mindful Archiving: Building a Second Brain That Actually Remembers',
    summary: 'Moving beyond passive note-taking to the Zettelkasten and Cornell methods that turn fleeting insights into permanent intellectual assets.',
    source: 'Harvard Business Review · Neuroscience Archive',
    date: 'Today',
    recommendationReason: 'Build a personalized knowledge management system that connects isolated ideas into actionable wisdom.',
    keyPoints: [
      'The passive note-taking trap: Transcribing text verbatim creates zero neural memory traces.',
      'The Cornell Note-taking System: Structuring notes into cues, summaries, and main concepts on a single page.',
      'The Zettelkasten method: Linking atomic notes into a dynamic, compounding web of ideas.'
    ],
    sections: [
      {
        heading: 'The Note-taking Trap: Passive Recording vs Active Synthesis',
        body: 'Writing down every word a lecturer speaks feels productive, but cognitive science shows it bypasses deep processing. Transforming notes into original sentences and questions forces active neural synthesis.'
      },
      {
        heading: 'The Cornell System: Clean Organization on One Page',
        body: 'Dividing your paper into a wide notes column, a left-hand cue margin, and a bottom summary box naturally guides you through review, synthesis, and self-testing.'
      },
      {
        heading: 'Zettelkasten: Compounding Networks of Fragmented Thoughts',
        body: 'Rather than filing notes into rigid folders where they are forgotten, linking individual atomic thoughts creates an interconnected knowledge network that sparks creative breakthroughs.'
      }
    ]
  },
  'study-4': {
    title: 'Pomodoro Optimization: 4 Hours of Deep Flow Without Burnout',
    summary: 'The neuroscience of finite human attention and how structured intervals of 25-minute focus and 5-minute rest recharge cognitive energy.',
    source: 'Harvard Business Review · Neuroscience Archive',
    date: 'Yesterday',
    recommendationReason: 'Scientifically proven protocol to eliminate afternoon brain fog and sustain razor-sharp concentration.',
    keyPoints: [
      'Human prefrontal cortex focus naturally fatigues after 25~45 minutes of continuous cognitive strain.',
      'True rest during breaks: Step away from screens to prevent sensory overload and dopamine depletion.',
      'Advanced Pomodoro tuning: Customizing cycle durations to match personal tasks and circadian rhythms.'
    ],
    sections: [
      {
        heading: 'Attention Limits and the Power of Timeboxing',
        body: 'The human brain cannot maintain peak concentration indefinitely. Timeboxing tasks into distinct 25-minute sprints creates a healthy sense of urgency that silences digital distractions.'
      },
      {
        heading: 'The Quality of Rest Dictates the Next Sprint',
        body: 'Scrolling social media during a 5-minute break is not resting; it floods visual pathways with rapid stimuli. Taking a brief walk or stretching with closed eyes restores prefrontal cortex reserves.'
      },
      {
        heading: 'Pro Tips for Deep Workers',
        body: 'Bundle smaller administrative tasks into a single 25-minute block. For deep analytical work, expand the interval to 50 minutes followed by a 10-minute restorative pause.'
      }
    ]
  },
  'study-5': {
    title: 'USD/KRW at 1,384: The Global Currency War and Macroeconomic Realities',
    summary: 'A clear macro breakdown of Federal Reserve interest rates, geopolitical tensions, and how currency fluctuations ripple across household finance.',
    source: 'YouTube · Sampro TV',
    date: 'Trending Video',
    recommendationReason: 'Essential financial literacy to understand inflation, interest rate shifts, and global currency dynamics.'
  },
  'study-6': {
    title: 'Evidence-Based Learning: Spaced Repetition and Active Recall Over Cramming',
    summary: 'Why pulling all-nighters leads to rapid forgetting, and how algorithm-driven spaced retrieval permanently hardens memory traces.',
    source: 'Harvard Business Review · Neuroscience Archive',
    date: '5d ago',
    recommendationReason: 'Learn the gold-standard learning protocol of cognitive psychology to master exams and professional skills with minimal fatigue.',
    keyPoints: [
      'The Ebbinghaus forgetting curve shows over 70% of newly acquired information fades within 48 hours without recall.',
      'Spaced repetition algorithms schedule reviews at the exact mathematical moment of impending memory decay.',
      'Active recall via digital flashcards forces synapses to rebuild stronger pathways than passive rereading.'
    ],
    sections: [
      {
        heading: 'Why Cramming Evaporates Right After Exams',
        body: 'All-night cramming places information into transient working memory buffers. Without sleep-driven memory consolidation in the hippocampus, nearly all retained facts evaporate within days.'
      },
      {
        heading: 'Spaced Repetition: Defeating the Forgetting Curve',
        body: 'Reviewing a concept just as it begins to slip from memory triggers deep synaptic reinforcement. Spacing reviews over 1 day, 3 days, 1 week, and 1 month locks information into permanent long-term storage.'
      },
      {
        heading: 'Building Your Flashcard Defense Line',
        body: 'Apps like Anki automate this algorithm. Crafting concise, single-question flashcards makes daily 10-minute reviews effortless and extraordinarily potent over years.'
      }
    ]
  },
  'study-8': {
    title: 'The Feynman Learning Technique: Explaining Complexity in Crystal-Clear Language',
    summary: 'Nobel laureate Richard Feynman\'s mental model for learning anything: If you cannot explain it to a sixth-grader, you don\'t truly understand it.',
    source: 'Harvard Business Review · Neuroscience Archive',
    date: '1w ago',
    recommendationReason: 'Exposes hidden conceptual gaps and cements intuitive mastery over technical topics.',
    keyPoints: [
      'Choose a target concept and explain it using everyday analogies with zero professional jargon.',
      'Identify the exact friction point where your explanation stumbles, and revisit source materials.',
      'Refine, simplify, and crystallize until the concept feels entirely intuitive and self-evident.'
    ],
    sections: [
      {
        heading: 'The Jargon Trap in Modern Knowledge',
        body: 'Hiding behind esoteric terminology is often a mask for shallow comprehension. Real understanding shines through the ability to describe complex ideas using plain, everyday language.'
      },
      {
        heading: 'The 4 Steps of the Feynman Protocol',
        body: 'Step 1: Write down the concept name. Step 2: Teach it to an imaginary child. Step 3: Pinpoint where your explanation falters and reread the core literature. Step 4: Simplify analogies until they are effortless.'
      },
      {
        heading: 'From Memorization to Deep Intuition',
        body: 'Once you can explain how a neural network works using a kitchen recipe analogy, the knowledge belongs to you forever, unlocking effortless creative application.'
      }
    ]
  },
  'study-9': {
    title: 'Finding Your Personal Learning Style: Aligning Cognitive Strengths with Study Methods',
    summary: 'How individual cognitive processing differences, attention rhythms, and sensory strengths shape effective study habits.',
    source: 'Wikipedia · Cognitive Psychology',
    date: 'Cognitive Science',
    recommendationReason: 'Identify your personal learning rhythms and craft study strategies that leverage your natural strengths.',
    keyPoints: [
      'Understanding auditory, visual, and kinesthetic information processing styles.',
      'Matching environmental conditions (lighting, noise, desk setup) to your attentional profile.',
      'Continuous self-monitoring to adjust study routines for maximum intellectual energy.'
    ],
    sections: [
      {
        heading: 'Diverse Cognitive Profiles Among Learners',
        body: 'Every individual processes sensory information with distinct efficiency. Some grasp abstract concepts through visual diagrams, while others require verbal discussions or hands-on practice.'
      },
      {
        heading: 'Designing an Optimized Study Ecosystem',
        body: 'Aligning your workspace with your sensory preferences—such as using noise-canceling headphones or tactile notebooks—drastically reduces background cognitive friction.'
      },
      {
        heading: 'Metacognitive Self-Adjustment',
        body: 'Regularly evaluating which study techniques yield the highest retention per hour allows you to discard ineffective habits and build an agile, enjoyable learning routine.'
      }
    ]
  },
  'study-10': {
    title: 'Effortless Vocabulary Acquisition: Mnemonics, Context & Etymology',
    summary: 'Cognitive memory strategies for learning languages: Why root-word etymology and contextual immersion surpass rote vocabulary lists.',
    source: 'Wikipedia · Cognitive Psychology',
    date: 'Language Science',
    recommendationReason: 'Master foreign language vocabulary faster by leveraging linguistic roots and vivid contextual imagery.',
    keyPoints: [
      'Latin and Greek root-word patterns unlocking dozens of related terms simultaneously.',
      'Contextual sentence immersion anchoring vocabulary into emotional and episodic memory.',
      'Mnemonic keyword associations turning abstract spellings into memorable mental pictures.'
    ],
    sections: [
      {
        heading: 'The Limits of Isolated Word Lists',
        body: 'Memorizing two-column word lists treats vocabulary as abstract symbols without context. Without rich episodic hooks, words quickly fade from memory.'
      },
      {
        heading: 'Etymology: The Architectural Skeleton of Words',
        body: 'Understanding prefixes, roots, and suffixes allows you to intuit the meanings of unfamiliar words instantly, turning vocabulary building into an intriguing puzzle.'
      },
      {
        heading: 'Contextual Immersion and Dual Coding',
        body: 'Reading engaging stories and associating new vocabulary with vivid mental images engages both verbal and visual memory pathways, dramatically boosting recall speed.'
      }
    ]
  },
  'study-11': {
    title: 'Galileo Galilei and the Dawn of Empirical Science: Measuring Truth Through Data',
    summary: 'How empirical observation, mathematical physics, and the telescope shattered dogma and founded the modern scientific method.',
    source: 'Wikipedia · Galileo Galilei',
    date: 'History Archive',
    recommendationReason: 'A historical perspective on how empirical measurement and reproducible experiments revolutionized human knowledge.',
    keyPoints: [
      'Challenging philosophical dogma through rigorous physical measurement and reproducible experimentation.',
      'Telescopic observations of Jupiter\'s moons providing concrete empirical proof of the Copernican solar system.',
      'Establishing mathematical relationships as the universal language of physical phenomena.'
    ],
    sections: [
      {
        heading: 'The Paradigm Shift from Philosophical Dogma to Measurement',
        body: 'Before Galileo, natural philosophy relied heavily on Aristotle\'s abstract deductions. Galileo insisted that true knowledge requires quantifiable observation and verifiable experiments.'
      },
      {
        heading: 'The Telescope that Shattered the Heavens',
        body: 'Pointing his homemade telescope to the night sky, Galileo discovered mountains on the moon and four moons orbiting Jupiter, dismantling the ancient belief that all celestial bodies must circle the Earth.'
      },
      {
        heading: 'The Legacy of Mathematical Physics',
        body: 'By quantifying the acceleration of falling bodies and the laws of pendulums, Galileo laid the mathematical foundations upon which Isaac Newton would soon build modern physics.'
      }
    ]
  },
  'study-12': {
    title: 'Why Some Memories Last a Lifetime While Others Vanish: The Neurobiology of Retention',
    summary: 'An exploration of episodic memory, hippocampal consolidation, emotional encoding, and the biological purpose of forgetting.',
    source: 'Wikipedia · Human Memory',
    date: 'Neuroscience Archive',
    recommendationReason: 'Understand the biological mechanics of how the brain filters daily experiences into permanent long-term memories.',
    keyPoints: [
      'The hippocampus functioning as an indexer before transferring memories into the cerebral cortex.',
      'Emotional arousal and adrenaline chemically tagging events for priority consolidation.',
      'Forgetting as an active neurobiological optimization process to eliminate clutter and extract abstract concepts.'
    ],
    sections: [
      {
        heading: 'The Gateway of Memory: The Hippocampus',
        body: 'Daily experiences are first processed as temporary synaptic patterns in the hippocampus. During deep slow-wave sleep, these memories are replayed and consolidated into the neocortex for permanent storage.'
      },
      {
        heading: 'Why Emotionally Charged Memories Stand the Test of Time',
        body: 'When an event triggers surprise, fear, or joy, the amygdala releases stress hormones that act as biochemical priority tags, ensuring critical survival information is permanently preserved.'
      },
      {
        heading: 'The Evolutionary Gift of Forgetting',
        body: 'If our brains retained every trivial sensory input—such as the license plate of every car passed—cognitive processing would freeze. Forgetting allows us to generalize and think conceptually.'
      }
    ]
  },
  'study-13': {
    title: 'Unlocking the Secrets of Stars and Exoplanets: Spectroscopy and Modern Astronomy',
    summary: 'How analyzing starlight wavelengths reveals stellar composition, exoplanet atmospheres, and the cosmic history of the universe.',
    source: 'Wikipedia · Astronomy',
    date: 'Astrophysics',
    recommendationReason: 'Discover how astronomical instruments decode invisible light to map the frontiers of the cosmos.',
    keyPoints: [
      'Spectroscopic absorption lines revealing chemical element fingerprints across billions of light-years.',
      'Transit photometry detecting exoplanet silhouettes as they cross in front of host stars.',
      'Space observatories like James Webb peering through cosmic dust to capture the earliest infant galaxies.'
    ],
    sections: [
      {
        heading: 'Decoding the Colors of Starlight',
        body: 'Every chemical element absorbs and emits specific wavelengths of light. By dispersing starlight through prisms and gratings into spectral lines, astronomers can determine the temperature, density, and chemical makeup of distant stars.'
      },
      {
        heading: 'Hunting for Alien Worlds in the Shadows',
        body: 'When an exoplanet passes between its parent star and our telescopes, the star\'s brightness dips slightly. Analyzing the filtered starlight through the planet\'s atmosphere allows scientists to detect water vapor, methane, and carbon dioxide.'
      },
      {
        heading: 'Looking Back to the Dawn of Time',
        body: 'Because light takes time to travel cosmic distances, infrared space telescopes act as time machines, capturing photons emitted over 13 billion years ago just after the Big Bang.'
      }
    ]
  },
  'study-14': {
    title: 'The Uncanny Valley: Why Almost-Human Faces Evoke Deep Unease in Robotics & CGI',
    summary: 'The evolutionary psychology and perceptual neuroscience behind our visceral discomfort when encountering androids that look almost—but not quite—human.',
    source: 'Wikipedia · Uncanny Valley',
    date: 'Psychology Lab',
    recommendationReason: 'Explore the psychological boundaries of human facial perception, robotics design, and synthetic avatars.',
    keyPoints: [
      'The perceptual cliff where emotional affinity plummets as artificial realism reaches near-human fidelity.',
      'Evolutionary disease-avoidance hypotheses flagging subtle facial asymmetry or unnatural eye movements.',
      'Design strategies in robotics and animation intentionally stylizing characters to stay safely outside the valley.'
    ],
    sections: [
      {
        heading: 'The Origin of the Uncanny Curve',
        body: 'In 1970, roboticist Masahiro Mori hypothesized that as robots appear more human, our emotional response becomes increasingly positive—until a point where subtle flaws turn admiration into sudden revulsion.'
      },
      {
        heading: 'Evolutionary Defense Mechanisms in Action',
        body: 'Evolutionary psychologists suggest this unease is a vital survival adaptation designed to keep humans away from diseased corpses or individuals carrying contagious pathogens with altered motor behaviors.'
      },
      {
        heading: 'Navigating the Valley in Modern Animation and AI',
        body: 'Studios like Pixar deliberately stylize characters with enlarged eyes and exaggerated proportions to bypass the uncanny valley, creating warm, emotionally resonant digital beings.'
      }
    ]
  },
  'study-15': {
    title: 'What Happens Inside the Brain When Solving Puzzles: Working Memory & Insight Moments',
    summary: 'The neurodynamics of problem-solving: Cognitive flexibility, working memory buffers, and the sudden \'Aha!\' spark of creative illumination.',
    source: 'Wikipedia · Puzzles & Cognition',
    date: 'Cognitive Psychology',
    recommendationReason: 'Understand how playful puzzles sharpen logical deduction, pattern recognition, and intellectual adaptability.',
    keyPoints: [
      'Prefrontal cortex managing working memory buffers while systematically testing candidate solutions.',
      'Pattern recognition linking fragmented spatial and numerical clues into coherent heuristics.',
      'The \'Eureka\' moment: How incubation periods during rest spark spontaneous creative breakthroughs.'
    ],
    sections: [
      {
        heading: 'Working Memory as an Intellectual Workbench',
        body: 'When tackling complex puzzles like Sudoku or chess tactics, your prefrontal cortex holds multiple provisional moves in mind simultaneously, testing outcomes before committing to action.'
      },
      {
        heading: 'Pattern Recognition and Heuristics',
        body: 'Experienced puzzle solvers develop visual and mathematical heuristics that immediately eliminate dead-end choices, transforming broad searches into lightning-fast intuitive decisions.'
      },
      {
        heading: 'The Neuroscience of the \'Eureka\' Flash',
        body: 'When you step away from a stuck puzzle to shower or take a walk, the brain\'s default mode network continues subconscious association, suddenly connecting distant neural circuits in a flash of insight.'
      }
    ]
  },
  'study-16': {
    title: 'The Magic of Raw Ingredients Becoming Cuisine: The Science of Cooking Chemistry',
    summary: 'Protein denaturation, starch gelatinization, the Maillard reaction, and how heat transforms molecular structures into mouthwatering flavors.',
    source: 'Wikipedia · Culinary Science',
    date: 'Culinary Science',
    recommendationReason: 'Learn the fascinating chemical reactions that dictate flavor, texture, and aroma in everyday cooking.',
    keyPoints: [
      'Protein denaturation uncoiling tight molecular bonds into tender, flavorful textures.',
      'The Maillard reaction between amino acids and reducing sugars creating golden-brown crusts and deep umami aromas.',
      'The evolutionary significance of cooking in unlocking calorie density that propelled human brain expansion.'
    ],
    sections: [
      {
        heading: 'Denaturation and Gelatinization: Restructuring Texture',
        body: 'Applying heat breaks hydrogen bonds inside proteins, causing them to unfold and coagulate into tender morsels. In starches, heat and water cause granules to swell and gelatinize, creating silky sauces.'
      },
      {
        heading: 'The Maillard Reaction: The Holy Grail of Flavor',
        body: 'Above 140°C, amino acids react with sugars on searing meats and baking breads, generating hundreds of new aromatic compounds responsible for savory, roasted, and nutty notes.'
      },
      {
        heading: 'Cooking as the Spark of Human Evolution',
        body: 'Anthropologists note that harnessing fire to cook predigested food allowed early hominids to absorb vastly more calories with minimal digestive energy, directly fueling our rapid cranial encephalization.'
      }
    ]
  },

  // --- CULTURE ---
  'culture-2': {
    title: 'Appreciating Contemporary Art Without a Docent: Deciphering Concepts and Context',
    summary: 'A friendly guide to exploring modern art galleries: Slow looking, understanding medium choices, and embracing open interpretation.',
    source: 'National Museum of Korea · Curator Talk',
    date: 'Today',
    recommendationReason: 'Overcome the intimidation of abstract and contemporary art with intuitive visual exploration tools.',
    keyPoints: [
      'Why contemporary art feels abstract: It questions the definition and social context of art itself.',
      'The practice of \'Slow Looking\': Putting away smartphones to gaze at a single artwork for a full uninterrupted minute.',
      'Deciphering clues hidden inside the gallery wall caption\'s \'Medium\' and exhibition statement.'
    ],
    sections: [
      {
        heading: 'Why Does Contemporary Art Feel Cryptic?',
        body: 'Historically, art focused on realistic representation. Contemporary art shifted its axis toward conceptual questions: What can be art? Who decides value? Embracing ambiguity is the first step.'
      },
      {
        heading: 'Slow Looking: The Lost Art of Contemplation',
        body: 'Studies show the average gallery visitor looks at an artwork for just 8 seconds before snapping a photo. Spending a full 60 seconds reveals unexpected brushstroke textures and emotional nuances.'
      },
      {
        heading: 'Finding Narrative Clues in the Caption',
        body: 'Check the medium listed on the placard. If an artist uses discarded plastics or volcanic ash instead of oil paint, the material itself holds the core narrative message of the exhibition.'
      }
    ]
  },
  'culture-3': {
    title: 'Relaxing Jazz Piano Radio: Warm Ambient Melodies for Deep Focus and Creative Work',
    summary: 'Gentle, comforting acoustic jazz piano chords perfect for background work, reading, programming, and evening relaxation.',
    source: 'Lofi Girl · ChilledCow',
    date: 'Featured Video',
    recommendationReason: 'Gentle acoustic piano harmonies that reduce stress and promote uninterrupted flow states.'
  },
  'culture-4': {
    title: '\'Text Hip\' in the Shorts Era: Why Gen Z is Passionately Turning to Physical Books',
    summary: 'Amid digital fatigue from TikTok and YouTube Shorts, young generations are rediscovering physical books as stylish, tactile cultural totems.',
    source: 'Cine21 · Independent & Art Cinema',
    date: '3d ago',
    recommendationReason: 'Analyzes modern cultural counter-movements embracing analog tactile depth amidst digital overload.',
    keyPoints: [
      'The rise of \'Text Hip\': Turning reading and book ownership into an aesthetic statement of intellectual discernment.',
      'The irreplaceable tactile sensory weight of paper texture, binding scents, and margin annotations.',
      'Independent bookstores evolving into cultural salons curating community and thoughtful conversation.'
    ],
    sections: [
      {
        heading: 'Why Seek Long Texts in an Era of Hyper-Short Clips?',
        body: 'When dopamine-chasing algorithms flood feeds with 15-second videos, cognitive exhaustion naturally follows. Physical books offer a slow sanctuary where readers govern their own pacing and thoughts.'
      },
      {
        heading: 'The Tactile Object Quality of Physical Books',
        body: 'Holding paper, flipping pages, and feeling paper grain connects physical touch to intellectual consumption, transforming paper books into cherished artistic objects on personal shelves.'
      },
      {
        heading: 'The Aesthetic Curation of Indie Bookstores',
        body: 'Neighborhood independent bookshops curate hand-picked themes, hosting evening reading circles and conversation clubs that foster authentic, intimate human connections.'
      }
    ]
  },
  'culture-6': {
    title: 'Theater Etiquette and Seat Selection: An Essential Primer for Musical First-Timers',
    summary: 'A comprehensive guide from picking the best acoustic and sightline zones to intermission timing and respectful curtain call applause.',
    source: 'Cine21 · Independent & Art Cinema',
    date: '5d ago',
    recommendationReason: 'Essential theater tips to maximize your immersion and visual appreciation at stage performances.',
    keyPoints: [
      'The golden acoustic sweet spot: Rows 7 through 12 in the center stalls balance stereo mix and visual angles.',
      'Making the most of 20-minute intermissions: Pre-ordering refreshments and avoiding restroom bottlenecks.',
      'Respectful viewing etiquette: Keeping phone screens dark and holding applause for musical endings.'
    ],
    sections: [
      {
        heading: 'Deciphering the Theater Seating Chart',
        body: 'Sitting too close in row 1 strains your neck and drowns out orchestral balance. The acoustic golden zone sits around rows 8 to 12 in the center orchestra, offering panoramic views of choreographies.'
      },
      {
        heading: 'Navigating the 20-Minute Intermission',
        body: 'Intermission flies by quickly. Head directly to the restroom when house lights rise, or preorder interval drinks beforehand to relax and discuss act one with companions.'
      },
      {
        heading: 'Etiquette that Protects Communal Immersion',
        body: 'Live theater is an intimate shared acoustic bubble. Keeping phones completely powered off and saving applause until the musical chord finishes ensures magical immersion for all.'
      }
    ]
  },
  'culture-8': {
    title: 'Independent and Art Cinema Highlights of the Year: Film Festival Curations',
    summary: 'A curated selection of visionary independent films from Cannes, Venice, and Busan that defy commercial Hollywood formulas.',
    source: 'IndieSpace · Art Film Archive',
    date: '1w ago',
    recommendationReason: 'Discover poetic, provocative independent cinema that expands empathy and visual imagination.',
    keyPoints: [
      'Cinema that breathes: Exploring deliberate pacing, deep silence, and poetic visual mise-en-scène.',
      'Intimate character studies that illuminate underrepresented human conditions and ethical questions.',
      'Curated recommendations to transform your quiet weekend evening into a festival screening.'
    ],
    sections: [
      {
        heading: 'Cinema Blooming Behind Commercial Formulas',
        body: 'Away from predictable blockbuster tropes, independent cinema explores raw human vulnerabilities and social complexities, using film as a profound medium of personal reflection.'
      },
      {
        heading: 'The Poetics of Silence and Negative Space',
        body: 'Visionary directors use lingering ambient soundscapes and quiet pauses to give audiences room to contemplate characters\' internal turmoil without manipulative musical cues.'
      },
      {
        heading: 'Curated Recommendations for Tonight',
        body: 'Explore intimate coming-of-age tales and atmospheric neo-realist cinema that linger in your heart for weeks long after the end credits roll.'
      }
    ]
  },
  'culture-9': {
    title: 'Traditional Heritage on the Global Stage: The Modern Reinterpretation of K-Culture',
    summary: 'How Hanbok fashion, Hanok architecture, and artisan crafts are reimagined as sleek contemporary design icons across the world.',
    source: 'Wikipedia · Korean Traditional Culture',
    date: 'Cultural Heritage',
    recommendationReason: 'Explore how ancient Korean craftsmanship and design philosophies inspire modern architecture and global fashion.',
    keyPoints: [
      'The five pillars of Korean heritage: Hansik, Hanbok, Hanji, Hangul, and Hanok.',
      'Contemporary designers incorporating traditional natural dyes and minimalist silhouettes.',
      'Global digital platforms celebrating living heritage through immersive modern storytelling.'
    ],
    sections: [
      {
        heading: 'The Five Aesthetic Pillars of Korean Heritage',
        body: 'From the ergonomic beauty of Hangul letterforms to the breathable comfort of Hanok wood-and-stone structures, traditional Korean design embodies harmony with natural cycles.'
      },
      {
        heading: 'Traditional Aesthetics in Contemporary Lifestyles',
        body: 'Modern industrial designers are incorporating Hanji paper into acoustic lamps and crafting minimalist streetwear inspired by traditional Hanbok drapery, finding fresh global acclaim.'
      },
      {
        heading: 'A Living Heritage Celebrated Worldwide',
        body: 'Rather than sitting behind museum glass, traditional pottery, tea rituals, and music are embraced by youth worldwide as sophisticated, sustainable lifestyle choices.'
      }
    ]
  },
  'culture-10': {
    title: 'Immersive Traditional Heritage: Experiencing Historic Hanok Estates and Tea Culture',
    summary: 'Stepping into preserved Joseon scholar academies and historic estates to experience mindful tea ceremonies and calligraphic arts hands-on.',
    source: 'Wikipedia · Korean Traditional Culture',
    date: 'Living Heritage',
    recommendationReason: 'A weekend guide to experiencing historic architecture, serene tea ceremonies, and mindfulness in nature.',
    keyPoints: [
      'Restored historic estates offering immersive weekend stay programs away from urban hustle.',
      'The multi-sensory art of Korean tea ceremonies (Dado): Aroma, visual clarity, and temperature mindfulness.',
      'Family-friendly heritage workshops blending history, traditional confectionery, and landscape exploration.'
    ],
    sections: [
      {
        heading: 'Historic Estates Reborn as Welcoming Retreats',
        body: 'Century-old scholar academies (Seowon) and traditional estates have opened their wooden gates, allowing travelers to sleep on heated ondol floors and listen to rain tapping against clay roof tiles.'
      },
      {
        heading: 'The Mindful Art of the Korean Tea Ceremony',
        body: 'Unlike fast-paced espresso routines, the slow pouring and contemplation of green tea teaches patience and sensory awareness, soothing frayed modern nerves.'
      },
      {
        heading: 'Weekend Escapes for the Whole Family',
        body: 'From natural indigo dye workshops to woodblock printing, hands-on cultural programs provide joyful, tactile bonding experiences across generations.'
      }
    ]
  },
  'culture-11': {
    title: 'The History and Phenomenon of Pokémon: From Game Boy Cartridge to Global Cultural Icon',
    summary: 'The 30-year evolution of the Pokémon franchise: Satoshi Tajiri\'s insect-collecting childhood memories, social trading, and global transmedia synergy.',
    source: 'Wikipedia · Pokémon Franchise',
    date: 'Pop Culture Archive',
    recommendationReason: 'A cultural and business study of the world\'s most profitable entertainment franchise and social gaming phenomenon.',
    keyPoints: [
      'The humble origin: Capturing the nostalgic magic of childhood bug collecting on a Game Boy link cable.',
      'The core triumvirate of gameplay: Collect, Train, and Trade fostering real-world friendships.',
      'Flawless transmedia integration across anime, trading cards, mobile AR, and retail empires.'
    ],
    sections: [
      {
        heading: 'A Legend Born on a Tiny Monochrome Screen',
        body: 'In 1996, Satoshi Tajiri channeled his childhood memories of catching beetles in rural forests into a portable RPG, creating a digital world where players could capture magical creatures.'
      },
      {
        heading: 'Social Connectivity as Game Mechanics',
        body: 'By requiring players to use a physical Link Cable to trade monsters exclusive to Red or Blue versions, Pokémon pioneered social networking through video gaming long before social media existed.'
      },
      {
        heading: 'The Apex of Global Transmedia Empires',
        body: 'By synchronizing video games with a hit animated television series, physical trading cards, and movies, Pokémon became the highest-grossing media franchise in entertainment history.'
      }
    ]
  },
  'culture-12': {
    title: 'Narrative Architecture in Television Dramas: Pacing, Cliffhangers & Emotional Resonance',
    summary: 'How scriptwriters structure episode arcs, develop multifaceted character flaws, and weave societal themes into compelling living-room dramas.',
    source: 'Wikipedia · Television Drama',
    date: 'Media Studies',
    recommendationReason: 'Analyze the storytelling engines and psychological hooks that make episodic dramas universally captivating.',
    keyPoints: [
      'The rise of serialized television as the dominant modern novel of our cultural era.',
      'Three-act episode structures ending on carefully calibrated cliffhangers to sustain suspense.',
      'Reflecting contemporary societal anxieties, family dynamics, and justice themes through character choices.'
    ],
    sections: [
      {
        heading: 'Television as the Modern Novel',
        body: 'With hours of narrative real estate, television dramas allow character arcs to breathe and evolve slowly, exploring moral ambiguities that standard two-hour films must truncate.'
      },
      {
        heading: 'The Anatomy of the Episodic Cliffhanger',
        body: 'Master screenwriters structure each episode with clear micro-resolutions while ending on unresolved narrative questions that spark passionate water-cooler debate.'
      },
      {
        heading: 'Reflecting the Zeitgeist of Society',
        body: 'From workplace dramas tackling corporate inequality to family sagas exploring changing gender roles, episodic series hold a mirror to contemporary social shifts.'
      }
    ]
  },
  'culture-13': {
    title: 'Defining the Adolescent Mind: Distinct Psychological and Social Milestones',
    summary: 'Inside the teenage brain: The limbic system developing ahead of the prefrontal cortex, peer identity formation, and supporting emotional transitions.',
    source: 'Wikipedia · Adolescent Psychology',
    date: 'Developmental Psychology',
    recommendationReason: 'Insights into cognitive and emotional transformations during youth to foster deeper empathy across generations.',
    keyPoints: [
      'The transitional bridge between dependent childhood and autonomous adult identity.',
      'Neurodevelopmental imbalance: Reward centers surge while executive risk-assessment matures into the mid-20s.',
      'The supportive role of educators, family communication, and constructive creative outlets.'
    ],
    sections: [
      {
        heading: 'The Great Psychological Metamorphosis',
        body: 'Adolescence is not merely a biological growth spurt; it is a profound identity revolution where individuals construct their moral boundaries and question inherited social norms.'
      },
      {
        heading: 'The Neurobiology of Risk and Passion',
        body: 'During teenage years, the emotional limbic system reaches full maturity while the rational prefrontal cortex is still pruning synapses, explaining heightened emotional sensitivity and boldness.'
      },
      {
        heading: 'The Power of Empathetic Mentorship',
        body: 'Providing teenagers with safe environments to take healthy risks, express artistic identity, and discuss doubts without fear of judgment anchors lifelong emotional resilience.'
      }
    ]
  },
  'culture-14': {
    title: 'The Evolution and Identity of American Popular Culture: A Global Mosaic',
    summary: 'How immigrant traditions, African American musical roots, Hollywood cinema, and consumer technology blended into an influential global cultural export.',
    source: 'Wikipedia · American Culture',
    date: 'Cultural Anthropology',
    recommendationReason: 'Explore how historical migrations, democratic ideals, and industrial media shaped the landscape of modern popular entertainment.',
    keyPoints: [
      'The cultural melting pot blending European, African, and Indigenous heritages into distinct art forms.',
      'Jazz, blues, rock, and hip-hop as foundational musical revolutions born from community struggle.',
      'Hollywood and Silicon Valley acting as global conduits projecting narrative archetypes worldwide.'
    ],
    sections: [
      {
        heading: 'A Mosaic Forged Through Migration',
        body: 'American culture is not a monolithic heritage but a dynamic mosaic where immigrant communities constantly cross-pollinated food, language, and artistic expressions.'
      },
      {
        heading: 'The African American Roots of Modern Sound',
        body: 'From Delta blues and New Orleans jazz to Motown soul and Bronx hip-hop, African American innovators created the rhythmic and harmonic vocabulary that underpins global popular music.'
      },
      {
        heading: 'Cinema and the Export of Narrative Ideals',
        body: 'Through the silver screens of Hollywood, American storytelling popularized ideals of individual freedom, optimism, and reinvention, shaping cultural aspirations worldwide.'
      }
    ]
  },
  'culture-15': {
    title: 'Sungnyung: The Cultural and Digestive Wisdom of Scorched Rice Tea in Korean Living',
    summary: 'The culinary origins of toasted rice tea brewed in traditional cast-iron cauldrons: Enzymatic digestion, warmth, and the comforting finish of Korean dining.',
    source: 'Wikipedia · Sungnyung (Scorched Rice Tea)',
    date: 'Culinary History',
    recommendationReason: 'Discover the zero-waste heritage and gentle digestive science behind Korea\'s oldest traditional post-meal beverage.',
    keyPoints: [
      'Born from cast-iron cauldrons (Gamasot) naturally toasting bottom rice into crispy Nurungji.',
      'Enzymatic and dextrin benefits soothing the digestive tract after robust, savory meals.',
      'A distinctive culinary symbol of warmth, zero waste, and communal hospitality across generations.'
    ],
    sections: [
      {
        heading: 'Born from the Cast-Iron Cauldron',
        body: 'When traditional Korean cooks scooped rice from heavy iron Gamasot cauldrons, a golden, nutty layer of scorched rice remained. Boiling water poured over this crust created Sungnyung.'
      },
      {
        heading: 'Digestive Chemistry in a Bowl',
        body: 'The toasting process breaks down starches into easily digestible dextrins. Drinking warm Sungnyung after salty or spicy dishes washes the palate and gently settles stomach acid.'
      },
      {
        heading: 'Hospitality and Zero-Waste Philosophy',
        body: 'Serving piping-hot Sungnyung to guests marked the harmonious conclusion of a shared meal, embodying an ancient Korean ethos where nothing cultivated with care went to waste.'
      }
    ]
  },
  'culture-16': {
    title: 'The Platform Architecture of Food Delivery: Urban Logistics, Apps & Dining Lifestyles',
    summary: 'How mobile dispatch algorithms, cloud kitchens, and two-sided marketplaces transformed metropolitan culinary culture and everyday dinner tables.',
    source: 'Wikipedia · Food Delivery Platforms',
    date: 'Urban Sociology',
    recommendationReason: 'An analytical look into how mobile delivery networks alter city traffic, restaurant business models, and household dining habits.',
    keyPoints: [
      'Routing algorithms pairing rider coordinates, kitchen prep times, and traffic data in real time.',
      'The rise of cloud kitchens and ghost restaurants optimized entirely for online app storefronts.',
      'Shifting social rituals from home cooking and formal restaurant visits toward on-demand dining convenience.'
    ],
    sections: [
      {
        heading: 'The Algorithmic Orchestration of Urban Dinners',
        body: 'Behind every delivery app lies an intricate dispatch engine balancing kitchen preparation estimations, rider locations, traffic bottlenecks, and customer delivery windows in milliseconds.'
      },
      {
        heading: 'The Ghost Kitchen Revolution',
        body: 'Eliminating the need for prime street-level retail space, commercial ghost kitchens allow innovative chefs to test regional menus with minimal overhead and rapid iteration.'
      },
      {
        heading: 'The Evolving Definition of the Family Meal',
        body: 'While delivery apps offer unmatched convenience for busy households, sociologists also examine the changing social rituals as collective family cooking is increasingly outsourced to mobile platforms.'
      }
    ]
  },
  'culture-17': {
    title: 'The Dynamic Flavor Balance of Thai Cuisine: Sweet, Sour, Spicy, and Umami Harmonies',
    summary: 'A culinary journey through Southeast Asia: Fresh lemongrass, galangal, kaffir lime, and the aromatic balance that makes Thai food globally irresistible.',
    source: 'Wikipedia · Thai Cuisine',
    date: 'Gastronomy Culture',
    recommendationReason: 'Learn how contrasting aromatics and herbs create one of the most vibrant flavor profiles in global gastronomy.',
    keyPoints: [
      'The sacred quartet of Thai cooking: balancing sweet palm sugar, tart lime, fiery chilis, and savory fish sauce.',
      'Aromatic herb bouquets of lemongrass, galangal, cilantro roots, and crushed kaffir lime leaves.',
      'Regional diversity from the coconut curries of the south to the fiery herbal salads of the northeastern Isan plateau.'
    ],
    sections: [
      {
        heading: 'The Symphony of Four Flavors',
        body: 'Thai chefs strive for dynamic tension in every dish. A single spoonful of Tom Yum soup simultaneously sparks sharp lime acidity, deep fish sauce umami, chili heat, and a mellow sweetness.'
      },
      {
        heading: 'Fresh Aromatics Over Dried Spices',
        body: 'Unlike cuisines that rely heavily on dried spice powders, Thai cooking pounds fresh rhizomes and bruised leaves in stone mortars, preserving lively, volatile herbal oils.'
      },
      {
        heading: 'Rich Regional Diversity',
        body: 'From the rich coconut-infused curries of the lush southern peninsula to the pungent herbal broths of the northern mountains, Thailand\'s geography offers endless gastronomic wonder.'
      }
    ]
  },
  'culture-18': {
    title: 'Regional Gastronomy Across China: Eight Great Culinary Traditions and Philosophy',
    summary: 'From Sichuan numbing spice and Cantonese seafood delicacy to Shandong banquets: How geography and Taoist balance shape Chinese culinary heritage.',
    source: 'Wikipedia · Chinese Culinary Traditions',
    date: 'East Asian Food Culture',
    recommendationReason: 'Explore the vast regional diversity, wok hei techniques, and communal dining philosophies of Chinese culinary culture.',
    keyPoints: [
      'The Eight Great Culinary Traditions reflecting distinct climates, trade routes, and local agriculture.',
      'Wok Hei: The breath of the wok imparting smoky complexity through high-heat searing.',
      'Dining as communal harmony: Shared circular lazy Susans and the philosophical balance of Yin and Yang.'
    ],
    sections: [
      {
        heading: 'The Eight Great Regional Schools',
        body: 'China\'s vast geography gave birth to eight distinct culinary canons—from the numbing peppercorn heat of Sichuan to the light, ingredient-focused steamed delicacies of coastal Canton.'
      },
      {
        heading: 'Wok Hei: The Elusive Breath of the Wok',
        body: 'Master chefs manipulate scorching cast-iron woks over roaring flames, vaporizing micro-droplets of oil to impart a prized smoky essence into flash-fried vegetables and meats.'
      },
      {
        heading: 'Food as Medicine and Harmony',
        body: 'Rooted in traditional medicine, Chinese cuisine pairs warming and cooling ingredients to promote bodily equilibrium, using shared banquets as joyful celebrations of family unity.'
      }
    ]
  },
  'culture-19': {
    title: 'Everyday Aesthetics on the Japanese Dining Table: Seasonality, Vessel & Balance',
    summary: 'The philosophy of Ichiju-sansai (one soup, three dishes), seasonal ingredients (Shun), and visual harmony in traditional Japanese dining.',
    source: 'Wikipedia · Japanese Gastronomy',
    date: 'Japanese Culinary Heritage',
    recommendationReason: 'Gain insight into the refined visual presentation, fermentation heritage, and seasonal mindfulness of Washoku dining.',
    keyPoints: [
      'Ichiju-Sansai: The nutritional balance of steamed rice, dashi miso soup, and three complementary side dishes.',
      'Celebrating \'Shun\': The fleeting peak moment when a fish, vegetable, or mushroom tastes at its absolute prime.',
      'Vessel aesthetics: Choosing handmade ceramics and lacquerware that mirror the changing seasons.'
    ],
    sections: [
      {
        heading: 'The Balanced Geometry of Ichiju-Sansai',
        body: 'Traditional Japanese tables follow an ergonomic formula: rice on the left, soup on the right, and three seasonal dishes arranged behind, ensuring nutritional harmony and mindful eating.'
      },
      {
        heading: 'The Ephemeral Beauty of Shun',
        body: 'Japanese cuisine reveres \'Shun\'—the fleeting 10-day window when seasonal produce possesses peak sweetness and fragrance, connecting diners intimately with nature\'s calendar.'
      },
      {
        heading: 'Visual Harmony Through Ceramics',
        body: 'An old proverb says: \'Japanese food is eaten with the eyes.\' Irregular earthenware bowls in autumn and cool translucent glassware in summer reflect the seasonal environment outside.'
      }
    ]
  },
  'culture-20': {
    title: 'Combining Live Action with Open-Source CGI: The Legacy of \'Tears of Steel\'',
    summary: 'How the Blender Foundation proved that open-source software and open licenses can produce studio-caliber visual effects and sci-fi cinema.',
    source: 'Wikipedia · Tears of Steel (Open Movie)',
    date: 'Open Source Cinema',
    recommendationReason: 'A milestone study in open-source creativity, digital visual effects, and collective global collaboration.',
    keyPoints: [
      'Live-action footage shot in Amsterdam blended with full 3D robotic armatures and post-apocalyptic environments.',
      'Blender open-source 3D suite used for camera tracking, compositing, color grading, and rendering.',
      'Creative Commons licensing releasing all project assets, scripts, and 3D rigs freely for global learners.'
    ],
    sections: [
      {
        heading: 'A Bold Experiment in Open-Source Cinema',
        body: 'In 2012, the Blender Foundation brought international VFX artists to Amsterdam to shoot a live-action science-fiction short, aiming to push open-source tools to professional Hollywood limits.'
      },
      {
        heading: 'Breakthroughs in Open-Source Visual Pipelines',
        body: 'Production of \'Tears of Steel\' drove major improvements in Blender\'s native motion tracking, green-screen keying, and node-based compositing, proving proprietary software was no longer mandatory.'
      },
      {
        heading: 'The Generosity of Open Collaboration',
        body: 'Every digital asset, raw 4K camera frame, and textured 3D mech model was released freely to the public under Creative Commons licenses, providing an invaluable masterclass for aspiring digital filmmakers.'
      }
    ]
  },
  'culture-21': {
    title: 'The Evolutionary History of Song: From Prehistoric Chants to Modern Recorded Music',
    summary: 'Why humans sing: The social bonding of communal singing, acoustic storytelling, and the recording technology revolution.',
    source: 'Wikipedia · History of Song & Singing',
    date: 'Music History',
    recommendationReason: 'An anthropological and musicological survey of how human voice and melodic harmony shaped civilization.',
    keyPoints: [
      'Singing as an ancient communal bonding tool pre-dating complex spoken syntactical language.',
      'Troubadours, bards, and folk songs transmitting historical lore and moral philosophy across generations.',
      'The 20th-century recording revolution transforming singing from ephemeral live moments into universal global culture.'
    ],
    sections: [
      {
        heading: 'The Voice as Our First Musical Instrument',
        body: 'Evolutionary anthropologists believe rhythmic vocalizing helped early hominids synchronize group emotions, sooth infants, and build tribal solidarity long before written words existed.'
      },
      {
        heading: 'The Bardic Tradition of Oral History',
        body: 'Across ancient civilizations, traveling bards encoded genealogical histories, heroic epics, and moral philosophies into rhyming verses that could be easily remembered and sung by heart.'
      },
      {
        heading: 'The Phonograph and Democratic Listening',
        body: 'The invention of sound recording liberated music from physical performance halls, allowing human voices from every continent to resonate inside living rooms around the world.'
      }
    ]
  },
  'culture-22': {
    title: 'How Feminist Movements Reshaped Society: Suffrage, Workplace Rights & Modern Discourse',
    summary: 'A historical reflection on feminist milestones: The fight for voting rights, reproductive autonomy, workplace pay equity, and contemporary intersectional solidarity.',
    source: 'Wikipedia · Feminist Movements',
    date: 'Social History',
    recommendationReason: 'A historical and sociological overview of civil rights milestones that expanded legal, social, and economic equality.',
    keyPoints: [
      'First-wave suffrage movements securing fundamental constitutional voting rights for women.',
      'Second and third waves breaking professional barriers, advocating equal workplace pay, and challenging cultural stereotypes.',
      'Contemporary intersectional dialogues championing universal human dignity across diverse backgrounds.'
    ],
    sections: [
      {
        heading: 'The Battle for the Ballot: First-Wave Suffrage',
        body: 'In the late 19th and early 20th centuries, courageous suffragettes endured imprisonment and public ridicule to win the foundational democratic right to vote and hold public office.'
      },
      {
        heading: 'Dismantling Institutional Barriers',
        body: 'Mid-20th-century feminist movements expanded the struggle into higher education, corporate boardrooms, and legal protections against domestic violence and workplace discrimination.'
      },
      {
        heading: 'Intersectional Solidarity in the 21st Century',
        body: 'Modern feminist discourse recognizes that gender equality intersects deeply with socioeconomic class, ethnicity, and disability, working toward universal justice for all marginalized communities.'
      }
    ]
  },
  'culture-23': {
    title: 'The Culture of Omakase: Chef\'s Intuition, Seasonality & Gastronomic Storytelling',
    summary: 'Entrusting your dinner to the chef: Counter-side dialogue, knife craftsmanship, fish aging techniques, and the modern experience economy of fine dining.',
    source: 'Wikipedia · Omakase Dining Culture',
    date: 'Gourmet Trends',
    recommendationReason: 'Understand the culinary etiquette, knife mastery, and hospitality philosophy behind personalized omakase dining.',
    keyPoints: [
      'Omakase literally meaning \'I leave it up to you\': A relationship of trust between diner and artisan chef.',
      'Counter seating turning dining into an intimate, front-row theatrical performance of precision knife work.',
      'A cultural manifestation of the modern experience economy where diners invest in authentic craftsmanship.'
    ],
    sections: [
      {
        heading: 'The Philosophy of Trust: Entrusting Your Meal',
        body: 'Unlike ordering from fixed menus, omakase asks the guest to surrender control to the chef, who curates a bespoke succession of dishes based on morning fish-market catches and guest reactions.'
      },
      {
        heading: 'Intimate Counter Hospitality (Omotenashi)',
        body: 'Sitting directly across from the master allows diners to observe knife angles, precise rice seasoning temperatures, and subtle culinary pacing, fostering warm personal connection.'
      },
      {
        heading: 'The Rise of Experiential Gastronomy',
        body: 'In modern cities, omakase has expanded into hanwoo beef, coffee, and dessert bars, reflecting consumers\' desire to trade mass consumption for bespoke, memorable artisanal encounters.'
      }
    ]
  },

  // --- HOBBY ---
  'hobby-1': {
    title: 'Running Form Fundamentals: Midfoot Landing, Cadence & Knee Injury Prevention',
    summary: 'The biomechanics of safe running: Why overstriding ruins knee joints, how to establish a 180 SPM cadence, and upright core posture.',
    source: 'YouTube · Running Fundamentals',
    date: 'Must Watch',
    recommendationReason: 'Essential mechanics guide for runners of all levels to enjoy effortless strides without shin splints or knee pain.'
  },
  'hobby-2': {
    title: 'Home Hand-Drip Pour Over Essentials: Roasting Profiles, Grind Size & Water Ratios',
    summary: 'A step-by-step masterclass: Blooming timers, pouring circles, water temperatures, and choosing between Hario V60 and Kalita Wave.',
    source: 'Specialty Coffee Association (SCA) Korea',
    date: 'Today',
    recommendationReason: 'Master specialty coffee brewing at home with precise extraction science and aromatic balance.',
    keyPoints: [
      'The holy triad of pour over: coffee bean freshness, uniform grind particle distribution, and 90~93°C water temperature.',
      'The blooming stage: 40 seconds of pre-wetting to degas CO2 and open the bed for optimal flavor extraction.',
      'Dripper geometry: Conical Hario V60 highlighting bright acidity vs flat-bottom Kalita Wave emphasizing sweet body.'
    ],
    sections: [
      {
        heading: 'The Three Decisive Variables in Every Cup',
        body: 'Hand-drip coffee is accessible science. Balancing freshly roasted beans, a 1:15 to 1:16 coffee-to-water ratio, and 92°C filtered water extracts sweet fruit notes while avoiding bitter over-extraction.'
      },
      {
        heading: 'Blooming: Opening Coffee\'s Lungs in 40 Seconds',
        body: 'Pouring twice the coffee\'s weight in hot water and pausing for 40 seconds allows trapped carbon dioxide gas to escape, creating a permeable coffee bed for uniform solvent extraction.'
      },
      {
        heading: 'Choosing Your Dripper: Conical vs Flat Bed',
        body: 'The conical Hario V60 features a single large exit hole and spiraled ribs, producing a bright, clean, tea-like clarity. The flat-bottom Kalita Wave slows flow rate, yielding rounded sweetness and rich body.'
      }
    ]
  },
  'hobby-4': {
    title: '5 Hardy Air-Purifying Indoor Plants That Thrive Even in Low Indirect Light',
    summary: 'Rescue your home garden: Understanding light thresholds, soil drainage, bottom-watering, and top air-cleaning houseplants for beginners.',
    source: 'National Institute of Forest Science · Indoor Gardening',
    date: '2d ago',
    recommendationReason: 'Beginner-friendly indoor plant care tips to green your living space and purify indoor air effortlessly.',
    keyPoints: [
      'The number one killer of indoor houseplants is chronic overwatering, not underwatering.',
      'Understanding indoor light: Bright indirect light near windows vs low light in corners.',
      'Top 5 beginner champions: Snake Plant, ZZ Plant, Pothos, Peace Lily, and Monstera.'
    ],
    sections: [
      {
        heading: 'Escaping the \'Plant Killer\' Curse',
        body: 'Most indoor plants perish from root rot caused by stagnant water in dense soil. Roots require oxygen as much as moisture. Always ensure pots have drainage holes and allow topsoil to dry before watering.'
      },
      {
        heading: 'Checking Soil and Bottom-Watering Secrets',
        body: 'Insert a wooden chopstick 3cm into the pot; if it comes out clean and dry, it is time to water. Bottom-watering by letting the pot sit in a saucer of water encourages deep, sturdy root growth.'
      },
      {
        heading: 'Top Beginner Indoor Plant Champions',
        body: 'Snake plants and ZZ plants thrive on neglect and handle dim light effortlessly. For trailing green aesthetics, resilient golden pothos forgives forgotten waterings while purifying air.'
      }
    ]
  },
  'hobby-5': {
    title: 'Authentic Korean-Style Aglio e Olio: Garlic-Infused Pasta with a Savory K-Twist',
    summary: 'Culinary secrets to rich pasta: Emulsifying starchy pasta water with olive oil, golden garlic browning, and a pinch of savory seasoned salt.',
    source: 'YouTube · Paik Jong-won Cooking',
    date: 'Featured Video',
    recommendationReason: 'Master the Italian classic with clever Korean home-cooking tips for rich, non-greasy garlic pasta.'
  },
  'hobby-6': {
    title: 'iPad Drawing and Urban Sketching: Embracing Imperfection in Everyday Line Art',
    summary: 'Overcoming blank-canvas fear: Quick gesture doodles, traveling with a digital stylus, and building your personal color palette.',
    source: 'Urban Sketchers Archive',
    date: '4d ago',
    recommendationReason: 'Inspires creative confidence to capture everyday street scenes and travel memories through relaxing line sketches.',
    keyPoints: [
      'The magic of doodling: Erasing perfectionism by embracing wobbly, organic hand-drawn lines.',
      'Urban sketching philosophy: Recording the authentic sensory atmosphere of a travel moment in 15 minutes.',
      'Building signature digital color palettes with muted pastel tones and textured ink brushes.'
    ],
    sections: [
      {
        heading: 'Curing Blank Canvas Paralysis with Quick Doodles',
        body: 'Staring at an empty white digital canvas can be intimidating. Starting with loose, continuous contour lines without lifting your stylus trains your eye to see shapes rather than judgment.'
      },
      {
        heading: 'Urban Sketching: Preserving Travel Moments Forever',
        body: 'A digital sketch captures memories far more vividly than a quick smartphone snap. Sitting on a bench for 15 minutes to sketch a historic café cements the sound of chatter and the afternoon breeze into memory.'
      },
      {
        heading: 'Crafting Your Personal Color Palette',
        body: 'Limit each drawing to two or three harmonized colors. Using soft watercolor wash brushes with paper-texture overlays creates warm, inviting analog textures directly on your iPad.'
      }
    ]
  },
  'hobby-8': {
    title: 'Air Fryer Golden Butter Scones: Crisp on the Outside, Fluffy on the Inside',
    summary: 'The perfect weekend baking project: Cold butter \'sanding\' technique, creating flaky layers, and foolproof air fryer temperature settings.',
    source: 'Home Baking Laboratory',
    date: '1w ago',
    recommendationReason: 'Simple, fail-safe home baking guide to enjoy freshly baked European-style bakery scones in 20 minutes.',
    keyPoints: [
      'The golden rule of flaky scones: Keep unsalted butter icy cold until entering the oven.',
      'Sanding technique: Gently rubbing butter cubes into flour until pea-sized crumbs form.',
      'Air fryer baking secrets: 170°C for 15 minutes yields a golden crust and pillowy, moist interior.'
    ],
    sections: [
      {
        heading: 'The Ultimate Gateway to Home Baking: Scones',
        body: 'Unlike sourdough or macarons that require hours of proofing and exacting humidity control, buttery British scones come together in a single mixing bowl in under 15 minutes.'
      },
      {
        heading: 'Protect the Butter: Sanding and Layering',
        body: 'Never let your butter melt into the dough. Cold butter cubes expand into steam pockets during baking, creating signature flaky layers and a melt-in-your-mouth crumb.'
      },
      {
        heading: 'Air Fryer Settings for Golden Perfection',
        body: 'Preheat your air fryer to 180°C. Brush the tops of your cut scone triangles with milk or egg wash for a lustrous sheen, and bake at 170°C for 14 to 16 minutes until delightfully golden.'
      }
    ]
  },
  'hobby-9': {
    title: 'Doenjang Mayo Kimchi Fried Rice: An Addictive Savory Korean Fusion Recipe',
    summary: 'Why adding half a spoon of Korean fermented soybean paste and a swirl of mayonnaise elevates standard kimchi fried rice into restaurant-grade comfort food.',
    source: 'WorldSkills Korean Cuisine Archive',
    date: 'Cooking Tips',
    recommendationReason: 'A creative culinary hack that balances acidic kimchi with rich, savory fermented depth.',
    keyPoints: [
      'A teaspoon of Doenjang adds deep savory umami that rounds out sharp, fermented kimchi acidity.',
      'Coating cooked rice in mayonnaise before stir-frying separates individual grains for a non-soggy texture.',
      'Finishing with a crispy sunny-side-up egg and toasted seaweed strips for the ultimate comfort meal.'
    ],
    sections: [
      {
        heading: 'The Secret Flavor Weapon: Fermented Doenjang',
        body: 'Standard kimchi fried rice can sometimes taste overly sour or one-dimensional. Searing half a teaspoon of Korean fermented soybean paste with scallion oil adds deep umami undertones.'
      },
      {
        heading: 'Mayonnaise: The Grain-Separating Hack',
        body: 'Mixing a tablespoon of mayonnaise into chilled rice before adding it to the wok coats each grain in oil and egg lecithin, ensuring individual grains fry crisp rather than clumping.'
      },
      {
        heading: 'High-Heat Assembly and Plating',
        body: 'Stir-fry well-aged kimchi until caramelized, toss in the coated rice over roaring heat, and press against the bottom of the pan for a minute to achieve coveted crispy rice (Nurungji) bottoms.'
      }
    ]
  },
  'hobby-10': {
    title: 'Smartphone Photography Masterclass: Composition, Natural Lighting & Perspective',
    summary: 'Take professional photographs on your phone: Enabling 3x3 grid lines, reading natural directional light, and manual exposure locks.',
    source: 'Smartphone Photography Academy',
    date: 'Photography Tips',
    recommendationReason: 'Instantly transform everyday travel and food snapshots into striking, gallery-worthy photographs.',
    keyPoints: [
      'Always clean your camera lens glass to eliminate hazy light glare and smudged reflections.',
      'Activate the 3x3 grid rule of thirds, placing key subjects along intersecting grid lines.',
      'Tap and slide to manually lock focus and dial down exposure, preserving rich shadow details.'
    ],
    sections: [
      {
        heading: 'The Most Neglected Step: Cleaning Your Lens',
        body: 'Smartphone lenses pick up finger oils constantly in pockets. Wiping the lens with your shirt before snapping a photo eliminates fuzzy glare and instantly restores razor-sharp contrast.'
      },
      {
        heading: 'Reading the Direction of Natural Light',
        body: 'Harsh midday sun casts unflattering shadows. Look for soft window light or golden hour sidelight that sculpts gentle contours and rich dimensional textures on food and portraits.'
      },
      {
        heading: 'Tapping for Exposure Control',
        body: 'Smartphones tend to overexpose scenes. Tap on your subject to lock focus, then drag the sun slider down slightly; slightly darker exposure yields richer color saturation and prevents blown-out skies.'
      }
    ]
  },
  'hobby-11': {
    title: 'The Enduring Charm of SpongeBob SquarePants: Animation History & Cultural Impact',
    summary: 'Stephen Hillenburg\'s marine biology vision: Bikini Bottom\'s timeless optimism, hand-drawn character physics, and cross-generational pop culture legacy.',
    source: 'Wikipedia · SpongeBob SquarePants',
    date: 'Animation History',
    recommendationReason: 'A heartwarming celebration of creative character design, surreal nautical humor, and animation craftsmanship.',
    keyPoints: [
      'Created by marine science educator Stephen Hillenburg to celebrate eccentric underwater life.',
      'Timeless character dynamics: SpongeBob\'s boundless optimism juxtaposed with Squidward\'s weary realism.',
      'A global pop culture milestone spanning hundreds of episodes, feature films, and viral internet memes.'
    ],
    sections: [
      {
        heading: 'Marine Biology Meets Whimsical Animation',
        body: 'Before animating, creator Stephen Hillenburg taught marine science in California. SpongeBob was born from an educational comic book he drew to teach students about tidal pool sea creatures.'
      },
      {
        heading: 'Universal Comedy Rooted in Timeless Archetypes',
        body: 'The comedy of Bikini Bottom endures because it mirrors universal human archetypes—the cheerful workaholic sponge, the cynical clarinet-playing neighbor, and the penny-pinching crustacean boss.'
      },
      {
        heading: 'An Enduring Icon of Modern Pop Culture',
        body: 'Decades after its 1999 premiere, SpongeBob continues to inspire Broadway musicals, designer fashion collaborations, and millions of daily internet memes that connect multiple generations.'
      }
    ]
  },

  // --- COMPREHENSIVE DRAFTS & RESEARCH ---
  'tech-draft-1': {
    title: '2026 On-Device AI Paradigm: Ultra-Lightweight Neural Networks in Your Pocket',
    summary: 'How LLMs once dependent on massive server farms were compressed into sub-1-watt mobile silicon through NPU architectural innovation.',
    source: 'Toss Tech',
    date: 'Latest Tech',
    recommendationReason: 'Explore how quantized neural networks deliver fast, private AI computing directly on personal mobile devices.',
    keyPoints: [
      'Compression of billion-parameter models via INT4/INT8 quantization and pruning.',
      'Dedicated NPU hardware engines processing tokens with sub-watt power efficiency.',
      'Zero-latency, privacy-first local inference without cloud round-trip delays.'
    ],
    sections: [
      {
        heading: 'The Liberation from Cloud Datacenters',
        body: 'Early generative AI required high-power GPU server clusters. However, latency and privacy constraints catalyzed a rapid migration toward compact neural networks running on mobile silicon.'
      },
      {
        heading: 'NPU Hardware Acceleration and Quantization',
        body: 'Modern mobile SoCs integrate dedicated Neural Processing Units optimized for 8-bit and 4-bit integer matrix math, slashing memory footprints while sustaining high perceptual accuracy.'
      },
      {
        heading: 'The Future of Sovereign Personal Intelligence',
        body: 'On-device intelligence ensures sensitive photos, chats, and documents never leave the hardware boundary, giving users complete data sovereignty.'
      }
    ]
  },
  'study-draft-1': {
    title: 'Retrieval Practice Proven by Neuroscience: Why Passive Re-reading Fails',
    summary: 'Passive review creates an illusion of competence. Explore the synaptic mechanisms of active retrieval that forge permanent memory traces.',
    source: 'Harvard Business Review · Neuroscience Archive',
    date: 'Cognitive Science',
    recommendationReason: 'Transform passive reading into durable neural encoding through science-backed retrieval techniques.',
    keyPoints: [
      'Passive highlighting triggers surface recognition without deep neural consolidation.',
      'Active retrieval strengthens synaptic long-term potentiation (LTP).',
      'Spaced testing loops produce exponential retention gains compared to massed cramming.'
    ],
    sections: [
      {
        heading: 'The Illusion of Competence in Passive Reading',
        body: 'When re-reading familiar text, the brain mistakes ease of visual recognition for true intellectual mastery, leading to swift forgetting during real-world recall.'
      },
      {
        heading: 'Neurobiology of Synaptic Retrieval',
        body: 'Every time the brain struggles to retrieve a memory without looking at notes, neural pathways undergo Long-Term Potentiation (LTP), physically cementing synaptic connections.'
      },
      {
        heading: 'Practical Retrieval Systems for Daily Work',
        body: 'Close the book immediately after reading and write three key concepts from memory. Implementing self-quizzing and flashcards turns fleeting input into lasting mastery.'
      }
    ]
  },
  'culture-draft-1': {
    title: 'Spatial Branding in Seongsu & Hannam: The "Experience Economics" of Offline Pop-ups',
    summary: 'In an era dominated by e-commerce, why do global brands flock to expensive physical pop-up spaces? Unpacking the neurology of spatial emotion.',
    source: 'Cine21 · Independent & Art Feature',
    date: 'Spatial Trend',
    recommendationReason: 'Understand why tactile, multi-sensory physical spaces have become the ultimate brand differentiator in the digital age.',
    keyPoints: [
      'Digital channels offer friction-free buying but lack visceral emotional bonding.',
      'Multi-sensory physical spaces forge deep dopamine and memory associations.',
      'Pop-up venues operate as cultural media hubs designed for social sharing.'
    ],
    sections: [
      {
        heading: 'The Paradox of the Post-Digital Retail Era',
        body: 'While digital storefronts solved convenience, they flattened brands into identical two-dimensional screens. Brands now build physical spaces not to sell goods, but to forge unforgettable emotional memories.'
      },
      {
        heading: 'Multi-Sensory Architecture and Spatial Neurology',
        body: 'Custom architectural scents, tactile materials, ambient lighting, and curated acoustic soundscapes engage all human senses simultaneously, creating profound neural resonance.'
      },
      {
        heading: 'The Pop-Up as Ephemeral Cultural Media',
        body: 'Limited-run pop-up spaces create psychological urgency (FOMO) and act as scenic stages for consumer co-creation, generating millions of organic social media impressions.'
      }
    ]
  },
  'hobby-draft-1': {
    title: 'Zone 2 Running for Heart Health & Mitochondria: Why Slowing Down Makes You Faster',
    summary: 'Sprinting to exhaustion is not the most effective cardio. Dissecting the aerobic science that optimizes mitochondrial density and metabolic fat oxidation.',
    source: 'Lifestyle Magazine B',
    date: 'Health & Wellness',
    recommendationReason: 'Discover the cardiovascular physiology behind low-intensity aerobic training for sustainable athletic longevity.',
    keyPoints: [
      'Zone 2 training operates below the first lactate threshold, maximizing mitochondrial biogenesis.',
      'Trains cellular physiology to burn lipid fats efficiently rather than quickly depleting glycogen.',
      'Minimizes central nervous system fatigue and joint strain while building an immense cardiovascular base.'
    ],
    sections: [
      {
        heading: 'The Science of Low-Intensity Aerobic Base',
        body: 'Most recreational runners train too fast on easy days and too slow on hard days. Zone 2 training targets a conversational pace where lactate clearance matches lactate production.'
      },
      {
        heading: 'Mitochondrial Density and Lipid Metabolism',
        body: 'Zone 2 stimulates the growth of new cellular mitochondria and oxidative enzymes, transforming the body into an efficient engine capable of utilizing fatty acids as sustained fuel.'
      },
      {
        heading: 'Sustainable Longevity Without Burnout',
        body: 'By reducing cardiac strain and orthopedic pounding, Zone 2 running allows consistent weekly mileage volume without chronic inflammation or overtraining syndrome.'
      }
    ]
  },
  'study-2199': {
    title: 'Memory is Reconstruction, Not Storage: Synaptic Plasticity & the Neuroscience of Retrieval',
    summary: 'Why passive re-reading creates an illusion of learning. How synaptic plasticity and Long-Term Potentiation (LTP) physically rewire the brain during active retrieval.',
    source: 'Nature Neuroscience · Cognitive Review',
    date: 'Neuroscience',
    recommendationReason: 'Deep dive into neurobiology showing how challenging retrieval rewires brain circuitry for permanent retention.',
    keyPoints: [
      'Synaptic plasticity and NMDA receptor activation during active recall.',
      'Long-Term Potentiation (LTP) consolidating fragile short-term traces into cortical storage.',
      'Interleaving diverse problem sets to stimulate adaptive neural network routing.'
    ],
    sections: [
      {
        heading: 'The Myth of Static Brain Storage',
        body: 'The human brain does not function like a hard drive storing static files. Memory is an active neural reconstruction process where every retrieval event alters and strengthens underlying synaptic connections.'
      },
      {
        heading: 'Synaptic Plasticity and Long-Term Potentiation',
        body: 'When neurons fire in synchronized patterns during focused recall, glutamate receptors activate Long-Term Potentiation (LTP), physically increasing synaptic spine density and dendritic branching.'
      },
      {
        heading: 'Desirable Difficulty in Human Learning',
        body: 'Cognitive effort that feels slightly strenuous during study produces vastly superior long-term retention. Embracing active retrieval transforms the brain into a resilient learning instrument.'
      }
    ]
  }
};

// 모든 69개 카드가 누락 없이 등록되었는지 확인
console.log('Total English translated cards mapped:', Object.keys(ALL_EN).length);

// articles_en.js 파일로 내보내기
const fileContent = `// ==========================================================================
// 맘고리즘 (My-gorithm) - 전체 콘텐츠 카드 영문 번역 데이터셋 (articles_en.js)
// ==========================================================================

export const ARTICLES_EN = ${JSON.stringify(ALL_EN, null, 2)};

export function getLocalizedCard(item, lang = 'ko') {
  if (!item) return item;
  if (lang !== 'en') return item;

  const en = ARTICLES_EN[item.id];
  if (!en) {
    // 폴백 기본 번역 (소량의 사용자 카드 또는 미정의 카드)
    const dur = item.duration
      ? item.duration.replace('분 읽기', ' min read').replace('분 분량', ' min read')
      : (item.type === 'video' ? '10:00' : '5 min read');
    const dt = item.date
      ? item.date.replace('어제', 'Yesterday').replace('오늘', 'Today').replace('일 전', 'd ago')
      : 'Recent';
    return {
      ...item,
      duration: dur,
      date: dt
    };
  }

  const dur = en.duration || (item.duration ? item.duration.replace('분 읽기', ' min read') : '5 min read');
  const dt = en.date || item.date;

  return {
    ...item,
    title: en.title || item.title,
    summary: en.summary || item.summary,
    source: en.source || item.source,
    duration: dur,
    date: dt,
    recommendationReason: en.recommendationReason || item.recommendationReason,
    keyPoints: en.keyPoints || item.keyPoints,
    sections: en.sections || item.sections
  };
}
`;

fs.writeFileSync('articles_en.js', fileContent);
console.log('Successfully generated articles_en.js with complete translations!');
