import { Link, useForm, usePage } from '@inertiajs/react';
import RatingStars from './RatingStars';
import WishlistButton from './WishlistButton';
import CurrencyFormatter from '@/Components/CurrencyFormatter';
import { productRoute } from '@/Helper';
import { useTrans, useLocale } from '@/i18n';

export default function ProductItem({ product }) {
    const { auth } = usePage().props;
    const form = useForm({ product_id: product.id, quantity: 1 });
    const t = useTrans();
    const locale = useLocale();

    const title = (locale === 'ar' && product.title_ar) ? product.title_ar : product.title;
    const isOnSale = product.is_on_sale;
    const displayPrice = isOnSale ? product.sale_price : product.price;
    const originalPrice = isOnSale ? product.price : null;

    const addToCart = () => form.post(route('cart.store', product.id), {
        preserveScroll: true,
        preserveState: true,
    });

    return (
        <div className="group block">
            <Link href={productRoute(product)} className="block">
                <div className="aspect-[3/4] bg-secondary overflow-hidden mb-3 relative rounded-sm">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                            <span className="font-display text-lg text-muted-foreground px-4 text-center">{title}</span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />

                    <div className="absolute top-3 end-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <WishlistButton
                            productId={product.id}
                            size={18}
                            className="bg-card/90 backdrop-blur-sm p-2 rounded-sm shadow-sm"
                        />
                    </div>

                    <div className="absolute top-3 start-3 flex flex-col gap-1">
                        {isOnSale && (
                            <span className="text-[10px] uppercase tracking-wider font-body font-medium px-2 py-0.5 bg-accent text-accent-foreground">
                                {t('product_item.sale_badge')}
                            </span>
                        )}
                        {product.quantity < 1 && (
                            <span className="text-[10px] uppercase tracking-wider font-body font-medium px-2 py-0.5 bg-muted text-muted-foreground">
                                {t('product.out_of_stock')}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="space-y-1">
                {(product.user?.name || product.store_name) && (
                    <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                        {product.user?.name || product.store_name}
                    </p>
                )}
                <Link href={productRoute(product)}>
                    <h3 className="font-display text-lg font-medium group-hover:text-accent transition-colors leading-tight line-clamp-2">{title}</h3>
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-body text-base font-medium">
                            <CurrencyFormatter amount={displayPrice} />
                        </span>
                        {originalPrice && (
                            <span className="font-body text-sm text-muted-foreground line-through">
                                <CurrencyFormatter amount={originalPrice} />
                            </span>
                        )}
                    </div>
                    {product.avg_rating > 0 && <RatingStars rating={product.avg_rating} size={12} />}
                </div>

                <div className="pt-2">
                    {product.has_variations ? (
                        <Link
                            href={productRoute(product)}
                            className="text-xs font-body uppercase tracking-wider text-accent hover:underline"
                        >
                            {t('product_item.select_options')}
                        </Link>
                    ) : (
                        <button
                            onClick={addToCart}
                            disabled={product.quantity < 1 || form.processing}
                            className="text-xs font-body uppercase tracking-wider bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-colors disabled:opacity-50 w-full"
                        >
                            {product.quantity < 1 ? (t('product.out_of_stock') || 'Out of Stock') : (t('product_item.add_to_cart') || 'Add to Bag')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

