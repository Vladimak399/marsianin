import { getMockMenuImage } from './mockImages';
import { LocationId } from './locations';

export type Nutrition = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceByLocation: Record<LocationId, number>;
  image: string;
  nutrition: Nutrition;
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};

const price = (o12: number, k10: number, p7: number): Record<LocationId, number> => ({
  o12,
  k10,
  p7
});

export const menuData: MenuCategory[] = [
  {
    category: 'завтраки',
    items: [
      {
        id: 'breakfast-1',
        name: 'большой завтрак',
        description: 'яйца, овощи, хлеб собственного производства',
        priceByLocation: price(1100, 1050, 990),
        image: getMockMenuImage('breakfast'),
        nutrition: { calories: 650, protein: 25, fat: 30, carbs: 60 }
      },
      {
        id: 'breakfast-2',
        name: 'гречка с грибами',
        description: 'гречка, шампиньоны, зелень, сливочное масло',
        priceByLocation: price(820, 790, 740),
        image: getMockMenuImage('breakfast'),
        nutrition: { calories: 520, protein: 14, fat: 20, carbs: 68 }
      },
      {
        id: 'breakfast-3',
        name: 'сырники',
        description: 'творог, яйцо, рисовая мука, натуральный йогурт',
        priceByLocation: price(760, 730, 690),
        image: getMockMenuImage('breakfast'),
        nutrition: { calories: 480, protein: 24, fat: 17, carbs: 58 }
      }
    ]
  },
  {
    category: 'яйца',
    items: [
      {
        id: 'eggs-1',
        name: 'омлет классический',
        description: 'три яйца, молоко, сливочное масло, зелень',
        priceByLocation: price(690, 660, 620),
        image: getMockMenuImage('eggs'),
        nutrition: { calories: 420, protein: 24, fat: 33, carbs: 6 }
      },
      {
        id: 'eggs-2',
        name: 'шакшука',
        description: 'яйца, томаты, сладкий перец, чеснок, кинза',
        priceByLocation: price(850, 810, 770),
        image: getMockMenuImage('eggs'),
        nutrition: { calories: 460, protein: 22, fat: 28, carbs: 30 }
      },
      {
        id: 'eggs-3',
        name: 'скрэмбл на тосте',
        description: 'яйца, цельнозерновой хлеб, листья салата, масло',
        priceByLocation: price(780, 740, 710),
        image: getMockMenuImage('eggs'),
        nutrition: { calories: 500, protein: 21, fat: 29, carbs: 38 }
      }
    ]
  },
  {
    category: 'творог',
    items: [
      {
        id: 'cottage-1',
        name: 'творожная тарелка',
        description: 'творог 5%, сезонные ягоды, семена, мед',
        priceByLocation: price(730, 700, 670),
        image: getMockMenuImage('cottage'),
        nutrition: { calories: 410, protein: 28, fat: 14, carbs: 42 }
      },
      {
        id: 'cottage-2',
        name: 'творог с гранолой',
        description: 'творог 5%, гранола, яблоко, корица',
        priceByLocation: price(690, 660, 630),
        image: getMockMenuImage('cottage'),
        nutrition: { calories: 450, protein: 26, fat: 13, carbs: 55 }
      },
      {
        id: 'cottage-3',
        name: 'творог с орехами',
        description: 'творог 5%, грецкий орех, груша, йогурт',
        priceByLocation: price(740, 710, 680),
        image: getMockMenuImage('cottage'),
        nutrition: { calories: 470, protein: 25, fat: 24, carbs: 31 }
      }
    ]
  },
  {
    category: 'пасты',
    items: [
      {
        id: 'pasta-1',
        name: 'паста с томатами',
        description: 'паста, томаты, базилик, оливковое масло, пармезан',
        priceByLocation: price(980, 940, 900),
        image: getMockMenuImage('pasta'),
        nutrition: { calories: 610, protein: 20, fat: 22, carbs: 80 }
      },
      {
        id: 'pasta-2',
        name: 'паста с курицей',
        description: 'паста, куриное филе, сливки, шпинат',
        priceByLocation: price(1140, 1090, 1040),
        image: getMockMenuImage('pasta'),
        nutrition: { calories: 690, protein: 35, fat: 26, carbs: 76 }
      },
      {
        id: 'pasta-3',
        name: 'паста с грибами',
        description: 'паста, шампиньоны, сливочный соус, петрушка',
        priceByLocation: price(1020, 980, 930),
        image: getMockMenuImage('pasta'),
        nutrition: { calories: 640, protein: 18, fat: 24, carbs: 84 }
      }
    ]
  },
  {
    category: 'напитки',
    items: [
      {
        id: 'drinks-1',
        name: 'эспрессо',
        description: 'двойной шот, зерно светлой обжарки',
        priceByLocation: price(240, 220, 210),
        image: getMockMenuImage('drinks'),
        nutrition: { calories: 6, protein: 0, fat: 0, carbs: 1 }
      },
      {
        id: 'drinks-2',
        name: 'фильтр-кофе',
        description: 'воронка V60, зерно средней обжарки',
        priceByLocation: price(320, 300, 280),
        image: getMockMenuImage('drinks'),
        nutrition: { calories: 8, protein: 1, fat: 0, carbs: 1 }
      },
      {
        id: 'drinks-3',
        name: 'капучино',
        description: 'эспрессо, молоко 3.2%, микропена',
        priceByLocation: price(380, 360, 340),
        image: getMockMenuImage('drinks'),
        nutrition: { calories: 135, protein: 7, fat: 7, carbs: 10 }
      },
      {
        id: 'drinks-4',
        name: 'матча латте',
        description: 'матча, молоко, вода, без сиропов',
        priceByLocation: price(420, 400, 370),
        image: getMockMenuImage('drinks'),
        nutrition: { calories: 150, protein: 6, fat: 7, carbs: 15 }
      }
    ]
  },
  {
    category: 'десерты',
    items: [
      {
        id: 'desserts-1',
        name: 'чизкейк ванильный',
        description: 'сливочный чизкейк, ваниль, песочная основа',
        priceByLocation: price(520, 490, 460),
        image: getMockMenuImage('cottage'),
        nutrition: { calories: 430, protein: 8, fat: 24, carbs: 45 }
      },
      {
        id: 'desserts-2',
        name: 'брауни шоколадный',
        description: 'тёмный шоколад, какао, миндальная мука',
        priceByLocation: price(480, 450, 430),
        image: getMockMenuImage('breakfast'),
        nutrition: { calories: 390, protein: 6, fat: 21, carbs: 43 }
      },
      {
        id: 'desserts-3',
        name: 'эклер фисташковый',
        description: 'заварное тесто, фисташковый крем, глазурь',
        priceByLocation: price(560, 530, 500),
        image: getMockMenuImage('pasta'),
        nutrition: { calories: 360, protein: 7, fat: 19, carbs: 39 }
      }
    ]
  }
];
