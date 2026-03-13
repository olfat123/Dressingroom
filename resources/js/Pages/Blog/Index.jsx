import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTrans, useLocale } from '@/i18n';
import Pagination from '@/Components/App/Pagination';
import { ArrowRight, FileText } from 'lucide-react';

function PostCard({ post }) {
    const t = useTrans();
    const locale = useLocale();

    const title   = locale === 'ar' && post.title_ar   ? post.title_ar   : post.title;
    const excerpt = locale === 'ar' && post.excerpt_ar ? post.excerpt_ar : post.excerpt;
    const catName = post.category
        ? (locale === 'ar' && post.category.name_ar ? post.category.name_ar : post.category.name)
        : null;

    return (
        <article className="group border border-border bg-background flex flex-col overflow-hidden hover:border-accent/50 transition-colors">
            <div className="relative overflow-hidden aspect-[16/9]">
                {post.cover_thumb ? (
                    <img
                        src={post.cover_thumb}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <FileText className="w-10 h-10 text-foreground/20" />
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 gap-3 p-5">
                <div className="flex items-center gap-3 flex-wrap">
                    {catName && (
                        <button
                            onClick={() => router.get(route('blog.index'), { category: post.category.slug })}
                            className="font-body text-xs uppercase tracking-widest text-accent hover:underline cursor-pointer"
                        >
                            {catName}
                        </button>
                    )}
                    {post.published_at && (
                        <p className="font-body text-xs text-foreground/40 uppercase tracking-wider">
                            {new Date(post.published_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                                year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        </p>
                    )}
                </div>

                <h2 className="font-display text-xl leading-snug line-clamp-2 group-hover:text-accent transition-colors">{title}</h2>

                {excerpt && (
                    <p className="font-body text-foreground/60 text-sm leading-relaxed line-clamp-3">{excerpt}</p>
                )}

                {post.author && (
                    <p className="font-body text-xs text-foreground/40 mt-auto">{t('blog.by', { author: post.author })}</p>
                )}

                <Link
                    href={route('blog.show', post.slug)}
                    className="inline-flex items-center gap-2 font-body text-sm uppercase tracking-widest mt-2 hover-gold-underline w-fit"
                >
                    {t('blog.read_more')} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </article>
    );
}

export default function BlogIndex({ posts, categories, activeCategory, banner }) {
    const t      = useTrans();
    const locale = useLocale();

    const items = posts?.data ?? [];
    const meta  = posts?.meta ?? {};

    const bannerTitle    = banner?.title    || t('blog.heading');
    const bannerSubtitle = banner?.subtitle || t('blog.subtitle');
    const bannerImage    = banner?.image_url || '';

    function filterCategory(slug) {
        router.get(route('blog.index'), slug ? { category: slug } : {}, { preserveScroll: false });
    }

    return (
        <AuthenticatedLayout>
            <Head title={t('blog.page_title')} />

            {/* Hero banner */}
            <section
                className="relative overflow-hidden bg-primary py-24 text-center"
                style={bannerImage ? { backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
                {bannerImage && <div className="absolute inset-0 bg-primary/70" />}
                <div className="relative container mx-auto px-4 max-w-3xl">
                    <span className="font-body text-xs uppercase tracking-widest text-primary-foreground/60 mb-4 block">
                        {t('blog.badge') || 'Journal'}
                    </span>
                    <h1 className="font-display text-5xl md:text-7xl text-primary-foreground">{bannerTitle}</h1>
                    {bannerSubtitle && (
                        <p className="font-body mt-4 text-primary-foreground/60 text-base max-w-xl mx-auto">{bannerSubtitle}</p>
                    )}
                </div>
            </section>

            {/* Category filter tabs */}
            {categories?.length > 0 && (
                <div className="bg-background border-b border-border sticky top-0 z-10">
                    <div className="container mx-auto px-4">
                        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
                            <button
                                onClick={() => filterCategory(null)}
                                className={`px-4 py-1.5 font-body text-xs uppercase tracking-widest flex-shrink-0 border transition-colors rounded-sm ${!activeCategory ? 'border-accent bg-accent/10 text-foreground' : 'border-transparent text-foreground/50 hover:text-foreground'}`}
                            >
                                {t('blog.all_categories')}
                            </button>
                            {categories.map(cat => {
                                const label = locale === 'ar' && cat.name_ar ? cat.name_ar : cat.name;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => filterCategory(cat.slug)}
                                        className={`px-4 py-1.5 font-body text-xs uppercase tracking-widest flex-shrink-0 border transition-colors rounded-sm ${activeCategory === cat.slug ? 'border-accent bg-accent/10 text-foreground' : 'border-transparent text-foreground/50 hover:text-foreground'}`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Posts grid */}
            <section className="py-16 bg-cream">
                <div className="container mx-auto px-4">
                    {items.length === 0 ? (
                        <div className="text-center py-24">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-foreground/20" />
                            <p className="font-display text-xl text-foreground/40">{t('blog.no_posts')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map(post => <PostCard key={post.id} post={post} />)}
                        </div>
                    )}

                    <Pagination meta={meta} className="mt-12" />
                </div>
            </section>
        </AuthenticatedLayout>
    );
}

