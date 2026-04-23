export type Nutrition = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type MenuItem = {
  name: string;
  description: string;
  price: number;
  image: string;
  nutrition: Nutrition;
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};

export const menuData: MenuCategory[] = [
  {
    category: 'завтраки',
    items: [
      {
        name: 'большой завтрак',
        description: 'яйца, овощи, хлеб собственного производства',
        price: 1100,
        image: '/images/breakfast.svg',
        nutrition: { calories: 650, protein: 25, fat: 30, carbs: 60 }
      },
      {
        name: 'гречка с грибами',
        description: 'гречка, шампиньоны, зелень, сливочное масло',
        price: 820,
        image: '/images/buckwheat.svg',
        nutrition: { calories: 520, protein: 14, fat: 20, carbs: 68 }
      },
      {
        name: 'сырники',
        description: 'творог, яйцо, рисовая мука, натуральный йогурт',
        price: 760,
        image: '/images/syrniki.svg',
        nutrition: { calories: 480, protein: 24, fat: 17, carbs: 58 }
      }
    ]
  },
  {
    category: 'яйца',
    items: [
      {
        name: 'омлет классический',
        description: 'три яйца, молоко, сливочное масло, зелень',
        price: 690,
        image: '/images/omelette.svg',
        nutrition: { calories: 420, protein: 24, fat: 33, carbs: 6 }
      },
      {
        name: 'шакшука',
        description: 'яйца, томаты, сладкий перец, чеснок, кинза',
        price: 850,
        image: '/images/shakshuka.svg',
        nutrition: { calories: 460, protein: 22, fat: 28, carbs: 30 }
      },
      {
        name: 'скрэмбл на тосте',
        description: 'яйца, цельнозерновой хлеб, листья салата, масло',
        price: 780,
        image: '/images/scramble.svg',
        nutrition: { calories: 500, protein: 21, fat: 29, carbs: 38 }
      }
    ]
  },
  {
    category: 'творог',
    items: [
      {
        name: 'творожная тарелка',
        description: 'творог 5%, сезонные ягоды, семена, мед',
        price: 730,
        image: '/images/cottage-bowl.svg',
        nutrition: { calories: 410, protein: 28, fat: 14, carbs: 42 }
      },
      {
        name: 'творог с гранолой',
        description: 'творог 5%, гранола, яблоко, корица',
        price: 690,
        image: '/images/cottage-granola.svg',
        nutrition: { calories: 450, protein: 26, fat: 13, carbs: 55 }
      },
      {
        name: 'творог с орехами',
        description: 'творог 5%, грецкий орех, груша, йогурт',
        price: 740,
        image: '/images/cottage-nuts.svg',
        nutrition: { calories: 470, protein: 25, fat: 24, carbs: 31 }
      }
    ]
  },
  {
    category: 'пасты',
    items: [
      {
        name: 'паста с томатами',
        description: 'паста, томаты, базилик, оливковое масло, пармезан',
        price: 980,
        image: '/images/pasta-tomato.svg',
        nutrition: { calories: 610, protein: 20, fat: 22, carbs: 80 }
      },
      {
        name: 'паста с курицей',
        description: 'паста, куриное филе, сливки, шпинат',
        price: 1140,
        image: '/images/pasta-chicken.svg',
        nutrition: { calories: 690, protein: 35, fat: 26, carbs: 76 }
      },
      {
        name: 'паста с грибами',
        description: 'паста, шампиньоны, сливочный соус, петрушка',
        price: 1020,
        image: '/images/pasta-mushroom.svg',
        nutrition: { calories: 640, protein: 18, fat: 24, carbs: 84 }
      }
    ]
  },
  {
    category: 'напитки',
    items: [
      {
        name: 'эспрессо',
        description: 'двойной шот, зерно светлой обжарки',
        price: 240,
        image: '/images/espresso.svg',
        nutrition: { calories: 6, protein: 0, fat: 0, carbs: 1 }
      },
      {
        name: 'фильтр-кофе',
        description: 'воронка V60, зерно средней обжарки',
        price: 320,
        image: '/images/filter-coffee.svg',
        nutrition: { calories: 8, protein: 1, fat: 0, carbs: 1 }
      },
      {
        name: 'капучино',
        description: 'эспрессо, молоко 3.2%, микропена',
        price: 380,
        image: '/images/cappuccino.svg',
        nutrition: { calories: 135, protein: 7, fat: 7, carbs: 10 }
      },
      {
        name: 'матча латте',
        description: 'матча, молоко, вода, без сиропов',
        price: 420,
        image: '/images/matcha.svg',
        nutrition: { calories: 150, protein: 6, fat: 7, carbs: 15 }
      }
    ]
  }
];
