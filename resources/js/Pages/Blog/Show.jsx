import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTrans, useLocale } from '@/i18n';
import { ArrowLeft } from 'lucide-react';

function RelatedCard({ post }) {
    const locale = useLocale();
    const title  = locale === 'ar' && post.title_ar ? post.title_ar : post.title;

    return (
        <Link
            href={route('blog.show', post.slug)}
            className="group flex gap-3 py-3 border-b border-border last:border-0 hover:opacity-80 transition-opacity"
        >
            {post.cover_thumb ? (
                <img src={post.cover_thumb} alt={title} className="w-16 h-14 object-cover flex-shrink-0" />
            ) : (
                <div className="w-16 h-14 bg-muted flex-shrink-0" />
            )}
            <div>
                <p className="font-body font-medium text-sm line-clamp-2 group-hover:text-accent transition-colors">{title}</p>
                {post.published_at && (
                    <p className="font-body text-xs text-foreground/40 mt-1">
                        {new Date(post.published_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                        })}
                    </p>
                )}
            </div>
        </Link>
    );
}

export default function BlogShow({ post, relatedPosts }) {
    const t      = useTrans();
    const locale = useLocale();

    const title   = locale === 'ar' && post.title_ar   ? post.title_ar   : post.title;
    const content = locale === 'ar' && post.content_ar ? post.content_ar : post.content;
    const excerpt = locale === 'ar' && post.excerpt_ar ? post.excerpt_ar : post.excerpt;
    const catName = post.category
        ? (locale === 'ar' && post.category.name_ar ? post.category.name_ar : post.category.name)
        : null;

    const related = Array.isArray(relatedPosts) ? relatedPosts : (relatedPosts?.data ?? []);

    return (
        <AuthenticatedLayout>
            <Head title={title} />

            {/* Article header */}
            <section className="relative bg-primary py-20">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    {/* Back link */}
                    <Link
                        href={route('blog.index')}
                        className="inline-flex items-center gap-2 font-body text-sm text-primary-foreground/50 hover:text-primary-foreground mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('blog.back')}
                    </Link>

                    {/* Category + date */}
                    <div className="flex items-center justify-center gap-4 flex-wrap mb-5">
                        {catName && (
                            <Link
                                href={route('blog.index', { category: post.category.slug })}
                                className="font-body text-xs uppercase tracking-widest text-gold hover:underline"
                            >
                                {catName}
                            </Link>
                        )}
                        {post.published_at && (
                            <p className="font-body text-sm text-primary-foreground/50 uppercase tracking-wider">
                                {new Date(post.published_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                })}
                            </p>
                        )}
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-primary-foreground leading-tight">
                        {title}
                    </h1>

                    {excerpt && (
                        <p className="font-body mt-6 text-primary-foreground/60 text-base max-w-2xl mx-auto leading-relaxed">
                            {excerpt}
                        </p>
                    )}

                    {post.author && (
                        <p className="font-body mt-5 text-primary-foreground/40 text-sm">
                            {t('blog.by', { author: post.author })}
                        </p>
                    )}
                </div>
            </section>

            {/* Cover image */}
            {post.cover_url && (
                <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-10">
                    <img
                        src={post.cover_url}
                        alt={title}
                        className="w-full max-h-[500px] object-cover shadow-xl"
                    />
                </div>
            )}

            {/* Content + sidebar */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Main content */}
                        <article className="flex-1 min-w-0">
                            <div
                                className="prose prose-lg max-w-none wysiwyg-output"
                                dir={locale === 'ar' ? 'rtl' : 'ltr'}
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </article>

                        {/* Sidebar */}
                        {related.length > 0 && (
                            <aside className="lg:w-72 flex-shrink-0">
                                <div className="sticky top-8 border border-border bg-background p-5">
                                    <h3 className="font-display text-xl text-foreground mb-4">
                                        {t('blog.related_posts')}
                                    </h3>
                                    <div>
                                        {related.map(rp => (
                                            <RelatedCard key={rp.id} post={rp} />
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        )}
                    </div>

                    {/* Back button */}
                    <div className="mt-16 pt-8 border-t border-border">
                        <Link
                            href={route('blog.index')}
                            className="inline-flex items-center gap-2 font-body text-sm uppercase tracking-widest hover-gold-underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('blog.back')}
                        </Link>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
