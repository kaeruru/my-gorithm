// scripts/generate_all_en.mjs
import fs from 'fs';
import { CONTENT_DATA } from '../data.js';

// 기본 소스 및 날짜 매핑
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
  '미래 기술': 'Future Tech'
};

export const ARTICLES_DATA_EN = {};

// 개별 카드 영문 정의
ARTICLES_DATA_EN['tech-draft-1'] = {
  title: "The 2026 On-Device AI Paradigm: Super-Lightweight Neural Networks in Your Pocket",
  summary: "How LLMs that once relied on massive cloud data centers were compressed into sub-1W smartphone APs, analyzing architectural breakthroughs in NPU hardware.",
  source: "Toss Tech",
  duration: "6 min read",
  date: "Latest Column",
  recommendationReason: "Highlights the privacy and zero-latency security benefits of on-device neural inference operating directly on local silicon.",
  keyPoints: [
    "Local on-device inference eliminates cloud API latency and zero out external data breach risks.",
    "Quantization and knowledge distillation compress 3B~7B parameter models to run on mobile memory footprints.",
    "Dedicated mobile NPU silicon minimizes battery drain while sustaining high token-per-second throughput."
  ],
  sections: [
    {
      heading: "1. The Limits of Centralized Clouds and the Rise of Local Silicon",
      body: "For years, generative AI has been the exclusive playground of colossal hyperscale data centers running thousands of GPUs. However, astronomical server operating costs, average 1-2 second round-trip network latencies, and grave concerns regarding private user data leakage exposed critical vulnerabilities in cloud-tethered architectures. Global tech titans are rapidly shifting their strategic core toward 'On-Device AI'—running advanced models directly on smartphones, laptops, and wearables."
    },
    {
      heading: "2. The Parameter Diet: Fitting Gigabyte Models into 2GB RAM",
      body: "The core breakthrough of on-device AI lies in compression engineering—maintaining over 90% of model accuracy while slashing memory footprints by more than tenfold. By reducing floating-point precision from FP16 to 4-bit integers (INT4), pruning redundant synaptic weights, and employing knowledge distillation where compact student models absorb the reasoning of massive teachers, smartphones can now run real-time inference at tens of tokens per second."
    },
    {
      heading: "3. Privacy Meets Personalization: A World Without Server Uploads",
      body: "The sharpest weapon of on-device AI is uncompromising security. Photos, voice recordings, banking transactions, and confidential chats never leave the physical device. This unlocks transformative hyper-personalized algorithms that learn from continuous local user behavior—ideal for services like My-gorithm that place full recommendation control directly into user hands."
    }
  ]
};

ARTICLES_DATA_EN['study-draft-1'] = {
  title: "The Science of 'Retrieval Practice': Why Passive Reading Fails to Build Real Knowledge",
  summary: "Mere re-reading only creates a deceptive illusion of competence. We explore the neuroscience of active retrieval that physically hardens synaptic connections.",
  source: "Harvard Business Review · Neuroscience Archive",
  duration: "5 min read",
  date: "Latest Column",
  recommendationReason: "Presents the single most effective cognitive psychology principle that triples long-term retention per study hour.",
  keyPoints: [
    "The fatal trap of input-only learning: The Fluency Illusion that tricks the brain into assuming familiarity equals mastery.",
    "Memory re-consolidation: Synaptic wiring physically reorganizes every time information is actively retrieved.",
    "Practical retrieval protocols utilizing flashcards, blank-sheet recaps, and the Feynman technique."
  ],
  sections: [
    {
      heading: "1. The False Comfort of the Highlighter Pen",
      body: "Countless students and knowledge workers fall into the trap of believing that highlighting sentences and re-reading textbook chapters constitutes genuine studying. Cognitive scientists call this the 'Fluency Illusion'. The ease of visually processing familiar text creates a false sensation of understanding, which crumbles the moment one is asked to solve a problem from scratch in high-stakes environments. Input alone does almost nothing to solidify long-term memory."
    },
    {
      heading: "2. The Cognitive Strain of Retrieval Reconstructs Synapses",
      body: "Long-term memory is catalyzed during the strenuous moment of 'Retrieval'—the act of actively pulling information from within. As the brain struggles to recall, it releases dopamine and norepinephrine, physically thickening and strengthening the synaptic pathways between relevant neurons. Experiments prove that learners who read once and test themselves three times retain over 50% more knowledge one week later than those who simply reviewed four times."
    },
    {
      heading: "3. A 3-Step Retrieval Protocol for Immediate Practice",
      body: "Implementing retrieval practice is straightforward. First, adopt the 'Blank Sheet Protocol': close the book after each chapter and jot down the top 3 core concepts by hand from memory. Second, employ the 'Feynman Technique' by explaining the concept aloud as if teaching a ten-year-old child. Third, integrate spaced repetition algorithms like Anki to trigger retrieval questions just as memories begin to fade."
    }
  ]
};

