// Region data structure for SJEG Globe
export const regionsData = {
  caribbean: {
    id: 'caribbean',
    name: 'Caribbean / Americas',
    description: 'Your Core (Home Base)',
    position: { lat: 15.4, lng: -61.3 }, // Dominica (primary)
    secondaryPosition: { lat: 29.7604, lng: -95.3698 }, // Houston, Texas
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
            bullets: ['AI Community Building', 'Educational Technology', 'Youth Leadership'],
            position: { lat: 15.4150, lng: -61.3710 }, // Dominica
            image: '/textures/1.jpg'
          },
          {
            id: 'guardian-amy',
            name: 'Guardian Amy',
            description: 'AI guardian and educational companion',
            bullets: ['AI Education', 'Child Safety', 'Learning Support'],
            position: { lat: 18.1096, lng: -77.2975 }, // Jamaica
            image: '/textures/2.png'
          },
          {
            id: 'vitajazz-ai',
            name: 'VitaJazz AI',
            description: 'AI wellness and lifestyle platform',
            bullets: ['Health AI', 'Wellness Technology', 'Lifestyle Optimization'],
            position: { lat: 11.1132, lng: -69.5988 }, // Barbados
            image: '/textures/3.png'
          },
          {
            id: 'tech-auntea',
            name: 'Tech Auntea',
            description: 'Technology education and mentorship (Houston)',
            bullets: ['Tech Education', 'Mentorship Programs', 'Community Tech'],
            position: { lat: 29.7604, lng: -95.3698 }, // Houston, Texas
            image: '/textures/1.jpg'
          },
          {
            id: 'bosspel',
            name: 'Bosspel',
            description: 'Innovative technology solutions',
            bullets: ['Tech Solutions', 'Innovation Hub', 'Digital Transformation'],
            position: { lat: 25.7617, lng: -80.1918 }, // Miami, Florida
            image: '/textures/2.png'
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
            name: 'Youth Leadership',
            description: 'Developing future leaders',
            bullets: ['Leadership Training', 'Mentorship', 'Community Impact'],
            position: { lat: 9000, lng: -61.2225 }, // Trinidad and Tobago
            image: '/textures/3.png'
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
            bullets: ['Solar Power', 'Wind Energy', 'Community Grids'],
            position: { lat: -1.2921, lng: 36.8219 }, // East Africa (Kenya area)
            image: '/textures/1.jpg' // Placeholder - you can add actual images
          },
          {
            id: 'clean-tech-labs',
            name: 'Clean-tech Labs',
            description: 'Innovation in renewable technology',
            bullets: ['Research & Development', 'Technology Innovation', 'Sustainable Solutions'],
            position: { lat: 6.5244, lng: 3.3792 }, // West Africa (Nigeria area)
            image: '/textures/2.png'
          },
          {
            id: 'resource-management',
            name: 'Resource Management',
            description: 'Efficient resource utilization systems',
            bullets: ['Energy Efficiency', 'Resource Optimization', 'Sustainable Practices'],
            position: { lat: -4.0383, lng: 21.7587 }, // Central Africa (Congo area)
            image: '/textures/3.png'
          },
          {
            id: 'renewable-infrastructure',
            name: 'Renewable Infrastructure',
            description: 'Building sustainable energy infrastructure',
            bullets: ['Infrastructure Development', 'Green Technology', 'Future Energy'],
            position: { lat: -25.7461, lng: 28.1881 }, // Southern Africa (South Africa area)
            image: '/textures/1.jpg'
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
            bullets: ['Eco Architecture', 'Sustainable Design', 'Community Living'],
            position: { lat: 52.5074, lng: -1 }, // London, UK
            image: '/textures/1.jpg'
          },
          {
            id: 'future-buildings',
            name: 'SJEG Future Buildings',
            description: 'Next-generation architectural projects',
            bullets: ['Innovative Design', 'Smart Buildings', 'Sustainable Architecture'],
            position: { lat: 42.5200, lng: 25.4050 }, // Berlin, Germany
            image: '/textures/2.png'
          },
          {
            id: 'smart-homes',
            name: 'Smart Homes',
            description: 'Intelligent living spaces',
            bullets: ['Home Automation', 'Energy Efficiency', 'Modern Living'],
            position: { lat: 40.8566, lng: -2 }, // Paris, France
            image: '/textures/3.png'
          },
          {
            id: 'eco-architecture',
            name: 'Eco Architecture',
            description: 'Environmentally conscious building design',
            bullets: ['Green Building', 'Sustainable Materials', 'Environmental Design'],
            position: { lat: 53.7558, lng: 16.6821 }, // Moscow, Russia
            image: '/textures/1.jpg'
          },
          {
            id: 'innovation-hubs',
            name: 'Innovation Hubs',
            description: 'Centers of technological innovation',
            bullets: ['Tech Centers', 'Collaboration Spaces', 'Innovation Labs'],
            position: { lat: 45.1109, lng: 8.6821 }, // Frankfurt, Germany
            image: '/textures/2.png'
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
            id: 'good-distribution',
            name: 'Good Distribution',
            description: 'Global logistics and supply chain solutions',
            bullets: ['Supply Chain', 'Logistics', 'Distribution Networks'],
            position: { lat: 35.8617, lng: 104.1954 }, // China
            image: '/textures/1.jpg'
          },
          {
            id: 'product-pipelines',
            name: 'Product Pipelines',
            description: 'Efficient product distribution networks',
            bullets: ['Supply Chain', 'Logistics', 'Distribution Networks'],
            position: { lat: 28.6139, lng: 77.2090 }, // India (Delhi)
            image: '/textures/2.png'
          },
          {
            id: 'global-trade-routes',
            name: 'Global Trade Routes',
            description: 'International commerce connections',
            bullets: ['International Trade', 'Commerce Networks', 'Global Markets'],
            position: { lat: 18.3521, lng: 98.8198 }, // Singapore
            image: '/textures/3.png'
          },
          {
            id: 'itgirl-nation',
            name: 'ItGirlNation',
            description: 'E-commerce and retail platform',
            bullets: ['E-commerce', 'Retail', 'Digital Commerce'],
            position: { lat: 20.6139, lng: 77.2090 }, // Tokyo, Japan
            image: '/textures/1.jpg'
          },
          {
            id: 'collections-by-si',
            name: 'Collections by Si',
            description: 'Curated product collections',
            bullets: ['Product Curation', 'Retail', 'Brand Collections'],
            position: { lat: 30.3193, lng: 114.1694 }, // Hong Kong
            image: '/textures/2.png'
          }
        ]
      }
    ]
  },
  oceania: {
    id: 'oceania',
    name: 'Oceania / Australia',
    description: 'Social Impact & Reinvestment',
    position: { lat: -25.2744, lng: 133.7751 }, // Center of Australia
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
            bullets: ['Heritage Protection', 'Cultural Programs', 'Community Culture'],
            position: { lat: -23.8688, lng: 115.2093 }, // Sydney, Australia
            image: '/textures/1.jpg'
          },
          {
            id: 'education-missions',
            name: 'Education Missions',
            description: 'Global educational initiatives',
            bullets: ['Educational Access', 'Learning Programs', 'Global Education'],
            position: { lat: -34.8136, lng: 144.9631 }, // Melbourne, Australia
            image: '/textures/2.png'
          },
          {
            id: 'reinvestment-programs',
            name: 'Reinvestment Programs',
            description: 'Community reinvestment and development',
            bullets: ['Community Development', 'Economic Growth', 'Sustainable Investment'],
            position: { lat: -27.4698, lng: 153.0251 }, // Brisbane, Australia
            image: '/textures/3.png'
          },
          {
            id: 'nonprofit-arms',
            name: 'Nonprofit Arms',
            description: 'Nonprofit humanitarian work',
            bullets: ['Philanthropy', 'Community Support', 'Social Good'],
            position: { lat: -31.9505, lng: 120.8605 }, // Perth, Australia
            image: '/textures/1.jpg'
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

