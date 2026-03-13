import { useMemo, useState, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag, Search, Menu, X, Heart, ChevronDown } from 'lucide-react';
import CurrencyFormatter from '@/Components/CurrencyFormatter';
import { productRoute } from '@/Helper';
import { useTrans, useLocale } from '@/i18n';
import SearchBar from './SearchBar';

export default function Navbar() {
    const { auth, totalQuantity, totalPrice, cartItems, availableLocales = ['en', 'ar'], app_logo, wishlistedProductIds = [], navDepartments = [] } = usePage().props;
    const user = auth.user;
    const t = useTrans();
    const locale = useLocale();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [activeDept, setActiveDept] = useState(null); // id of hovered dept
    const megaCloseTimer = useRef(null);

    const openMega = (id) => {
        clearTimeout(megaCloseTimer.current);
        setActiveDept(id);
    };
    const closeMega = () => {
        megaCloseTimer.current = setTimeout(() => setActiveDept(null), 120);
    };
    const [mobileShopOpen, setMobileShopOpen] = useState(false);
    const [mobileExpandedDept, setMobileExpandedDept] = useState(null);

    const flatCartItems = useMemo(() => {
        if (!cartItems) return [];
        if (Array.isArray(cartItems)) return cartItems;
        return Object.values(cartItems).flatMap(v => Array.isArray(v.items) ? v.items : []);
    }, [cartItems]);

    const switchLang = (lng) => {
        window.location.href = route('language.switch', lng);
    };

    const closeMobile = () => {
        setMobileOpen(false);
        setMobileShopOpen(false);
        setMobileExpandedDept(null);
    };

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border relative">
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

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {/* <Link
                            href={route('shop')}
                            onMouseEnter={closeMega}
                            className="text-sm font-body tracking-wide uppercase hover-gold-underline pb-1"
                        >
                            {t('nav.viewAll')}
                        </Link> */}
                        {navDepartments.map(dept => (
                            <div
                                key={dept.id}
                                onMouseEnter={() => openMega(dept.id)}
                                onMouseLeave={closeMega}
                            >
                                <button className={`flex items-center gap-1 text-sm font-body tracking-wide uppercase hover-gold-underline pb-1 ${activeDept === dept.id ? 'text-accent' : ''}`}>
                                    {dept.name}
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDept === dept.id ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        ))}
                        <Link href={route('blog.index')} onMouseEnter={closeMega} className="text-sm font-body tracking-wide uppercase hover-gold-underline pb-1">{t('nav.blog')}</Link>
                    </nav>

                    <Link href={route('home')} className="font-display text-2xl lg:text-3xl font-semibold tracking-wider absolute left-1/2 -translate-x-1/2">
                        {app_logo
                            ? <img src={`/storage/${app_logo}`} alt={t('nav.brand')} className="h-14 max-w-[160px] object-contain" />
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
                    <nav className="lg:hidden pb-6 flex flex-col gap-1 animate-fade-in border-t border-border pt-4">
                        {/* Shop accordion */}
                        <div>
                            <button
                                onClick={() => setMobileShopOpen(!mobileShopOpen)}
                                className="flex items-center justify-between w-full py-2 text-sm font-body tracking-wide uppercase"
                            >
                                {t('nav.shop')}
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileShopOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {mobileShopOpen && (
                                <div className="ps-3 pb-2 flex flex-col gap-1">
                                    <Link
                                        href={route('shop')}
                                        onClick={closeMobile}
                                        className="py-1.5 text-sm font-body text-accent"
                                    >
                                        {t('nav.viewAll')}
                                    </Link>
                                    {navDepartments.map(dept => (
                                        <div key={dept.id}>
                                            <button
                                                onClick={() => setMobileExpandedDept(mobileExpandedDept === dept.id ? null : dept.id)}
                                                className="flex items-center justify-between w-full py-1.5 text-sm font-body font-medium"
                                            >
                                                {dept.name}
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileExpandedDept === dept.id ? 'rotate-180' : ''}`} />
                                            </button>
                                            {mobileExpandedDept === dept.id && (
                                                <div className="ps-3 flex flex-col gap-1 pb-1">
                                                    {dept.categories.map(cat => (
                                                        <Link
                                                            key={cat.id}
                                                            href={route('shop', { department_id: dept.id, category_id: cat.id })}
                                                            onClick={closeMobile}
                                                            className="py-1 text-sm font-body text-muted-foreground hover:text-accent transition-colors"
                                                        >
                                                            {cat.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href={route('blog.index')} onClick={closeMobile} className="py-2 text-sm font-body tracking-wide uppercase">{t('nav.blog')}</Link>
                        {user ? (
                            <>
                                <Link href={route('account.index')} onClick={closeMobile} className="py-2 text-sm font-body tracking-wide uppercase">{t('nav.my_account')}</Link>
                                <Link href={route('logout')} method="post" as="button" className="py-2 text-sm font-body tracking-wide uppercase text-start text-destructive">{t('nav.logout')}</Link>
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} onClick={closeMobile} className="py-2 text-sm font-body tracking-wide uppercase">{t('nav.login')}</Link>
                                <Link href={route('register')} onClick={closeMobile} className="py-2 text-sm font-body tracking-wide uppercase">{t('nav.register')}</Link>
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
                            <SearchBar onClose={closeMobile} />
                        </div>
                    </nav>
                )}
            </div>

            {/* Mega menu panel — spans full header width */}
            {activeDept && (() => {
                const dept = navDepartments.find(d => d.id === activeDept);
                if (!dept) return null;
                return (
                    <div
                        className="hidden lg:block absolute left-0 right-0 top-full z-40"
                        onMouseEnter={() => openMega(dept.id)}
                        onMouseLeave={closeMega}
                    >
                        <div className="bg-card border-b border-border shadow-2xl animate-fade-in">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex">
                                    {/* Left: categories */}
                                    <div className="flex-1 py-8 pe-8">
                                        <div className="flex items-center justify-between mb-5">
                                            <Link
                                                href={route('shop', { department_id: dept.id })}
                                                onClick={() => setActiveDept(null)}
                                                className="font-display text-2xl font-medium hover:text-accent transition-colors"
                                            >
                                                {dept.name}
                                            </Link>
                                            <Link
                                                href={route('shop', { department_id: dept.id })}
                                                onClick={() => setActiveDept(null)}
                                                className="text-xs font-body text-accent uppercase tracking-wider hover:underline"
                                            >
                                                {t('nav.viewAll')} →
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                                            {dept.categories.map(cat => (
                                                <Link
                                                    key={cat.id}
                                                    href={route('shop', { department_id: dept.id, category_id: cat.id })}
                                                    onClick={() => setActiveDept(null)}
                                                    className="font-body text-sm text-muted-foreground hover:text-accent transition-colors py-1 border-b border-transparent hover:border-accent"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: department image */}
                                    <div className="hidden md:block w-56 xl:w-72 flex-shrink-0 border-s border-border overflow-hidden">
                                        {dept.image_url
                                            ? <img src={dept.image_url} alt={dept.name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full bg-secondary flex items-center justify-center font-display text-4xl text-muted-foreground">{dept.name?.[0]}</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </header>
    );
}
