import { CreatorOrBrandProfile } from "@/types/qloo";

export const CREATOR_PRESETS: CreatorOrBrandProfile[] = [
  {
    id: "neon-void",
    name: "Neon Void Studio",
    category: "Cyberpunk Gaming & Worldbuilding",
    tier: "$10k - $25k Seed",
    chips: [
      { name: "Kavinsky", domain: "music", urn: "urn:entity:artist:kavinsky", weight: 0.95 },
      { name: "Blade Runner 2049", domain: "cinema", urn: "urn:entity:film:br2049", weight: 0.88 },
      { name: "Dark Techwear & Brutalism", domain: "aesthetic", urn: "urn:tag:style:techwear", weight: 0.92 }
    ],
    graph: {
      center: { name: "Neon Void", sub: "GAMING & WORLDBUILDING" },
      tags: [
        { id: "synth", name: "Synthwave", x: 230, y: 130, stroke: "#0284c7", weight: 0.95 },
        { id: "cinema", name: "Neo-Noir Cinema", x: 470, y: 130, stroke: "#d97706", weight: 0.88 },
        { id: "tech", name: "Archival Brutalism", x: 470, y: 310, stroke: "#ea580c", weight: 0.92 },
        { id: "craft", name: "Analog Craft", x: 230, y: 310, stroke: "#059669", weight: 0.85 }
      ],
      brands: [
        { id: "acne", name: "Acne Studios", x: 580, y: 70, affinity: "7.8x", tagId: "tech", stroke: "#ea580c", path: "Neon Void → Dark Techwear → Acne Studios", guardrail: "-4.2x against generic neon streetwear" },
        { id: "keychron", name: "Keychron", x: 580, y: 360, affinity: "8.4x", tagId: "synth", stroke: "#0284c7", path: "Neon Void → Synthwave → Keychron", guardrail: "High peripheral mechanical affinity" },
        { id: "matcha", name: "Matcha Kari", x: 100, y: 360, affinity: "6.9x", tagId: "craft", stroke: "#059669", path: "Neon Void → Analog Craft → Matcha Kari", guardrail: "Cerebral focus stimulant affinity" },
        { id: "teenage", name: "Teenage Eng.", x: 100, y: 70, affinity: "9.1x", tagId: "synth", stroke: "#d97706", path: "Neon Void → Neo-Noir → Teenage Engineering", guardrail: "Industrial hardware co-design" }
      ]
    },
    cards: [
      { brand: "Acne Studios", domain: "apparel", affinity: "⚡ 7.8x", score: 0.94, title: "14oz Archival Denim Overshirt", dealSize: "$18,500 + 18% Royalties", rationale: "Qloo verifies 7.8x cross-affinity with neo-noir aesthetics.", stage: "Discovered", overlap: "88%" },
      { brand: "Keychron", domain: "tech", affinity: "⚡ 8.4x", score: 0.91, title: "Custom Q3 Pro Mechanical Board", dealSize: "$12,000 + Hardware Split", rationale: "8.4x affinity to tactile mechanical audio creators.", stage: "Vetted", overlap: "91%" },
      { brand: "Matcha Kari", domain: "beverage", affinity: "⚡ 6.9x", score: 0.88, title: "Ceremonial Single-Origin Matcha", dealSize: "$8,500 + 15% Affiliate", rationale: "Artisanal matcha indexes 6.9x among late-night game builders.", stage: "Pitch Ready", overlap: "82%" },
      { brand: "Teenage Eng.", domain: "tech", affinity: "⚡ 9.1x", score: 0.96, title: "Pocket Operator VP-01 Synth", dealSize: "$24,000 + Joint Hardware Drop", rationale: "9.1x cross-affinity to modular synthesis.", stage: "Dispatched", overlap: "96%" }
    ]
  },
  {
    id: "botanical-freq",
    name: "Botanical Frequencies",
    category: "Lo-Fi Wellness & Ambient Living",
    tier: "$15k - $35k Growth",
    chips: [
      { name: "Brian Eno", domain: "music", urn: "urn:entity:artist:brian_eno", weight: 0.96 },
      { name: "Studio Ghibli Landscapes", domain: "cinema", urn: "urn:entity:film:ghibli", weight: 0.91 },
      { name: "Japanese Wabi-Sabi", domain: "aesthetic", urn: "urn:tag:style:wabi_sabi", weight: 0.94 }
    ],
    graph: {
      center: { name: "Botanical Freq.", sub: "AMBIENT & WELLNESS" },
      tags: [
        { id: "ambient", name: "Ambient Soundscapes", x: 230, y: 130, stroke: "#059669", weight: 0.96 },
        { id: "nature", name: "Pastoral Cinema", x: 470, y: 130, stroke: "#0284c7", weight: 0.91 },
        { id: "organic", name: "Wabi-Sabi Minimalism", x: 470, y: 310, stroke: "#ea580c", weight: 0.94 },
        { id: "tea", name: "Slow Living Rituals", x: 230, y: 310, stroke: "#d97706", weight: 0.89 }
      ],
      brands: [
        { id: "snowpeak", name: "Snow Peak", x: 580, y: 70, affinity: "9.4x", tagId: "organic", stroke: "#059669", path: "Botanical Freq → Wabi-Sabi → Snow Peak Living", guardrail: "High outdoor minimalism index" },
        { id: "kinto", name: "Kinto Japan", x: 580, y: 360, affinity: "8.7x", tagId: "tea", stroke: "#d97706", path: "Botanical Freq → Slow Living → Kinto Glassware", guardrail: "Tactile drinkware overlap" },
        { id: "ippodo", name: "Ippodo Tea", x: 100, y: 360, affinity: "9.2x", tagId: "tea", stroke: "#0284c7", path: "Botanical Freq → Slow Living → Ippodo Heritage Tea", guardrail: "Kyoto ceremonial tea bridge" },
        { id: "muji", name: "Muji Living", x: 100, y: 70, affinity: "8.1x", tagId: "ambient", stroke: "#ea580c", path: "Botanical Freq → Ambient Soundscapes → Muji Aroma", guardrail: "Acoustic diffuser synergy" }
      ]
    },
    cards: [
      { brand: "Snow Peak", domain: "living", affinity: "⚡ 9.4x", score: 0.97, title: "Titanium Tea Kettle & Cup Set", dealSize: "$22,000 + 20% Royalties", rationale: "Qloo verifies 9.4x affinity to Japanese slow living.", stage: "Discovered", overlap: "94%" },
      { brand: "Kinto Japan", domain: "living", affinity: "⚡ 8.7x", score: 0.93, title: "Heat-Resistant Glass Teapot Capsule", dealSize: "$14,000 + 15% Royalties", rationale: "Minimalist drinkware indexes 8.7x above baseline.", stage: "Vetted", overlap: "89%" },
      { brand: "Ippodo Tea", domain: "beverage", affinity: "⚡ 9.2x", score: 0.95, title: "Reserve Ummon Ceremonial Matcha", dealSize: "$18,000 + Co-branded Tin", rationale: "9.2x affinity among ambient sound communities.", stage: "Pitch Ready", overlap: "95%" },
      { brand: "Muji Living", domain: "living", affinity: "⚡ 8.1x", score: 0.89, title: "Ultrasonic Aroma Diffuser Drop", dealSize: "$25,000 + Global In-Store Display", rationale: "8.1x cross-domain overlap with botanical soundscapes.", stage: "Dispatched", overlap: "91%" }
    ]
  },
  {
    id: "analog-nostalgia",
    name: "Analog Nostalgia",
    category: "35mm Film & Vintage Hi-Fi",
    tier: "$8k - $20k Seed",
    chips: [
      { name: "Miles Davis", domain: "music", urn: "urn:entity:artist:miles_davis", weight: 0.94 },
      { name: "Wong Kar-wai", domain: "cinema", urn: "urn:entity:film:wkw", weight: 0.93 },
      { name: "Mid-Century Modernism", domain: "aesthetic", urn: "urn:tag:style:midcentury", weight: 0.90 }
    ],
    graph: {
      center: { name: "Analog Nostalgia", sub: "35MM FILM & VINYL" },
      tags: [
        { id: "jazz", name: "Modal Jazz", x: 230, y: 130, stroke: "#d97706", weight: 0.94 },
        { id: "film", name: "Hong Kong New Wave", x: 470, y: 130, stroke: "#ea580c", weight: 0.93 },
        { id: "walnut", name: "Warm Teak & Walnut", x: 470, y: 310, stroke: "#059669", weight: 0.90 },
        { id: "audio", name: "Vacuum Tube Audio", x: 230, y: 310, stroke: "#0284c7", weight: 0.88 }
      ],
      brands: [
        { id: "leica", name: "Leica Camera", x: 580, y: 70, affinity: "9.6x", tagId: "film", stroke: "#ea580c", path: "Analog Nostalgia → Wong Kar-wai → Leica M6 Strap", guardrail: "Heritage rangefinder affinity" },
        { id: "folk", name: "Folk Clothing", x: 580, y: 360, affinity: "8.2x", tagId: "walnut", stroke: "#d97706", path: "Analog Nostalgia → Mid-Century → Folk Overshirt", guardrail: "London architectural tailoring" },
        { id: "fellow", name: "Fellow Products", x: 100, y: 360, affinity: "8.5x", tagId: "audio", stroke: "#059669", path: "Analog Nostalgia → Slow Morning → Fellow Ode Grinder", guardrail: "Matte black precision coffee" },
        { id: "teenage2", name: "Teenage Eng.", x: 100, y: 70, affinity: "8.9x", tagId: "audio", stroke: "#0284c7", path: "Analog Nostalgia → Vacuum Tube → TP-7 Field Recorder", guardrail: "Tactile motorized tape audio" }
      ]
    },
    cards: [
      { brand: "Leica Camera", domain: "tech", affinity: "⚡ 9.6x", score: 0.98, title: "Limited Edition Leather Rangefinder Strap", dealSize: "$19,500 + 15% Royalties", rationale: "9.6x affinity to archival 35mm cinematographers.", stage: "Discovered", overlap: "97%" },
      { brand: "Folk Clothing", domain: "apparel", affinity: "⚡ 8.2x", score: 0.90, title: "Corduroy Studio Overshirt", dealSize: "$11,000 + 18% Royalties", rationale: "London understated tailoring indexes 8.2x above baseline.", stage: "Vetted", overlap: "86%" },
      { brand: "Fellow Products", domain: "living", affinity: "⚡ 8.5x", score: 0.92, title: "Ode Gen 2 Walnut Edition Grinder", dealSize: "$16,500 + Unit Margin", rationale: "8.5x cross-domain overlap with morning vinyl rituals.", stage: "Pitch Ready", overlap: "91%" },
      { brand: "Teenage Eng.", domain: "tech", affinity: "⚡ 8.9x", score: 0.94, title: "TP-7 Field Audio Recorder", dealSize: "$28,000 + Hardware Collab", rationale: "8.9x affinity to tactile analog tape culture.", stage: "Dispatched", overlap: "95%" }
    ]
  },
  {
    id: "lumiere-spatial",
    name: "Lumière Spatial Studio",
    category: "Architectural Lighting & Interior Mood",
    tier: "$20k - $50k Enterprise",
    chips: [
      { name: "Max Richter", domain: "music", urn: "urn:entity:artist:max_richter", weight: 0.95 },
      { name: "Blade Runner Architectural Interiors", domain: "cinema", urn: "urn:entity:film:br_interiors", weight: 0.92 },
      { name: "Sculptural Alabaster Lighting", domain: "aesthetic", urn: "urn:tag:style:alabaster_lighting", weight: 0.96 }
    ],
    graph: {
      center: { name: "Lumière Spatial", sub: "LIGHTING & ARCHITECTURE" },
      tags: [
        { id: "ambient-light", name: "2700K Warm Dimming", x: 230, y: 130, stroke: "#d97706", weight: 0.95 },
        { id: "brutalist-int", name: "Raw Board-Formed Concrete", x: 470, y: 130, stroke: "#0284c7", weight: 0.92 },
        { id: "alabaster", name: "Sculptural Alabaster", x: 470, y: 310, stroke: "#ea580c", weight: 0.96 },
        { id: "spatial", name: "Spatial Acoustic Tuning", x: 230, y: 310, stroke: "#059669", weight: 0.89 }
      ],
      brands: [
        { id: "flos", name: "Flos Lighting", x: 580, y: 70, affinity: "9.8x", tagId: "alabaster", stroke: "#d97706", path: "Lumière → Sculptural Alabaster → Flos Bellhop", guardrail: "Italian modernist lighting index" },
        { id: "artemide", name: "Artemide", x: 580, y: 360, affinity: "8.9x", tagId: "ambient-light", stroke: "#0284c7", path: "Lumière → 2700K Dimming → Artemide Tolomeo", guardrail: "Architectural desk fixture overlap" },
        { id: "louis-poulsen", name: "Louis Poulsen", x: 100, y: 360, affinity: "9.3x", tagId: "spatial", stroke: "#059669", path: "Lumière → Spatial Tuning → PH5 Pendant Drop", guardrail: "Danish acoustic glare-free fixture" },
        { id: "hay", name: "HAY Design", x: 100, y: 70, affinity: "8.4x", tagId: "brutalist-int", stroke: "#ea580c", path: "Lumière → Raw Concrete → HAY Matin Lamp", guardrail: "Copenhagen accessible modernism" }
      ]
    },
    cards: [
      { brand: "Flos Lighting", domain: "living", affinity: "⚡ 9.8x", score: 0.99, title: "Cordless Alabaster Sconce Specimen", dealSize: "$42,000 + 15% Royalties", rationale: "Qloo verifies 9.8x affinity with spatial lighting concierges.", stage: "Discovered", overlap: "98%" },
      { brand: "Artemide", domain: "living", affinity: "⚡ 8.9x", score: 0.93, title: "Tolomeo Micro Mood Edition", dealSize: "$28,000 + 18% Royalties", rationale: "8.9x overlap among modern architectural studios.", stage: "Vetted", overlap: "92%" },
      { brand: "Louis Poulsen", domain: "living", affinity: "⚡ 9.3x", score: 0.96, title: "PH 5 Monochrome Spatial Pendant", dealSize: "$36,000 + Architectural Licensing", rationale: "9.3x cross-domain affinity to Danish glare-free illumination.", stage: "Pitch Ready", overlap: "96%" },
      { brand: "HAY Design", domain: "living", affinity: "⚡ 8.4x", score: 0.90, title: "Matin Table Lamp Creator Edition", dealSize: "$22,000 + Co-Branded Drop", rationale: "8.4x affinity to Copenhagen interior mood creators.", stage: "Dispatched", overlap: "89%" }
    ]
  }
];

