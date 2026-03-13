import { Link, usePage } from '@inertiajs/react';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useTrans } from '@/i18n';

const MobileBottomNav = () => {
    const t = useTrans();
    const { totalQuantity = 0, wishlistedProductIds = [], auth } = usePage().props;
    const pathname = window.location.pathname;

    const links = [
        { href: route('home'), icon: Home, label: t('nav.home') || 'Home' },
        { href: route('shop'), icon: Search, label: t('nav.shop') || 'Shop' },
        { href: route('account.index'), icon: Heart, label: t('nav.wishlist') || 'Wishlist', badge: wishlistedProductIds.length, requiresAuth: true },
        { href: route('cart.index'), icon: ShoppingBag, label: t('nav.cart') || 'Bag', badge: totalQuantity },
        { href: auth?.user ? route('account.index') : route('login'), icon: User, label: t('nav.account') || 'Account' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-md border-t border-border safe-area-bottom">
            <div className="flex items-center justify-around h-16">
                {links.map(link => {
                    const Icon = link.icon;
                    const active = pathname === new URL(link.href, window.location.origin).pathname;
                    return (
                        <Link key={link.href + link.label} href={link.href} className="flex flex-col items-center gap-0.5 relative px-3 py-1">
                            <div className="relative">
                                <Icon className={`w-5 h-5 transition-colors ${active ? 'text-accent' : 'text-muted-foreground'}`} />
                                {link.badge > 0 && (
                                    <span className="absolute -top-1.5 -end-2 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-body">
                                        {link.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-body ${active ? 'text-accent' : 'text-muted-foreground'}`}>{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
