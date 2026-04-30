import { 
  Diamond, 
  DiamondCut, 
  DiamondColor, 
  DiamondClarity, 
  DiamondShape, 
  CertificationLab 
} from '../types';

export const mockDiamonds: Diamond[] = [
  {
    id: '1',
    slug: 'the-eternal-round-2ct',
    name: 'The Eternal Round Brilliant',
    price: 32500,
    carat: 2.05,
    cut: DiamondCut.EXCELLENT,
    color: DiamondColor.D,
    clarity: DiamondClarity.IF,
    shape: DiamondShape.ROUND,
    description: 'A masterpiece of precision, this Round Brilliant diamond exhibits unparalleled fire and brilliance. Ideal for an engagement ring that demands attention.',
    images: [
      'https://images.unsplash.com/photo-1584302983494-2092264c8a9e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop'
    ],
    certification: {
      lab: CertificationLab.GIA,
      number: '2214589901',
      url: '#'
    },
    inStock: true,
    isNew: true
  },
  {
    id: '2',
    slug: 'majestic-princess-1-5ct',
    name: 'Majestic Princess Cut',
    price: 18400,
    originalPrice: 21000,
    carat: 1.54,
    cut: DiamondCut.EXCELLENT,
    color: DiamondColor.E,
    clarity: DiamondClarity.VVS1,
    shape: DiamondShape.PRINCESS,
    description: 'Contemporary elegance meets classic sparkle. This Princess cut diamond features sharp edges and a brilliant facet pattern.',
    images: [
      'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=1000&auto=format&fit=crop'
    ],
    certification: {
      lab: CertificationLab.GIA,
      number: '5341220087',
      url: '#'
    },
    inStock: true,
    sale: true
  },
  {
    id: '3',
    slug: 'vintage-emerald-step-cut',
    name: 'Vintage Emerald Step Cut',
    price: 24200,
    carat: 1.82,
    cut: DiamondCut.VERY_GOOD,
    color: DiamondColor.F,
    clarity: DiamondClarity.VS1,
    shape: DiamondShape.EMERALD,
    description: 'The "hall of mirrors" effect of this Emerald cut diamond creates long, elegant flashes of light. Perfect for an art-deco inspired setting.',
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad55934d?q=80&w=1000&auto=format&fit=crop'
    ],
    certification: {
      lab: CertificationLab.IGI,
      number: '44521190',
      url: '#'
    },
    inStock: true
  },
  {
    id: '4',
    slug: 'celestial-oval-brilliant',
    name: 'Celestial Oval Brilliant',
    price: 15900,
    carat: 1.25,
    cut: DiamondCut.EXCELLENT,
    color: DiamondColor.G,
    clarity: DiamondClarity.VVS2,
    shape: DiamondShape.OVAL,
    description: 'An elongated silhouette that flatters the finger. This oval diamond combines the fire of a round cut with a modern, sophisticated shape.',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1000&auto=format&fit=crop'
    ],
    certification: {
      lab: CertificationLab.GIA,
      number: '1109823485',
      url: '#'
    },
    inStock: true,
    isNew: true
  },
  {
    id: '5',
    slug: 'pure-pear-teardrop',
    name: 'Pure Pear Teardrop',
    price: 28700,
    carat: 2.12,
    cut: DiamondCut.EXCELLENT,
    color: DiamondColor.D,
    clarity: DiamondClarity.VS1,
    shape: DiamondShape.PEAR,
    description: 'A striking teardrop shape that makes a statement. Exceptional symmetry and a crisp, white appearance.',
    images: [
      'https://images.unsplash.com/photo-1630019017730-207826e89310?q=80&w=1000&auto=format&fit=crop'
    ],
    certification: {
      lab: CertificationLab.AGS,
      number: '10403321',
      url: '#'
    },
    inStock: true
  }
];
