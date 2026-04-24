import { redirect } from 'next/navigation';
import { locations } from '@/data/locations';

export default function MenuRoutePage() {
  redirect(`/menu/${locations[0].id}`);
}
