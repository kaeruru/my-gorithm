// ==========================================================================
// 맘고리즘 (My-gorithm) - 전체 콘텐츠 카드 영문 번역 데이터셋 (articles_en.js)
// ==========================================================================

export const ARTICLES_EN = {
  "tech-1": {
    "title": "Toss Shopping Recommendation Engine: Matching Millions of Users to Relevant Products",
    "summary": "A look into real-time collaborative filtering and deep retrieval models that curate optimal product streams without cluttering user experience.",
    "source": "Toss Tech",
    "date": "3d ago",
    "recommendationReason": "Provides insight into production-scale e-commerce ML pipelines and two-tower recommendation architectures.",
    "keyPoints": [
      "Multi-stage recommendation funnel: Candidate generation (Recall) -> Ranking -> Business logic re-ranking.",
      "Balancing exploitation of known user preferences with serendipitous exploration of new merchandise categories.",
      "Real-time streaming features utilizing user dwell time and immediate add-to-cart signals."
    ],
    "sections": [
      {
        "heading": "The Core Philosophy of Discovery-Driven Shopping",
        "body": "Unlike search-driven commerce where users know exactly what product model they seek, recommendation feeds cater to browsing users. The system must anticipate unspoken intent through subtle behavioral signals like scroll deceleration and dwell time without showing repetitive clutter."
      },
      {
        "heading": "Architecture of the Multi-Stage Funnel",
        "body": "Processing millions of items in under 50 milliseconds requires a funnel architecture. Lightweight vector similarity searches (ANN) first narrow millions of items down to several hundred candidates. Then, a deep ranking model calculates exact click-through and purchase probabilities."
      },
      {
        "heading": "Continuous A/B Experimentation and Experience Guardrails",
        "body": "A recommendation system is never static. Continuous online bandit testing balances familiar bestsellers with fresh discovery candidates, backed by algorithmic rules that prevent visual fatigue and redundant merchant exposure."
      }
    ]
  },
  "tech-2": {
    "title": "Why Apple Music Shook Its Logo Like Liquid: The Art of Dynamic Motion Design",
    "summary": "Analyzing the physics and emotional resonance behind Apple Music's animated fluid branding and kinetic identity system.",
    "source": "YouTube · Toss Tech",
    "date": "Must Watch",
    "recommendationReason": "Explore how micro-animations and physics simulations communicate brand emotion in modern UI design."
  },
  "tech-3": {
    "title": "Modern Responsive Web Design: Clean Layouts with CSS Grid, Container Queries & Fluid Units",
    "summary": "A practical architecture guide to building scalable, adaptive interfaces without relying on bloated media query chains.",
    "source": "Toss Tech",
    "date": "2d ago",
    "recommendationReason": "Essential layout strategies for modern web developers targeting diverse mobile, tablet, and desktop viewports.",
    "keyPoints": [
      "Mobile-First design philosophy cuts decorative excess to prioritize essential content hierarchy.",
      "CSS Grid minmax() and repeat(auto-fill, ...) construct fluid card grids with zero breakpoint overhead.",
      "Adopting dynamic viewport units (100dvh) and env(safe-area-inset) solves mobile browser URL bar shifting."
    ],
    "sections": [
      {
        "heading": "The Less-is-More Philosophy Starting on Mobile",
        "body": "Starting on desktop canvases tempts designers to fill empty space with unnecessary sidebars and decorative widgets. Designing for 390px mobile viewports first forces focus on the fundamental question: What is the most immediate value for the user?"
      },
      {
        "heading": "Modern CSS Techniques Reducing Media Query Clutter",
        "body": "Modern CSS leverages inherent layout flexibility. The pattern `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` dynamically arranges cards across 1, 2, or 3 columns based on available container width, eliminating brittle breakpoint rules."
      },
      {
        "heading": "New Standards for Mobile Viewports: dvh and Safe Areas",
        "body": "Mobile browser address bars expand and collapse during scroll, breaking legacy 100vh calculations. Today, production applications must utilize 100dvh along with `env(safe-area-inset-bottom)` to prevent buttons from hiding behind native browser chrome."
      }
    ]
  },
  "tech-4": {
    "title": "Python Programming Crash Course: From Core Syntax to Practical Automation in 5 Hours",
    "summary": "A fast-paced hands-on guide covering variables, lists, dictionaries, functions, web scraping, and office task automation.",
    "source": "YouTube · JoCoding",
    "date": "Featured Video",
    "recommendationReason": "Perfect foundational course for beginners aiming to automate repetitive desktop workflows."
  },
  "tech-5": {
    "title": "Prolonging Smartphone Battery Health: The Chemistry of Lithium-Ion Degradation",
    "summary": "Understanding electrochemical aging in lithium-ion cells, thermal throttling, and practical charging habits to double battery cycle longevity.",
    "source": "Samsung Support · Battery Care",
    "date": "4d ago",
    "recommendationReason": "Practical advice on device care, charging limits, and thermal management to protect battery capacity and prevent OLED burn-in.",
    "keyPoints": [
      "Lithium-ion cells endure maximum chemical stress at extreme states of charge (0% deep discharge or 100% full charge).",
      "Maintaining charge levels between 20% and 80% can extend battery lifespan cycles by over twofold.",
      "Managing heat dissipation during fast charging is paramount to prevent electrolyte breakdown and display degradation."
    ],
    "sections": [
      {
        "heading": "Charge Cycles and Electrochemical Degradation",
        "body": "Lithium-ion batteries operate via ion transfer between cathode and anode. At 0% deep discharge, the copper current collector risks dissolution, while sustaining 100% high voltage causes electrolyte decomposition and gas generation. Capping charging at 80~85% preserves long-term cell integrity."
      },
      {
        "heading": "Heat: The Common Enemy of Batteries and Displays",
        "body": "The real danger of fast charging is concurrent temperature rise. Running high-end 3D graphics or recording 4K video while charging exposes cells to temperatures above 45°C, accelerating permanent capacity loss and speeding up OLED organic sub-pixel burn-in."
      },
      {
        "heading": "Three Practical Habits for Everyday Battery Health",
        "body": "First, enable \"Protect Battery\" mode when charging overnight. Second, avoid fast charging under direct sunlight or inside thick insulated cases. Third, plug into a charger before remaining battery drops below the 20% warning threshold."
      }
    ]
  },
  "tech-6": {
    "title": "Git & GitHub Collaboration Mastery: Version Control, Branches & Conflict Resolution",
    "summary": "Essential team workflows from remote repository hygiene to Pull Request code reviews and resolving merge conflicts cleanly.",
    "source": "YouTube · Quick Coding Guide",
    "date": "Must Watch",
    "recommendationReason": "A must-watch masterclass for engineers collaborating on shared production codebases."
  },
  "tech-7": {
    "title": "Kakao Kanana Technical Report: The Future of On-Device AI and Small Language Models",
    "summary": "How lightweight language model architectures run locally on mobile silicon to preserve privacy and enable real-time interaction.",
    "source": "Kakao Tech",
    "date": "Yesterday",
    "recommendationReason": "Deep dive into mobile neural processing architectures and the paradigm of local privacy-first AI.",
    "keyPoints": [
      "On-device AI executes neural models directly on the smartphone NPU without pinging remote cloud servers.",
      "Sensitive user data (conversations, photos, health logs) never leaves the physical device sandbox.",
      "Zero round-trip network latency enables instantaneous interactions even in offline environments."
    ],
    "sections": [
      {
        "heading": "Cloud AI Limits and the Shift to Edge Silicon",
        "body": "While massive cloud LLMs ignited the generative AI boom, they introduced staggering server costs and serious privacy hurdles. Reluctance to transmit private notes and recordings to external servers prompted the development of Small Language Models (SLMs) running directly on device silicon."
      },
      {
        "heading": "NPU Architectures and Integer Quantization",
        "body": "Mobile Neural Processing Units (NPUs) accelerate matrix mathematics with ultra-low power consumption. Combined with 4-bit and 8-bit integer quantization (INT4/INT8), gigabyte-sized weight files are compressed into several hundred megabytes of RAM."
      },
      {
        "heading": "Complete Personalization Inside Your Hands",
        "body": "On-device models learn usage rhythms, calendar appointments, and subject affinities exclusively within the local OS sandbox. Combined with user-driven algorithmic mixers like My-gorithm, it forms an autonomous, private personal companion."
      }
    ]
  },
  "tech-8": {
    "title": "The 3 Mega Projects Leading the AI Era: Physical AI, Advanced Packaging & Eco Data Centers",
    "summary": "Exploring high-bandwidth memory (HBM), 3D semiconductor packaging, physical robotics, and high-efficiency AI data center clusters.",
    "source": "Korea Policy Briefing",
    "date": "Policy Briefing",
    "recommendationReason": "Essential reading to grasp the structural pillars of next-generation hardware and manufacturing ecosystems.",
    "keyPoints": [
      "Next-generation High Bandwidth Memory (HBM) and advanced 3D packaging powering hyper-scale neural computation.",
      "Physical AI integrating artificial intelligence into humanoid robotics, autonomous fleets, and smart factory floors.",
      "Building sustainable, liquid-cooled green data center clusters to meet surging energy demands."
    ],
    "sections": [
      {
        "heading": "Advanced Packaging Reshaping the Semiconductor Landscape",
        "body": "As traditional process shrinking approaches atomic limits, 3D packaging and HBM memory linking separate silicon dies have emerged as the primary technological battleground."
      },
      {
        "heading": "Beyond Code: Physical AI Embodied in Reality",
        "body": "AI is expanding from on-screen text generation to Physical AI embodied in humanoid robots, automated factory cells, and autonomous vehicles that sense, interact with, and manipulate the physical world."
      },
      {
        "heading": "AI Data Centers and Sustainable Energy Infrastructure",
        "body": "Cooling clusters of tens of thousands of GPUs demands liquid cooling technologies and resilient clean energy grids, establishing green data center infrastructure as a core national asset."
      }
    ]
  },
  "tech-9": {
    "title": "Agentic AI: Can Artificial Intelligence Autonomously Plan, Execute, and Reflect?",
    "summary": "An exploration of agentic architectures that break down complex multi-step goals, use external tools, and self-correct across workflows.",
    "source": "Korea Policy Briefing",
    "date": "Future Tech",
    "recommendationReason": "Understand how AI is transitioning from conversational chatbots into autonomous software agents that execute real tasks.",
    "keyPoints": [
      "Agentic AI parses human intent, decomposes high-level goals into sub-tasks, and executes them autonomously.",
      "Combines tool use, long-term memory retrieval, web browsing, and code execution to automate complex workflows.",
      "Requires strict safety guardrails and authorization protocols to prevent unauthorized actions and prompt injection."
    ],
    "sections": [
      {
        "heading": "From Conversational Bots to Action-Oriented Agents",
        "body": "While traditional generative AI answered single questions passively, Agentic AI accepts overarching goals—such as \"compare workshop venues next month and book the best option\"—and executes every prerequisite step sequentially."
      },
      {
        "heading": "The Triad of Agentic Architecture: Planning, Tools, and Reflection",
        "body": "Agents achieve high success rates by combining task planning (breaking down problems), tool utilization (APIs, calculators, shells), and reflection loops that inspect intermediate outputs to self-correct mistakes."
      },
      {
        "heading": "Security and Governance Behind Autonomous Action",
        "body": "Because agents can modify files and execute transactions, robust authorization protocols and Human-in-the-Loop approval checkpoints are indispensable to prevent runaway actions or data loss."
      }
    ]
  },
  "tech-11": {
    "title": "The Tech Powering Virtual Worlds: Real-Time 3D Rendering & Game Hardware",
    "summary": "How modern gaming hardware, ray-tracing pipelines, and global distribution networks construct hyper-realistic virtual spaces.",
    "source": "Wikipedia · Video Game Consoles",
    "date": "Latest Column",
    "recommendationReason": "Understand the cutting-edge intersection of graphics hardware, physics engines, and real-time 3D simulation.",
    "keyPoints": [
      "Dedicated GPU silicon accelerating real-time ray-tracing and geometric shader calculations.",
      "High-speed NVMe SSD architectures eliminating in-game loading screens via asset streaming.",
      "Global low-latency content networks enabling synchronized multi-user simulations."
    ],
    "sections": [
      {
        "heading": "Hardware Convergence in Modern Gaming",
        "body": "Modern gaming consoles share unified x86 CPU architectures, high-speed unified memory, and ray-tracing capable GPUs, democratizing film-grade visual rendering in consumer living rooms."
      },
      {
        "heading": "The Physics of Real-Time Ray Tracing",
        "body": "Rather than relying solely on pre-baked lighting, modern graphics engines calculate billions of virtual photon rays per second to simulate realistic refractions, reflections, and ambient occlusions."
      },
      {
        "heading": "Global Distribution and Seamless World Streaming",
        "body": "Massive virtual game environments are streamed on-the-fly from high-speed SSDs directly into GPU VRAM, allowing gamers to travel vast digital landscapes with zero loading delays."
      }
    ]
  },
  "tech-12": {
    "title": "The Rules Behind Recommendations: How Ranking Algorithms Shape Digital Discovery",
    "summary": "A conceptual study of algorithmic decision sequences, conditional weighting, and automated inference pipelines in content platforms.",
    "source": "Wikipedia · Algorithms",
    "date": "Technology Science",
    "recommendationReason": "Examines the fundamental mechanics of ranking formulas and why transparent user control is essential.",
    "keyPoints": [
      "Algorithms as finite sequences of unambiguous rules transforming user signals into sorted outputs.",
      "Balancing multi-objective loss functions: relevance, freshness, and category diversity.",
      "The importance of transparent algorithmic knobs that place curation sovereignty back in user hands."
    ],
    "sections": [
      {
        "heading": "Defining Algorithmic Sequences",
        "body": "An algorithm is fundamentally a finite sequence of well-defined computational instructions. In recommendation feeds, it transforms user preferences and content metadata into an ordered stream."
      },
      {
        "heading": "Conditional Logic and Decision Thresholds",
        "body": "Modern feed pipelines evaluate hundreds of weighted ranking signals, from historical click propensity to category balance, determining which cards are surfaced and which are excluded."
      },
      {
        "heading": "Transparent Curation vs Black Box Traps",
        "body": "When recommendation algorithms operate secretly to maximize screen addiction, user autonomy suffers. User-tuned architectures restore agency by making weight sliders and formulas completely transparent."
      }
    ]
  },
  "tech-13": {
    "title": "How Artificial Intelligence Makes Decisions: Weights, Probabilities & Explainability",
    "summary": "Demystifying the internal mechanics of deep neural networks: matrix multiplications, attention heads, and probabilistic outputs.",
    "source": "Wikipedia · Artificial Intelligence",
    "date": "AI Theory",
    "recommendationReason": "A clear conceptual primer on how machine learning models generate decisions and navigate hallucination risks.",
    "keyPoints": [
      "Deep learning models as billions of tunable numerical weights optimized via backpropagation.",
      "Probability distributions over vocabulary tokens and latent feature spaces.",
      "The urgent engineering frontier of AI explainability, calibration, and safety alignment."
    ],
    "sections": [
      {
        "heading": "From Static Code to Learned Synaptic Weights",
        "body": "Traditional software relies on explicit human-written conditionals. In contrast, neural networks learn mathematical weights by observing patterns across billions of data examples."
      },
      {
        "heading": "Attention Mechanisms and Contextual Weighting",
        "body": "The Transformer architecture revolutionized AI by enabling models to assign varying mathematical attention to every word in a prompt, capturing nuanced contextual relationships."
      },
      {
        "heading": "Explainability and the Challenge of Trust",
        "body": "As neural networks grow in complexity, understanding why a model arrived at a specific conclusion becomes crucial, driving rapid research into mechanistic interpretability."
      }
    ]
  },
  "tech-14": {
    "title": "How Robots Sense and Navigate: Sensor Fusion, LiDAR, SLAM & Computer Vision",
    "summary": "How autonomous machines perceive unstructured environments, fuse multimodal sensor streams, and execute high-precision movements.",
    "source": "Wikipedia · Robotics",
    "date": "Robotics Science",
    "recommendationReason": "Explore how physical robots map the world and calculate navigation vectors in real-world spaces.",
    "keyPoints": [
      "Sensor fusion combining cameras, ultrasonic detectors, and LiDAR for robust spatial perception.",
      "Simultaneous Localization and Mapping (SLAM) enabling robots to map unknown rooms in real time.",
      "From rigid industrial robotic arms to agile mobile humanoids and service automatons."
    ],
    "sections": [
      {
        "heading": "The Sensory Organs of Machines",
        "body": "Robots rely on complementary sensor suites: cameras provide rich color and semantic textures, while time-of-flight LiDAR sensors measure millimetric depth regardless of ambient lighting."
      },
      {
        "heading": "Real-Time Spatial Mapping with SLAM",
        "body": "SLAM algorithms allow machines to answer two fundamental questions simultaneously: \"Where am I right now?\" and \"What does the surrounding environment look like?\""
      },
      {
        "heading": "Precision Actuation and Motor Control",
        "body": "Turning spatial understanding into movement requires harmonic drive gearboxes and high-frequency closed-loop feedback controllers to ensure smooth, safe physical interaction."
      }
    ]
  },
  "tech-15": {
    "title": "Detecting Malicious Software: Static Disassembly, Sandboxing & Behavioral Profiling",
    "summary": "Inside the cat-and-mouse game of cybersecurity: How security researchers deconstruct malware signatures and analyze suspicious binaries.",
    "source": "Wikipedia · Malware Analysis",
    "date": "Security Analysis",
    "recommendationReason": "Essential concepts of cybersecurity defense, safe code sandboxes, and proactive threat detection.",
    "keyPoints": [
      "Static analysis inspecting PE headers, cryptographic hashes, and compiled opcode patterns without execution.",
      "Dynamic sandboxing observing runtime API calls, process spawning, and network exfiltration attempts.",
      "Heuristic detection models identifying novel zero-day malware based on behavioral anomalies."
    ],
    "sections": [
      {
        "heading": "Static Code Disassembly and Signature Verification",
        "body": "Static analysis examines binary code while at rest. Analysts inspect import address tables, cryptographic certificates, and strings to flag known malicious patterns without executing risk."
      },
      {
        "heading": "Dynamic Behavioral Sandboxes",
        "body": "To bypass obfuscation and code packers, analysts execute files in instrumented virtual machines, monitoring file system modifications, registry edits, and outbound network traffic."
      },
      {
        "heading": "Heuristics and Machine Learning Defense",
        "body": "Modern antivirus engines utilize machine learning models trained on millions of benign and malicious samples, predicting threats based on behavioral intent rather than exact file hashes."
      }
    ]
  },
  "tech-16": {
    "title": "How Computers Understand Human Language: Tokenization, Embeddings & Transformers",
    "summary": "The technological trajectory of Natural Language Processing: From statistical n-grams to high-dimensional semantic vector spaces.",
    "source": "Wikipedia · Natural Language Processing",
    "date": "Language Tech",
    "recommendationReason": "Clear explanation of how raw text characters are converted into mathematical coordinates that algorithms can comprehend.",
    "keyPoints": [
      "Byte-Pair Encoding (BPE) tokenization converting unstructured prose into discrete numeric tokens.",
      "Dense vector embeddings placing semantically related concepts close together in high-dimensional space.",
      "Self-attention mechanisms enabling neural models to track long-distance grammatical dependencies."
    ],
    "sections": [
      {
        "heading": "From Letters to Tokens",
        "body": "Computers cannot read text natively; they compute numbers. Tokenizers dissect sentences into sub-word tokens, creating an indexable numerical vocabulary for neural processing."
      },
      {
        "heading": "The Geometry of Semantics: Vector Embeddings",
        "body": "Word embeddings assign multi-hundred-dimensional vectors to each token. Words with similar meanings or contexts naturally cluster together, allowing mathematical reasoning across concepts."
      },
      {
        "heading": "The Transformer Revolution",
        "body": "Self-attention layers compute cross-token relationships across entire paragraphs simultaneously, allowing models to grasp complex pronouns, humor, and nuanced logical arguments."
      }
    ]
  },
  "tech-17": {
    "title": "Robotic Surgery in Modern Medicine: Sub-Millimeter Precision & 3D Teleoperation",
    "summary": "How robotic armatures, stereoscopic 3D cameras, and tremor-filtering algorithms assist surgeons in performing minimally invasive procedures.",
    "source": "Wikipedia · Robotic Surgery",
    "date": "Medical Tech",
    "recommendationReason": "Examines the engineering triumphs of surgical robotics and how precision mechanical design protects patient outcomes.",
    "keyPoints": [
      "Master-slave teleoperation translating surgeon hand gestures into sub-millimeter robotic tool movements.",
      "Tremor-canceling algorithms and 7 degrees of instrument wrist articulation exceeding human hand agility.",
      "Minimally invasive incisions reducing postoperative pain, blood loss, and patient recovery durations."
    ],
    "sections": [
      {
        "heading": "The Principles of Surgical Teleoperation",
        "body": "In robotic surgery, the surgeon sits at an ergonomic console, manipulating high-sensitivity master grips that translate finger movements into micro-movements of miniaturized arms inside the patient."
      },
      {
        "heading": "Overcoming Human Physical Limitations",
        "body": "Robotic systems filter out natural physiological tremors and offer 360-degree wrist rotations in tight anatomical spaces where human fingers cannot fit, dramatically boosting precision."
      },
      {
        "heading": "Minimizing Surgical Trauma",
        "body": "By operating through keyhole incisions with 3D high-definition magnification, tissue trauma and blood loss are minimized, allowing patients to return home significantly faster."
      }
    ]
  },
  "tech-18": {
    "title": "Google Gemini and Multimodal Intelligence: Intertwining Thought, Vision, and Audio",
    "summary": "Inside native multimodal foundation models: How AI processes text, code, high-resolution imagery, and audio streams in a single unified architecture.",
    "source": "Wikipedia · Gemini (Language Model)",
    "date": "AI Innovation",
    "recommendationReason": "An overview of native multimodal neural architectures and how unified token representations unlock cross-domain reasoning.",
    "keyPoints": [
      "Built from the ground up as native multimodal models rather than stitching separate vision models together.",
      "Massive million-token context windows enabling comprehensive analysis of entire book libraries or codebases.",
      "Versatile deployment across scales, from Ultra clusters down to mobile Nano silicon."
    ],
    "sections": [
      {
        "heading": "The Architecture of Native Multimodality",
        "body": "Past AI architectures connected vision encoders to separate text models, losing subtle cross-modal nuance. Native multimodal models process audio waveforms, video frames, and text tokens inside a unified latent space."
      },
      {
        "heading": "Million-Token Context Horizons",
        "body": "Gemini expanded context windows beyond one million tokens, enabling the model to absorb hours of raw video, hundreds of pages of documentation, and entire GitHub repositories in a single inference call."
      },
      {
        "heading": "From Hyperscale Clouds to Edge Nano",
        "body": "Architecting models across multiple tiers allows lightweight variants like Nano to run securely on smartphone chips while Ultra models tackle complex multi-step reasoning in cloud clusters."
      }
    ]
  },
  "tech-19": {
    "title": "The Landscape of 2D Computer Graphics: Scalable Vectors, Raster Pipelines & Canvas APIs",
    "summary": "The mathematical foundations behind digital images: Bézier curves, rasterization, bitmap compression, and dynamic WebGL rendering.",
    "source": "Wikipedia · 2D Computer Graphics",
    "date": "Visual Tech",
    "recommendationReason": "A foundational look at graphic rendering technologies that power modern mobile screens and browser viewports.",
    "keyPoints": [
      "Vector graphics utilizing mathematical coordinate formulas for infinite lossless scaling.",
      "Raster images mapping discrete color values across high-density pixel grids.",
      "Hardware acceleration leveraging GPU shaders for instantaneous interface compositing."
    ],
    "sections": [
      {
        "heading": "Vectors vs Raster: Mathematical Precision vs Pixel Realism",
        "body": "Vector graphics define shapes through mathematical formulas and Bézier control points, staying razor-sharp at any zoom level. Raster graphics excel at continuous tones in digital photographs by assigning color coordinates to individual pixels."
      },
      {
        "heading": "The Pipeline of Screen Rasterization",
        "body": "Before vector paths or HTML DOM elements appear on display panels, they must be converted into raster pixels via GPU rasterization engines, running at 60 to 120 frames per second."
      },
      {
        "heading": "Modern Web Graphics and GPU Acceleration",
        "body": "Technologies like SVG, Canvas 2D, and WebGL allow web applications to delegate complex rendering directly to device GPUs, ensuring ultra-smooth scrolling and crisp typography."
      }
    ]
  },
  "tech-20": {
    "title": "Creating the Impossible on Screen: The Fusion of Practical Effects & Photorealistic CGI",
    "summary": "How computer graphics, volumetric lighting, and physical camera sensors blend to craft seamless cinematic visual effects.",
    "source": "Wikipedia · Computer Graphics",
    "date": "CGI Innovation",
    "recommendationReason": "Gain insight into the computational physics behind 3D visual effects and cinematic worldbuilding.",
    "keyPoints": [
      "Monte Carlo ray-tracing simulating physical photon transport and material shaders.",
      "Photogrammetry and motion capture recording real-world actors and landscapes into digital assets.",
      "Virtual production LED stages replacing green screens with real-time parallax backgrounds."
    ],
    "sections": [
      {
        "heading": "The Science of Photorealistic Rendering",
        "body": "Modern visual effects rely on physically-based rendering (PBR) that simulates real-world optical phenomena—surface roughness, subsurface scattering in human skin, and atmospheric light diffusion."
      },
      {
        "heading": "Digital Asset Capture and Motion Tracking",
        "body": "High-speed camera rigs capture human facial muscle micro-movements, transferring live actor emotion directly onto computer-generated characters with breathtaking fidelity."
      },
      {
        "heading": "The Revolution of Virtual LED Volumes",
        "body": "Rather than performing in front of green screens, actors now stand within gigantic curved LED volumes that render background parallax in real time via game engines, casting realistic ambient light onto sets."
      }
    ]
  },
  "tech-21": {
    "title": "The Evolution of China's AI Industry: National Infrastructure, Talent & Enterprise Scale",
    "summary": "A macro perspective on China's technological rise: Supercomputing infrastructure, manufacturing robotics, and expansive mobile data ecosystems.",
    "source": "Wikipedia · AI Industry in China",
    "date": "Global Tech",
    "recommendationReason": "Analyzes global geopolitical competition and technical specialization across international artificial intelligence ecosystems.",
    "keyPoints": [
      "Massive domestic consumer data pools fueling rapid computer vision and recommendation engine refinement.",
      "National strategic roadmaps pairing academic institutes with enterprise technology champions.",
      "Heavy investment into physical manufacturing automation and localized semiconductor fabs."
    ],
    "sections": [
      {
        "heading": "Data Scale as an Engine for Vision AI",
        "body": "Widespread mobile payments and urban infrastructure created massive multimodal datasets, giving Chinese tech firms early global leadership in facial recognition, optical character recognition, and logistics routing."
      },
      {
        "heading": "Strategic National Initiatives",
        "body": "Through coordinated multi-year technology roadmaps, government and private sectors established dedicated AI experimental zones and nationwide compute network backbones."
      },
      {
        "heading": "Navigating Hardware Supply Realities",
        "body": "Global trade restrictions spurred massive domestic investments into indigenous chip design, RISC-V architectures, and open-source software frameworks to achieve independent technological resilience."
      }
    ]
  },
  "tech-22": {
    "title": "Underwater Photography: Lighting, Optical Physics & Color Correction Beneath the Waves",
    "summary": "The physics of light attenuation in water: Specialized pressure-resistant housings, strobe synchronization, and restoring lost reds in ocean depths.",
    "source": "Wikipedia · Underwater Photography",
    "date": "Optics & Nature",
    "recommendationReason": "Learn the fascinating optical physics and camera adaptations required to photograph deep marine ecosystems.",
    "keyPoints": [
      "Water selectively absorbs warm wavelengths first, leaving deep waters bathed in monochrome blue.",
      "Submersible camera housings engineered to withstand immense hydrostatic water pressure.",
      "Artificial strobe placement minimizing backscatter reflection from suspended particles."
    ],
    "sections": [
      {
        "heading": "The Optical Physics of Light Attenuation",
        "body": "Water is approximately 800 times denser than air. As light penetrates the ocean surface, red and orange wavelengths are absorbed within the first 5 meters, requiring artificial light or white-balance correction to restore true natural color."
      },
      {
        "heading": "Pressure-Resistant Engineering and Dome Ports",
        "body": "Underwater housings utilize marine-grade aluminum and optical glass domes. The curved dome port corrects for water-induced optical refraction, restoring the camera lens's true wide field of view."
      },
      {
        "heading": "Taming Backscatter with Dual Strobes",
        "body": "Firing camera flashes directly forward reflects off floating plankton and debris, creating white specks called backscatter. Positioning strobes far to the sides at 45-degree angles illuminates the subject while bypassing floating particles."
      }
    ]
  },
  "study-1": {
    "title": "Unlocking Inner Potential with Metacognition: The Psychology of Learning",
    "summary": "Cognitive psychologist Prof. Lisa Son explains how knowing what you truly know vs what you don't transforms learning speed.",
    "source": "YouTube · Sebasi Talk (15 Min to Change the World)",
    "date": "Must Watch",
    "recommendationReason": "Understand the difference between surface familiarity and genuine metacognitive mastery."
  },
  "study-2": {
    "title": "Mindful Archiving: Building a Second Brain That Actually Remembers",
    "summary": "Moving beyond passive note-taking to the Zettelkasten and Cornell methods that turn fleeting insights into permanent intellectual assets.",
    "source": "Harvard Business Review · Neuroscience Archive",
    "date": "Today",
    "recommendationReason": "Build a personalized knowledge management system that connects isolated ideas into actionable wisdom.",
    "keyPoints": [
      "The passive note-taking trap: Transcribing text verbatim creates zero neural memory traces.",
      "The Cornell Note-taking System: Structuring notes into cues, summaries, and main concepts on a single page.",
      "The Zettelkasten method: Linking atomic notes into a dynamic, compounding web of ideas."
    ],
    "sections": [
      {
        "heading": "The Note-taking Trap: Passive Recording vs Active Synthesis",
        "body": "Writing down every word a lecturer speaks feels productive, but cognitive science shows it bypasses deep processing. Transforming notes into original sentences and questions forces active neural synthesis."
      },
      {
        "heading": "The Cornell System: Clean Organization on One Page",
        "body": "Dividing your paper into a wide notes column, a left-hand cue margin, and a bottom summary box naturally guides you through review, synthesis, and self-testing."
      },
      {
        "heading": "Zettelkasten: Compounding Networks of Fragmented Thoughts",
        "body": "Rather than filing notes into rigid folders where they are forgotten, linking individual atomic thoughts creates an interconnected knowledge network that sparks creative breakthroughs."
      }
    ]
  },
  "study-4": {
    "title": "Pomodoro Optimization: 4 Hours of Deep Flow Without Burnout",
    "summary": "The neuroscience of finite human attention and how structured intervals of 25-minute focus and 5-minute rest recharge cognitive energy.",
    "source": "Harvard Business Review · Neuroscience Archive",
    "date": "Yesterday",
    "recommendationReason": "Scientifically proven protocol to eliminate afternoon brain fog and sustain razor-sharp concentration.",
    "keyPoints": [
      "Human prefrontal cortex focus naturally fatigues after 25~45 minutes of continuous cognitive strain.",
      "True rest during breaks: Step away from screens to prevent sensory overload and dopamine depletion.",
      "Advanced Pomodoro tuning: Customizing cycle durations to match personal tasks and circadian rhythms."
    ],
    "sections": [
      {
        "heading": "Attention Limits and the Power of Timeboxing",
        "body": "The human brain cannot maintain peak concentration indefinitely. Timeboxing tasks into distinct 25-minute sprints creates a healthy sense of urgency that silences digital distractions."
      },
      {
        "heading": "The Quality of Rest Dictates the Next Sprint",
        "body": "Scrolling social media during a 5-minute break is not resting; it floods visual pathways with rapid stimuli. Taking a brief walk or stretching with closed eyes restores prefrontal cortex reserves."
      },
      {
        "heading": "Pro Tips for Deep Workers",
        "body": "Bundle smaller administrative tasks into a single 25-minute block. For deep analytical work, expand the interval to 50 minutes followed by a 10-minute restorative pause."
      }
    ]
  },
  "study-5": {
    "title": "USD/KRW at 1,384: The Global Currency War and Macroeconomic Realities",
    "summary": "A clear macro breakdown of Federal Reserve interest rates, geopolitical tensions, and how currency fluctuations ripple across household finance.",
    "source": "YouTube · Sampro TV",
    "date": "Trending Video",
    "recommendationReason": "Essential financial literacy to understand inflation, interest rate shifts, and global currency dynamics."
  },
  "study-6": {
    "title": "Evidence-Based Learning: Spaced Repetition and Active Recall Over Cramming",
    "summary": "Why pulling all-nighters leads to rapid forgetting, and how algorithm-driven spaced retrieval permanently hardens memory traces.",
    "source": "Harvard Business Review · Neuroscience Archive",
    "date": "5d ago",
    "recommendationReason": "Learn the gold-standard learning protocol of cognitive psychology to master exams and professional skills with minimal fatigue.",
    "keyPoints": [
      "The Ebbinghaus forgetting curve shows over 70% of newly acquired information fades within 48 hours without recall.",
      "Spaced repetition algorithms schedule reviews at the exact mathematical moment of impending memory decay.",
      "Active recall via digital flashcards forces synapses to rebuild stronger pathways than passive rereading."
    ],
    "sections": [
      {
        "heading": "Why Cramming Evaporates Right After Exams",
        "body": "All-night cramming places information into transient working memory buffers. Without sleep-driven memory consolidation in the hippocampus, nearly all retained facts evaporate within days."
      },
      {
        "heading": "Spaced Repetition: Defeating the Forgetting Curve",
        "body": "Reviewing a concept just as it begins to slip from memory triggers deep synaptic reinforcement. Spacing reviews over 1 day, 3 days, 1 week, and 1 month locks information into permanent long-term storage."
      },
      {
        "heading": "Building Your Flashcard Defense Line",
        "body": "Apps like Anki automate this algorithm. Crafting concise, single-question flashcards makes daily 10-minute reviews effortless and extraordinarily potent over years."
      }
    ]
  },
  "study-8": {
    "title": "The Feynman Learning Technique: Explaining Complexity in Crystal-Clear Language",
    "summary": "Nobel laureate Richard Feynman's mental model for learning anything: If you cannot explain it to a sixth-grader, you don't truly understand it.",
    "source": "Harvard Business Review · Neuroscience Archive",
    "date": "1w ago",
    "recommendationReason": "Exposes hidden conceptual gaps and cements intuitive mastery over technical topics.",
    "keyPoints": [
      "Choose a target concept and explain it using everyday analogies with zero professional jargon.",
      "Identify the exact friction point where your explanation stumbles, and revisit source materials.",
      "Refine, simplify, and crystallize until the concept feels entirely intuitive and self-evident."
    ],
    "sections": [
      {
        "heading": "The Jargon Trap in Modern Knowledge",
        "body": "Hiding behind esoteric terminology is often a mask for shallow comprehension. Real understanding shines through the ability to describe complex ideas using plain, everyday language."
      },
      {
        "heading": "The 4 Steps of the Feynman Protocol",
        "body": "Step 1: Write down the concept name. Step 2: Teach it to an imaginary child. Step 3: Pinpoint where your explanation falters and reread the core literature. Step 4: Simplify analogies until they are effortless."
      },
      {
        "heading": "From Memorization to Deep Intuition",
        "body": "Once you can explain how a neural network works using a kitchen recipe analogy, the knowledge belongs to you forever, unlocking effortless creative application."
      }
    ]
  },
  "study-9": {
    "title": "Finding Your Personal Learning Style: Aligning Cognitive Strengths with Study Methods",
    "summary": "How individual cognitive processing differences, attention rhythms, and sensory strengths shape effective study habits.",
    "source": "Wikipedia · Cognitive Psychology",
    "date": "Cognitive Science",
    "recommendationReason": "Identify your personal learning rhythms and craft study strategies that leverage your natural strengths.",
    "keyPoints": [
      "Understanding auditory, visual, and kinesthetic information processing styles.",
      "Matching environmental conditions (lighting, noise, desk setup) to your attentional profile.",
      "Continuous self-monitoring to adjust study routines for maximum intellectual energy."
    ],
    "sections": [
      {
        "heading": "Diverse Cognitive Profiles Among Learners",
        "body": "Every individual processes sensory information with distinct efficiency. Some grasp abstract concepts through visual diagrams, while others require verbal discussions or hands-on practice."
      },
      {
        "heading": "Designing an Optimized Study Ecosystem",
        "body": "Aligning your workspace with your sensory preferences—such as using noise-canceling headphones or tactile notebooks—drastically reduces background cognitive friction."
      },
      {
        "heading": "Metacognitive Self-Adjustment",
        "body": "Regularly evaluating which study techniques yield the highest retention per hour allows you to discard ineffective habits and build an agile, enjoyable learning routine."
      }
    ]
  },
  "study-10": {
    "title": "Effortless Vocabulary Acquisition: Mnemonics, Context & Etymology",
    "summary": "Cognitive memory strategies for learning languages: Why root-word etymology and contextual immersion surpass rote vocabulary lists.",
    "source": "Wikipedia · Cognitive Psychology",
    "date": "Language Science",
    "recommendationReason": "Master foreign language vocabulary faster by leveraging linguistic roots and vivid contextual imagery.",
    "keyPoints": [
      "Latin and Greek root-word patterns unlocking dozens of related terms simultaneously.",
      "Contextual sentence immersion anchoring vocabulary into emotional and episodic memory.",
      "Mnemonic keyword associations turning abstract spellings into memorable mental pictures."
    ],
    "sections": [
      {
        "heading": "The Limits of Isolated Word Lists",
        "body": "Memorizing two-column word lists treats vocabulary as abstract symbols without context. Without rich episodic hooks, words quickly fade from memory."
      },
      {
        "heading": "Etymology: The Architectural Skeleton of Words",
        "body": "Understanding prefixes, roots, and suffixes allows you to intuit the meanings of unfamiliar words instantly, turning vocabulary building into an intriguing puzzle."
      },
      {
        "heading": "Contextual Immersion and Dual Coding",
        "body": "Reading engaging stories and associating new vocabulary with vivid mental images engages both verbal and visual memory pathways, dramatically boosting recall speed."
      }
    ]
  },
  "study-11": {
    "title": "Galileo Galilei and the Dawn of Empirical Science: Measuring Truth Through Data",
    "summary": "How empirical observation, mathematical physics, and the telescope shattered dogma and founded the modern scientific method.",
    "source": "Wikipedia · Galileo Galilei",
    "date": "History Archive",
    "recommendationReason": "A historical perspective on how empirical measurement and reproducible experiments revolutionized human knowledge.",
    "keyPoints": [
      "Challenging philosophical dogma through rigorous physical measurement and reproducible experimentation.",
      "Telescopic observations of Jupiter's moons providing concrete empirical proof of the Copernican solar system.",
      "Establishing mathematical relationships as the universal language of physical phenomena."
    ],
    "sections": [
      {
        "heading": "The Paradigm Shift from Philosophical Dogma to Measurement",
        "body": "Before Galileo, natural philosophy relied heavily on Aristotle's abstract deductions. Galileo insisted that true knowledge requires quantifiable observation and verifiable experiments."
      },
      {
        "heading": "The Telescope that Shattered the Heavens",
        "body": "Pointing his homemade telescope to the night sky, Galileo discovered mountains on the moon and four moons orbiting Jupiter, dismantling the ancient belief that all celestial bodies must circle the Earth."
      },
      {
        "heading": "The Legacy of Mathematical Physics",
        "body": "By quantifying the acceleration of falling bodies and the laws of pendulums, Galileo laid the mathematical foundations upon which Isaac Newton would soon build modern physics."
      }
    ]
  },
  "study-12": {
    "title": "Why Some Memories Last a Lifetime While Others Vanish: The Neurobiology of Retention",
    "summary": "An exploration of episodic memory, hippocampal consolidation, emotional encoding, and the biological purpose of forgetting.",
    "source": "Wikipedia · Human Memory",
    "date": "Neuroscience Archive",
    "recommendationReason": "Understand the biological mechanics of how the brain filters daily experiences into permanent long-term memories.",
    "keyPoints": [
      "The hippocampus functioning as an indexer before transferring memories into the cerebral cortex.",
      "Emotional arousal and adrenaline chemically tagging events for priority consolidation.",
      "Forgetting as an active neurobiological optimization process to eliminate clutter and extract abstract concepts."
    ],
    "sections": [
      {
        "heading": "The Gateway of Memory: The Hippocampus",
        "body": "Daily experiences are first processed as temporary synaptic patterns in the hippocampus. During deep slow-wave sleep, these memories are replayed and consolidated into the neocortex for permanent storage."
      },
      {
        "heading": "Why Emotionally Charged Memories Stand the Test of Time",
        "body": "When an event triggers surprise, fear, or joy, the amygdala releases stress hormones that act as biochemical priority tags, ensuring critical survival information is permanently preserved."
      },
      {
        "heading": "The Evolutionary Gift of Forgetting",
        "body": "If our brains retained every trivial sensory input—such as the license plate of every car passed—cognitive processing would freeze. Forgetting allows us to generalize and think conceptually."
      }
    ]
  },
  "study-13": {
    "title": "Unlocking the Secrets of Stars and Exoplanets: Spectroscopy and Modern Astronomy",
    "summary": "How analyzing starlight wavelengths reveals stellar composition, exoplanet atmospheres, and the cosmic history of the universe.",
    "source": "Wikipedia · Astronomy",
    "date": "Astrophysics",
    "recommendationReason": "Discover how astronomical instruments decode invisible light to map the frontiers of the cosmos.",
    "keyPoints": [
      "Spectroscopic absorption lines revealing chemical element fingerprints across billions of light-years.",
      "Transit photometry detecting exoplanet silhouettes as they cross in front of host stars.",
      "Space observatories like James Webb peering through cosmic dust to capture the earliest infant galaxies."
    ],
    "sections": [
      {
        "heading": "Decoding the Colors of Starlight",
        "body": "Every chemical element absorbs and emits specific wavelengths of light. By dispersing starlight through prisms and gratings into spectral lines, astronomers can determine the temperature, density, and chemical makeup of distant stars."
      },
      {
        "heading": "Hunting for Alien Worlds in the Shadows",
        "body": "When an exoplanet passes between its parent star and our telescopes, the star's brightness dips slightly. Analyzing the filtered starlight through the planet's atmosphere allows scientists to detect water vapor, methane, and carbon dioxide."
      },
      {
        "heading": "Looking Back to the Dawn of Time",
        "body": "Because light takes time to travel cosmic distances, infrared space telescopes act as time machines, capturing photons emitted over 13 billion years ago just after the Big Bang."
      }
    ]
  },
  "study-14": {
    "title": "The Uncanny Valley: Why Almost-Human Faces Evoke Deep Unease in Robotics & CGI",
    "summary": "The evolutionary psychology and perceptual neuroscience behind our visceral discomfort when encountering androids that look almost—but not quite—human.",
    "source": "Wikipedia · Uncanny Valley",
    "date": "Psychology Lab",
    "recommendationReason": "Explore the psychological boundaries of human facial perception, robotics design, and synthetic avatars.",
    "keyPoints": [
      "The perceptual cliff where emotional affinity plummets as artificial realism reaches near-human fidelity.",
      "Evolutionary disease-avoidance hypotheses flagging subtle facial asymmetry or unnatural eye movements.",
      "Design strategies in robotics and animation intentionally stylizing characters to stay safely outside the valley."
    ],
    "sections": [
      {
        "heading": "The Origin of the Uncanny Curve",
        "body": "In 1970, roboticist Masahiro Mori hypothesized that as robots appear more human, our emotional response becomes increasingly positive—until a point where subtle flaws turn admiration into sudden revulsion."
      },
      {
        "heading": "Evolutionary Defense Mechanisms in Action",
        "body": "Evolutionary psychologists suggest this unease is a vital survival adaptation designed to keep humans away from diseased corpses or individuals carrying contagious pathogens with altered motor behaviors."
      },
      {
        "heading": "Navigating the Valley in Modern Animation and AI",
        "body": "Studios like Pixar deliberately stylize characters with enlarged eyes and exaggerated proportions to bypass the uncanny valley, creating warm, emotionally resonant digital beings."
      }
    ]
  },
  "study-15": {
    "title": "What Happens Inside the Brain When Solving Puzzles: Working Memory & Insight Moments",
    "summary": "The neurodynamics of problem-solving: Cognitive flexibility, working memory buffers, and the sudden 'Aha!' spark of creative illumination.",
    "source": "Wikipedia · Puzzles & Cognition",
    "date": "Cognitive Psychology",
    "recommendationReason": "Understand how playful puzzles sharpen logical deduction, pattern recognition, and intellectual adaptability.",
    "keyPoints": [
      "Prefrontal cortex managing working memory buffers while systematically testing candidate solutions.",
      "Pattern recognition linking fragmented spatial and numerical clues into coherent heuristics.",
      "The 'Eureka' moment: How incubation periods during rest spark spontaneous creative breakthroughs."
    ],
    "sections": [
      {
        "heading": "Working Memory as an Intellectual Workbench",
        "body": "When tackling complex puzzles like Sudoku or chess tactics, your prefrontal cortex holds multiple provisional moves in mind simultaneously, testing outcomes before committing to action."
      },
      {
        "heading": "Pattern Recognition and Heuristics",
        "body": "Experienced puzzle solvers develop visual and mathematical heuristics that immediately eliminate dead-end choices, transforming broad searches into lightning-fast intuitive decisions."
      },
      {
        "heading": "The Neuroscience of the 'Eureka' Flash",
        "body": "When you step away from a stuck puzzle to shower or take a walk, the brain's default mode network continues subconscious association, suddenly connecting distant neural circuits in a flash of insight."
      }
    ]
  },
  "study-16": {
    "title": "The Magic of Raw Ingredients Becoming Cuisine: The Science of Cooking Chemistry",
    "summary": "Protein denaturation, starch gelatinization, the Maillard reaction, and how heat transforms molecular structures into mouthwatering flavors.",
    "source": "Wikipedia · Culinary Science",
    "date": "Culinary Science",
    "recommendationReason": "Learn the fascinating chemical reactions that dictate flavor, texture, and aroma in everyday cooking.",
    "keyPoints": [
      "Protein denaturation uncoiling tight molecular bonds into tender, flavorful textures.",
      "The Maillard reaction between amino acids and reducing sugars creating golden-brown crusts and deep umami aromas.",
      "The evolutionary significance of cooking in unlocking calorie density that propelled human brain expansion."
    ],
    "sections": [
      {
        "heading": "Denaturation and Gelatinization: Restructuring Texture",
        "body": "Applying heat breaks hydrogen bonds inside proteins, causing them to unfold and coagulate into tender morsels. In starches, heat and water cause granules to swell and gelatinize, creating silky sauces."
      },
      {
        "heading": "The Maillard Reaction: The Holy Grail of Flavor",
        "body": "Above 140°C, amino acids react with sugars on searing meats and baking breads, generating hundreds of new aromatic compounds responsible for savory, roasted, and nutty notes."
      },
      {
        "heading": "Cooking as the Spark of Human Evolution",
        "body": "Anthropologists note that harnessing fire to cook predigested food allowed early hominids to absorb vastly more calories with minimal digestive energy, directly fueling our rapid cranial encephalization."
      }
    ]
  },
  "culture-2": {
    "title": "Appreciating Contemporary Art Without a Docent: Deciphering Concepts and Context",
    "summary": "A friendly guide to exploring modern art galleries: Slow looking, understanding medium choices, and embracing open interpretation.",
    "source": "National Museum of Korea · Curator Talk",
    "date": "Today",
    "recommendationReason": "Overcome the intimidation of abstract and contemporary art with intuitive visual exploration tools.",
    "keyPoints": [
      "Why contemporary art feels abstract: It questions the definition and social context of art itself.",
      "The practice of 'Slow Looking': Putting away smartphones to gaze at a single artwork for a full uninterrupted minute.",
      "Deciphering clues hidden inside the gallery wall caption's 'Medium' and exhibition statement."
    ],
    "sections": [
      {
        "heading": "Why Does Contemporary Art Feel Cryptic?",
        "body": "Historically, art focused on realistic representation. Contemporary art shifted its axis toward conceptual questions: What can be art? Who decides value? Embracing ambiguity is the first step."
      },
      {
        "heading": "Slow Looking: The Lost Art of Contemplation",
        "body": "Studies show the average gallery visitor looks at an artwork for just 8 seconds before snapping a photo. Spending a full 60 seconds reveals unexpected brushstroke textures and emotional nuances."
      },
      {
        "heading": "Finding Narrative Clues in the Caption",
        "body": "Check the medium listed on the placard. If an artist uses discarded plastics or volcanic ash instead of oil paint, the material itself holds the core narrative message of the exhibition."
      }
    ]
  },
  "culture-3": {
    "title": "Relaxing Jazz Piano Radio: Warm Ambient Melodies for Deep Focus and Creative Work",
    "summary": "Gentle, comforting acoustic jazz piano chords perfect for background work, reading, programming, and evening relaxation.",
    "source": "Lofi Girl · ChilledCow",
    "date": "Featured Video",
    "recommendationReason": "Gentle acoustic piano harmonies that reduce stress and promote uninterrupted flow states."
  },
  "culture-4": {
    "title": "'Text Hip' in the Shorts Era: Why Gen Z is Passionately Turning to Physical Books",
    "summary": "Amid digital fatigue from TikTok and YouTube Shorts, young generations are rediscovering physical books as stylish, tactile cultural totems.",
    "source": "Cine21 · Independent & Art Cinema",
    "date": "3d ago",
    "recommendationReason": "Analyzes modern cultural counter-movements embracing analog tactile depth amidst digital overload.",
    "keyPoints": [
      "The rise of 'Text Hip': Turning reading and book ownership into an aesthetic statement of intellectual discernment.",
      "The irreplaceable tactile sensory weight of paper texture, binding scents, and margin annotations.",
      "Independent bookstores evolving into cultural salons curating community and thoughtful conversation."
    ],
    "sections": [
      {
        "heading": "Why Seek Long Texts in an Era of Hyper-Short Clips?",
        "body": "When dopamine-chasing algorithms flood feeds with 15-second videos, cognitive exhaustion naturally follows. Physical books offer a slow sanctuary where readers govern their own pacing and thoughts."
      },
      {
        "heading": "The Tactile Object Quality of Physical Books",
        "body": "Holding paper, flipping pages, and feeling paper grain connects physical touch to intellectual consumption, transforming paper books into cherished artistic objects on personal shelves."
      },
      {
        "heading": "The Aesthetic Curation of Indie Bookstores",
        "body": "Neighborhood independent bookshops curate hand-picked themes, hosting evening reading circles and conversation clubs that foster authentic, intimate human connections."
      }
    ]
  },
  "culture-6": {
    "title": "Theater Etiquette and Seat Selection: An Essential Primer for Musical First-Timers",
    "summary": "A comprehensive guide from picking the best acoustic and sightline zones to intermission timing and respectful curtain call applause.",
    "source": "Cine21 · Independent & Art Cinema",
    "date": "5d ago",
    "recommendationReason": "Essential theater tips to maximize your immersion and visual appreciation at stage performances.",
    "keyPoints": [
      "The golden acoustic sweet spot: Rows 7 through 12 in the center stalls balance stereo mix and visual angles.",
      "Making the most of 20-minute intermissions: Pre-ordering refreshments and avoiding restroom bottlenecks.",
      "Respectful viewing etiquette: Keeping phone screens dark and holding applause for musical endings."
    ],
    "sections": [
      {
        "heading": "Deciphering the Theater Seating Chart",
        "body": "Sitting too close in row 1 strains your neck and drowns out orchestral balance. The acoustic golden zone sits around rows 8 to 12 in the center orchestra, offering panoramic views of choreographies."
      },
      {
        "heading": "Navigating the 20-Minute Intermission",
        "body": "Intermission flies by quickly. Head directly to the restroom when house lights rise, or preorder interval drinks beforehand to relax and discuss act one with companions."
      },
      {
        "heading": "Etiquette that Protects Communal Immersion",
        "body": "Live theater is an intimate shared acoustic bubble. Keeping phones completely powered off and saving applause until the musical chord finishes ensures magical immersion for all."
      }
    ]
  },
  "culture-8": {
    "title": "Independent and Art Cinema Highlights of the Year: Film Festival Curations",
    "summary": "A curated selection of visionary independent films from Cannes, Venice, and Busan that defy commercial Hollywood formulas.",
    "source": "IndieSpace · Art Film Archive",
    "date": "1w ago",
    "recommendationReason": "Discover poetic, provocative independent cinema that expands empathy and visual imagination.",
    "keyPoints": [
      "Cinema that breathes: Exploring deliberate pacing, deep silence, and poetic visual mise-en-scène.",
      "Intimate character studies that illuminate underrepresented human conditions and ethical questions.",
      "Curated recommendations to transform your quiet weekend evening into a festival screening."
    ],
    "sections": [
      {
        "heading": "Cinema Blooming Behind Commercial Formulas",
        "body": "Away from predictable blockbuster tropes, independent cinema explores raw human vulnerabilities and social complexities, using film as a profound medium of personal reflection."
      },
      {
        "heading": "The Poetics of Silence and Negative Space",
        "body": "Visionary directors use lingering ambient soundscapes and quiet pauses to give audiences room to contemplate characters' internal turmoil without manipulative musical cues."
      },
      {
        "heading": "Curated Recommendations for Tonight",
        "body": "Explore intimate coming-of-age tales and atmospheric neo-realist cinema that linger in your heart for weeks long after the end credits roll."
      }
    ]
  },
  "culture-9": {
    "title": "Traditional Heritage on the Global Stage: The Modern Reinterpretation of K-Culture",
    "summary": "How Hanbok fashion, Hanok architecture, and artisan crafts are reimagined as sleek contemporary design icons across the world.",
    "source": "Wikipedia · Korean Traditional Culture",
    "date": "Cultural Heritage",
    "recommendationReason": "Explore how ancient Korean craftsmanship and design philosophies inspire modern architecture and global fashion.",
    "keyPoints": [
      "The five pillars of Korean heritage: Hansik, Hanbok, Hanji, Hangul, and Hanok.",
      "Contemporary designers incorporating traditional natural dyes and minimalist silhouettes.",
      "Global digital platforms celebrating living heritage through immersive modern storytelling."
    ],
    "sections": [
      {
        "heading": "The Five Aesthetic Pillars of Korean Heritage",
        "body": "From the ergonomic beauty of Hangul letterforms to the breathable comfort of Hanok wood-and-stone structures, traditional Korean design embodies harmony with natural cycles."
      },
      {
        "heading": "Traditional Aesthetics in Contemporary Lifestyles",
        "body": "Modern industrial designers are incorporating Hanji paper into acoustic lamps and crafting minimalist streetwear inspired by traditional Hanbok drapery, finding fresh global acclaim."
      },
      {
        "heading": "A Living Heritage Celebrated Worldwide",
        "body": "Rather than sitting behind museum glass, traditional pottery, tea rituals, and music are embraced by youth worldwide as sophisticated, sustainable lifestyle choices."
      }
    ]
  },
  "culture-10": {
    "title": "Immersive Traditional Heritage: Experiencing Historic Hanok Estates and Tea Culture",
    "summary": "Stepping into preserved Joseon scholar academies and historic estates to experience mindful tea ceremonies and calligraphic arts hands-on.",
    "source": "Wikipedia · Korean Traditional Culture",
    "date": "Living Heritage",
    "recommendationReason": "A weekend guide to experiencing historic architecture, serene tea ceremonies, and mindfulness in nature.",
    "keyPoints": [
      "Restored historic estates offering immersive weekend stay programs away from urban hustle.",
      "The multi-sensory art of Korean tea ceremonies (Dado): Aroma, visual clarity, and temperature mindfulness.",
      "Family-friendly heritage workshops blending history, traditional confectionery, and landscape exploration."
    ],
    "sections": [
      {
        "heading": "Historic Estates Reborn as Welcoming Retreats",
        "body": "Century-old scholar academies (Seowon) and traditional estates have opened their wooden gates, allowing travelers to sleep on heated ondol floors and listen to rain tapping against clay roof tiles."
      },
      {
        "heading": "The Mindful Art of the Korean Tea Ceremony",
        "body": "Unlike fast-paced espresso routines, the slow pouring and contemplation of green tea teaches patience and sensory awareness, soothing frayed modern nerves."
      },
      {
        "heading": "Weekend Escapes for the Whole Family",
        "body": "From natural indigo dye workshops to woodblock printing, hands-on cultural programs provide joyful, tactile bonding experiences across generations."
      }
    ]
  },
  "culture-11": {
    "title": "The History and Phenomenon of Pokémon: From Game Boy Cartridge to Global Cultural Icon",
    "summary": "The 30-year evolution of the Pokémon franchise: Satoshi Tajiri's insect-collecting childhood memories, social trading, and global transmedia synergy.",
    "source": "Wikipedia · Pokémon Franchise",
    "date": "Pop Culture Archive",
    "recommendationReason": "A cultural and business study of the world's most profitable entertainment franchise and social gaming phenomenon.",
    "keyPoints": [
      "The humble origin: Capturing the nostalgic magic of childhood bug collecting on a Game Boy link cable.",
      "The core triumvirate of gameplay: Collect, Train, and Trade fostering real-world friendships.",
      "Flawless transmedia integration across anime, trading cards, mobile AR, and retail empires."
    ],
    "sections": [
      {
        "heading": "A Legend Born on a Tiny Monochrome Screen",
        "body": "In 1996, Satoshi Tajiri channeled his childhood memories of catching beetles in rural forests into a portable RPG, creating a digital world where players could capture magical creatures."
      },
      {
        "heading": "Social Connectivity as Game Mechanics",
        "body": "By requiring players to use a physical Link Cable to trade monsters exclusive to Red or Blue versions, Pokémon pioneered social networking through video gaming long before social media existed."
      },
      {
        "heading": "The Apex of Global Transmedia Empires",
        "body": "By synchronizing video games with a hit animated television series, physical trading cards, and movies, Pokémon became the highest-grossing media franchise in entertainment history."
      }
    ]
  },
  "culture-12": {
    "title": "Narrative Architecture in Television Dramas: Pacing, Cliffhangers & Emotional Resonance",
    "summary": "How scriptwriters structure episode arcs, develop multifaceted character flaws, and weave societal themes into compelling living-room dramas.",
    "source": "Wikipedia · Television Drama",
    "date": "Media Studies",
    "recommendationReason": "Analyze the storytelling engines and psychological hooks that make episodic dramas universally captivating.",
    "keyPoints": [
      "The rise of serialized television as the dominant modern novel of our cultural era.",
      "Three-act episode structures ending on carefully calibrated cliffhangers to sustain suspense.",
      "Reflecting contemporary societal anxieties, family dynamics, and justice themes through character choices."
    ],
    "sections": [
      {
        "heading": "Television as the Modern Novel",
        "body": "With hours of narrative real estate, television dramas allow character arcs to breathe and evolve slowly, exploring moral ambiguities that standard two-hour films must truncate."
      },
      {
        "heading": "The Anatomy of the Episodic Cliffhanger",
        "body": "Master screenwriters structure each episode with clear micro-resolutions while ending on unresolved narrative questions that spark passionate water-cooler debate."
      },
      {
        "heading": "Reflecting the Zeitgeist of Society",
        "body": "From workplace dramas tackling corporate inequality to family sagas exploring changing gender roles, episodic series hold a mirror to contemporary social shifts."
      }
    ]
  },
  "culture-13": {
    "title": "Defining the Adolescent Mind: Distinct Psychological and Social Milestones",
    "summary": "Inside the teenage brain: The limbic system developing ahead of the prefrontal cortex, peer identity formation, and supporting emotional transitions.",
    "source": "Wikipedia · Adolescent Psychology",
    "date": "Developmental Psychology",
    "recommendationReason": "Insights into cognitive and emotional transformations during youth to foster deeper empathy across generations.",
    "keyPoints": [
      "The transitional bridge between dependent childhood and autonomous adult identity.",
      "Neurodevelopmental imbalance: Reward centers surge while executive risk-assessment matures into the mid-20s.",
      "The supportive role of educators, family communication, and constructive creative outlets."
    ],
    "sections": [
      {
        "heading": "The Great Psychological Metamorphosis",
        "body": "Adolescence is not merely a biological growth spurt; it is a profound identity revolution where individuals construct their moral boundaries and question inherited social norms."
      },
      {
        "heading": "The Neurobiology of Risk and Passion",
        "body": "During teenage years, the emotional limbic system reaches full maturity while the rational prefrontal cortex is still pruning synapses, explaining heightened emotional sensitivity and boldness."
      },
      {
        "heading": "The Power of Empathetic Mentorship",
        "body": "Providing teenagers with safe environments to take healthy risks, express artistic identity, and discuss doubts without fear of judgment anchors lifelong emotional resilience."
      }
    ]
  },
  "culture-14": {
    "title": "The Evolution and Identity of American Popular Culture: A Global Mosaic",
    "summary": "How immigrant traditions, African American musical roots, Hollywood cinema, and consumer technology blended into an influential global cultural export.",
    "source": "Wikipedia · American Culture",
    "date": "Cultural Anthropology",
    "recommendationReason": "Explore how historical migrations, democratic ideals, and industrial media shaped the landscape of modern popular entertainment.",
    "keyPoints": [
      "The cultural melting pot blending European, African, and Indigenous heritages into distinct art forms.",
      "Jazz, blues, rock, and hip-hop as foundational musical revolutions born from community struggle.",
      "Hollywood and Silicon Valley acting as global conduits projecting narrative archetypes worldwide."
    ],
    "sections": [
      {
        "heading": "A Mosaic Forged Through Migration",
        "body": "American culture is not a monolithic heritage but a dynamic mosaic where immigrant communities constantly cross-pollinated food, language, and artistic expressions."
      },
      {
        "heading": "The African American Roots of Modern Sound",
        "body": "From Delta blues and New Orleans jazz to Motown soul and Bronx hip-hop, African American innovators created the rhythmic and harmonic vocabulary that underpins global popular music."
      },
      {
        "heading": "Cinema and the Export of Narrative Ideals",
        "body": "Through the silver screens of Hollywood, American storytelling popularized ideals of individual freedom, optimism, and reinvention, shaping cultural aspirations worldwide."
      }
    ]
  },
  "culture-15": {
    "title": "Sungnyung: The Cultural and Digestive Wisdom of Scorched Rice Tea in Korean Living",
    "summary": "The culinary origins of toasted rice tea brewed in traditional cast-iron cauldrons: Enzymatic digestion, warmth, and the comforting finish of Korean dining.",
    "source": "Wikipedia · Sungnyung (Scorched Rice Tea)",
    "date": "Culinary History",
    "recommendationReason": "Discover the zero-waste heritage and gentle digestive science behind Korea's oldest traditional post-meal beverage.",
    "keyPoints": [
      "Born from cast-iron cauldrons (Gamasot) naturally toasting bottom rice into crispy Nurungji.",
      "Enzymatic and dextrin benefits soothing the digestive tract after robust, savory meals.",
      "A distinctive culinary symbol of warmth, zero waste, and communal hospitality across generations."
    ],
    "sections": [
      {
        "heading": "Born from the Cast-Iron Cauldron",
        "body": "When traditional Korean cooks scooped rice from heavy iron Gamasot cauldrons, a golden, nutty layer of scorched rice remained. Boiling water poured over this crust created Sungnyung."
      },
      {
        "heading": "Digestive Chemistry in a Bowl",
        "body": "The toasting process breaks down starches into easily digestible dextrins. Drinking warm Sungnyung after salty or spicy dishes washes the palate and gently settles stomach acid."
      },
      {
        "heading": "Hospitality and Zero-Waste Philosophy",
        "body": "Serving piping-hot Sungnyung to guests marked the harmonious conclusion of a shared meal, embodying an ancient Korean ethos where nothing cultivated with care went to waste."
      }
    ]
  },
  "culture-16": {
    "title": "The Platform Architecture of Food Delivery: Urban Logistics, Apps & Dining Lifestyles",
    "summary": "How mobile dispatch algorithms, cloud kitchens, and two-sided marketplaces transformed metropolitan culinary culture and everyday dinner tables.",
    "source": "Wikipedia · Food Delivery Platforms",
    "date": "Urban Sociology",
    "recommendationReason": "An analytical look into how mobile delivery networks alter city traffic, restaurant business models, and household dining habits.",
    "keyPoints": [
      "Routing algorithms pairing rider coordinates, kitchen prep times, and traffic data in real time.",
      "The rise of cloud kitchens and ghost restaurants optimized entirely for online app storefronts.",
      "Shifting social rituals from home cooking and formal restaurant visits toward on-demand dining convenience."
    ],
    "sections": [
      {
        "heading": "The Algorithmic Orchestration of Urban Dinners",
        "body": "Behind every delivery app lies an intricate dispatch engine balancing kitchen preparation estimations, rider locations, traffic bottlenecks, and customer delivery windows in milliseconds."
      },
      {
        "heading": "The Ghost Kitchen Revolution",
        "body": "Eliminating the need for prime street-level retail space, commercial ghost kitchens allow innovative chefs to test regional menus with minimal overhead and rapid iteration."
      },
      {
        "heading": "The Evolving Definition of the Family Meal",
        "body": "While delivery apps offer unmatched convenience for busy households, sociologists also examine the changing social rituals as collective family cooking is increasingly outsourced to mobile platforms."
      }
    ]
  },
  "culture-17": {
    "title": "The Dynamic Flavor Balance of Thai Cuisine: Sweet, Sour, Spicy, and Umami Harmonies",
    "summary": "A culinary journey through Southeast Asia: Fresh lemongrass, galangal, kaffir lime, and the aromatic balance that makes Thai food globally irresistible.",
    "source": "Wikipedia · Thai Cuisine",
    "date": "Gastronomy Culture",
    "recommendationReason": "Learn how contrasting aromatics and herbs create one of the most vibrant flavor profiles in global gastronomy.",
    "keyPoints": [
      "The sacred quartet of Thai cooking: balancing sweet palm sugar, tart lime, fiery chilis, and savory fish sauce.",
      "Aromatic herb bouquets of lemongrass, galangal, cilantro roots, and crushed kaffir lime leaves.",
      "Regional diversity from the coconut curries of the south to the fiery herbal salads of the northeastern Isan plateau."
    ],
    "sections": [
      {
        "heading": "The Symphony of Four Flavors",
        "body": "Thai chefs strive for dynamic tension in every dish. A single spoonful of Tom Yum soup simultaneously sparks sharp lime acidity, deep fish sauce umami, chili heat, and a mellow sweetness."
      },
      {
        "heading": "Fresh Aromatics Over Dried Spices",
        "body": "Unlike cuisines that rely heavily on dried spice powders, Thai cooking pounds fresh rhizomes and bruised leaves in stone mortars, preserving lively, volatile herbal oils."
      },
      {
        "heading": "Rich Regional Diversity",
        "body": "From the rich coconut-infused curries of the lush southern peninsula to the pungent herbal broths of the northern mountains, Thailand's geography offers endless gastronomic wonder."
      }
    ]
  },
  "culture-18": {
    "title": "Regional Gastronomy Across China: Eight Great Culinary Traditions and Philosophy",
    "summary": "From Sichuan numbing spice and Cantonese seafood delicacy to Shandong banquets: How geography and Taoist balance shape Chinese culinary heritage.",
    "source": "Wikipedia · Chinese Culinary Traditions",
    "date": "East Asian Food Culture",
    "recommendationReason": "Explore the vast regional diversity, wok hei techniques, and communal dining philosophies of Chinese culinary culture.",
    "keyPoints": [
      "The Eight Great Culinary Traditions reflecting distinct climates, trade routes, and local agriculture.",
      "Wok Hei: The breath of the wok imparting smoky complexity through high-heat searing.",
      "Dining as communal harmony: Shared circular lazy Susans and the philosophical balance of Yin and Yang."
    ],
    "sections": [
      {
        "heading": "The Eight Great Regional Schools",
        "body": "China's vast geography gave birth to eight distinct culinary canons—from the numbing peppercorn heat of Sichuan to the light, ingredient-focused steamed delicacies of coastal Canton."
      },
      {
        "heading": "Wok Hei: The Elusive Breath of the Wok",
        "body": "Master chefs manipulate scorching cast-iron woks over roaring flames, vaporizing micro-droplets of oil to impart a prized smoky essence into flash-fried vegetables and meats."
      },
      {
        "heading": "Food as Medicine and Harmony",
        "body": "Rooted in traditional medicine, Chinese cuisine pairs warming and cooling ingredients to promote bodily equilibrium, using shared banquets as joyful celebrations of family unity."
      }
    ]
  },
  "culture-19": {
    "title": "Everyday Aesthetics on the Japanese Dining Table: Seasonality, Vessel & Balance",
    "summary": "The philosophy of Ichiju-sansai (one soup, three dishes), seasonal ingredients (Shun), and visual harmony in traditional Japanese dining.",
    "source": "Wikipedia · Japanese Gastronomy",
    "date": "Japanese Culinary Heritage",
    "recommendationReason": "Gain insight into the refined visual presentation, fermentation heritage, and seasonal mindfulness of Washoku dining.",
    "keyPoints": [
      "Ichiju-Sansai: The nutritional balance of steamed rice, dashi miso soup, and three complementary side dishes.",
      "Celebrating 'Shun': The fleeting peak moment when a fish, vegetable, or mushroom tastes at its absolute prime.",
      "Vessel aesthetics: Choosing handmade ceramics and lacquerware that mirror the changing seasons."
    ],
    "sections": [
      {
        "heading": "The Balanced Geometry of Ichiju-Sansai",
        "body": "Traditional Japanese tables follow an ergonomic formula: rice on the left, soup on the right, and three seasonal dishes arranged behind, ensuring nutritional harmony and mindful eating."
      },
      {
        "heading": "The Ephemeral Beauty of Shun",
        "body": "Japanese cuisine reveres 'Shun'—the fleeting 10-day window when seasonal produce possesses peak sweetness and fragrance, connecting diners intimately with nature's calendar."
      },
      {
        "heading": "Visual Harmony Through Ceramics",
        "body": "An old proverb says: 'Japanese food is eaten with the eyes.' Irregular earthenware bowls in autumn and cool translucent glassware in summer reflect the seasonal environment outside."
      }
    ]
  },
  "culture-20": {
    "title": "Combining Live Action with Open-Source CGI: The Legacy of 'Tears of Steel'",
    "summary": "How the Blender Foundation proved that open-source software and open licenses can produce studio-caliber visual effects and sci-fi cinema.",
    "source": "Wikipedia · Tears of Steel (Open Movie)",
    "date": "Open Source Cinema",
    "recommendationReason": "A milestone study in open-source creativity, digital visual effects, and collective global collaboration.",
    "keyPoints": [
      "Live-action footage shot in Amsterdam blended with full 3D robotic armatures and post-apocalyptic environments.",
      "Blender open-source 3D suite used for camera tracking, compositing, color grading, and rendering.",
      "Creative Commons licensing releasing all project assets, scripts, and 3D rigs freely for global learners."
    ],
    "sections": [
      {
        "heading": "A Bold Experiment in Open-Source Cinema",
        "body": "In 2012, the Blender Foundation brought international VFX artists to Amsterdam to shoot a live-action science-fiction short, aiming to push open-source tools to professional Hollywood limits."
      },
      {
        "heading": "Breakthroughs in Open-Source Visual Pipelines",
        "body": "Production of 'Tears of Steel' drove major improvements in Blender's native motion tracking, green-screen keying, and node-based compositing, proving proprietary software was no longer mandatory."
      },
      {
        "heading": "The Generosity of Open Collaboration",
        "body": "Every digital asset, raw 4K camera frame, and textured 3D mech model was released freely to the public under Creative Commons licenses, providing an invaluable masterclass for aspiring digital filmmakers."
      }
    ]
  },
  "culture-21": {
    "title": "The Evolutionary History of Song: From Prehistoric Chants to Modern Recorded Music",
    "summary": "Why humans sing: The social bonding of communal singing, acoustic storytelling, and the recording technology revolution.",
    "source": "Wikipedia · History of Song & Singing",
    "date": "Music History",
    "recommendationReason": "An anthropological and musicological survey of how human voice and melodic harmony shaped civilization.",
    "keyPoints": [
      "Singing as an ancient communal bonding tool pre-dating complex spoken syntactical language.",
      "Troubadours, bards, and folk songs transmitting historical lore and moral philosophy across generations.",
      "The 20th-century recording revolution transforming singing from ephemeral live moments into universal global culture."
    ],
    "sections": [
      {
        "heading": "The Voice as Our First Musical Instrument",
        "body": "Evolutionary anthropologists believe rhythmic vocalizing helped early hominids synchronize group emotions, sooth infants, and build tribal solidarity long before written words existed."
      },
      {
        "heading": "The Bardic Tradition of Oral History",
        "body": "Across ancient civilizations, traveling bards encoded genealogical histories, heroic epics, and moral philosophies into rhyming verses that could be easily remembered and sung by heart."
      },
      {
        "heading": "The Phonograph and Democratic Listening",
        "body": "The invention of sound recording liberated music from physical performance halls, allowing human voices from every continent to resonate inside living rooms around the world."
      }
    ]
  },
  "culture-22": {
    "title": "How Feminist Movements Reshaped Society: Suffrage, Workplace Rights & Modern Discourse",
    "summary": "A historical reflection on feminist milestones: The fight for voting rights, reproductive autonomy, workplace pay equity, and contemporary intersectional solidarity.",
    "source": "Wikipedia · Feminist Movements",
    "date": "Social History",
    "recommendationReason": "A historical and sociological overview of civil rights milestones that expanded legal, social, and economic equality.",
    "keyPoints": [
      "First-wave suffrage movements securing fundamental constitutional voting rights for women.",
      "Second and third waves breaking professional barriers, advocating equal workplace pay, and challenging cultural stereotypes.",
      "Contemporary intersectional dialogues championing universal human dignity across diverse backgrounds."
    ],
    "sections": [
      {
        "heading": "The Battle for the Ballot: First-Wave Suffrage",
        "body": "In the late 19th and early 20th centuries, courageous suffragettes endured imprisonment and public ridicule to win the foundational democratic right to vote and hold public office."
      },
      {
        "heading": "Dismantling Institutional Barriers",
        "body": "Mid-20th-century feminist movements expanded the struggle into higher education, corporate boardrooms, and legal protections against domestic violence and workplace discrimination."
      },
      {
        "heading": "Intersectional Solidarity in the 21st Century",
        "body": "Modern feminist discourse recognizes that gender equality intersects deeply with socioeconomic class, ethnicity, and disability, working toward universal justice for all marginalized communities."
      }
    ]
  },
  "culture-23": {
    "title": "The Culture of Omakase: Chef's Intuition, Seasonality & Gastronomic Storytelling",
    "summary": "Entrusting your dinner to the chef: Counter-side dialogue, knife craftsmanship, fish aging techniques, and the modern experience economy of fine dining.",
    "source": "Wikipedia · Omakase Dining Culture",
    "date": "Gourmet Trends",
    "recommendationReason": "Understand the culinary etiquette, knife mastery, and hospitality philosophy behind personalized omakase dining.",
    "keyPoints": [
      "Omakase literally meaning 'I leave it up to you': A relationship of trust between diner and artisan chef.",
      "Counter seating turning dining into an intimate, front-row theatrical performance of precision knife work.",
      "A cultural manifestation of the modern experience economy where diners invest in authentic craftsmanship."
    ],
    "sections": [
      {
        "heading": "The Philosophy of Trust: Entrusting Your Meal",
        "body": "Unlike ordering from fixed menus, omakase asks the guest to surrender control to the chef, who curates a bespoke succession of dishes based on morning fish-market catches and guest reactions."
      },
      {
        "heading": "Intimate Counter Hospitality (Omotenashi)",
        "body": "Sitting directly across from the master allows diners to observe knife angles, precise rice seasoning temperatures, and subtle culinary pacing, fostering warm personal connection."
      },
      {
        "heading": "The Rise of Experiential Gastronomy",
        "body": "In modern cities, omakase has expanded into hanwoo beef, coffee, and dessert bars, reflecting consumers' desire to trade mass consumption for bespoke, memorable artisanal encounters."
      }
    ]
  },
  "hobby-1": {
    "title": "Running Form Fundamentals: Midfoot Landing, Cadence & Knee Injury Prevention",
    "summary": "The biomechanics of safe running: Why overstriding ruins knee joints, how to establish a 180 SPM cadence, and upright core posture.",
    "source": "YouTube · Running Fundamentals",
    "date": "Must Watch",
    "recommendationReason": "Essential mechanics guide for runners of all levels to enjoy effortless strides without shin splints or knee pain."
  },
  "hobby-2": {
    "title": "Home Hand-Drip Pour Over Essentials: Roasting Profiles, Grind Size & Water Ratios",
    "summary": "A step-by-step masterclass: Blooming timers, pouring circles, water temperatures, and choosing between Hario V60 and Kalita Wave.",
    "source": "Specialty Coffee Association (SCA) Korea",
    "date": "Today",
    "recommendationReason": "Master specialty coffee brewing at home with precise extraction science and aromatic balance.",
    "keyPoints": [
      "The holy triad of pour over: coffee bean freshness, uniform grind particle distribution, and 90~93°C water temperature.",
      "The blooming stage: 40 seconds of pre-wetting to degas CO2 and open the bed for optimal flavor extraction.",
      "Dripper geometry: Conical Hario V60 highlighting bright acidity vs flat-bottom Kalita Wave emphasizing sweet body."
    ],
    "sections": [
      {
        "heading": "The Three Decisive Variables in Every Cup",
        "body": "Hand-drip coffee is accessible science. Balancing freshly roasted beans, a 1:15 to 1:16 coffee-to-water ratio, and 92°C filtered water extracts sweet fruit notes while avoiding bitter over-extraction."
      },
      {
        "heading": "Blooming: Opening Coffee's Lungs in 40 Seconds",
        "body": "Pouring twice the coffee's weight in hot water and pausing for 40 seconds allows trapped carbon dioxide gas to escape, creating a permeable coffee bed for uniform solvent extraction."
      },
      {
        "heading": "Choosing Your Dripper: Conical vs Flat Bed",
        "body": "The conical Hario V60 features a single large exit hole and spiraled ribs, producing a bright, clean, tea-like clarity. The flat-bottom Kalita Wave slows flow rate, yielding rounded sweetness and rich body."
      }
    ]
  },
  "hobby-4": {
    "title": "5 Hardy Air-Purifying Indoor Plants That Thrive Even in Low Indirect Light",
    "summary": "Rescue your home garden: Understanding light thresholds, soil drainage, bottom-watering, and top air-cleaning houseplants for beginners.",
    "source": "National Institute of Forest Science · Indoor Gardening",
    "date": "2d ago",
    "recommendationReason": "Beginner-friendly indoor plant care tips to green your living space and purify indoor air effortlessly.",
    "keyPoints": [
      "The number one killer of indoor houseplants is chronic overwatering, not underwatering.",
      "Understanding indoor light: Bright indirect light near windows vs low light in corners.",
      "Top 5 beginner champions: Snake Plant, ZZ Plant, Pothos, Peace Lily, and Monstera."
    ],
    "sections": [
      {
        "heading": "Escaping the 'Plant Killer' Curse",
        "body": "Most indoor plants perish from root rot caused by stagnant water in dense soil. Roots require oxygen as much as moisture. Always ensure pots have drainage holes and allow topsoil to dry before watering."
      },
      {
        "heading": "Checking Soil and Bottom-Watering Secrets",
        "body": "Insert a wooden chopstick 3cm into the pot; if it comes out clean and dry, it is time to water. Bottom-watering by letting the pot sit in a saucer of water encourages deep, sturdy root growth."
      },
      {
        "heading": "Top Beginner Indoor Plant Champions",
        "body": "Snake plants and ZZ plants thrive on neglect and handle dim light effortlessly. For trailing green aesthetics, resilient golden pothos forgives forgotten waterings while purifying air."
      }
    ]
  },
  "hobby-5": {
    "title": "Authentic Korean-Style Aglio e Olio: Garlic-Infused Pasta with a Savory K-Twist",
    "summary": "Culinary secrets to rich pasta: Emulsifying starchy pasta water with olive oil, golden garlic browning, and a pinch of savory seasoned salt.",
    "source": "YouTube · Paik Jong-won Cooking",
    "date": "Featured Video",
    "recommendationReason": "Master the Italian classic with clever Korean home-cooking tips for rich, non-greasy garlic pasta."
  },
  "hobby-6": {
    "title": "iPad Drawing and Urban Sketching: Embracing Imperfection in Everyday Line Art",
    "summary": "Overcoming blank-canvas fear: Quick gesture doodles, traveling with a digital stylus, and building your personal color palette.",
    "source": "Urban Sketchers Archive",
    "date": "4d ago",
    "recommendationReason": "Inspires creative confidence to capture everyday street scenes and travel memories through relaxing line sketches.",
    "keyPoints": [
      "The magic of doodling: Erasing perfectionism by embracing wobbly, organic hand-drawn lines.",
      "Urban sketching philosophy: Recording the authentic sensory atmosphere of a travel moment in 15 minutes.",
      "Building signature digital color palettes with muted pastel tones and textured ink brushes."
    ],
    "sections": [
      {
        "heading": "Curing Blank Canvas Paralysis with Quick Doodles",
        "body": "Staring at an empty white digital canvas can be intimidating. Starting with loose, continuous contour lines without lifting your stylus trains your eye to see shapes rather than judgment."
      },
      {
        "heading": "Urban Sketching: Preserving Travel Moments Forever",
        "body": "A digital sketch captures memories far more vividly than a quick smartphone snap. Sitting on a bench for 15 minutes to sketch a historic café cements the sound of chatter and the afternoon breeze into memory."
      },
      {
        "heading": "Crafting Your Personal Color Palette",
        "body": "Limit each drawing to two or three harmonized colors. Using soft watercolor wash brushes with paper-texture overlays creates warm, inviting analog textures directly on your iPad."
      }
    ]
  },
  "hobby-8": {
    "title": "Air Fryer Golden Butter Scones: Crisp on the Outside, Fluffy on the Inside",
    "summary": "The perfect weekend baking project: Cold butter 'sanding' technique, creating flaky layers, and foolproof air fryer temperature settings.",
    "source": "Home Baking Laboratory",
    "date": "1w ago",
    "recommendationReason": "Simple, fail-safe home baking guide to enjoy freshly baked European-style bakery scones in 20 minutes.",
    "keyPoints": [
      "The golden rule of flaky scones: Keep unsalted butter icy cold until entering the oven.",
      "Sanding technique: Gently rubbing butter cubes into flour until pea-sized crumbs form.",
      "Air fryer baking secrets: 170°C for 15 minutes yields a golden crust and pillowy, moist interior."
    ],
    "sections": [
      {
        "heading": "The Ultimate Gateway to Home Baking: Scones",
        "body": "Unlike sourdough or macarons that require hours of proofing and exacting humidity control, buttery British scones come together in a single mixing bowl in under 15 minutes."
      },
      {
        "heading": "Protect the Butter: Sanding and Layering",
        "body": "Never let your butter melt into the dough. Cold butter cubes expand into steam pockets during baking, creating signature flaky layers and a melt-in-your-mouth crumb."
      },
      {
        "heading": "Air Fryer Settings for Golden Perfection",
        "body": "Preheat your air fryer to 180°C. Brush the tops of your cut scone triangles with milk or egg wash for a lustrous sheen, and bake at 170°C for 14 to 16 minutes until delightfully golden."
      }
    ]
  },
  "hobby-9": {
    "title": "Doenjang Mayo Kimchi Fried Rice: An Addictive Savory Korean Fusion Recipe",
    "summary": "Why adding half a spoon of Korean fermented soybean paste and a swirl of mayonnaise elevates standard kimchi fried rice into restaurant-grade comfort food.",
    "source": "WorldSkills Korean Cuisine Archive",
    "date": "Cooking Tips",
    "recommendationReason": "A creative culinary hack that balances acidic kimchi with rich, savory fermented depth.",
    "keyPoints": [
      "A teaspoon of Doenjang adds deep savory umami that rounds out sharp, fermented kimchi acidity.",
      "Coating cooked rice in mayonnaise before stir-frying separates individual grains for a non-soggy texture.",
      "Finishing with a crispy sunny-side-up egg and toasted seaweed strips for the ultimate comfort meal."
    ],
    "sections": [
      {
        "heading": "The Secret Flavor Weapon: Fermented Doenjang",
        "body": "Standard kimchi fried rice can sometimes taste overly sour or one-dimensional. Searing half a teaspoon of Korean fermented soybean paste with scallion oil adds deep umami undertones."
      },
      {
        "heading": "Mayonnaise: The Grain-Separating Hack",
        "body": "Mixing a tablespoon of mayonnaise into chilled rice before adding it to the wok coats each grain in oil and egg lecithin, ensuring individual grains fry crisp rather than clumping."
      },
      {
        "heading": "High-Heat Assembly and Plating",
        "body": "Stir-fry well-aged kimchi until caramelized, toss in the coated rice over roaring heat, and press against the bottom of the pan for a minute to achieve coveted crispy rice (Nurungji) bottoms."
      }
    ]
  },
  "hobby-10": {
    "title": "Smartphone Photography Masterclass: Composition, Natural Lighting & Perspective",
    "summary": "Take professional photographs on your phone: Enabling 3x3 grid lines, reading natural directional light, and manual exposure locks.",
    "source": "Smartphone Photography Academy",
    "date": "Photography Tips",
    "recommendationReason": "Instantly transform everyday travel and food snapshots into striking, gallery-worthy photographs.",
    "keyPoints": [
      "Always clean your camera lens glass to eliminate hazy light glare and smudged reflections.",
      "Activate the 3x3 grid rule of thirds, placing key subjects along intersecting grid lines.",
      "Tap and slide to manually lock focus and dial down exposure, preserving rich shadow details."
    ],
    "sections": [
      {
        "heading": "The Most Neglected Step: Cleaning Your Lens",
        "body": "Smartphone lenses pick up finger oils constantly in pockets. Wiping the lens with your shirt before snapping a photo eliminates fuzzy glare and instantly restores razor-sharp contrast."
      },
      {
        "heading": "Reading the Direction of Natural Light",
        "body": "Harsh midday sun casts unflattering shadows. Look for soft window light or golden hour sidelight that sculpts gentle contours and rich dimensional textures on food and portraits."
      },
      {
        "heading": "Tapping for Exposure Control",
        "body": "Smartphones tend to overexpose scenes. Tap on your subject to lock focus, then drag the sun slider down slightly; slightly darker exposure yields richer color saturation and prevents blown-out skies."
      }
    ]
  },
  "hobby-11": {
    "title": "The Enduring Charm of SpongeBob SquarePants: Animation History & Cultural Impact",
    "summary": "Stephen Hillenburg's marine biology vision: Bikini Bottom's timeless optimism, hand-drawn character physics, and cross-generational pop culture legacy.",
    "source": "Wikipedia · SpongeBob SquarePants",
    "date": "Animation History",
    "recommendationReason": "A heartwarming celebration of creative character design, surreal nautical humor, and animation craftsmanship.",
    "keyPoints": [
      "Created by marine science educator Stephen Hillenburg to celebrate eccentric underwater life.",
      "Timeless character dynamics: SpongeBob's boundless optimism juxtaposed with Squidward's weary realism.",
      "A global pop culture milestone spanning hundreds of episodes, feature films, and viral internet memes."
    ],
    "sections": [
      {
        "heading": "Marine Biology Meets Whimsical Animation",
        "body": "Before animating, creator Stephen Hillenburg taught marine science in California. SpongeBob was born from an educational comic book he drew to teach students about tidal pool sea creatures."
      },
      {
        "heading": "Universal Comedy Rooted in Timeless Archetypes",
        "body": "The comedy of Bikini Bottom endures because it mirrors universal human archetypes—the cheerful workaholic sponge, the cynical clarinet-playing neighbor, and the penny-pinching crustacean boss."
      },
      {
        "heading": "An Enduring Icon of Modern Pop Culture",
        "body": "Decades after its 1999 premiere, SpongeBob continues to inspire Broadway musicals, designer fashion collaborations, and millions of daily internet memes that connect multiple generations."
      }
    ]
  },
  "tech-draft-1": {
    "title": "2026 On-Device AI Paradigm: Ultra-Lightweight Neural Networks in Your Pocket",
    "summary": "How LLMs once dependent on massive server farms were compressed into sub-1-watt mobile silicon through NPU architectural innovation.",
    "source": "Toss Tech",
    "date": "Latest Tech",
    "recommendationReason": "Explore how quantized neural networks deliver fast, private AI computing directly on personal mobile devices.",
    "keyPoints": [
      "Compression of billion-parameter models via INT4/INT8 quantization and pruning.",
      "Dedicated NPU hardware engines processing tokens with sub-watt power efficiency.",
      "Zero-latency, privacy-first local inference without cloud round-trip delays."
    ],
    "sections": [
      {
        "heading": "The Liberation from Cloud Datacenters",
        "body": "Early generative AI required high-power GPU server clusters. However, latency and privacy constraints catalyzed a rapid migration toward compact neural networks running on mobile silicon."
      },
      {
        "heading": "NPU Hardware Acceleration and Quantization",
        "body": "Modern mobile SoCs integrate dedicated Neural Processing Units optimized for 8-bit and 4-bit integer matrix math, slashing memory footprints while sustaining high perceptual accuracy."
      },
      {
        "heading": "The Future of Sovereign Personal Intelligence",
        "body": "On-device intelligence ensures sensitive photos, chats, and documents never leave the hardware boundary, giving users complete data sovereignty."
      }
    ]
  },
  "study-draft-1": {
    "title": "Retrieval Practice Proven by Neuroscience: Why Passive Re-reading Fails",
    "summary": "Passive review creates an illusion of competence. Explore the synaptic mechanisms of active retrieval that forge permanent memory traces.",
    "source": "Harvard Business Review · Neuroscience Archive",
    "date": "Cognitive Science",
    "recommendationReason": "Transform passive reading into durable neural encoding through science-backed retrieval techniques.",
    "keyPoints": [
      "Passive highlighting triggers surface recognition without deep neural consolidation.",
      "Active retrieval strengthens synaptic long-term potentiation (LTP).",
      "Spaced testing loops produce exponential retention gains compared to massed cramming."
    ],
    "sections": [
      {
        "heading": "The Illusion of Competence in Passive Reading",
        "body": "When re-reading familiar text, the brain mistakes ease of visual recognition for true intellectual mastery, leading to swift forgetting during real-world recall."
      },
      {
        "heading": "Neurobiology of Synaptic Retrieval",
        "body": "Every time the brain struggles to retrieve a memory without looking at notes, neural pathways undergo Long-Term Potentiation (LTP), physically cementing synaptic connections."
      },
      {
        "heading": "Practical Retrieval Systems for Daily Work",
        "body": "Close the book immediately after reading and write three key concepts from memory. Implementing self-quizzing and flashcards turns fleeting input into lasting mastery."
      }
    ]
  },
  "culture-draft-1": {
    "title": "Spatial Branding in Seongsu & Hannam: The \"Experience Economics\" of Offline Pop-ups",
    "summary": "In an era dominated by e-commerce, why do global brands flock to expensive physical pop-up spaces? Unpacking the neurology of spatial emotion.",
    "source": "Cine21 · Independent & Art Feature",
    "date": "Spatial Trend",
    "recommendationReason": "Understand why tactile, multi-sensory physical spaces have become the ultimate brand differentiator in the digital age.",
    "keyPoints": [
      "Digital channels offer friction-free buying but lack visceral emotional bonding.",
      "Multi-sensory physical spaces forge deep dopamine and memory associations.",
      "Pop-up venues operate as cultural media hubs designed for social sharing."
    ],
    "sections": [
      {
        "heading": "The Paradox of the Post-Digital Retail Era",
        "body": "While digital storefronts solved convenience, they flattened brands into identical two-dimensional screens. Brands now build physical spaces not to sell goods, but to forge unforgettable emotional memories."
      },
      {
        "heading": "Multi-Sensory Architecture and Spatial Neurology",
        "body": "Custom architectural scents, tactile materials, ambient lighting, and curated acoustic soundscapes engage all human senses simultaneously, creating profound neural resonance."
      },
      {
        "heading": "The Pop-Up as Ephemeral Cultural Media",
        "body": "Limited-run pop-up spaces create psychological urgency (FOMO) and act as scenic stages for consumer co-creation, generating millions of organic social media impressions."
      }
    ]
  },
  "hobby-draft-1": {
    "title": "Zone 2 Running for Heart Health & Mitochondria: Why Slowing Down Makes You Faster",
    "summary": "Sprinting to exhaustion is not the most effective cardio. Dissecting the aerobic science that optimizes mitochondrial density and metabolic fat oxidation.",
    "source": "Lifestyle Magazine B",
    "date": "Health & Wellness",
    "recommendationReason": "Discover the cardiovascular physiology behind low-intensity aerobic training for sustainable athletic longevity.",
    "keyPoints": [
      "Zone 2 training operates below the first lactate threshold, maximizing mitochondrial biogenesis.",
      "Trains cellular physiology to burn lipid fats efficiently rather than quickly depleting glycogen.",
      "Minimizes central nervous system fatigue and joint strain while building an immense cardiovascular base."
    ],
    "sections": [
      {
        "heading": "The Science of Low-Intensity Aerobic Base",
        "body": "Most recreational runners train too fast on easy days and too slow on hard days. Zone 2 training targets a conversational pace where lactate clearance matches lactate production."
      },
      {
        "heading": "Mitochondrial Density and Lipid Metabolism",
        "body": "Zone 2 stimulates the growth of new cellular mitochondria and oxidative enzymes, transforming the body into an efficient engine capable of utilizing fatty acids as sustained fuel."
      },
      {
        "heading": "Sustainable Longevity Without Burnout",
        "body": "By reducing cardiac strain and orthopedic pounding, Zone 2 running allows consistent weekly mileage volume without chronic inflammation or overtraining syndrome."
      }
    ]
  },
  "study-2199": {
    "title": "Memory is Reconstruction, Not Storage: Synaptic Plasticity & the Neuroscience of Retrieval",
    "summary": "Why passive re-reading creates an illusion of learning. How synaptic plasticity and Long-Term Potentiation (LTP) physically rewire the brain during active retrieval.",
    "source": "Nature Neuroscience · Cognitive Review",
    "date": "Neuroscience",
    "recommendationReason": "Deep dive into neurobiology showing how challenging retrieval rewires brain circuitry for permanent retention.",
    "keyPoints": [
      "Synaptic plasticity and NMDA receptor activation during active recall.",
      "Long-Term Potentiation (LTP) consolidating fragile short-term traces into cortical storage.",
      "Interleaving diverse problem sets to stimulate adaptive neural network routing."
    ],
    "sections": [
      {
        "heading": "The Myth of Static Brain Storage",
        "body": "The human brain does not function like a hard drive storing static files. Memory is an active neural reconstruction process where every retrieval event alters and strengthens underlying synaptic connections."
      },
      {
        "heading": "Synaptic Plasticity and Long-Term Potentiation",
        "body": "When neurons fire in synchronized patterns during focused recall, glutamate receptors activate Long-Term Potentiation (LTP), physically increasing synaptic spine density and dendritic branching."
      },
      {
        "heading": "Desirable Difficulty in Human Learning",
        "body": "Cognitive effort that feels slightly strenuous during study produces vastly superior long-term retention. Embracing active retrieval transforms the brain into a resilient learning instrument."
      }
    ]
  }
};

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
