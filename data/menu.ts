import { getMockMenuImage } from './mockImages';
import { LocationId } from './locations';

export type Nutrition = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type PriceOption = {
  label: string;
  price: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  subcategory?: string;
  priceByLocation: Record<LocationId, number>;
  priceOptionsByLocation?: Record<LocationId, PriceOption[]>;
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

const samePrice = (value: number): Record<LocationId, number> => price(value, value, value);

const samePriceOptions = (options: PriceOption[]): Record<LocationId, PriceOption[]> => ({
  o12: options,
  k10: options,
  p7: options
});

const volumePrices = (...options: PriceOption[]): Record<LocationId, PriceOption[]> => samePriceOptions(options);
const nutritionEmpty: Nutrition = { calories: 0, protein: 0, fat: 0, carbs: 0 };

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
        id: 'drinks-espresso',
        name: 'эспрессо',
        description: '',
        subcategory: 'черный кофе',
        priceByLocation: samePrice(190),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-filter',
        name: 'фильтр',
        description: '',
        subcategory: 'черный кофе',
        priceByLocation: samePrice(220),
        priceOptionsByLocation: volumePrices(
          { label: '0,2 л', price: 220 },
          { label: '0,3 л', price: 270 },
          { label: '0,4 л', price: 320 }
        ),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-americano',
        name: 'американо',
        description: '',
        subcategory: 'черный кофе',
        priceByLocation: samePrice(220),
        priceOptionsByLocation: volumePrices(
          { label: '0,2 л', price: 220 },
          { label: '0,4 л', price: 320 }
        ),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-manual-brew',
        name: 'v60 / аэропресс / лунго',
        description: '',
        subcategory: 'черный кофе',
        priceByLocation: samePrice(330),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-guest-beans',
        name: 'гостевое зерно',
        description: '',
        subcategory: 'черный кофе',
        priceByLocation: samePrice(450),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-coffee-set-1',
        name: 'кофе сет 1',
        description: '',
        subcategory: 'черный кофе',
        priceByLocation: samePrice(350),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-coffee-set-2',
        name: 'кофе сет 2',
        description: '',
        subcategory: 'черный кофе',
        priceByLocation: samePrice(400),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-flat-white',
        name: 'флэт уайт',
        description: '',
        subcategory: 'классика',
        priceByLocation: samePrice(260),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-cappuccino',
        name: 'капучино',
        description: '',
        subcategory: 'классика',
        priceByLocation: samePrice(230),
        priceOptionsByLocation: volumePrices(
          { label: '0,2 л', price: 230 },
          { label: '0,3 л', price: 290 },
          { label: '0,4 л', price: 380 }
        ),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-latte',
        name: 'латте',
        description: '',
        subcategory: 'классика',
        priceByLocation: samePrice(290),
        priceOptionsByLocation: volumePrices(
          { label: '0,3 л', price: 290 },
          { label: '0,4 л', price: 380 }
        ),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-raf',
        name: 'раф',
        description: '',
        subcategory: 'классика',
        priceByLocation: samePrice(310),
        priceOptionsByLocation: volumePrices(
          { label: '0,3 л', price: 310 },
          { label: '0,4 л', price: 390 }
        ),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-bumble',
        name: 'бамбл',
        description: 'апельсиновый фреш / вишневый сок',
        subcategory: 'классика',
        priceByLocation: samePrice(400),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-taste-experience',
        name: 'вкусовой опыт',
        description: '',
        subcategory: 'авторские напитки',
        priceByLocation: samePrice(470),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-basil-raf',
        name: 'раф базилик',
        description: '',
        subcategory: 'авторские напитки',
        priceByLocation: samePrice(360),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-strawberry-mocha',
        name: 'мокко клубника',
        description: '',
        subcategory: 'авторские напитки',
        priceByLocation: samePrice(360),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-citrus-matcha',
        name: 'маття цитрус',
        description: '',
        subcategory: 'авторские напитки',
        priceByLocation: samePrice(380),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-strawberry-banana-matcha',
        name: 'маття клубника-банан',
        description: '',
        subcategory: 'холодные напитки',
        priceByLocation: samePrice(380),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-taiga-lemonade',
        name: 'лимонад таежный',
        description: '',
        subcategory: 'холодные напитки',
        priceByLocation: samePrice(320),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-floral-lemonade',
        name: 'лимонад цветочный',
        description: '',
        subcategory: 'холодные напитки',
        priceByLocation: samePrice(320),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-espresso-tonic',
        name: 'эспрессо тоник',
        description: '',
        subcategory: 'холодные напитки',
        priceByLocation: samePrice(310),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-matcha-tonic',
        name: 'маття тоник',
        description: '',
        subcategory: 'холодные напитки',
        priceByLocation: samePrice(310),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-cold-brew-tea',
        name: 'чай холодного заваривания',
        description: 'габа манго / ледяной тигуанинь',
        subcategory: 'холодные напитки',
        priceByLocation: samePrice(310),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-chinese-tea',
        name: 'китайский чай',
        description: '',
        subcategory: 'чай',
        priceByLocation: samePrice(390),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-shu-puer-gaba',
        name: 'шу пуэр + ми сян габа',
        description: '',
        subcategory: 'чай',
        priceByLocation: samePrice(400),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-sagan-lemongrass',
        name: 'саган дайля-лимонник',
        description: '',
        subcategory: 'чай',
        priceByLocation: samePrice(370),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-barberry-lemongrass',
        name: 'барбарис-лемонграсс',
        description: '',
        subcategory: 'чай',
        priceByLocation: samePrice(370),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-raspberry-longjing',
        name: 'малиновый лун цзин',
        description: '',
        subcategory: 'чай',
        priceByLocation: samePrice(370),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-cocoa',
        name: 'какао',
        description: '',
        subcategory: 'не кофе',
        priceByLocation: samePrice(290),
        priceOptionsByLocation: volumePrices(
          { label: '0,3 л', price: 290 },
          { label: '0,4 л', price: 380 }
        ),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-special-cocoa',
        name: 'какао особый',
        description: '',
        subcategory: 'не кофе',
        priceByLocation: samePrice(450),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-matcha',
        name: 'маття',
        description: '',
        subcategory: 'не кофе',
        priceByLocation: samePrice(240),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-matcha-latte',
        name: 'маття латте',
        description: '',
        subcategory: 'не кофе',
        priceByLocation: samePrice(290),
        priceOptionsByLocation: volumePrices(
          { label: '0,3 л', price: 290 },
          { label: '0,4 л', price: 380 }
        ),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-orange-fresh',
        name: 'апельсиновый фреш',
        description: '',
        subcategory: 'не кофе',
        priceByLocation: samePrice(380),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-alternative-milk',
        name: 'альтернативное молоко',
        description: '',
        subcategory: 'дополнительно',
        priceByLocation: samePrice(90),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-iced-teguanyin',
        name: 'ледяной те гуань инь',
        description: 'светлый улун; ноты сирени, цветы; расслабление',
        subcategory: 'чайное меню',
        priceByLocation: samePrice(390),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-mi-xiang-gaba',
        name: 'ми сян габа',
        description: 'цветы, мед, карамель; концентрация',
        subcategory: 'чайное меню',
        priceByLocation: samePrice(390),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-gaba-mango',
        name: 'габа манго',
        description: 'хвоя, карамель, цветы',
        subcategory: 'чайное меню',
        priceByLocation: samePrice(390),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-nai-xiang',
        name: 'най сян',
        description: 'сливки, карамель',
        subcategory: 'чайное меню',
        priceByLocation: samePrice(390),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-xi-hu-long-jing',
        name: 'си ху лун цзин',
        description: 'тыквенные семечки, печенье',
        subcategory: 'чайное меню',
        priceByLocation: samePrice(390),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-da-jin-zhen-wang',
        name: 'да цзинь чжень ван',
        description: 'мед, хлеб, цитрус',
        subcategory: 'чайное меню',
        priceByLocation: samePrice(390),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-da-hong-pao-xiao-zhong',
        name: 'да хун пао сяо чжун',
        description: 'карамель, сахар',
        subcategory: 'чайное меню',
        priceByLocation: samePrice(390),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-lincang-ba-ji-cha',
        name: 'линьцан ба цзи ча',
        description: 'цветочный, чернослив',
        subcategory: 'чайное меню',
        priceByLocation: samePrice(390),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
      },
      {
        id: 'drinks-xin-yi-wu-zhen-shu',
        name: 'синь и у чжен шу',
        description: 'лесной орех, карамель',
        subcategory: 'чайное меню',
        priceByLocation: samePrice(390),
        image: getMockMenuImage('drinks'),
        nutrition: nutritionEmpty
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
