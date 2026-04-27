import { Recipe } from '../types';

export const VERIFIED_RECIPES: Recipe[] = [
  {
    id: 'v1',
    title: 'Dabba Gosht',
    category: 'Jamaan',
    description: 'A legendary Bohra specialty - slow-cooked mutton in a rich cashew-cream gravy, topped with whisked egg and shimmering ghee.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80',
    time: '45 mins',
    servings: '4-6 Hearts',
    servingCount: 6,
    flavorProfile: 'Malai',
    cuisineType: 'Traditional',
    difficulty: 'Medium',
    ingredients: [
      '500g Mutton (boneless), cut into 1.5-inch cubes',
      '2 cups Hand-churned heavy cream',
      '1 cup Cashew paste (fine grind)',
      '2 tbsp Ginger-Garlic paste (freshly crushed)',
      '2 tbsp Pure Ghee (A2 quality preferred)',
      '2 large whisked Eggs (room temperature)',
      '1 tsp Authentic Bohra Garam Masala'
    ],
    instructions: [
      'Marinate the mutton with ginger-garlic paste and salt for 30 minutes.',
      'Sauté the mutton in ghee until golden brown.',
      'Add cashew paste and cream, simmering on low heat until the meat is tender.',
      'Pour the mixture into a "dabba" (casserole), top with whisked eggs.',
      'Pour hot ghee over the eggs to cook them instantly and seal the flavors.'
    ],
    heritage: 'Dabba Gosht is the cornerstone of the Bohra Thaal. Traditionally prepared for grand celebrations, it symbolizes the community\'s love for slow-cooked, rich, and communal dining.',
    verified: true
  },
  {
    id: 'v2',
    title: 'Kalamro',
    category: 'Meethas',
    description: 'The soul of Bohra desserts - a creamy yogurt-based rice pudding infused with saffron and crunchy pistachios.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80',
    time: '30 mins',
    servings: '4 Guests',
    servingCount: 4,
    flavorProfile: 'Khatta-Mitth',
    cuisineType: 'Traditional',
    difficulty: 'Easy',
    ingredients: [
      '1 cup Basmati Rice (boiled)',
      '2 cups Thick Yogurt',
      '1/2 cup Condensed milk',
      'Pinch of Saffron',
      '1/4 cup Chopped Pistachios',
      'Rose petals for garnish'
    ],
    instructions: [
      'Gently mash the boiled rice while it is warm.',
      'Whisk the yogurt until smooth and mix with condensed milk.',
      'Fold the rice into the yogurt mixture.',
      'Infuse with saffron soaked in warm milk.',
      'Garnish with pistachios and rose petals, and chill before serving.'
    ],
    heritage: 'Kalamro is more than just a sweet; it is often the first dish served in a Bohra Thaal, signifying a sweet start to the communal feast. It dates back centuries to when yogurt was a primary cooling element in coastal diets.',
    verified: true
  },
  {
    id: 'v3',
    title: 'Sarkhi',
    category: 'Salad',
    description: 'A refreshing cold mung bean salad tempered with curry leaves and mustard seeds, providing a vibrant crunch to the Thaal.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80',
    time: '20 mins',
    servings: '2 Guests',
    servingCount: 2,
    flavorProfile: 'Kurkura',
    cuisineType: 'Traditional',
    difficulty: 'Easy',
    ingredients: [
      '1 cup Sprouted Mung beans',
      '1 finely chopped Onion',
      '1 Green chili',
      '1 tbsp Mustard seeds',
      'Handful of Curry leaves',
      'Lemon juice'
    ],
    instructions: [
      'Steam the mung beans briefly to maintain crunch.',
      'Mix with onions and chopped chilies.',
      'Prepare a "tadka" (tempering) by heating ghee with mustard seeds and curry leaves.',
      'Pour the hot tadka over the beans.',
      'Finish with a squeeze of fresh lemon and sea salt.'
    ],
    heritage: 'Sarkhi represents the health-conscious side of the Bohra diet, balancing rich meat dishes with high-protein legumes and powerful digestive temperings.',
    verified: true
  }
];
