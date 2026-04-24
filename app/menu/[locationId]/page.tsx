import MenuPage from '@/components/menu/MenuPage';

type MenuByLocationRoutePageProps = {
  params: { locationId: string };
  searchParams: { category?: string; source?: string; guestLat?: string; guestLng?: string };
};

const parseCoordinate = (value?: string) => {
  if (!value) return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

export default function MenuByLocationRoutePage({ params, searchParams }: MenuByLocationRoutePageProps) {
  const guestLat = parseCoordinate(searchParams.guestLat);
  const guestLng = parseCoordinate(searchParams.guestLng);

  return (
    <MenuPage
      initialLocation={params.locationId}
      initialCategory={searchParams.category}
      initialEntrySource={searchParams.source}
      initialGuestCoordinates={guestLat !== null && guestLng !== null ? { lat: guestLat, lng: guestLng } : null}
    />
  );
}
