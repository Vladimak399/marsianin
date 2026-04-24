import MenuPage from '@/components/menu/MenuPage';

type LocationMenuPageProps = {
  params: { locationId: string };
  searchParams: { category?: string };
};

export default function LocationMenuPage({ params, searchParams }: LocationMenuPageProps) {
  return <MenuPage initialLocation={params.locationId} initialCategory={searchParams.category} />;
}
