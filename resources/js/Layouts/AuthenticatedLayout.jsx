import { usePage } from '@inertiajs/react';
import Navbar from '@/Components/App/Navbar';
import Footer from '@/Components/App/Footer';
import MobileBottomNav from '@/Components/App/MobileBottomNav';

export default function AuthenticatedLayout({ children }) {
    const { error, success } = usePage().props;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 mx-auto mt-4 max-w-7xl w-full text-sm font-body rounded-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-accent/10 border border-accent/30 text-foreground px-4 py-3 mx-auto mt-4 max-w-7xl w-full text-sm font-body rounded-sm">
                    {success}
                </div>
            )}

            <main className="flex-1">{children}</main>
            <Footer />
            <MobileBottomNav />
        </div>
    );
}


