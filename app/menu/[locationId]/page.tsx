import MenuPage from '@/components/menu/MenuPage';

type MenuByLocationRoutePageProps = {
  params: Promise<{ locationId: string }>;
  searchParams: Promise<{ category?: string; source?: string; guestLat?: string; guestLng?: string }>;
};

const parseCoordinate = (value?: string) => {
  if (!value) return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

export default async function MenuByLocationRoutePage({ params, searchParams }: MenuByLocationRoutePageProps) {
  const { locationId } = await params;
  const query = await searchParams;
  const guestLat = parseCoordinate(query.guestLat);
  const guestLng = parseCoordinate(query.guestLng);

  return (
    <MenuPage
      initialLocation={locationId}
      initialCategory={query.category}
      initialEntrySource={query.source}
      initialGuestCoordinates={guestLat !== null && guestLng !== null ? { lat: guestLat, lng: guestLng } : null}
    />
  );
}
