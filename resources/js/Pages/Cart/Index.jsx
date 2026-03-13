import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import CurrencyFormatter from '@/Components/CurrencyFormatter';
import { CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import CartItem from '@/Components/App/CartItem';
import { useTrans } from '@/i18n';

export default function Index({ cartItems, total_price, total_quantity, tax_rate, tax_amount, prices_include_tax, grand_total }) {
    const t = useTrans();

    // Convert cartItems to array if it's an object, ensure it's always an array
    let cartItemsArray = [];
    if (Array.isArray(cartItems)) {
        cartItemsArray = cartItems;
    } else if (cartItems && typeof cartItems === 'object') {
        try {
            cartItemsArray = Object.values(cartItems);
        } catch (e) {
            cartItemsArray = [];
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title={t('cart.page_title')} />

            {/* Page header */}
            <div className="border-b border-border bg-background">
                <div className="container mx-auto px-4 py-10">
                    <h1 className="font-display text-4xl md:text-5xl text-foreground text-center">{t('cart.page_title')}</h1>
                    <p className="font-body text-sm text-foreground/50 text-center mt-2">
                        {total_quantity > 0 ? t('cart.subtotal', { count: total_quantity }) : t('cart.empty')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-start">
                {/* Cart items */}
                <div className="w-full lg:flex-1 order-2 lg:order-1">
                    {cartItemsArray.length === 0 ? (
                        <div className="text-center py-20 border border-border rounded-sm bg-background">
                            <ShoppingBag className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                            <p className="font-body text-foreground/50">{t('cart.empty')}</p>
                            <Link href={route('shop')} className="inline-flex items-center gap-2 mt-6 font-body text-sm uppercase tracking-widest hover-gold-underline">
                                {t('cart.continue_shopping') || 'Continue Shopping'} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cartItemsArray.map((cartItem) => (
                                <div key={cartItem.user.id} className="border border-border bg-background rounded-sm">
                                    {/* Vendor header */}
                                    <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
                                        <Link href="/" className="font-body text-sm font-medium hover-gold-underline">
                                            {cartItem.user.name}'s Store
                                        </Link>
                                        <Link
                                            href={route('cart.checkout') + '?vendor_id=' + cartItem.user.id}
                                            className="flex items-center gap-1.5 font-body text-xs text-foreground/60 hover:text-foreground transition-colors"
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            {t('cart.checkout_seller')}
                                        </Link>
                                    </div>
                                    {/* Items */}
                                    <div className="divide-y divide-border">
                                        {(cartItem.items || []).map((item) => (
                                            <div key={item.id} className="px-5 py-4">
                                                <CartItem item={item} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order summary */}
                <div className="w-full lg:w-80 shrink-0 border border-border bg-background rounded-sm order-1 lg:order-2 sticky top-4">
                    <div className="px-6 py-5 border-b border-border">
                        <h2 className="font-display text-xl">{t('cart.order_summary') || 'Order Summary'}</h2>
                    </div>
                    <div className="px-6 py-5 space-y-3">
                        <div className="flex justify-between font-body text-sm">
                            <span className="text-foreground/70">{t('cart.subtotal', { count: total_quantity })}</span>
                            <CurrencyFormatter amount={total_price} />
                        </div>

                        {tax_rate > 0 && (
                            <div className="flex justify-between font-body text-sm text-foreground/60">
                                <span>
                                    {t('cart.tax', { rate: tax_rate })}{prices_include_tax ? ' ' + t('cart.tax_incl') : ''}
                                </span>
                                <span>{prices_include_tax ? t('cart.included') : <CurrencyFormatter amount={tax_amount} />}</span>
                            </div>
                        )}

                        <div className="border-t border-border pt-3">
                            <div className="flex justify-between font-body font-semibold text-base">
                                <span>{t('cart.total')}</span>
                                <CurrencyFormatter amount={grand_total} />
                            </div>
                        </div>

                        <Link
                            href={route('cart.checkout')}
                            className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3 font-body text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors mt-2"
                        >
                            <CreditCard className="w-4 h-4" />
                            {t('cart.proceed_checkout')}
                        </Link>

                        <Link href={route('shop')} className="flex items-center justify-center gap-1 font-body text-xs text-foreground/50 hover:text-foreground transition-colors mt-2">
                            {t('cart.continue_shopping') || 'Continue Shopping'}
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
