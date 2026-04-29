import { Recipe } from '../types';

export const VERIFIED_RECIPES: Recipe[] = [
  {
    id: 'kalamra',
    title: 'Kalamra',
    category: 'Meethas',
    description: 'A divine curd-based rice pudding, traditionally served during auspicious occasions.',
    image: 'https://images.unsplash.com/photo-1589113103553-496da4389131?q=80&w=2670&auto=format&fit=crop',
    time: '45 mins',
    servings: '8 people',
    servingCount: 8,
    flavorProfile: 'Malai',
    cuisineType: 'Traditional',
    difficulty: 'Medium',
    ingredients: ['Basmati Rice', 'Yogurt', 'Sugar', 'Saffron', 'Pomegranate seeds', 'Charoli', 'Milk'],
    instructions: [
      'Wash and soak rice for 30 minutes.',
      'Boil rice until soft, then mash it slightly.',
      'Add milk and sugar, simmer until thick.',
      'Once cooled, fold in yogurt gently.',
      'Garnish with pomegranate, saffron, and nuts.'
    ],
    heritage: 'Kalamra is more than a dessert; it is a symbol of Barakat (blessings). It is often the first "Meethas" served in an Eid Thaal.',
    verified: true
  },
  {
    id: 'smoked-dal-chawal',
    title: 'Dal Chawal Palido',
    category: 'Jamaan',
    description: 'The quintessential Bohra comfort food featuring layered rice and a smoky lentil soup.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2670&auto=format&fit=crop',
    time: '1.5 hours',
    servings: '8 people',
    servingCount: 8,
    flavorProfile: 'Dhungaar',
    cuisineType: 'Traditional',
    difficulty: 'Advanced',
    ingredients: ['Basmati Rice', 'Tuvar Dal', 'Drumsticks', 'Besan', 'Kokum', 'Garlic', 'Ghee', 'Coal'],
    instructions: [
      'Cook rice and dal separately.',
      'Prepare Palido (soup) using drumsticks, besan, and spices.',
      'Layer the cooked dal over the rice.',
      'Infuse with Dhungaar (smoke) using a hot coal and ghee.',
      'Serve hot with the Palido poured over.'
    ],
    heritage: 'This dish showcases the unique Bohra technique of Dhungaar (smoking) and the use of drumsticks in a savory broth.',
    verified: true
  }
];
