import { Profile } from './types';

export const CUISINE_PROFILES: Profile[] = [
  { name: 'Traditional', desc: 'Ancestral recipes passed down through generations, strictly following Bohra family secrets.' },
  { name: 'Fusion', desc: 'Modern adaptations and cross-cultural blends that maintain the Bohra soul with contemporary twists.' }
];

export const FLAVOR_PROFILES: Profile[] = [
  { name: 'Khatta-Mitth', desc: 'The soul of the Bohra palate; a sophisticated tug-of-war between the tang of dried kokum or tamarind pulp and the earthy sweetness of organic jaggery or dates.' },
  { name: 'Zaikedaar', desc: 'A term for depth of flavor; achieved through "Bhunao" (slow-roasting) and the use of "Lazzat-e-Taam", a proprietary spice blend that unlocks deep umami and lingering aromatics.' },
  { name: 'Kurkura', desc: 'The iconic shatter-crisp texture of Bohra appetizers; perfected by using paper-thin "patti" sheets that are vertical-fried until golden and translucent.' },
  { name: 'Masaledaar', desc: 'Layered spice-craft that focuses on complexity rather than heat; using stone-pounded cumin, coriander, and the rare "dagad phool" for an earthy finish.' },
  { name: 'Malai', desc: 'The essence of luxury in the Thaal; characterized by silken textures derived from hand-churned cream, cashew pastes, and slow-reduced milk.' },
  { name: 'Dhungaar', desc: 'The ancestral art of smoke; where a live coal is doused with ghee inside a sealed vessel to infuse the meat with a primal, woody fragrance.' },
  { name: 'Kharas', desc: 'A fundamental pillar of the meal; the robust savory dimension that balances the "Meethas", featuring garlic and herb-heavy preparations.' }
];

export const COMMON_INGREDIENTS = [
  'Basmati Rice', 'Mutton', 'Yogurt', 'Kokum', 'Drumsticks', 
  'Besan', 'Spring Onions', 'Pineapple', 'Ghee', 'Saffron'
];

export const CATEGORIES = ['All', 'Meethas', 'Kharaas', 'Jamaan', 'Salad'];
