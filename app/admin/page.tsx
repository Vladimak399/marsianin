import AdminAvailabilityShortcut from '@/components/admin/AdminAvailabilityShortcut';
import AdminPanel from '@/components/admin/AdminPanel';
import SeedImportGuard from '@/components/admin/SeedImportGuard';

export default function AdminPage() {
  return (
    <>
      <SeedImportGuard />
      <AdminPanel />
      <AdminAvailabilityShortcut />
    </>
  );
}