ARTICLES_DATA_EN['culture-draft-1'] = {
  title: "Spatial Branding in Seongsu & Hannam: The 'Experience Economics' of Offline Pop-ups",
  summary: "In a digital age conquered by e-commerce, why are top brands paradoxically spending millions on physical pop-up venues? We dissect the spatial neuroscience.",
  source: "Cine21 · Independent & Art Cinema",
  duration: "5 min read",
  date: "Latest Column",
  recommendationReason: "Gain insight into how five-sensory physical spaces construct deep brand loyalty far beyond digital phone screens.",
  keyPoints: [
    "What algorithms cannot deliver: The rich tactile three-dimensionality of curated physical spaces.",
    "The psychology of custom scent and object curation directly triggering the brain's emotional limbic system.",
    "The future of retail: Shifting from product vendors to holistic worldview architects."
  ],
  sections: [
    {
      heading: "1. What Digital Screens Cannot Replicate",
      body: "While Amazon and e-commerce platforms offer frictionless overnight logistics and endless price comparisons, they remain flat, two-dimensional glass-screen interactions. In contrast, stepping into a physical space engages the vestibular and somatosensory systems simultaneously. Lighting temperatures, acoustic reverberation, and architectural textures create an immersive sensory environment that digital feeds cannot simulate."
    },
    {
      heading: "2. Scent and Tactile Psychology in Brand Recall",
      body: "The human olfactory bulb is uniquely wired directly into the amygdala and hippocampus—the emotional and memory hubs of the brain. When a consumer experiences a brand's signature fragrance in a thoughtfully designed Seongsu gallery, the emotional association becomes permanently etched into memory. Visitors do not simply purchase goods; they absorb a curated lifestyle aesthetic."
    },
    {
      heading: "3. Retail's Evolution: From Sales Counters to Worldview Architects",
      body: "Modern pop-up spaces rarely measure success by on-site register revenues. Instead, they operate as cultural monuments designed for spontaneous social sharing and peer endorsement. Physical presence validates the brand's cultural authority, establishing a narrative foundation that sustains long-term customer loyalty across digital channels."
    }
  ]
};

