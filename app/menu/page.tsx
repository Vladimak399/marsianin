import MenuPage from '@/components/menu/MenuPage';

type MenuRoutePageProps = {
  searchParams: { location?: string; category?: string };
};

export default function MenuRoutePage({ searchParams }: MenuRoutePageProps) {
  return <MenuPage initialLocation={searchParams.location} initialCategory={searchParams.category} />;
}
