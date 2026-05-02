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

const createFoodItem = (id: string, name: string, imageKey: Parameters<typeof getMockMenuImage>[0]): MenuItem => ({
  id,
  name,
  description: '',
  priceByLocation: samePrice(0),
  image: getMockMenuImage(imageKey),
  nutrition: nutritionEmpty
});

export const menuData: MenuCategory[] = [
  {
    category: 'большие завтраки',
    items: [
      createFoodItem('big-breakfast-fish', 'большой завтрак — рыба', 'breakfast'),
      createFoodItem('big-breakfast-meat', 'большой завтрак — мясо', 'breakfast')
    ]
  },
  {
    category: 'яйца и каши',
    items: [
      createFoodItem('eggs-porridge-oatmeal', 'каша овсяная', 'eggs'),
      createFoodItem('eggs-porridge-rice', 'каша рисовая', 'eggs'),
      createFoodItem('eggs-scramble-toast', 'скрембл — тост', 'eggs'),
      createFoodItem('eggs-scramble-toast-fish', 'скрембл тост рыба', 'eggs'),
      createFoodItem('eggs-french-toast-salami', 'французский тост салями', 'eggs'),
      createFoodItem('eggs-italian', 'яйца по-итальянски', 'eggs')
    ]
  },
  {
    category: 'паста',
    items: [
      createFoodItem('pasta-truffle', 'паста — трюфель', 'pasta'),
      createFoodItem('pasta-pesto-chicken', 'паста песто курица', 'pasta'),
      createFoodItem('pasta-tomato-shrimp', 'паста томатная креветка', 'pasta')
    ]
  },
  {
    category: 'драники',
    items: [
      createFoodItem('draniki-trout', 'драник форель', 'breakfast'),
      createFoodItem('draniki-mushrooms', 'драник грибы', 'breakfast')
    ]
  },
  {
    category: 'творог',
    items: [
      createFoodItem('cottage-syrniki-sweet', 'сырники сладкие', 'cottage'),
      createFoodItem('cottage-syrniki-savory', 'сырники соленые', 'cottage'),
      createFoodItem('cottage-greek-yogurt', 'творог с греческим йогуртом', 'cottage')
    ]
  },
  {
    category: 'супы и салаты',
    items: [
      createFoodItem('soups-salads-chicken-soup', 'суп куриный', 'breakfast'),
      createFoodItem('soups-salads-gazpacho', 'суп гаспачо', 'breakfast'),
      createFoodItem('soups-salads-green-pepper', 'зеленый салат с печеным перцем', 'breakfast'),
      createFoodItem('soups-salads-caesar', 'цезарь креветка / курица', 'breakfast')
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
  }
];
