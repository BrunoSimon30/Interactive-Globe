// Region data structure for SJEG Globe
export const regionsData = {
  caribbean: {
    id: 'caribbean',
    name: 'Caribbean / Americas',
    description: 'Your Core (Home Base)',
    position: { lat: 15.4, lng: -61.3 }, // Dominica
    glowColor: '#00d4ff',
    mainDivisions: [
      {
        id: 'ai-tech',
        name: 'AI & Emerging Technologies',
        description: 'Innovation at the intersection of artificial intelligence and community',
        subdivisions: [
          {
            id: 'little-jahsi',
            name: 'Little Jahsi',
            description: 'AI-powered community platform from Dominica',
            bullets: ['AI Community Building', 'Educational Technology', 'Youth Leadership']
          },
          {
            id: 'guardian-amy',
            name: 'Guardian Amy',
            description: 'AI guardian and educational companion',
            bullets: ['AI Education', 'Child Safety', 'Learning Support']
          },
          {
            id: 'vitajazz-ai',
            name: 'VitaJazz AI',
            description: 'AI wellness and lifestyle platform',
            bullets: ['Health AI', 'Wellness Technology', 'Lifestyle Optimization']
          },
          {
            id: 'tech-auntea',
            name: 'Tech Auntea',
            description: 'Technology education and mentorship (Houston)',
            bullets: ['Tech Education', 'Mentorship Programs', 'Community Tech']
          },
          {
            id: 'bosspel',
            name: 'Bosspel',
            description: 'Innovative technology solutions',
            bullets: ['Tech Solutions', 'Innovation Hub', 'Digital Transformation']
          }
        ]
      },
      {
        id: 'community-education',
        name: 'Community Building & Education',
        description: 'Empowering communities through education and connection',
        subdivisions: [
          {
            id: 'youth-leadership',
            name: 'Youth Leadership Programs',
            description: 'Developing future leaders',
            bullets: ['Leadership Training', 'Mentorship', 'Community Impact']
          }
        ]
      }
    ]
  },
  africa: {
    id: 'africa',
    name: 'Africa',
    description: 'Good Energy & Sustainable Systems',
    position: { lat: 0, lng: 20 }, // Center of Africa
    glowColor: '#00ff88',
    mainDivisions: [
      {
        id: 'good-energy',
        name: 'Good Energy',
        description: 'Renewable energy solutions for sustainable future',
        subdivisions: [
          {
            id: 'micro-grids',
            name: 'Micro-grids',
            description: 'Localized renewable energy systems',
            bullets: ['Solar Power', 'Wind Energy', 'Community Grids']
          },
          {
            id: 'clean-tech-labs',
            name: 'Clean-tech Labs',
            description: 'Innovation in renewable technology',
            bullets: ['Research & Development', 'Technology Innovation', 'Sustainable Solutions']
          },
          {
            id: 'resource-management',
            name: 'Resource Management',
            description: 'Efficient resource utilization systems',
            bullets: ['Energy Efficiency', 'Resource Optimization', 'Sustainable Practices']
          },
          {
            id: 'renewable-infrastructure',
            name: 'Renewable Infrastructure',
            description: 'Building sustainable energy infrastructure',
            bullets: ['Infrastructure Development', 'Green Technology', 'Future Energy']
          }
        ]
      }
    ]
  },
  europe: {
    id: 'europe',
    name: 'Europe',
    description: 'Architecture & Innovation',
    position: { lat: 50, lng: 10 }, // Center of Europe
    glowColor: '#ffd700',
    mainDivisions: [
      {
        id: 'architecture',
        name: 'Architecture & Infrastructure',
        description: 'Engineering excellence and innovative design',
        subdivisions: [
          {
            id: 'lumi-isle-village',
            name: 'Lumi Isle Village',
            description: 'Sustainable living community',
            bullets: ['Eco Architecture', 'Sustainable Design', 'Community Living']
          },
          {
            id: 'future-buildings',
            name: 'SJEG Future Buildings',
            description: 'Next-generation architectural projects',
            bullets: ['Innovative Design', 'Smart Buildings', 'Sustainable Architecture']
          },
          {
            id: 'smart-homes',
            name: 'Smart Homes',
            description: 'Intelligent living spaces',
            bullets: ['Home Automation', 'Energy Efficiency', 'Modern Living']
          },
          {
            id: 'eco-architecture',
            name: 'Eco Architecture',
            description: 'Environmentally conscious building design',
            bullets: ['Green Building', 'Sustainable Materials', 'Environmental Design']
          },
          {
            id: 'innovation-hubs',
            name: 'Innovation Hubs',
            description: 'Centers of technological innovation',
            bullets: ['Tech Centers', 'Collaboration Spaces', 'Innovation Labs']
          }
        ]
      }
    ]
  },
  asia: {
    id: 'asia',
    name: 'Asia',
    description: 'Global Commerce & Distribution',
    position: { lat: 30, lng: 100 }, // Center of Asia
    glowColor: '#4da6ff',
    mainDivisions: [
      {
        id: 'distribution',
        name: 'Good Distribution',
        description: 'Global logistics and supply chain solutions',
        subdivisions: [
          {
            id: 'product-pipelines',
            name: 'Product Pipelines',
            description: 'Efficient product distribution networks',
            bullets: ['Supply Chain', 'Logistics', 'Distribution Networks']
          },
          {
            id: 'global-trade-routes',
            name: 'Global Trade Routes',
            description: 'International commerce connections',
            bullets: ['International Trade', 'Commerce Networks', 'Global Markets']
          },
          {
            id: 'itgirl-nation',
            name: 'ItGirlNation',
            description: 'E-commerce and retail platform',
            bullets: ['E-commerce', 'Retail', 'Digital Commerce']
          },
          {
            id: 'collections-by-si',
            name: 'Collections by Si',
            description: 'Curated product collections',
            bullets: ['Product Curation', 'Retail', 'Brand Collections']
          }
        ]
      }
    ]
  },
  global: {
    id: 'global',
    name: 'Global Impact',
    description: 'Social Impact & Reinvestment',
    position: { lat: 0, lng: 0 }, // Center of globe
    glowColor: '#ffffff',
    mainDivisions: [
      {
        id: 'social-impact',
        name: 'Social Impact & Reinvestment',
        description: 'Creating positive change globally',
        subdivisions: [
          {
            id: 'cultural-preservation',
            name: 'Cultural Preservation',
            description: 'Protecting and celebrating cultural heritage',
            bullets: ['Heritage Protection', 'Cultural Programs', 'Community Culture']
          },
          {
            id: 'education-missions',
            name: 'Education Missions',
            description: 'Global educational initiatives',
            bullets: ['Educational Access', 'Learning Programs', 'Global Education']
          },
          {
            id: 'reinvestment-programs',
            name: 'Reinvestment Programs',
            description: 'Community reinvestment and development',
            bullets: ['Community Development', 'Economic Growth', 'Sustainable Investment']
          },
          {
            id: 'apple-tree-foundation',
            name: 'The Apple & The Tree Foundation',
            description: 'Nonprofit humanitarian work',
            bullets: ['Philanthropy', 'Community Support', 'Social Good']
          }
        ]
      }
    ]
  }
};

// Helper function to get region by ID
export const getRegionById = (id) => {
  return regionsData[id] || null;
};

// Helper function to get all region IDs
export const getAllRegionIds = () => {
  return Object.keys(regionsData);
};

