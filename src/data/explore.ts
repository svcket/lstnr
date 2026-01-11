export const TRENDING_ARTISTS = [
  {
    id: 'a1',
    name: 'Kanye West',
    avatar: 'https://i.pravatar.cc/150?u=kanye',
    volume: '$4,271,485 Vol.',
    price: '$19,012.84',
    change: '+163.9%',
    isPositive: true,
  },
  {
    id: 'a2',
    name: 'Tems',
    avatar: 'https://i.pravatar.cc/150?u=tems',
    volume: '$4,271,485 Vol.',
    price: '$16,334.92',
    change: '+163.9%',
    isPositive: true,
  },
  {
    id: 'a3',
    name: 'Burna Boy',
    avatar: 'https://i.pravatar.cc/150?u=burna',
    volume: '$4,271,485 Vol.',
    price: '$20,699.57',
    change: '+163.9%',
    isPositive: true,
  },
  {
    id: 'a4',
    name: 'Lily Allen',
    avatar: 'https://i.pravatar.cc/150?u=lily',
    volume: '$4,271,485 Vol.',
    price: '$19,012.84',
    change: '+163.9%',
    isPositive: true,
  },
];

export const POPULAR_LABELS = [
  {
    id: 'l1',
    name: 'UMG',
    logo: 'https://i.pravatar.cc/150?u=umg',
    volume: '$4,271,485 Vol.',
    price: '$16,334.92',
    change: '+163.9%',
    isPositive: true,
  },
  {
    id: 'l2',
    name: 'Rockafella',
    logo: 'https://i.pravatar.cc/150?u=rock',
    volume: '$4,271,485 Vol.',
    price: '$20,699.57',
    change: '+163.9%',
    isPositive: true,
  },
  {
    id: 'l3',
    name: 'Good Music',
    logo: 'https://i.pravatar.cc/150?u=good',
    volume: '$4,271,485 Vol.',
    price: '$19,012.84',
    change: '+163.9%',
    isPositive: true,
  },
  {
    id: 'l4',
    name: 'Def Jam',
    logo: 'https://i.pravatar.cc/150?u=def',
    volume: '$4,271,485 Vol.',
    price: '$19,012.84',
    change: '+163.9%',
    isPositive: true,
  },
];

export const TOP_PREDICTIONS = [
  {
    id: 'p1',
    type: 'binary',
    question: 'Would Tomi Obanure release an album in 2025?',
    chance: 90,
    yesPrice: '5.8¢',
    noPrice: '94.5¢',
    volume: '$369k Vol.',
    endTime: '2025-12-31',
  },
  {
    id: 'p2',
    type: 'multi',
    question: 'Which Nigerian artiste would win a Grammy in the 2026 awards ceremony?',
    candidates: [
      { name: 'Tomi Obanure', pct: '72%' },
      { name: 'KVV', pct: '32%' }, // Math doesn't sum to 100 but following UI reference style strictly
    ],
    volume: '$369k Vol.',
    endTime: '2026-02-01',
  },
  {
    id: 'p3',
    type: 'binary',
    question: 'Would Tomi Obanure win the “Headies Next Rated Artist Award in 2026?”',
    chance: 27,
    yesPrice: '32.4¢',
    noPrice: '67.6¢',
    volume: '$125.0k Vol.',
    endTime: '2026-06-01', // Sorting fodder
  },
];
