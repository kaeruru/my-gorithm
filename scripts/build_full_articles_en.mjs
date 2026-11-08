// scripts/build_full_articles_en.mjs
import fs from 'fs';
import { CONTENT_DATA } from '../data.js';

// 공통 번역 딕셔너리
const TRANSLATIONS_MAP = {
  // --- TECH ---
  'tech-1': {
    title: 'Toss Shopping Recommendation Engine: Matching Millions of Users to Relevant Products',
    summary: 'A look into real-time collaborative filtering and deep retrieval models that curate optimal product streams without cluttering user experience.',
    source: 'Toss Tech',
    date: '3d ago',
    recommendationReason: 'Provides insight into production-scale e-commerce ML pipelines and two-tower recommendation architectures.',
    keyPoints: [
      'Multi-stage recommendation funnel: Candidate generation (Recall) -> Ranking -> Business logic re-ranking.',
      'Balancing exploitation of known user preferences with serendipitous exploration of new merchandise categories.',
      'Real-time streaming features utilizing user dwell time and immediate add-to-cart signals.'
    ],
    sections: [
      {
        heading: 'The Core Philosophy of Discovery-Driven Shopping',
        body: 'Unlike search-driven commerce where users know exactly what product model they seek, recommendation feeds cater to browsing users. The system must anticipate unspoken intent through subtle behavioral signals like scroll deceleration and dwell time without showing repetitive clutter.'
      },
      {
        heading: 'Architecture of the Multi-Stage Funnel',
        body: 'Processing millions of items in under 50 milliseconds requires a funnel architecture. Lightweight vector similarity searches (ANN) first narrow millions of items down to several hundred candidates. Then, a deep ranking model calculates exact click-through and purchase probabilities.'
      },
      {
        heading: 'Continuous A/B Experimentation and Experience Guardrails',
        body: 'A recommendation system is never static. Continuous online bandit testing balances familiar bestsellers with fresh discovery candidates, backed by algorithmic rules that prevent visual fatigue and redundant merchant exposure.'
      }
    ]
  },
  'tech-2': {
    title: 'Why Apple Music Shook Its Logo Like Liquid: The Art of Dynamic Motion Design',
    summary: 'Analyzing the physics and emotional resonance behind Apple Music\'s animated fluid branding and kinetic identity system.',
    source: 'YouTube · Toss Tech',
    date: 'Must Watch',
    recommendationReason: 'Explore how micro-animations and physics simulations communicate brand emotion in modern UI design.'
  },
  'tech-3': {
    title: 'Modern Responsive Web Design: Clean Layouts with CSS Grid, Container Queries & Fluid Units',
    summary: 'A practical architecture guide to building scalable, adaptive interfaces without relying on bloated media query chains.',
    source: 'Toss Tech',
    date: '2d ago',
    recommendationReason: 'Essential layout strategies for modern web developers targeting diverse mobile, tablet, and desktop viewports.',
    keyPoints: [
      'Mobile-First design philosophy cuts decorative excess to prioritize essential content hierarchy.',
      'CSS Grid minmax() and repeat(auto-fill, ...) construct fluid card grids with zero breakpoint overhead.',
      'Adopting dynamic viewport units (100dvh) and env(safe-area-inset) solves mobile browser URL bar shifting.'
    ],
    sections: [
      {
        heading: 'The Less-is-More Philosophy Starting on Mobile',
        body: 'Starting on desktop canvases tempts designers to fill empty space with unnecessary sidebars and decorative widgets. Designing for 390px mobile viewports first forces focus on the fundamental question: What is the most immediate value for the user?'
      },
      {
        heading: 'Modern CSS Techniques Reducing Media Query Clutter',
        body: 'Modern CSS leverages inherent layout flexibility. The pattern `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` dynamically arranges cards across 1, 2, or 3 columns based on available container width, eliminating brittle breakpoint rules.'
      },
      {
        heading: 'New Standards for Mobile Viewports: dvh and Safe Areas',
        body: 'Mobile browser address bars expand and collapse during scroll, breaking legacy 100vh calculations. Today, production applications must utilize 100dvh along with `env(safe-area-inset-bottom)` to prevent buttons from hiding behind native browser chrome.'
      }
    ]
  },
  'tech-4': {
    title: 'Python Programming Crash Course: From Core Syntax to Practical Automation in 5 Hours',
    summary: 'A fast-paced hands-on guide covering variables, lists, dictionaries, functions, web scraping, and office task automation.',
    source: 'YouTube · JoCoding',
    date: 'Featured Video',
    recommendationReason: 'Perfect foundational course for beginners aiming to automate repetitive desktop workflows.'
  },
  'tech-5': {
    title: 'Prolonging Smartphone Battery Health: The Chemistry of Lithium-Ion Degradation',
    summary: 'Understanding electrochemical aging in lithium-ion cells, thermal throttling, and practical charging habits to double battery cycle longevity.',
    source: 'Samsung Support · Battery Care',
    date: '4d ago',
    recommendationReason: 'Practical advice on device care, charging limits, and thermal management to protect battery capacity and prevent OLED burn-in.',
    keyPoints: [
      'Lithium-ion cells endure maximum chemical stress at extreme states of charge (0% deep discharge or 100% full charge).',
      'Maintaining charge levels between 20% and 80% can extend battery lifespan cycles by over twofold.',
      'Managing heat dissipation during fast charging is paramount to prevent electrolyte breakdown and display degradation.'
    ],
    sections: [
      {
        heading: 'Charge Cycles and Electrochemical Degradation',
        body: 'Lithium-ion batteries operate via ion transfer between cathode and anode. At 0% deep discharge, the copper current collector risks dissolution, while sustaining 100% high voltage causes electrolyte decomposition and gas generation. Capping charging at 80~85% preserves long-term cell integrity.'
      },
      {
        heading: 'Heat: The Common Enemy of Batteries and Displays',
        body: 'The real danger of fast charging is concurrent temperature rise. Running high-end 3D graphics or recording 4K video while charging exposes cells to temperatures above 45°C, accelerating permanent capacity loss and speeding up OLED organic sub-pixel burn-in.'
      },
      {
        heading: 'Three Practical Habits for Everyday Battery Health',
        body: 'First, enable "Protect Battery" mode when charging overnight. Second, avoid fast charging under direct sunlight or inside thick insulated cases. Third, plug into a charger before remaining battery drops below the 20% warning threshold.'
      }
    ]
  },
  'tech-6': {
    title: 'Git & GitHub Collaboration Mastery: Version Control, Branches & Conflict Resolution',
    summary: 'Essential team workflows from remote repository hygiene to Pull Request code reviews and resolving merge conflicts cleanly.',
    source: 'YouTube · Quick Coding Guide',
    date: 'Must Watch',
    recommendationReason: 'A must-watch masterclass for engineers collaborating on shared production codebases.'
  },
  'tech-7': {
    title: 'Kakao Kanana Technical Report: The Future of On-Device AI and Small Language Models',
    summary: 'How lightweight language model architectures run locally on mobile silicon to preserve privacy and enable real-time interaction.',
    source: 'Kakao Tech',
    date: 'Yesterday',
    recommendationReason: 'Deep dive into mobile neural processing architectures and the paradigm of local privacy-first AI.',
    keyPoints: [
      'On-device AI executes neural models directly on the smartphone NPU without pinging remote cloud servers.',
      'Sensitive user data (conversations, photos, health logs) never leaves the physical device sandbox.',
      'Zero round-trip network latency enables instantaneous interactions even in offline environments.'
    ],
    sections: [
      {
        heading: 'Cloud AI Limits and the Shift to Edge Silicon',
        body: 'While massive cloud LLMs ignited the generative AI boom, they introduced staggering server costs and serious privacy hurdles. Reluctance to transmit private notes and recordings to external servers prompted the development of Small Language Models (SLMs) running directly on device silicon.'
      },
      {
        heading: 'NPU Architectures and Integer Quantization',
        body: 'Mobile Neural Processing Units (NPUs) accelerate matrix mathematics with ultra-low power consumption. Combined with 4-bit and 8-bit integer quantization (INT4/INT8), gigabyte-sized weight files are compressed into several hundred megabytes of RAM.'
      },
      {
        heading: 'Complete Personalization Inside Your Hands',
        body: 'On-device models learn usage rhythms, calendar appointments, and subject affinities exclusively within the local OS sandbox. Combined with user-driven algorithmic mixers like My-gorithm, it forms an autonomous, private personal companion.'
      }
    ]
  },
  'tech-8': {
    title: 'The 3 Mega Projects Leading the AI Era: Physical AI, Advanced Packaging & Eco Data Centers',
    summary: 'Exploring high-bandwidth memory (HBM), 3D semiconductor packaging, physical robotics, and high-efficiency AI data center clusters.',
    source: 'Korea Policy Briefing',
    date: 'Policy Briefing',
    recommendationReason: 'Essential reading to grasp the structural pillars of next-generation hardware and manufacturing ecosystems.',
    keyPoints: [
      'Next-generation High Bandwidth Memory (HBM) and advanced 3D packaging powering hyper-scale neural computation.',
      'Physical AI integrating artificial intelligence into humanoid robotics, autonomous fleets, and smart factory floors.',
      'Building sustainable, liquid-cooled green data center clusters to meet surging energy demands.'
    ],
    sections: [
      {
        heading: 'Advanced Packaging Reshaping the Semiconductor Landscape',
        body: 'As traditional process shrinking approaches atomic limits, 3D packaging and HBM memory linking separate silicon dies have emerged as the primary technological battleground.'
      },
      {
        heading: 'Beyond Code: Physical AI Embodied in Reality',
        body: 'AI is expanding from on-screen text generation to Physical AI embodied in humanoid robots, automated factory cells, and autonomous vehicles that sense, interact with, and manipulate the physical world.'
      },
      {
        heading: 'AI Data Centers and Sustainable Energy Infrastructure',
        body: 'Cooling clusters of tens of thousands of GPUs demands liquid cooling technologies and resilient clean energy grids, establishing green data center infrastructure as a core national asset.'
      }
    ]
  },
  'tech-9': {
    title: 'Agentic AI: Can Artificial Intelligence Autonomously Plan, Execute, and Reflect?',
    summary: 'An exploration of agentic architectures that break down complex multi-step goals, use external tools, and self-correct across workflows.',
    source: 'Korea Policy Briefing',
    date: 'Future Tech',
    recommendationReason: 'Understand how AI is transitioning from conversational chatbots into autonomous software agents that execute real tasks.',
    keyPoints: [
      'Agentic AI parses human intent, decomposes high-level goals into sub-tasks, and executes them autonomously.',
      'Combines tool use, long-term memory retrieval, web browsing, and code execution to automate complex workflows.',
      'Requires strict safety guardrails and authorization protocols to prevent unauthorized actions and prompt injection.'
    ],
    sections: [
      {
        heading: 'From Conversational Bots to Action-Oriented Agents',
        body: 'While traditional generative AI answered single questions passively, Agentic AI accepts overarching goals—such as "compare workshop venues next month and book the best option"—and executes every prerequisite step sequentially.'
      },
      {
        heading: 'The Triad of Agentic Architecture: Planning, Tools, and Reflection',
        body: 'Agents achieve high success rates by combining task planning (breaking down problems), tool utilization (APIs, calculators, shells), and reflection loops that inspect intermediate outputs to self-correct mistakes.'
      },
      {
        heading: 'Security and Governance Behind Autonomous Action',
        body: 'Because agents can modify files and execute transactions, robust authorization protocols and Human-in-the-Loop approval checkpoints are indispensable to prevent runaway actions or data loss.'
      }
    ]
  },
  'tech-11': {
    title: 'The Tech Powering Virtual Worlds: Real-Time 3D Rendering & Game Hardware',
    summary: 'How modern gaming hardware, ray-tracing pipelines, and global distribution networks construct hyper-realistic virtual spaces.',
    source: 'Wikipedia · Video Game Consoles',
    date: 'Latest Column',
    recommendationReason: 'Understand the cutting-edge intersection of graphics hardware, physics engines, and real-time 3D simulation.',
    keyPoints: [
      'Dedicated GPU silicon accelerating real-time ray-tracing and geometric shader calculations.',
      'High-speed NVMe SSD architectures eliminating in-game loading screens via asset streaming.',
      'Global low-latency content networks enabling synchronized multi-user simulations.'
    ],
    sections: [
      {
        heading: 'Hardware Convergence in Modern Gaming',
        body: 'Modern gaming consoles share unified x86 CPU architectures, high-speed unified memory, and ray-tracing capable GPUs, democratizing film-grade visual rendering in consumer living rooms.'
      },
      {
        heading: 'The Physics of Real-Time Ray Tracing',
        body: 'Rather than relying solely on pre-baked lighting, modern graphics engines calculate billions of virtual photon rays per second to simulate realistic refractions, reflections, and ambient occlusions.'
      },
      {
        heading: 'Global Distribution and Seamless World Streaming',
        body: 'Massive virtual game environments are streamed on-the-fly from high-speed SSDs directly into GPU VRAM, allowing gamers to travel vast digital landscapes with zero loading delays.'
      }
    ]
  },
  'tech-12': {
    title: 'The Rules Behind Recommendations: How Ranking Algorithms Shape Digital Discovery',
    summary: 'A conceptual study of algorithmic decision sequences, conditional weighting, and automated inference pipelines in content platforms.',
    source: 'Wikipedia · Algorithms',
    date: 'Technology Science',
    recommendationReason: 'Examines the fundamental mechanics of ranking formulas and why transparent user control is essential.',
    keyPoints: [
      'Algorithms as finite sequences of unambiguous rules transforming user signals into sorted outputs.',
      'Balancing multi-objective loss functions: relevance, freshness, and category diversity.',
      'The importance of transparent algorithmic knobs that place curation sovereignty back in user hands.'
    ],
    sections: [
      {
        heading: 'Defining Algorithmic Sequences',
        body: 'An algorithm is fundamentally a finite sequence of well-defined computational instructions. In recommendation feeds, it transforms user preferences and content metadata into an ordered stream.'
      },
      {
        heading: 'Conditional Logic and Decision Thresholds',
        body: 'Modern feed pipelines evaluate hundreds of weighted ranking signals, from historical click propensity to category balance, determining which cards are surfaced and which are excluded.'
      },
      {
        heading: 'Transparent Curation vs Black Box Traps',
        body: 'When recommendation algorithms operate secretly to maximize screen addiction, user autonomy suffers. User-tuned architectures restore agency by making weight sliders and formulas completely transparent.'
      }
    ]
  },
  'tech-13': {
    title: 'How Artificial Intelligence Makes Decisions: Weights, Probabilities & Explainability',
    summary: 'Demystifying the internal mechanics of deep neural networks: matrix multiplications, attention heads, and probabilistic outputs.',
    source: 'Wikipedia · Artificial Intelligence',
    date: 'AI Theory',
    recommendationReason: 'A clear conceptual primer on how machine learning models generate decisions and navigate hallucination risks.',
    keyPoints: [
      'Deep learning models as billions of tunable numerical weights optimized via backpropagation.',
      'Probability distributions over vocabulary tokens and latent feature spaces.',
      'The urgent engineering frontier of AI explainability, calibration, and safety alignment.'
    ],
    sections: [
      {
        heading: 'From Static Code to Learned Synaptic Weights',
        body: 'Traditional software relies on explicit human-written conditionals. In contrast, neural networks learn mathematical weights by observing patterns across billions of data examples.'
      },
      {
        heading: 'Attention Mechanisms and Contextual Weighting',
        body: 'The Transformer architecture revolutionized AI by enabling models to assign varying mathematical attention to every word in a prompt, capturing nuanced contextual relationships.'
      },
      {
        heading: 'Explainability and the Challenge of Trust',
        body: 'As neural networks grow in complexity, understanding why a model arrived at a specific conclusion becomes crucial, driving rapid research into mechanistic interpretability.'
      }
    ]
  },
  'tech-14': {
    title: 'How Robots Sense and Navigate: Sensor Fusion, LiDAR, SLAM & Computer Vision',
    summary: 'How autonomous machines perceive unstructured environments, fuse multimodal sensor streams, and execute high-precision movements.',
    source: 'Wikipedia · Robotics',
    date: 'Robotics Science',
    recommendationReason: 'Explore how physical robots map the world and calculate navigation vectors in real-world spaces.',
    keyPoints: [
      'Sensor fusion combining cameras, ultrasonic detectors, and LiDAR for robust spatial perception.',
      'Simultaneous Localization and Mapping (SLAM) enabling robots to map unknown rooms in real time.',
      'From rigid industrial robotic arms to agile mobile humanoids and service automatons.'
    ],
    sections: [
      {
        heading: 'The Sensory Organs of Machines',
        body: 'Robots rely on complementary sensor suites: cameras provide rich color and semantic textures, while time-of-flight LiDAR sensors measure millimetric depth regardless of ambient lighting.'
      },
      {
        heading: 'Real-Time Spatial Mapping with SLAM',
        body: 'SLAM algorithms allow machines to answer two fundamental questions simultaneously: "Where am I right now?" and "What does the surrounding environment look like?"'
      },
      {
        heading: 'Precision Actuation and Motor Control',
        body: 'Turning spatial understanding into movement requires harmonic drive gearboxes and high-frequency closed-loop feedback controllers to ensure smooth, safe physical interaction.'
      }
    ]
  },
  'tech-15': {
    title: 'Detecting Malicious Software: Static Disassembly, Sandboxing & Behavioral Profiling',
    summary: 'Inside the cat-and-mouse game of cybersecurity: How security researchers deconstruct malware signatures and analyze suspicious binaries.',
    source: 'Wikipedia · Malware Analysis',
    date: 'Security Analysis',
    recommendationReason: 'Essential concepts of cybersecurity defense, safe code sandboxes, and proactive threat detection.',
    keyPoints: [
      'Static analysis inspecting PE headers, cryptographic hashes, and compiled opcode patterns without execution.',
      'Dynamic sandboxing observing runtime API calls, process spawning, and network exfiltration attempts.',
      'Heuristic detection models identifying novel zero-day malware based on behavioral anomalies.'
    ],
    sections: [
      {
        heading: 'Static Code Disassembly and Signature Verification',
        body: 'Static analysis examines binary code while at rest. Analysts inspect import address tables, cryptographic certificates, and strings to flag known malicious patterns without executing risk.'
      },
      {
        heading: 'Dynamic Behavioral Sandboxes',
        body: 'To bypass obfuscation and code packers, analysts execute files in instrumented virtual machines, monitoring file system modifications, registry edits, and outbound network traffic.'
      },
      {
        heading: 'Heuristics and Machine Learning Defense',
        body: 'Modern antivirus engines utilize machine learning models trained on millions of benign and malicious samples, predicting threats based on behavioral intent rather than exact file hashes.'
      }
    ]
  },
  'tech-16': {
    title: 'How Computers Understand Human Language: Tokenization, Embeddings & Transformers',
    summary: 'The technological trajectory of Natural Language Processing: From statistical n-grams to high-dimensional semantic vector spaces.',
    source: 'Wikipedia · Natural Language Processing',
    date: 'Language Tech',
    recommendationReason: 'Clear explanation of how raw text characters are converted into mathematical coordinates that algorithms can comprehend.',
    keyPoints: [
      'Byte-Pair Encoding (BPE) tokenization converting unstructured prose into discrete numeric tokens.',
      'Dense vector embeddings placing semantically related concepts close together in high-dimensional space.',
      'Self-attention mechanisms enabling neural models to track long-distance grammatical dependencies.'
    ],
    sections: [
      {
        heading: 'From Letters to Tokens',
        body: 'Computers cannot read text natively; they compute numbers. Tokenizers dissect sentences into sub-word tokens, creating an indexable numerical vocabulary for neural processing.'
      },
      {
        heading: 'The Geometry of Semantics: Vector Embeddings',
        body: 'Word embeddings assign multi-hundred-dimensional vectors to each token. Words with similar meanings or contexts naturally cluster together, allowing mathematical reasoning across concepts.'
      },
      {
        heading: 'The Transformer Revolution',
        body: 'Self-attention layers compute cross-token relationships across entire paragraphs simultaneously, allowing models to grasp complex pronouns, humor, and nuanced logical arguments.'
      }
    ]
  },
  'tech-17': {
    title: 'Robotic Surgery in Modern Medicine: Sub-Millimeter Precision & 3D Teleoperation',
    summary: 'How robotic armatures, stereoscopic 3D cameras, and tremor-filtering algorithms assist surgeons in performing minimally invasive procedures.',
    source: 'Wikipedia · Robotic Surgery',
    date: 'Medical Tech',
    recommendationReason: 'Examines the engineering triumphs of surgical robotics and how precision mechanical design protects patient outcomes.',
    keyPoints: [
      'Master-slave teleoperation translating surgeon hand gestures into sub-millimeter robotic tool movements.',
      'Tremor-canceling algorithms and 7 degrees of instrument wrist articulation exceeding human hand agility.',
      'Minimally invasive incisions reducing postoperative pain, blood loss, and patient recovery durations.'
    ],
    sections: [
      {
        heading: 'The Principles of Surgical Teleoperation',
        body: 'In robotic surgery, the surgeon sits at an ergonomic console, manipulating high-sensitivity master grips that translate finger movements into micro-movements of miniaturized arms inside the patient.'
      },
      {
        heading: 'Overcoming Human Physical Limitations',
        body: 'Robotic systems filter out natural physiological tremors and offer 360-degree wrist rotations in tight anatomical spaces where human fingers cannot fit, dramatically boosting precision.'
      },
      {
        heading: 'Minimizing Surgical Trauma',
        body: 'By operating through keyhole incisions with 3D high-definition magnification, tissue trauma and blood loss are minimized, allowing patients to return home significantly faster.'
      }
    ]
  },
  'tech-18': {
    title: 'Google Gemini and Multimodal Intelligence: Intertwining Thought, Vision, and Audio',
    summary: 'Inside native multimodal foundation models: How AI processes text, code, high-resolution imagery, and audio streams in a single unified architecture.',
    source: 'Wikipedia · Gemini (Language Model)',
    date: 'AI Innovation',
    recommendationReason: 'An overview of native multimodal neural architectures and how unified token representations unlock cross-domain reasoning.',
    keyPoints: [
      'Built from the ground up as native multimodal models rather than stitching separate vision models together.',
      'Massive million-token context windows enabling comprehensive analysis of entire book libraries or codebases.',
      'Versatile deployment across scales, from Ultra clusters down to mobile Nano silicon.'
    ],
    sections: [
      {
        heading: 'The Architecture of Native Multimodality',
        body: 'Past AI architectures connected vision encoders to separate text models, losing subtle cross-modal nuance. Native multimodal models process audio waveforms, video frames, and text tokens inside a unified latent space.'
      },
      {
        heading: 'Million-Token Context Horizons',
        body: 'Gemini expanded context windows beyond one million tokens, enabling the model to absorb hours of raw video, hundreds of pages of documentation, and entire GitHub repositories in a single inference call.'
      },
      {
        heading: 'From Hyperscale Clouds to Edge Nano',
        body: 'Architecting models across multiple tiers allows lightweight variants like Nano to run securely on smartphone chips while Ultra models tackle complex multi-step reasoning in cloud clusters.'
      }
    ]
  },
  'tech-19': {
    title: 'The Landscape of 2D Computer Graphics: Scalable Vectors, Raster Pipelines & Canvas APIs',
    summary: 'The mathematical foundations behind digital images: Bézier curves, rasterization, bitmap compression, and dynamic WebGL rendering.',
    source: 'Wikipedia · 2D Computer Graphics',
    date: 'Visual Tech',
    recommendationReason: 'A foundational look at graphic rendering technologies that power modern mobile screens and browser viewports.',
    keyPoints: [
      'Vector graphics utilizing mathematical coordinate formulas for infinite lossless scaling.',
      'Raster images mapping discrete color values across high-density pixel grids.',
      'Hardware acceleration leveraging GPU shaders for instantaneous interface compositing.'
    ],
    sections: [
      {
        heading: 'Vectors vs Raster: Mathematical Precision vs Pixel Realism',
        body: 'Vector graphics define shapes through mathematical formulas and Bézier control points, staying razor-sharp at any zoom level. Raster graphics excel at continuous tones in digital photographs by assigning color coordinates to individual pixels.'
      },
      {
        heading: 'The Pipeline of Screen Rasterization',
        body: 'Before vector paths or HTML DOM elements appear on display panels, they must be converted into raster pixels via GPU rasterization engines, running at 60 to 120 frames per second.'
      },
      {
        heading: 'Modern Web Graphics and GPU Acceleration',
        body: 'Technologies like SVG, Canvas 2D, and WebGL allow web applications to delegate complex rendering directly to device GPUs, ensuring ultra-smooth scrolling and crisp typography.'
      }
    ]
  },
  'tech-20': {
    title: 'Creating the Impossible on Screen: The Fusion of Practical Effects & Photorealistic CGI',
    summary: 'How computer graphics, volumetric lighting, and physical camera sensors blend to craft seamless cinematic visual effects.',
    source: 'Wikipedia · Computer Graphics',
    date: 'CGI Innovation',
    recommendationReason: 'Gain insight into the computational physics behind 3D visual effects and cinematic worldbuilding.',
    keyPoints: [
      'Monte Carlo ray-tracing simulating physical photon transport and material shaders.',
      'Photogrammetry and motion capture recording real-world actors and landscapes into digital assets.',
      'Virtual production LED stages replacing green screens with real-time parallax backgrounds.'
    ],
    sections: [
      {
        heading: 'The Science of Photorealistic Rendering',
        body: 'Modern visual effects rely on physically-based rendering (PBR) that simulates real-world optical phenomena—surface roughness, subsurface scattering in human skin, and atmospheric light diffusion.'
      },
      {
        heading: 'Digital Asset Capture and Motion Tracking',
        body: 'High-speed camera rigs capture human facial muscle micro-movements, transferring live actor emotion directly onto computer-generated characters with breathtaking fidelity.'
      },
      {
        heading: 'The Revolution of Virtual LED Volumes',
        body: 'Rather than performing in front of green screens, actors now stand within gigantic curved LED volumes that render background parallax in real time via game engines, casting realistic ambient light onto sets.'
      }
    ]
  },
  'tech-21': {
    title: 'The Evolution of China\'s AI Industry: National Infrastructure, Talent & Enterprise Scale',
    summary: 'A macro perspective on China\'s technological rise: Supercomputing infrastructure, manufacturing robotics, and expansive mobile data ecosystems.',
    source: 'Wikipedia · AI Industry in China',
    date: 'Global Tech',
    recommendationReason: 'Analyzes global geopolitical competition and technical specialization across international artificial intelligence ecosystems.',
    keyPoints: [
      'Massive domestic consumer data pools fueling rapid computer vision and recommendation engine refinement.',
      'National strategic roadmaps pairing academic institutes with enterprise technology champions.',
      'Heavy investment into physical manufacturing automation and localized semiconductor fabs.'
    ],
    sections: [
      {
        heading: 'Data Scale as an Engine for Vision AI',
        body: 'Widespread mobile payments and urban infrastructure created massive multimodal datasets, giving Chinese tech firms early global leadership in facial recognition, optical character recognition, and logistics routing.'
      },
      {
        heading: 'Strategic National Initiatives',
        body: 'Through coordinated multi-year technology roadmaps, government and private sectors established dedicated AI experimental zones and nationwide compute network backbones.'
      },
      {
        heading: 'Navigating Hardware Supply Realities',
        body: 'Global trade restrictions spurred massive domestic investments into indigenous chip design, RISC-V architectures, and open-source software frameworks to achieve independent technological resilience.'
      }
    ]
  },
  'tech-22': {
    title: 'Underwater Photography: Lighting, Optical Physics & Color Correction Beneath the Waves',
    summary: 'The physics of light attenuation in water: Specialized pressure-resistant housings, strobe synchronization, and restoring lost reds in ocean depths.',
    source: 'Wikipedia · Underwater Photography',
    date: 'Optics & Nature',
    recommendationReason: 'Learn the fascinating optical physics and camera adaptations required to photograph deep marine ecosystems.',
    keyPoints: [
      'Water selectively absorbs warm wavelengths first, leaving deep waters bathed in monochrome blue.',
      'Submersible camera housings engineered to withstand immense hydrostatic water pressure.',
      'Artificial strobe placement minimizing backscatter reflection from suspended particles.'
    ],
    sections: [
      {
        heading: 'The Optical Physics of Light Attenuation',
        body: 'Water is approximately 800 times denser than air. As light penetrates the ocean surface, red and orange wavelengths are absorbed within the first 5 meters, requiring artificial light or white-balance correction to restore true natural color.'
      },
      {
        heading: 'Pressure-Resistant Engineering and Dome Ports',
        body: 'Underwater housings utilize marine-grade aluminum and optical glass domes. The curved dome port corrects for water-induced optical refraction, restoring the camera lens\'s true wide field of view.'
      },
      {
        heading: 'Taming Backscatter with Dual Strobes',
        body: 'Firing camera flashes directly forward reflects off floating plankton and debris, creating white specks called backscatter. Positioning strobes far to the sides at 45-degree angles illuminates the subject while bypassing floating particles.'
      }
    ]
  }
};

console.log('Building complete translation module...');
fs.writeFileSync('scripts/temp_tech_translations.json', JSON.stringify(TRANSLATIONS_MAP, null, 2));
console.log('Saved translations.');