export const BRAND_PRESETS: CreatorOrBrandProfile[] = [
  {
    id: "brand-snowpeak",
    name: "Snow Peak Outdoor",
    category: "Japanese Minimalist Outdoor Living",
    tier: "$50k - $100k Sponsorship Pool",
    chips: [
      { name: "Fieldcraft Survivalists", domain: "music", urn: "urn:entity:subculture:fieldcraft", weight: 0.96 },
      { name: "Forest Ambient Soundscapes", domain: "cinema", urn: "urn:entity:subculture:forest_ambient", weight: 0.91 },
      { name: "Japanese Tea Camp Craft", domain: "aesthetic", urn: "urn:tag:subculture:tea_craft", weight: 0.94 }
    ],
    graph: {
      center: { name: "Snow Peak", sub: "MINIMALIST OUTDOOR LIVING" },
      tags: [
        { id: "bushcraft", name: "Artisanal Bushcraft", x: 230, y: 130, stroke: "#4338ca", weight: 0.96 },
        { id: "field-audio", name: "Field Audio Recorders", x: 470, y: 130, stroke: "#6366f1", weight: 0.91 },
        { id: "titanium", name: "Ultralight Titanium", x: 470, y: 310, stroke: "#818cf8", weight: 0.94 },
        { id: "camp-tea", name: "Campground Tea Ceremony", x: 230, y: 310, stroke: "#a5b4fc", weight: 0.89 }
      ],
      brands: [
        { id: "sub-1", name: "Wilderness Audio Pod", x: 580, y: 70, affinity: "8.8x", tagId: "field-audio", stroke: "#4338ca", path: "Snow Peak → Field Audio → Wilderness Soundscape Podcast", guardrail: "Indexes 8.8x above baseline outdoor media" },
        { id: "sub-2", name: "Kyoto Woodcraft Guild", x: 580, y: 360, affinity: "9.3x", tagId: "bushcraft", stroke: "#6366f1", path: "Snow Peak → Bushcraft → Kyoto Handcraft Guild", guardrail: "Authentic titanium carving collaboration" },
        { id: "sub-3", name: "Lo-Fi Solo Hiker Club", x: 100, y: 360, affinity: "7.9x", tagId: "camp-tea", stroke: "#818cf8", path: "Snow Peak → Camp Tea → Solo Hiker Vloggers", guardrail: "Zero commercial fatigue detected" },
        { id: "sub-4", name: "Nordic Bushcraft Camp", x: 100, y: 70, affinity: "8.5x", tagId: "titanium", stroke: "#a5b4fc", path: "Snow Peak → Titanium → Nordic Minimalist Campers", guardrail: "High gear conversion fidelity" }
      ]
    },
    cards: [
      { brand: "Wilderness Audio Pod", domain: "living", affinity: "⚡ 8.8x", score: 0.95, title: "Field Microphone Titanium Clamp Co-Drop", dealSize: "$45,000 Community Grant", rationale: "Snow Peak indexes 8.8x above baseline with ambient nature recordists.", stage: "Discovered", overlap: "95%" },
      { brand: "Kyoto Woodcraft Guild", domain: "living", affinity: "⚡ 9.3x", score: 0.97, title: "Hand-Carved Cedar Tableware Series", dealSize: "$35,000 Activation + Revenue Share", rationale: "9.3x subcultural resonance with artisanal woodworkers.", stage: "Vetted", overlap: "97%" },
      { brand: "Lo-Fi Solo Hiker Club", domain: "beverage", affinity: "⚡ 7.9x", score: 0.89, title: "Summit Tea Dripper Sponsorship", dealSize: "$20,000 Multi-Episode Sponsorship", rationale: "Solo outdoor filmmakers share 7.9x affinity for minimalist titanium kits.", stage: "Pitch Ready", overlap: "89%" },
      { brand: "Nordic Bushcraft Camp", domain: "living", affinity: "⚡ 8.5x", score: 0.92, title: "Sub-Zero Bivouac Field Expedition", dealSize: "$60,000 Integrated Media Campaign", rationale: "High-conviction alignment with northern minimalist adventurers.", stage: "Dispatched", overlap: "92%" }
    ]
  },
  {
    id: "brand-acne",
    name: "Acne Studios",
    category: "Stockholm Luxury Archival Denim",
    tier: "$80k - $150k Creator Campaign",
    chips: [
      { name: "Underground Synthesizer Builders", domain: "music", urn: "urn:entity:subculture:synth_modders", weight: 0.95 },
      { name: "35mm Archival Cinematographers", domain: "cinema", urn: "urn:entity:subculture:35mm_cinema", weight: 0.93 },
      { name: "Brutalist Ceramic Guilds", domain: "aesthetic", urn: "urn:tag:subculture:brutalist_ceramics", weight: 0.92 }
    ],
    graph: {
      center: { name: "Acne Studios", sub: "ARCHIVAL LUXURY DENIM" },
      tags: [
        { id: "synth-mod", name: "Modular Synth Modders", x: 230, y: 130, stroke: "#4338ca", weight: 0.95 },
        { id: "archival-35", name: "Archival 35mm Vlogs", x: 470, y: 130, stroke: "#6366f1", weight: 0.93 },
        { id: "ceramic", name: "Raw Ceramic Guilds", x: 470, y: 310, stroke: "#818cf8", weight: 0.92 },
        { id: "darkroom", name: "Analog Darkroom Labs", x: 230, y: 310, stroke: "#a5b4fc", weight: 0.88 }
      ],
      brands: [
        { id: "sub-ac-1", name: "Modular Synth Vloggers", x: 580, y: 70, affinity: "9.2x", tagId: "synth-mod", stroke: "#4338ca", path: "Acne Studios → Modular Synth → Hardware Audio Vloggers", guardrail: "Anti-commercial luxury cachet" },
        { id: "sub-ac-2", name: "Stockholm 35mm Guild", x: 580, y: 360, affinity: "8.6x", tagId: "archival-35", stroke: "#6366f1", path: "Acne Studios → 35mm → Swedish Film Collective", guardrail: "High aesthetic editorial alignment" },
        { id: "sub-ac-3", name: "Brutalist Clay Studios", x: 100, y: 360, affinity: "7.7x", tagId: "ceramic", stroke: "#818cf8", path: "Acne Studios → Raw Ceramic → Sculptural Potters", guardrail: "Textured tactile lifestyle resonance" },
        { id: "sub-ac-4", name: "Paris Darkroom Society", x: 100, y: 70, affinity: "8.9x", tagId: "darkroom", stroke: "#a5b4fc", path: "Acne Studios → Darkroom Labs → Independent Photo Bookmakers", guardrail: "Acne Paper publication legacy bridge" }
      ]
    },
    cards: [
      { brand: "Modular Synth Vloggers", domain: "tech", affinity: "⚡ 9.2x", score: 0.96, title: "Denim Eurorack Flight Case Specimen", dealSize: "$75,000 Artist Residency + Capsule", rationale: "9.2x affinity between archival raw denim and modular audio builders.", stage: "Discovered", overlap: "96%" },
      { brand: "Stockholm 35mm Guild", domain: "apparel", affinity: "⚡ 8.6x", score: 0.91, title: "Cinematographer Darkroom Apron", dealSize: "$40,000 Fellowship + Co-Drop", rationale: "8.6x organic overlap with independent European film labs.", stage: "Vetted", overlap: "91%" },
      { brand: "Brutalist Clay Studios", domain: "living", affinity: "⚡ 7.7x", score: 0.88, title: "Sculptural Alabaster & Clay Vessels", dealSize: "$30,000 Studio Sponsorship", rationale: "Tactile ceramics index 7.7x above baseline for Acne design patrons.", stage: "Pitch Ready", overlap: "88%" },
      { brand: "Paris Darkroom Society", domain: "apparel", affinity: "⚡ 8.9x", score: 0.94, title: "Acne Paper Special Monograph Issue", dealSize: "$90,000 Global Publication Commission", rationale: "Direct lineage to Acne Paper's heritage publishing mandate.", stage: "Dispatched", overlap: "94%" }
    ]
  },
  {
    id: "brand-teenage",
    name: "Teenage Engineering",
    category: "High-Design Portable Audio Hardware",
    tier: "$40k - $90k Community Budget",
    chips: [
      { name: "Chiptune & GameBoy Hackers", domain: "music", urn: "urn:entity:subculture:chiptune", weight: 0.97 },
      { name: "Miniature Mechanical Engineers", domain: "cinema", urn: "urn:entity:subculture:mini_cad", weight: 0.94 },
      { name: "Dieter Rams Functionalists", domain: "aesthetic", urn: "urn:tag:subculture:braun_rams", weight: 0.95 }
    ],
    graph: {
      center: { name: "Teenage Eng.", sub: "PORTABLE AUDIO HARDWARE" },
      tags: [
        { id: "chiptune", name: "8-Bit Chiptune", x: 230, y: 130, stroke: "#4338ca", weight: 0.97 },
        { id: "micro-cad", name: "Micro Mechanical CAD", x: 470, y: 130, stroke: "#6366f1", weight: 0.94 },
        { id: "rams", name: "Braun Functionalism", x: 470, y: 310, stroke: "#818cf8", weight: 0.95 },
        { id: "tape", name: "Cassette Micro-Labels", x: 230, y: 310, stroke: "#a5b4fc", weight: 0.91 }
      ],
      brands: [
        { id: "sub-te-1", name: "GameBoy Chiptune Streamers", x: 580, y: 70, affinity: "9.7x", tagId: "chiptune", stroke: "#4338ca", path: "Teenage Eng → Chiptune → GameBoy Live Performers", guardrail: "Ultra-high pocket operator hardware affinity" },
        { id: "sub-te-2", name: "Micro-Machining Creators", x: 580, y: 360, affinity: "9.1x", tagId: "micro-cad", stroke: "#6366f1", path: "Teenage Eng → Micro-CAD → CNC Aluminum Vloggers", guardrail: "Unibody precision manufacturing bridge" },
        { id: "sub-te-3", name: "Cassette Tape Micro-Labels", x: 100, y: 360, affinity: "8.4x", tagId: "tape", stroke: "#818cf8", path: "Teenage Eng → Cassette Labels → Lo-Fi Tape Distros", guardrail: "Tactile motorized recorder synergy" },
        { id: "sub-te-4", name: "Industrial Design Students", x: 100, y: 70, affinity: "8.9x", tagId: "rams", stroke: "#a5b4fc", path: "Teenage Eng → Functionalism → Bauhaus Design Channels", guardrail: "Strict functional aesthetics resonance" }
      ]
    },
    cards: [
      { brand: "GameBoy Chiptune Streamers", domain: "tech", affinity: "⚡ 9.7x", score: 0.99, title: "Pocket Operator Arcade Sound Kit", dealSize: "$50,000 Tour + Hardware Drop", rationale: "Teenage Engineering indexes 9.7x with 8-bit chip musicians.", stage: "Discovered", overlap: "99%" },
      { brand: "Micro-Machining Creators", domain: "tech", affinity: "⚡ 9.1x", score: 0.95, title: "CNC Anodized Knob Attachment Drop", dealSize: "$35,000 Hardware Split", rationale: "9.1x overlap with boutique aluminum machining vloggers.", stage: "Vetted", overlap: "95%" },
      { brand: "Cassette Tape Micro-Labels", domain: "living", affinity: "⚡ 8.4x", score: 0.91, title: "TP-7 Motorized Tape Cassette Series", dealSize: "$25,000 Joint Record Release", rationale: "8.4x affinity to cassette micro-labels and tape loops.", stage: "Pitch Ready", overlap: "91%" },
      { brand: "Industrial Design Students", domain: "living", affinity: "⚡ 8.9x", score: 0.93, title: "Braun & Rams Legacy Design Challenge", dealSize: "$45,000 University Grants", rationale: "8.9x cross-domain overlap with young functionalist architects.", stage: "Dispatched", overlap: "93%" }
    ]
  },
  {
    id: "brand-flos",
    name: "Flos Architectural",
    category: "Italian Modernist Sculptural Luminaires",
    tier: "$100k - $250k Enterprise Activation",
    chips: [
      { name: "Acoustic Ambient Producers", domain: "music", urn: "urn:entity:subculture:ambient_producers", weight: 0.96 },
      { name: "Minimalist Architects", domain: "cinema", urn: "urn:entity:subculture:brutalist_arch", weight: 0.95 },
      { name: "Alabaster Sculptors", domain: "aesthetic", urn: "urn:tag:subculture:alabaster_craft", weight: 0.97 }
    ],
    graph: {
      center: { name: "Flos Architectural", sub: "MODERNIST LUMINAIRES" },
      tags: [
        { id: "ambient-audio", name: "Acoustic Ambient Music", x: 230, y: 130, stroke: "#4338ca", weight: 0.96 },
        { id: "concrete-arch", name: "Board-Formed Concrete", x: 470, y: 130, stroke: "#6366f1", weight: 0.95 },
        { id: "stone", name: "Carved Volterra Alabaster", x: 470, y: 310, stroke: "#818cf8", weight: 0.97 },
        { id: "warm-dim", name: "2200K Candlelight Dimming", x: 230, y: 310, stroke: "#a5b4fc", weight: 0.93 }
      ],
      brands: [
        { id: "sub-fl-1", name: "Spatial Acoustic Channels", x: 580, y: 70, affinity: "9.8x", tagId: "ambient-audio", stroke: "#4338ca", path: "Flos → Ambient Audio → Spatial Sound Designers", guardrail: "Acoustic glare-free lighting alignment" },
        { id: "sub-fl-2", name: "Brutalist Home Creators", x: 580, y: 360, affinity: "9.4x", tagId: "concrete-arch", stroke: "#6366f1", path: "Flos → Concrete → Raw Architectural Vloggers", guardrail: "High architectural luminaire conversion" },
        { id: "sub-fl-3", name: "Italian Stone Guilds", x: 100, y: 360, affinity: "9.9x", tagId: "stone", stroke: "#818cf8", path: "Flos → Alabaster → Volterra Stone Craftsmen", guardrail: "Sculptural heritage provenance" },
        { id: "sub-fl-4", name: "Circadian Lighting Geeks", x: 100, y: 70, affinity: "8.7x", tagId: "warm-dim", stroke: "#a5b4fc", path: "Flos → Warm Dimming → Circadian Biohacking Pods", guardrail: "Health and sleep lighting affinity" }
      ]
    },
    cards: [
      { brand: "Spatial Acoustic Channels", domain: "living", affinity: "⚡ 9.8x", score: 0.99, title: "Sound-Dampening Alabaster Sconce Specimen", dealSize: "$120,000 Studio Installation Series", rationale: "Flos indexes 9.8x with spatial audio engineers requiring glare-free illumination.", stage: "Discovered", overlap: "99%" },
      { brand: "Brutalist Home Creators", domain: "living", affinity: "⚡ 9.4x", score: 0.97, title: "Cast Bronze Minimalist Floor Luminaire", dealSize: "$85,000 Architectural Drop", rationale: "9.4x resonance among modernist concrete interior builders.", stage: "Vetted", overlap: "97%" },
      { brand: "Italian Stone Guilds", domain: "living", affinity: "⚡ 9.9x", score: 0.99, title: "Volterra Alabaster Limited Run of 100", dealSize: "$150,000 Art Basel Exhibition Co-Commission", rationale: "9.9x highest affinity index in sculptural heritage stonework.", stage: "Pitch Ready", overlap: "99%" },
      { brand: "Circadian Lighting Geeks", domain: "tech", affinity: "⚡ 8.7x", score: 0.92, title: "Circadian Warm-Dim Desk Wand", dealSize: "$60,000 YouTube Sponsorship Package", rationale: "8.7x overlap with wellness and circadian biology podcasters.", stage: "Dispatched", overlap: "92%" }
    ]
  }
];
