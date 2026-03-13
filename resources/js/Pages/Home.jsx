import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import ProductItem from '@/Components/App/ProductItem';
import SectionHeader from '@/Components/App/SectionHeader';
import SearchBar from '@/Components/App/SearchBar';
import { useTrans, useLocale } from '@/i18n';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Star } from 'lucide-react';

export default function Home({ departments, featuredCategories, featuredProducts, mostSellingProducts, latestViewedProducts, latestPosts, hero, sections }) {
    const t = useTrans();
    const locale = useLocale();

    const heroHeading   = hero?.heading         || t('home.hero.headline');
    const heroHeading2  = hero?.heading2        || t('home.hero.headline2');
    const heroSubtext   = hero?.subtext         || t('home.hero.subtext');
    const heroCtaShop   = hero?.cta_shop_label  || t('home.hero.cta_shop');
    const heroBgImage   = hero?.bg_image_url    || '';

    const showFeatured  = sections?.featured_products !== false;
    const showBest      = sections?.best_sellers      !== false;
    const showRecent    = sections?.recently_viewed   !== false;
    const showBlog      = sections?.blog_posts        !== false;

    return (
        <AuthenticatedLayout>
            <Head title="Welcome" />

            {/* ── Hero ─────────────────────────────────────────── */}
            <section
                className="relative h-[90vh] overflow-hidden"
                style={heroBgImage ? { backgroundImage: `url(${heroBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
                {!heroBgImage && (
                    <div className="absolute inset-0 bg-foreground" />
                )}
                {heroBgImage && <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="max-w-xl animate-fade-in">
                            <h1 className="font-display text-5xl md:text-7xl font-light text-primary-foreground leading-[0.95] mb-6">
                                {heroHeading}<br />
                                <span className="italic">{heroHeading2}</span>
                            </h1>
                            {heroSubtext && (
                                <p className="font-body text-sm text-primary-foreground/80 mb-6 leading-relaxed">{heroSubtext}</p>
                            )}
                            <div className="mb-6">
                                <SearchBar variant="hero" />
                            </div>
                            <Link href={route('shop')} className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-3.5 font-body text-sm uppercase tracking-wider hover:bg-accent/90 transition-colors">
                                {heroCtaShop} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Trust Bar ─────────────────────────────────────── */}
            <section className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                        {[
                            { icon: Truck,        text: t('product.freeShipping') },
                            { icon: RotateCcw,    text: t('product.freeReturns') },
                            { icon: ShieldCheck,  text: t('product.securePayment') },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-center gap-3 py-4 text-sm font-body text-muted-foreground">
                                <item.icon className="w-4 h-4" /> {item.text}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Shop by Category ──────────────────────────────── */}
            {featuredCategories?.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <h2 className="font-display text-3xl md:text-4xl text-center mb-3">{t('home.categories.heading')}</h2>
                    <p className="text-center text-muted-foreground font-body mb-12">{t('home.categories.subtext')}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {featuredCategories.map(cat => (
                            <Link
                                key={cat.id}
                                href={route('shop')}
                                className="group relative flex flex-col items-center gap-3 rounded-sm overflow-hidden bg-card border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-1"
                            >
                                <div className="w-full aspect-square overflow-hidden rounded-sm bg-muted">
                                    {cat.image_url
                                        ? <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        : <div className="w-full h-full flex items-center justify-center font-display text-2xl text-muted-foreground">{cat.name?.[0]}</div>
                                    }
                                </div>
                                <span className="pb-3 text-center font-body text-sm font-medium text-foreground leading-tight px-2 line-clamp-2">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Departments ───────────────────────────────────── */}
            {departments?.length > 0 && (
                <section className="bg-secondary py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SectionHeader
                            heading={t('home.departments.heading')}
                            subtext={t('home.departments.subtext')}
                            viewAllHref={route('shop')}
                            viewAllLabel={t('home.featured.view_all')}
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {departments.map((dept, i) => (
                                <Link
                                    key={dept.id}
                                    href={route('shop')}
                                    className="group relative overflow-hidden rounded-sm aspect-square flex items-end p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-muted"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-foreground/10" />
                                    <div className="relative z-10">
                                        <p className="text-primary-foreground font-display text-xl font-medium">{dept.name}</p>
                                        {dept.categories_count > 0 && (
                                            <p className="text-primary-foreground/70 font-body text-xs mt-1">{dept.categories_count} {t('home.departments.categories')}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Featured Products ─────────────────────────────── */}
            {showFeatured && featuredProducts?.data?.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <SectionHeader
                        heading={t('home.featured.heading')}
                        subtext={t('home.featured.subtext')}
                        viewAllHref={route('shop')}
                        viewAllLabel={t('home.featured.view_all')}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {featuredProducts.data.map(product => <ProductItem product={product} key={product.id} />)}
                    </div>
                </section>
            )}

            {/* ── Best Sellers ──────────────────────────────────── */}
            {showBest && mostSellingProducts?.data?.length > 0 && (
                <section className="bg-secondary py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SectionHeader
                            heading={t('home.best_sellers.heading')}
                            subtext={t('home.best_sellers.subtext')}
                            viewAllHref={route('shop')}
                            viewAllLabel={t('home.featured.view_all')}
                        />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {mostSellingProducts.data.map(product => <ProductItem product={product} key={product.id} />)}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Recently Viewed ───────────────────────────────── */}
            {showRecent && latestViewedProducts?.data?.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <SectionHeader
                        heading={t('home.recently_viewed.heading')}
                        subtext={t('home.recently_viewed.subtext')}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {latestViewedProducts.data.map(product => <ProductItem product={product} key={product.id} />)}
                    </div>
                </section>
            )}

            {/* ── Latest Blog Posts ─────────────────────────────── */}
            {showBlog && latestPosts?.data?.length > 0 && (
                <section className="bg-secondary py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SectionHeader
                            heading={t('home.blog.heading')}
                            subtext={t('home.blog.subtext')}
                            viewAllHref={route('blog.index')}
                            viewAllLabel={t('home.blog.view_all')}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {latestPosts.data.map(post => {
                                const title   = locale === 'ar' && post.title_ar   ? post.title_ar   : post.title;
                                const excerpt = locale === 'ar' && post.excerpt_ar ? post.excerpt_ar : post.excerpt;
                                return (
                                    <Link key={post.id} href={route('blog.show', post.slug)} className="group">
                                        <div className="aspect-[4/3] bg-muted mb-4 overflow-hidden rounded-sm">
                                            {post.cover_thumb
                                                ? <img src={post.cover_thumb} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                : <div className="w-full h-full flex items-center justify-center font-display text-lg text-muted-foreground">{title?.[0]}</div>
                                            }
                                        </div>
                                        {post.published_at && (
                                            <p className="text-xs font-body uppercase tracking-widest text-accent">
                                                {new Date(post.published_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        )}
                                        <h3 className="font-display text-xl mt-2 mb-2 group-hover:text-accent transition-colors line-clamp-2">{title}</h3>
                                        {excerpt && <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">{excerpt}</p>}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Vendor CTA ────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="font-display text-3xl md:text-4xl mb-4">{t('home.cta.heading')}</h2>
                <p className="text-muted-foreground font-body mb-8 max-w-md mx-auto">{t('home.cta.subtext')}</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href={route('register')} className="bg-primary text-primary-foreground px-8 py-3.5 font-body text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors">
                        {t('home.cta.get_started')}
                    </Link>
                    <Link href={route('shop')} className="border border-border px-8 py-3.5 font-body text-sm uppercase tracking-wider hover:border-accent hover:text-accent transition-colors">
                        {t('home.cta.browse')}
                    </Link>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}

