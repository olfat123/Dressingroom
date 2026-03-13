import { useState, useMemo, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import isEqual from 'lodash/isEqual';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CurrencyFormatter from '@/Components/CurrencyFormatter';
import Carousel from '@/Components/Carousel';
import ProductItem from '@/Components/App/ProductItem';
import StarRating from '@/Components/App/StarRating';
import { Head, Link } from '@inertiajs/react';
import { useTrans, useLocale } from '@/i18n';
import { Minus, Plus, ShoppingBag, Star, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

export default function Show({ product, variationOptions, relatedProducts, reviews = [], canReview = false, userReview = null }) {
    const form = useForm({
        product_id: product.id,
        option_ids: Object.values(variationOptions || {}),
        quantity: 1,
        price: product.price ?? null
    });

    const reviewForm = useForm({ rating: 0, body: '' });

    const submitReview = (e) => {
        e.preventDefault();
        reviewForm.post(route('product.reviews.store', { product: product.slug }), {
            preserveScroll: true,
            onSuccess: () => reviewForm.reset(),
        });
    };

    const deleteReview = (reviewId) => {
        router.delete(route('product.reviews.destroy', { product: product.slug, review: reviewId }), {
            preserveScroll: true,
        });
    };
    const t = useTrans();
    const locale = useLocale();
    const productTitle = (locale === 'ar' && product.title_ar) ? product.title_ar : product.title;
    const productDesc = (locale === 'ar' && product.description_ar) ? product.description_ar : product.description;

    const {url} = usePage();

    const [selectedOptions, setSelectedOptions] = useState([]);
    const images = useMemo(() => {
        for (let typeId in selectedOptions) {
            const option = selectedOptions[typeId];
            if (option && option.images.length > 0) return option.images;
        }
        return product.images;
    }, [product,selectedOptions]);

    const arrayAreEquals = (arr1, arr2) => isEqual([...arr1].sort(), [...arr2].sort());
    const computedProduct = useMemo(() => {
        const selectedOptionIds = Object.values
            (selectedOptions)
            .map((op) => op.id)
            .sort();

        for (let variation of product.variations) {
            const optionIds = variation
            .variation_type_option_ids.sort();

            if(arrayAreEquals(selectedOptionIds, optionIds)) {
                return {
                    price: variation.price,
                    sale_price: variation.sale_price,
                    is_on_sale: variation.is_on_sale,
                    quantity: variation.quantity === null ? 1 : variation.quantity,
                }
            }
        }
        return {
            price: product.price,
            sale_price: product.sale_price,
            is_on_sale: product.is_on_sale,
            quantity: product.quantity === null ? 1 : product.quantity,
        };
    }, [product, selectedOptions]);

    useEffect(() => {
        if (!variationOptions) return;

        for (let type of product.variationTypes) {
            const selectedOptionId = variationOptions[type.id];
            const selectedId = selectedOptionId ? Number(selectedOptionId) : null;

            chooseOption(
                type.id,
                type.options.find((op) => op.id === selectedId) || type.options[0],
                false
            );
        }
    }, [variationOptions, product.variationTypes]);

    const getOptionIdsMap = (newOptions) => {
        return Object.fromEntries(
            Object.entries(newOptions)
                .map(([a, b]) => [a, b.id])
        )
    }

    const chooseOption = (typeId, option, updateRouter = true) => {
        setSelectedOptions((prevSelectedOptions) => {
            const newOptions = { 
                ...prevSelectedOptions,
                [typeId]: option 
            }
            
            if (updateRouter) {
                router.get(url, {
                    options: getOptionIdsMap(newOptions)
                }, { 
                    preserveState: true, 
                    preserveScroll: true 
                } );
            }

            return newOptions;
        });
    }

    const onQuantityChange = (e) => {
        form.setData('quantity', parseInt(e.target.value));
    }

    const addToCart = () => {
        form.post(route('cart.store', product.id), {
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                console.log(errors);
            },
            onSuccess: (response) => {
                console.log(response);  
            }
        });
    }

    const renderProductVariationTypes = () => {
        return (
            product.variationTypes.map((type) => (
                <div key={type.id} className="mb-5">
                    <p className="font-body text-sm font-medium text-foreground/70 uppercase tracking-wider mb-2">
                        {(locale === 'ar' && type.name_ar) ? type.name_ar : type.name}
                    </p>
                    {type.type === 'image' &&
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {type.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => chooseOption(type.id, option)}
                                    className={
                                        'border-2 p-0.5 rounded-sm transition-colors ' +
                                        (selectedOptions[type.id]?.id === option.id
                                            ? 'border-accent'
                                            : 'border-border hover:border-accent/50')
                                    }
                                >
                                    {option.images?.length > 0 && (
                                        <img
                                            src={option.images[0].thumb}
                                            alt={(locale === 'ar' && option.name_ar) ? option.name_ar : option.name}
                                            className="w-12 h-12 object-cover"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    }
                    {type.type === 'radio' &&
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {type.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => chooseOption(type.id, option)}
                                    className={
                                        'px-4 py-2 text-sm font-body border rounded-sm transition-colors ' +
                                        (selectedOptions[type.id]?.id === option.id
                                            ? 'border-accent bg-accent/10 text-foreground'
                                            : 'border-border hover:border-accent bg-background')
                                    }
                                >
                                    {(locale === 'ar' && option.name_ar) ? option.name_ar : option.name}
                                </button>
                            ))}
                        </div>
                    }
                </div>
            ))
        );
    }

    const renderAddToCartButton = () => {
        return (
            <div className="mb-8 flex items-center gap-3">
                <div className="flex items-center border border-border rounded-sm">
                    <button
                        onClick={() => form.setData('quantity', Math.max(1, form.data.quantity - 1))}
                        className="px-3 py-2 hover:bg-muted transition-colors"
                        disabled={form.data.quantity <= 1}
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-body text-sm min-w-[3rem] text-center">
                        {form.data.quantity}
                    </span>
                    <button
                        onClick={() => form.setData('quantity', Math.min(computedProduct.quantity, form.data.quantity + 1))}
                        className="px-3 py-2 hover:bg-muted transition-colors"
                        disabled={computedProduct.quantity < 1}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <button
                    onClick={addToCart}
                    disabled={computedProduct.quantity < 1 || form.processing}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-body text-sm uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ShoppingBag className="w-4 h-4" />
                    {computedProduct.quantity < 1 ? t('product.out_of_stock') : t('product.add_to_cart')}
                </button>
            </div>
        );
    }

    useEffect(() => {
        const idsMap = Object.fromEntries(
            Object.entries(selectedOptions)
                .map(([typeId, option]) => [typeId, option.id])
        );
        form.setData('option_ids', idsMap);
    }, [selectedOptions]);

    return (
        <AuthenticatedLayout>
            <Head title={productTitle} />

            {/* ── Product Detail ─────────────────────────────────── */}
            <div className="container mx-auto px-4 py-10 lg:py-16">
                <div className="grid gap-10 grid-cols-1 lg:grid-cols-12">
                    {/* Images */}
                    <div className="lg:col-span-7">
                        <Carousel images={images} />
                    </div>

                    {/* Info */}
                    <div className="lg:col-span-5">
                        {/* Store name */}
                        {product.store && (
                            <Link href={route('store.show', product.store.slug)} className="font-body text-xs text-foreground/50 uppercase tracking-widest hover-gold-underline mb-2 inline-block">
                                {product.store.name}
                            </Link>
                        )}

                        <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4 leading-snug">{productTitle}</h1>

                        {/* Ratings summary */}
                        {reviews.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} className={`w-4 h-4 ${i <= Math.round(reviews.reduce((s,r) => s + r.rating, 0) / reviews.length) ? 'fill-gold text-gold' : 'text-border'}`} />
                                    ))}
                                </div>
                                <span className="font-body text-sm text-foreground/50">
                                    {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)} ({reviews.length})
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="mb-6">
                            {computedProduct.is_on_sale ? (
                                <div className="flex items-center gap-3">
                                    <span className="font-display text-3xl text-destructive">
                                        <CurrencyFormatter amount={computedProduct.sale_price} />
                                    </span>
                                    <span className="font-display text-xl line-through text-foreground/40">
                                        <CurrencyFormatter amount={computedProduct.price} />
                                    </span>
                                    <span className="text-xs font-body uppercase tracking-widest bg-destructive/10 text-destructive px-2 py-1 rounded-sm">
                                        {t('product_item.sale_badge')}
                                    </span>
                                </div>
                            ) : (
                                <span className="font-display text-3xl text-foreground">
                                    <CurrencyFormatter amount={computedProduct.price} />
                                </span>
                            )}
                        </div>

                        <div className="border-t border-border my-5" />

                        {/* Variation types */}
                        {renderProductVariationTypes()}

                        {/* Low stock warning */}
                        {computedProduct.quantity != undefined && computedProduct.quantity > 0 && computedProduct.quantity < 10 && (
                            <p className="text-sm font-body text-destructive mb-4">
                                {t('product.only_left', { count: computedProduct.quantity })}
                            </p>
                        )}

                        {/* Add to cart */}
                        {renderAddToCartButton()}

                        {/* Trust badges */}
                        <div className="border-t border-border pt-5 grid grid-cols-3 gap-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                                <Truck className="w-5 h-5 text-foreground/50" />
                                <span className="font-body text-xs text-foreground/50">{t('trust.free_shipping') || 'Free Shipping'}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <RotateCcw className="w-5 h-5 text-foreground/50" />
                                <span className="font-body text-xs text-foreground/50">{t('trust.easy_returns') || 'Easy Returns'}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <ShieldCheck className="w-5 h-5 text-foreground/50" />
                                <span className="font-body text-xs text-foreground/50">{t('trust.secure_pay') || 'Secure Payment'}</span>
                            </div>
                        </div>

                        <div className="border-t border-border my-5" />

                        {/* Description */}
                        <h2 className="font-display text-xl mb-3">{t('product.about')}</h2>
                        <div className="wysiwyg-output font-body text-sm text-foreground/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: productDesc }}></div>
                    </div>
                </div>
            </div>

            {/* ── Reviews ────────────────────────────────────────── */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header + average */}
                    <div className="flex items-center gap-6 mb-10">
                        <div>
                            <h2 className="font-display text-3xl text-foreground">{t('reviews.heading')}</h2>
                            {reviews.length > 0 && (
                                <p className="font-body text-sm text-foreground/50 mt-1">
                                    {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)} / 5
                                    &nbsp;({reviews.length} {t('reviews.count_label')})
                                </p>
                            )}
                        </div>
                    </div>

                    {/* User's existing review */}
                    {userReview && (
                        <div className="border border-accent/30 bg-accent/5 rounded-sm p-5 mb-8 flex justify-between items-start gap-4">
                            <div>
                                <p className="font-body font-semibold text-sm mb-1">{t('reviews.your_review')}</p>
                                <StarRating value={userReview.rating} readonly />
                                {userReview.body && <p className="font-body text-sm mt-2 text-foreground/70">{userReview.body}</p>}
                                {!userReview.is_approved && (
                                    <p className="font-body text-xs mt-2 text-foreground/40">{t('reviews.pending_approval')}</p>
                                )}
                            </div>
                            <button
                                onClick={() => deleteReview(userReview.id)}
                                className="font-body text-sm text-destructive hover:underline shrink-0"
                            >
                                {t('reviews.delete')}
                            </button>
                        </div>
                    )}

                    {/* Review submission form */}
                    {canReview && (
                        <div className="border border-border bg-background rounded-sm p-6 mb-10">
                            <h3 className="font-display text-xl mb-5">{t('reviews.write_review')}</h3>
                            <form onSubmit={submitReview} className="space-y-5">
                                <div>
                                    <label className="font-body text-sm font-medium text-foreground/70 block mb-2">{t('reviews.your_rating')}</label>
                                    <StarRating
                                        value={reviewForm.data.rating}
                                        onChange={(v) => reviewForm.setData('rating', v)}
                                    />
                                    {reviewForm.errors.rating && (
                                        <p className="font-body text-destructive text-sm mt-1">{reviewForm.errors.rating}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="font-body text-sm font-medium text-foreground/70 block mb-2">{t('reviews.comment_label')}</label>
                                    <textarea
                                        className="w-full border border-border px-3 py-2 font-body text-sm bg-background focus:outline-none focus:border-accent rounded-sm resize-none"
                                        rows={4}
                                        placeholder={t('reviews.comment_placeholder')}
                                        value={reviewForm.data.body}
                                        onChange={(e) => reviewForm.setData('body', e.target.value)}
                                    />
                                    {reviewForm.errors.body && (
                                        <p className="font-body text-destructive text-sm mt-1">{reviewForm.errors.body}</p>
                                    )}
                                </div>
                                {reviewForm.errors.review && (
                                    <p className="font-body text-destructive text-sm">{reviewForm.errors.review}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={reviewForm.data.rating === 0 || reviewForm.processing}
                                    className="bg-primary text-primary-foreground px-8 py-2.5 font-body text-sm uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {reviewForm.processing ? t('reviews.submitting') : t('reviews.submit_btn')}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Approved reviews list */}
                    {reviews.length === 0 ? (
                        <p className="font-body text-foreground/40 text-center py-16">{t('reviews.no_reviews')}</p>
                    ) : (
                        <div className="space-y-5">
                            {reviews.map((review) => (
                                <div key={review.id} className="border border-border bg-background rounded-sm p-5">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <p className="font-body font-semibold text-sm text-foreground">{review.user.name}</p>
                                            <p className="font-body text-xs text-foreground/40 mt-0.5">
                                                {new Date(review.created_at).toLocaleDateString(
                                                    locale === 'ar' ? 'ar-EG' : 'en-US',
                                                    { year: 'numeric', month: 'short', day: 'numeric' }
                                                )}
                                            </p>
                                        </div>
                                        <StarRating value={review.rating} readonly />
                                    </div>
                                    {review.body && (
                                        <p className="font-body text-sm text-foreground/70 leading-relaxed">{review.body}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Related Products ───────────────────────────────── */}
            {relatedProducts?.data?.length > 0 && (
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4">
                        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8 text-center">
                            {t('product.related_products')}
                        </h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {relatedProducts.data.map(p => (
                                <ProductItem key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </AuthenticatedLayout>
    );
}
