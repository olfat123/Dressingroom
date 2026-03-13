import { Link } from '@inertiajs/react';
import { useTrans } from '@/i18n';

export default function Footer() {
    const year = new Date().getFullYear();
    const t = useTrans();

    return (
        <footer className="bg-primary text-primary-foreground mt-20 pb-20 lg:pb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
                    <div className="col-span-2 md:col-span-1">
                        <Link href={route('home')} className="font-display text-2xl font-semibold tracking-wider block mb-4">
                            {t('footer.brand')}
                        </Link>
                        <p className="text-sm opacity-70 font-body leading-relaxed">{t('footer.tagline')}</p>
                    </div>
                    <div>
                        <h4 className="font-body text-sm uppercase tracking-wider mb-4 font-medium">{t('footer.shop')}</h4>
                        <div className="flex flex-col gap-2">
                            <Link href={route('shop')} className="text-sm opacity-70 hover:opacity-100 transition-opacity font-body">{t('footer.shop')}</Link>
                            <Link href={route('blog.index')} className="text-sm opacity-70 hover:opacity-100 transition-opacity font-body">{t('nav.blog')}</Link>
                            <Link href={route('cart.index')} className="text-sm opacity-70 hover:opacity-100 transition-opacity font-body">{t('footer.cart')}</Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-body text-sm uppercase tracking-wider mb-4 font-medium">{t('footer.account')}</h4>
                        <div className="flex flex-col gap-2">
                            <Link href={route('login')} className="text-sm opacity-70 hover:opacity-100 transition-opacity font-body">{t('nav.login')}</Link>
                            <Link href={route('register')} className="text-sm opacity-70 hover:opacity-100 transition-opacity font-body">{t('nav.register')}</Link>
                            <Link href={route('profile.edit')} className="text-sm opacity-70 hover:opacity-100 transition-opacity font-body">{t('footer.my_profile')}</Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-body text-sm uppercase tracking-wider mb-4 font-medium">{t('footer.customerCare') || 'Customer Care'}</h4>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm opacity-70 font-body">support@dressingroom.com</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-body text-sm uppercase tracking-wider mb-4 font-medium">{t('footer.vendorProgram') || 'Vendors'}</h4>
                        <div className="flex flex-col gap-2">
                            <Link href={route('register')} className="text-sm opacity-70 hover:opacity-100 transition-opacity font-body">{t('nav.becomeVendor')}</Link>
                        </div>
                    </div>
                </div>
                <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
                    <p className="text-xs opacity-50 font-body">{t('footer.copyright', { year }) || `© ${year} Dressingroom. All rights reserved.`}</p>
                </div>
            </div>
        </footer>
    );
}