ARTICLES_DATA_EN['hobby-draft-1'] = {
  title: "Awakening Mitochondria with 'Zone 2 Running': Why Running Slower Makes You Faster",
  summary: "Gasping for breath until your lungs burn isn't the best way to train. We dissect the scientific endurance method that maximizes aerobic capacity and fat oxidation.",
  source: "Journal of Sports Medicine · Exercise Physiology",
  duration: "5 min read",
  date: "Latest Column",
  recommendationReason: "A practical guide to building an unshakeable aerobic base and torching visceral fat without joint injury or burnout.",
  keyPoints: [
    "The myth of 'No Pain, No Gain': Why chronic high-intensity anaerobic training stalls endurance progress.",
    "Mitochondrial biogenesis: How low-intensity steady-state running cultivates cellular energy engines.",
    "Setting your personalized Zone 2 heart-rate ceiling using the talk test and smartwatch metrics."
  ],
  sections: [
    {
      heading: "1. The Death of the 'No Pain, No Gain' Dogma",
      body: "Novice runners often believe that every training session must leave them collapsed on the pavement in exhaustion. In exercise physiology, this constant high-lactate stress triggers excessive cortisol release, suppresses immune function, and leads to persistent tendon inflammation. World-class marathoners spend 80% of their total mileage running at surprisingly conversational, easy paces."
    },
    {
      heading: "2. Mitochondrial Cleaning and the Fat-Burning Engine Room",
      body: "Zone 2 training—typically 60% to 70% of maximum heart rate—forces muscle fibers to generate energy strictly via aerobic beta-oxidation of fatty acids rather than glycogen. This steady state triggers mitochondrial biogenesis, multiplying the density and clearance efficiency of cellular powerplants while drastically reducing post-run recovery times."
    },
    {
      heading: "3. Establishing Your Practical Zone 2 Pace",
      body: "The most intuitive gauge is the 'Talk Test': you should be able to speak complete sentences aloud without gasping for air. If using a heart-rate monitor, apply the Maffetone formula (180 minus your age). The moment your heart rate crosses into Zone 3, intentionally slow down to a brisk walk to keep your metabolic machinery in pure aerobic adaptation."
    }
  ]
};

ARTICLES_DATA_EN['study-2199'] = {
  title: "Memory is Reconstruction, Not Storage: Synaptic Plasticity and the Neuroscience of Active Retrieval",
  summary: "Why passive rereading is merely a learning illusion. A deep dive into synaptic plasticity and Long-Term Potentiation (LTP) showing how active retrieval physically restructures the brain.",
  source: "Harvard Business Review · Neuroscience Archive",
  duration: "6 min read",
  date: "Featured Deep Report",
  recommendationReason: "Explore the neurobiology of memory consolidation to maximize knowledge retention with minimal cognitive waste.",
  keyPoints: [
    "The Underlining Trap: Why highlighting textbook passages tricks the brain into mistaking visual familiarity for true mastery.",
    "Long-Term Potentiation (LTP): The physical biochemical cascade that permanently wires neural synapses together.",
    "Desirable Difficulty: Embracing deliberate friction as the primary biological signal that tells your brain to preserve knowledge.",
    "Structural Redesign of Intelligence: Moving from passive consumption to productive self-generation."
  ],
  sections: [
    {
      heading: "1. The Underlining Trap: Familiarity is Not Knowledge",
      body: "Many students spend hours rereading highlighted chapters, experiencing a comforting sense of recognition. Cognitive psychologists identify this as the 'Fluency Illusion'. Recognizing a sentence as familiar is fundamentally distinct from being able to synthesize and deploy that knowledge in unfamiliar contexts. Receptive reading leaves almost no long-term structural traces in neural circuitry."
    },
    {
      heading: "2. Synaptic Plasticity and Long-Term Potentiation (LTP)",
      body: "Memories do not sit in static drawers like files on a hard drive. Every memory is a dynamic pattern of synaptic activations. When neurons fire repeatedly in close succession during challenging cognitive work, NMDA receptors open, calcium ions rush in, and synaptic sensitivity is amplified—a phenomenon known as Long-Term Potentiation (LTP). Memory is an ongoing act of continuous reconstruction."
    },
    {
      heading: "3. Retrieval Practice: The Pain of Recall Solidifies the Network",
      body: "The cognitive friction felt when struggling to remember an answer is not a sign of failure—it is the biological signature of learning taking place. Each act of retrieval alters the memory trace, rendering it more durable and interconnected with existing knowledge schemata. Testing yourself is not an assessment tool; it is a profound learning event in itself."
    },
    {
      heading: "4. The Architecture of Intelligence: Welcoming Intentional Discomfort",
      body: "To accelerate personal growth, design your information intake with built-in retrieval checkpoints. Replace marathon reading sessions with quick self-inquiry loops. By welcoming 'Desirable Difficulty', you transform ephemeral information into lifelong intellectual capability."
    }
  ]
};

// 기본 기사 번역 데이터베이스 등록 완료 메시지
console.log('Top featured articles registered.');
fs.writeFileSync('scripts/generated_check.txt', 'OK');
