import AdminAvailabilityShortcut from '@/components/admin/AdminAvailabilityShortcut';
import AdminGuide from '@/components/admin/AdminGuide';
import AdminPanel from '@/components/admin/AdminPanel';
import SeedImportGuard from '@/components/admin/SeedImportGuard';

export default function AdminPage() {
  return (
    <>
      <SeedImportGuard />
      <AdminGuide />
      <AdminPanel />
      <AdminAvailabilityShortcut />
    </>
  );
}
