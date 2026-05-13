import AdminHeader from '@/components/admin/AdminHeader';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ minHeight: '100vh', background: '#0a0c10' }}>
            <AdminHeader />
            <main>{children}</main>
        </div>
    );
}
