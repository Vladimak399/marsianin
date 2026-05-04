export const locations = [
  {
    id: 'o12',
    label: 'О12',
    lat: 54.7008,
    lng: 20.5161,
    address: 'калининград, ул октябрьская 12',
    workingHours: 'ежедневно с 08:00 до 21:00',
    phone: '+7 (993) 731-36-96',
    phoneTel: '+79937313696',
    links: {
      yandexEda: 'https://eda.yandex.ru/kaliningrad/r/marsianin_kofejna',
      delivery: 'https://eda.yandex.ru/kaliningrad/r/marsianin_kofejna',
      maps: {
        yandex:
          'https://yandex.ru/maps/?text=%D0%9A%D0%B0%D0%BB%D0%B8%D0%BD%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%2C%20%D0%9E%D0%BA%D1%82%D1%8F%D0%B1%D1%80%D1%8C%D1%81%D0%BA%D0%B0%D1%8F%2012%2C%20%D0%9C%D0%B0%D1%80%D1%81%D0%B8%D0%B0%D0%BD%D0%B8%D0%BD',
        twoGis: 'https://2gis.ru/kaliningrad/firm/70000001068979963'
      },
      reviews: {
        yandex:
          'https://yandex.ru/maps/?text=%D0%9A%D0%B0%D0%BB%D0%B8%D0%BD%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%2C%20%D0%9E%D0%BA%D1%82%D1%8F%D0%B1%D1%80%D1%8C%D1%81%D0%BA%D0%B0%D1%8F%2012%2C%20%D0%9C%D0%B0%D1%80%D1%81%D0%B8%D0%B0%D0%BD%D0%B8%D0%BD%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D1%8B',
        twoGis: 'https://2gis.ru/kaliningrad/firm/70000001068979963/tab/reviews'
      }
    }
  },
  {
    id: 'k10',
    label: 'К10',
    lat: 54.7299,
    lng: 20.5523,
    address: 'калининград, ул костромская 10',
    workingHours: 'ежедневно с 08:00 до 20:00',
    phone: '+7 (995) 326-31-96',
    phoneTel: '+79953263196',
    links: {
      yandexEda: 'https://eda.yandex.ru/kaliningrad/r/marsianin_kofejna',
      delivery: 'https://eda.yandex.ru/kaliningrad/r/marsianin_kofejna',
      maps: {
        yandex:
          'https://yandex.ru/maps/?text=%D0%9A%D0%B0%D0%BB%D0%B8%D0%BD%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%2C%20%D0%9A%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%BC%D1%81%D0%BA%D0%B0%D1%8F%2010%2C%20%D0%9C%D0%B0%D1%80%D1%81%D0%B8%D0%B0%D0%BD%D0%B8%D0%BD',
        twoGis: 'https://2gis.ru/kaliningrad/firm/70000001092792431'
      },
      reviews: {
        yandex:
          'https://yandex.ru/maps/?text=%D0%9A%D0%B0%D0%BB%D0%B8%D0%BD%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%2C%20%D0%9A%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%BC%D1%81%D0%BA%D0%B0%D1%8F%2010%2C%20%D0%9C%D0%B0%D1%80%D1%81%D0%B8%D0%B0%D0%BD%D0%B8%D0%BD%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D1%8B',
        twoGis: 'https://2gis.ru/kaliningrad/firm/70000001092792431/tab/reviews'
      }
    }
  },
  {
    id: 'p7',
    label: 'П7',
    lat: 54.712506,
    lng: 20.512726,
    address: 'калининград, ул пролетарская 7',
    workingHours: 'ежедневно с 08:00 до 20:00',
    phone: '+7 (995) 303-69-64',
    phoneTel: '+79953036964',
    links: {
      yandexEda: 'https://eda.yandex.ru/kaliningrad/r/marsianin_kofejna',
      delivery: 'https://eda.yandex.ru/kaliningrad/r/marsianin_kofejna',
      maps: {
        yandex: 'https://yandex.ru/maps/org/132873121692',
        twoGis: 'https://2gis.ru/kaliningrad/firm/70000001056623162'
      },
      reviews: {
        yandex: 'https://yandex.ru/maps/org/132873121692/reviews',
        twoGis: 'https://2gis.ru/kaliningrad/firm/70000001056623162/tab/reviews'
      }
    }
  }
] as const;

export type LocationId = (typeof locations)[number]['id'];

export const getLocationLabel = (locationId: LocationId) =>
  locations.find((location) => location.id === locationId)?.label ?? locationId;

export const getLocationAddress = (locationId: LocationId) =>
  locations.find((location) => location.id === locationId)?.address ?? 'адрес уточняется';
