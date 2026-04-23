export const mockMenuImageByKey = {
  breakfast: '/images/mock/breakfast-card.svg',
  eggs: '/images/mock/eggs-card.svg',
  cottage: '/images/mock/cottage-card.svg',
  pasta: '/images/mock/pasta-card.svg',
  drinks: '/images/mock/drinks-card.svg'
} as const;

export type MockMenuImageKey = keyof typeof mockMenuImageByKey;

export const getMockMenuImage = (key: MockMenuImageKey) => mockMenuImageByKey[key];
