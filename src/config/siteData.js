// Default Portfolio Data for Aditya Tomar
// All content can be edited live using the Visual Edit Mode or by updating this config

export const defaultSiteData = {
  brand: {
    logoText: "AT",
    logoImage: "",
    title: "ADITYA TOMAR",
    subtitleRole: "Cinematographer | Photographer | Visual Storyteller",
    tagline: "Framing emotions. Capturing timeless visual stories across cinema, photography, and commercial videography.",
  },

  navigation: [
    { label: "Work", path: "#featured-work" },
    { label: "Photography", path: "#photography" },
    { label: "Cinematics", path: "#cinematics" },
    { label: "Videography", path: "#videography" },
    { label: "About", path: "#about" },
  ],

  hero: {
    title: "ADITYA TOMAR",
    roles: ["Cinematographer", "Photographer", "Visual Storyteller"],
    bgImage: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=2500&auto=format&fit=crop",
    quote: "“Cinema is a matter of what's in the frame and what's out.”",
  },

  featuredWork: [
    {
      id: "photography",
      title: "Photography",
      description: "Editorial, architectural, and intimate portraiture capturing raw human emotion and natural light.",
      coverImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop",
      badge: "FINE ART & PORTRAITS",
      link: "#photography"
    },
    {
      id: "cinematics",
      title: "Cinematics",
      description: "Short films, anamorphic narrative frames, and high-contrast atmospheric storytelling.",
      coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop",
      badge: "NARRATIVE & FEATURE",
      link: "#cinematics"
    },
    {
      id: "videography",
      title: "Videography",
      description: "Commercial brand films, luxury automotive ads, music videos, and fashion visuals.",
      coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1600&auto=format&fit=crop",
      badge: "COMMERCIAL & BRAND",
      link: "#videography"
    }
  ],

  photographyPage: {
    title: "Photography",
    subtitle: "A curated visual anthology exploring light, shadow, texture, and silent moments.",
    coverImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop",
    photos: [
      {
        id: "p1",
        title: "Monochrome Portrait",
        category: "Portrait",
        orientation: "portrait",
        aspectRatio: "3/4",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
        description: "Studio portraiture utilizing harsh key light and atmospheric haze."
      },
      {
        id: "p2",
        title: "Highland Solitude",
        category: "Landscape",
        orientation: "landscape",
        aspectRatio: "16/9",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop",
        description: "Dawn over mountain peaks captured on 35mm format."
      },
      {
        id: "p3",
        title: "Tokyo Neon Noir",
        category: "Street",
        orientation: "portrait",
        aspectRatio: "3/4",
        url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
        description: "Rain reflections and vibrant neon signage in Shinjuku alleys."
      },
      {
        id: "p4",
        title: "Architectural Symmetry",
        category: "Architecture",
        orientation: "landscape",
        aspectRatio: "16/9",
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop",
        description: "Minimalist concrete geometry in contemporary brutalist structures."
      },
      {
        id: "p5",
        title: "Desert Dusk",
        category: "Editorial",
        orientation: "portrait",
        aspectRatio: "3/4",
        url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop",
        description: "Warm golden ratio sunlight casting long shadow gradients."
      },
      {
        id: "p6",
        title: "Ocean Cinematic Mood",
        category: "Landscape",
        orientation: "landscape",
        aspectRatio: "16/9",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
        description: "Deep cyan coastal waves breaking against volcanic obsidian rocks."
      },
      {
        id: "p7",
        title: "Serene Reflection",
        category: "Fine Art",
        orientation: "portrait",
        aspectRatio: "3/4",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
        description: "Subtle skin tones against dark charcoal background."
      },
      {
        id: "p8",
        title: "Urban Horizon",
        category: "Street",
        orientation: "landscape",
        aspectRatio: "16/9",
        url: "https://images.unsplash.com/photo-1477959858617-67f30ac72604?q=80&w=1600&auto=format&fit=crop",
        description: "Golden hour haze sweeping over modern skyscraper skyline."
      }
    ]
  },

  cinematicsPage: {
    title: "Cinematics",
    subtitle: "Short narrative films, mood reels, and cinematic storytelling crafted for cinema projection and digital media.",
    coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop",
    videos: [
      {
        id: "c1",
        title: "Echoes of Silence - Short Film",
        category: "Narrative Short",
        videoType: "mp4",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop",
        description: "Shot on ARRI Alexa Mini LF with Cooke Anamorphic lenses. A poignant visual journey into isolation.",
        duration: "04:12",
        year: "2025"
      },
      {
        id: "c2",
        title: "The Golden Horizon - Reel",
        category: "Showreel 2026",
        videoType: "mp4",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop",
        description: "Compilation of feature film sequences, high-contrast night scenes, and natural light compositions.",
        duration: "02:45",
        year: "2026"
      },
      {
        id: "c3",
        title: "Solitude in Motion",
        category: "Documentary Short",
        videoType: "mp4",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        poster: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1600&auto=format&fit=crop",
        description: "Experimental visual piece exploring urban movement and silent reflections in northern climates.",
        duration: "03:30",
        year: "2025"
      }
    ]
  },

  videographyPage: {
    title: "Videography",
    subtitle: "High-end commercial films, luxury product launches, fashion films, and high-energy brand visuals.",
    coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1600&auto=format&fit=crop",
    videos: [
      {
        id: "v1",
        title: "Apex Motorsport - GT3 Commercial",
        client: "Apex Racing",
        category: "Automotive",
        videoType: "mp4",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        poster: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
        description: "Dynamic tracking shots, precision color grading in DaVinci Resolve Studio, and high RPM sound design.",
        resolution: "4K DCI"
      },
      {
        id: "v2",
        title: "Lumière Haute Horlogerie",
        client: "Lumière Geneve",
        category: "Luxury & Fashion",
        videoType: "mp4",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        poster: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
        description: "Macro cinematography revealing precision mechanical movements and polished rose gold surfaces.",
        resolution: "8K Raw"
      },
      {
        id: "v3",
        title: "Velocita Fashion Campaign",
        client: "Velocita Milano",
        category: "Fashion Film",
        videoType: "mp4",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyflights.mp4",
        poster: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop",
        description: "High-contrast editorial lighting with anamorphic lens flares recorded on RED V-Raptor.",
        resolution: "6K Anamorphic"
      }
    ]
  },

  about: {
    title: "About Me",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    bio: [
      "I am Aditya Tomar, a cinematographer, photographer, and visual storyteller dedicated to capturing evocative narrative imagery and refined commercial films.",
      "With over a decade of experience operating high-end cinema camera systems (ARRI, RED, Sony Venice) and 35mm medium format cameras (Leica, Hasselblad), my work blends dark cinematic atmospheres with natural light and precise composition.",
      "Whether directing photography for narrative feature films, capturing editorial portraiture, or executing luxury commercial campaigns, I approach every frame with intention, emotion, and technical mastery."
    ],
    skills: [
      { id: "s1", title: "Cinematography", desc: "ARRI, RED, Sony Venice, Anamorphic lenses, Crane & Steadicam framing." },
      { id: "s2", title: "Photography", desc: "Medium format digital, 35mm film, studio strobe & natural light portraiture." },
      { id: "s3", title: "Video Editing", desc: "Premiere Pro, Final Cut Pro X, pacing, audio mixing & rhythm." },
      { id: "s4", title: "Color Grading", desc: "DaVinci Resolve Studio, custom ACES workflow, film emulation LUTs." },
      { id: "s5", title: "Creative Direction", desc: "Concept development, storyboarding, moodboards & shot listing." },
      { id: "s6", title: "Storytelling", desc: "Visual subtext, narrative pacing, lighting mood & character elevation." }
    ]
  },

  footer: {
    quote: "“Visual storytelling is the art of translating unsaid emotions into light, texture, and time.”",
    copyright: "© 2026 Aditya Tomar. All rights reserved.",
    socials: [
      { label: "Instagram", url: "https://instagram.com" },
      { label: "Email", url: "mailto:aditya@adityatomar.com" }
    ]
  }
};
