export interface Recipe {
  id: string;
  title: string;
  category: 'Meethas' | 'Khadan' | 'Main' | 'Salad';
  description: string;
  image: string;
  time: string;
  servings: string;
  servingCount: number;
  flavorProfile: 'Khatt-Mitth' | 'Zaikedaar' | 'Kurkura' | 'Masaledaar' | 'Malai' | 'Dhungaar' | 'Kharas';
  cuisineType: 'Traditional' | 'Fusion';
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  ingredients: string[];
  substitutions?: { original: string; substitute: string }[];
  instructions: string[];
  heritage: string;
}

export interface Profile {
  name: string;
  desc: string;
}
