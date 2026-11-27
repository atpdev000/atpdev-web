import type { Metadata } from 'next';
import AdminPagosClient from '@/components/AdminPagosClient';

export const metadata: Metadata = {
  title: 'Admin Pagos — Colorear Pro',
  robots: { index: false, follow: false },
};

export default function AdminPagosPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <AdminPagosClient />
    </div>
  );
}
