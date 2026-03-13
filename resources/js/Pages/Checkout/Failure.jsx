import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { XCircle } from 'lucide-react';
import { useTrans } from '@/i18n';

export default function Failure({ message }) {
    const t = useTrans();
    return (
        <AuthenticatedLayout>
            <Head title={t('checkout.failure.title')} />

            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 py-16">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <XCircle className="w-10 h-10 text-destructive" />
                </div>
                <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">{t('checkout.failure.heading')}</h1>
                <p className="font-body text-foreground/60 max-w-md mb-8">
                    {message || t('checkout.failure.message')}
                </p>
                <div className="flex gap-4">
                    <Link
                        href={route('cart.index')}
                        className="border border-border px-8 py-3 font-body text-sm uppercase tracking-widest hover:border-accent transition-colors"
                    >
                        {t('checkout.back_to_cart')}
                    </Link>
                    <Link
                        href={route('home')}
                        className="bg-primary text-primary-foreground px-8 py-3 font-body text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
                    >
                        {t('checkout.success.continue')}
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
