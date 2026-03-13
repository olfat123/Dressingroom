import { useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag, Search, Menu, X, User, Heart, Globe } from 'lucide-react';
import CurrencyFormatter from '@/Components/CurrencyFormatter';
import { productRoute } from '@/Helper';
import { useTrans, useLocale } from '@/i18n';
import SearchBar from './SearchBar';

export default function Navbar() {
    const { auth, totalQuantity, totalPrice, cartItems, availableLocales = ['en', 'ar'], app_logo, wishlistedProductIds = [] } = usePage().props;
    const user = auth.user;
    const t = useTrans();
    const locale = useLocale();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const flatCartItems = useMemo(() => {
        if (!cartItems) return [];
        if (Array.isArray(cartItems)) return cartItems;
        return Object.values(cartItems).flatMap(v => Array.isArray(v.items) ? v.items : []);
    }, [cartItems]);

    const switchLang = (lng) => {
        window.location.href = route('language.switch', lng);
    };

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top bar */}
                <div className="hidden lg:flex items-center justify-between py-1.5 border-b border-border/50 text-xs font-body text-muted-foreground">
                    <span>{t('product.freeShipping')}</span>
                    <div className="flex items-center gap-4">
                        <Link href={route('register')} className="hover:text-foreground transition-colors">{t('nav.becomeVendor')}</Link>
                        {availableLocales.length > 1 && (
                            <div className="flex items-center gap-2">
                                {availableLocales.map(lng => (
                                    <button
                                        key={lng}
                                        onClick={() => switchLang(lng)}
                                        className={`text-xs font-body uppercase tracking-wide transition-colors ${locale === lng ? 'text-accent font-medium' : 'hover:text-foreground'}`}
                                    >
                                        {lng === 'ar' ? 'عر' : lng.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between h-16 lg:h-20">
                    <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href={route('shop')} className="text-sm font-body tracking-wide uppercase hover-gold-underline pb-1">{t('nav.shop')}</Link>
                        <Link href={route('blog.index')} className="text-sm font-body tracking-wide uppercase hover-gold-underline pb-1">{t('nav.blog')}</Link>
                    </nav>

                    <Link href={route('home')} className="font-display text-2xl lg:text-3xl font-semibold tracking-wider">
                        {app_logo
                            ? <img src={`/storage/${app_logo}`} alt={t('nav.brand')} className="h-10 max-w-[160px] object-contain" />
                            : t('nav.brand')
                        }
                    </Link>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setSearchOpen(!searchOpen)} className="hidden lg:block">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Cart */}
                        <div className="relative group">
                            <Link href={route('cart.index')} className="relative block">
                                <ShoppingBag className="w-5 h-5" />
                                {totalQuantity > 0 && (
                                    <span className="absolute -top-2 -end-2 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-body font-medium">
                                        {totalQuantity}
                                    </span>
                                )}
                            </Link>

                            {/* Cart hover dropdown */}
                            {flatCartItems.length > 0 && (
                                <div className="absolute end-0 top-8 w-80 bg-card border border-border shadow-xl rounded-sm z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-body font-medium text-sm">{t('nav.cart.items', { count: totalQuantity })}</span>
                                            <span className="font-body text-sm text-accent"><CurrencyFormatter amount={totalPrice} /></span>
                                        </div>
                                        <div className="max-h-56 overflow-y-auto space-y-2">
                                            {flatCartItems.slice(0, 5).map(item => (
                                                <Link key={item.id} href={productRoute(item)} className="flex gap-3 p-2 hover:bg-muted rounded-sm transition-colors">
                                                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-sm border border-border flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-body truncate">{item.title}</p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-xs text-muted-foreground font-body">×{item.quantity}</span>
                                                            <CurrencyFormatter amount={item.price} />
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <Link href={route('cart.index')} className="block w-full text-center bg-primary text-primary-foreground py-2.5 font-body text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors">
                                            {t('nav.cart.view')}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Wishlist */}
                        {user && (
                            <Link href={route('account.index')} className="hidden lg:block relative">
                                <Heart className="w-5 h-5" />
                                {wishlistedProductIds.length > 0 && (
                                    <span className="absolute -top-2 -end-2 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-body">{wishlistedProductIds.length}</span>
                                )}
                            </Link>
                        )}

                        {/* User */}
                        {user ? (
                            <div className="hidden lg:block relative group">
                                <button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-body font-bold">
                                    {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </button>
                                <div className="absolute end-0 top-10 w-48 bg-card border border-border shadow-xl rounded-sm z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                                    <div className="py-2">
                                        <Link href={route('account.index')} className="block px-4 py-2 text-sm font-body hover:bg-muted transition-colors">{t('nav.my_account')}</Link>
                                        <Link href={route('profile.edit')} className="block px-4 py-2 text-sm font-body hover:bg-muted transition-colors">{t('nav.profile')}</Link>
                                        <div className="border-t border-border my-1" />
                                        <Link href={route('logout')} method="post" as="button" className="block w-full text-start px-4 py-2 text-sm font-body text-destructive hover:bg-muted transition-colors">{t('nav.logout')}</Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center gap-2">
                                <Link href={route('login')} className="text-sm font-body hover:text-accent transition-colors">{t('nav.login')}</Link>
                                <Link href={route('register')} className="text-sm font-body bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-colors">{t('nav.register')}</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search overlay */}
                {searchOpen && (
                    <div className="hidden lg:block pb-4 animate-fade-in">
                        <SearchBar onClose={() => setSearchOpen(false)} />
                    </div>
                )}

                {/* Mobile menu */}
                {mobileOpen && (
                    <nav className="lg:hidden pb-6 flex flex-col gap-4 animate-fade-in border-t border-border pt-4">
                        <Link href={route('shop')} onClick={() => setMobileOpen(false)} className="text-sm font-body tracking-wide uppercase">{t('nav.shop')}</Link>
                        <Link href={route('blog.index')} onClick={() => setMobileOpen(false)} className="text-sm font-body tracking-wide uppercase">{t('nav.blog')}</Link>
                        {user ? (
                            <>
                                <Link href={route('account.index')} onClick={() => setMobileOpen(false)} className="text-sm font-body tracking-wide uppercase">{t('nav.my_account')}</Link>
                                <Link href={route('logout')} method="post" as="button" className="text-sm font-body tracking-wide uppercase text-start text-destructive">{t('nav.logout')}</Link>
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} onClick={() => setMobileOpen(false)} className="text-sm font-body tracking-wide uppercase">{t('nav.login')}</Link>
                                <Link href={route('register')} onClick={() => setMobileOpen(false)} className="text-sm font-body tracking-wide uppercase">{t('nav.register')}</Link>
                            </>
                        )}
                        {availableLocales.length > 1 && (
                            <div className="flex items-center gap-4 pt-2">
                                {availableLocales.map(lng => (
                                    <button
                                        key={lng}
                                        onClick={() => switchLang(lng)}
                                        className={`text-sm font-body uppercase ${locale === lng ? 'text-accent font-medium' : 'text-muted-foreground'}`}
                                    >
                                        {lng === 'ar' ? 'عر' : lng.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="pt-2">
                            <SearchBar onClose={() => setMobileOpen(false)} />
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
