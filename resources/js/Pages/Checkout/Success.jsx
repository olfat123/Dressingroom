import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useTrans } from '@/i18n';

export default function Success({ message }) {
    const t = useTrans();
    return (
        <AuthenticatedLayout>
            <Head title={t('checkout.success.title')} />

            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 py-16">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">{t('checkout.success.heading')}</h1>
                <p className="font-body text-foreground/60 max-w-md mb-8">
                    {message || t('checkout.success.message')}
                </p>
                <Link
                    href={route('home')}
                    className="bg-primary text-primary-foreground px-10 py-3 font-body text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
                >
                    {t('checkout.success.continue')}
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
