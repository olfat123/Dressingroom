import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import CurrencyFormatter from '@/Components/CurrencyFormatter';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { CreditCard, Truck, Tag, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useTrans } from '@/i18n';

export default function Index({ checkoutItems, total_price, vendor_id, tax_rate, tax_amount, prices_include_tax, grand_total }) {
    const { data, setData, post, processing, errors } = useForm({
        shipping_name: '',
        shipping_phone: '',
        shipping_address: '',
        shipping_city: '',
        shipping_state: '',
        shipping_country: '',
        shipping_zip: '',
        payment_method: 'cod',
        vendor_id: vendor_id || '',
        coupon_code: '',
    });
    const t = useTrans();

    const [couponCode, setCouponCode]       = useState('');
    const [couponData, setCouponData]       = useState(null);
    const [couponError, setCouponError]     = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const appliedTotal = couponData ? couponData.final_total : grand_total; // kept for potential external use

    // When a coupon is applied and tax is exclusive, recompute tax on the discounted base
    const discountedBase = couponData ? couponData.final_total : total_price;
    const effectiveTaxAmount = (tax_rate > 0 && !prices_include_tax)
        ? parseFloat((discountedBase * tax_rate / 100).toFixed(4))
        : (couponData ? 0 : tax_amount);
    const effectiveGrandTotal = prices_include_tax
        ? discountedBase
        : discountedBase + effectiveTaxAmount;

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        setCouponData(null);
        try {
            const response = await axios.post(route('coupon.apply'), {
                code: couponCode,
                vendor_id: vendor_id || null,
            });
            setCouponData(response.data);
            setData('coupon_code', response.data.code);
        } catch (err) {
            setCouponError(err.response?.data?.error ?? 'Invalid coupon code.');
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setCouponData(null);
        setCouponCode('');
        setCouponError('');
        setData('coupon_code', '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('cart.place-order'));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t('checkout.page_title')} />

            {/* Page header */}
            <div className="border-b border-border bg-background">
                <div className="container mx-auto px-4 py-10">
                    <h1 className="font-display text-4xl md:text-5xl text-foreground text-center">{t('checkout.heading')}</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left column — Shipping & Payment */}
                    <div className="flex-1 flex flex-col gap-6">

                        {/* Shipping Address */}
                        <div className="border border-border bg-background rounded-sm">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="font-display text-xl">{t('checkout.shipping_address')}</h2>
                            </div>
                            <div className="px-6 py-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="shipping_name" value={t('checkout.full_name')} className="font-body text-sm text-foreground/70 mb-1" />
                                        <TextInput
                                            id="shipping_name"
                                            className="mt-1 block w-full border-border focus:border-accent font-body text-sm"
                                            value={data.shipping_name}
                                            onChange={(e) => setData('shipping_name', e.target.value)}
                                            placeholder="John Doe"
                                            required
                                        />
                                        <InputError message={errors.shipping_name} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="shipping_phone" value={t('checkout.phone')} className="font-body text-sm text-foreground/70 mb-1" />
                                        <TextInput
                                            id="shipping_phone"
                                            className="mt-1 block w-full border-border focus:border-accent font-body text-sm"
                                            value={data.shipping_phone}
                                            onChange={(e) => setData('shipping_phone', e.target.value)}
                                            placeholder="+20 1xx xxx xxxx"
                                            required
                                        />
                                        <InputError message={errors.shipping_phone} className="mt-1" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="shipping_address" value={t('checkout.street_address')} className="font-body text-sm text-foreground/70 mb-1" />
                                        <TextInput
                                            id="shipping_address"
                                            className="mt-1 block w-full border-border focus:border-accent font-body text-sm"
                                            value={data.shipping_address}
                                            onChange={(e) => setData('shipping_address', e.target.value)}
                                            placeholder="123 Main St, Apt 4"
                                            required
                                        />
                                        <InputError message={errors.shipping_address} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="shipping_city" value={t('checkout.city')} className="font-body text-sm text-foreground/70 mb-1" />
                                        <TextInput
                                            id="shipping_city"
                                            className="mt-1 block w-full border-border focus:border-accent font-body text-sm"
                                            value={data.shipping_city}
                                            onChange={(e) => setData('shipping_city', e.target.value)}
                                            placeholder="Cairo"
                                            required
                                        />
                                        <InputError message={errors.shipping_city} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="shipping_state" value={t('checkout.state')} className="font-body text-sm text-foreground/70 mb-1" />
                                        <TextInput
                                            id="shipping_state"
                                            className="mt-1 block w-full border-border focus:border-accent font-body text-sm"
                                            value={data.shipping_state}
                                            onChange={(e) => setData('shipping_state', e.target.value)}
                                            placeholder="Cairo Governorate"
                                        />
                                        <InputError message={errors.shipping_state} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="shipping_country" value={t('checkout.country')} className="font-body text-sm text-foreground/70 mb-1" />
                                        <TextInput
                                            id="shipping_country"
                                            className="mt-1 block w-full border-border focus:border-accent font-body text-sm"
                                            value={data.shipping_country}
                                            onChange={(e) => setData('shipping_country', e.target.value)}
                                            placeholder="Egypt"
                                            required
                                        />
                                        <InputError message={errors.shipping_country} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="shipping_zip" value={t('checkout.zip')} className="font-body text-sm text-foreground/70 mb-1" />
                                        <TextInput
                                            id="shipping_zip"
                                            className="mt-1 block w-full border-border focus:border-accent font-body text-sm"
                                            value={data.shipping_zip}
                                            onChange={(e) => setData('shipping_zip', e.target.value)}
                                            placeholder="12345"
                                        />
                                        <InputError message={errors.shipping_zip} className="mt-1" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="border border-border bg-background rounded-sm">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="font-display text-xl">{t('checkout.payment_method')}</h2>
                            </div>
                            <div className="px-6 py-5 flex flex-col gap-3">
                                {/* Paymob Credit Card */}
                                <label
                                    className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors rounded-sm ${
                                        data.payment_method === 'paymob_cc'
                                            ? 'border-accent bg-accent/5'
                                            : 'border-border hover:border-accent/50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="paymob_cc"
                                        checked={data.payment_method === 'paymob_cc'}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="accent-[hsl(var(--accent))]"
                                    />
                                    <CreditCard className="w-5 h-5 text-accent" />
                                    <div>
                                        <p className="font-body font-medium text-sm">{t('checkout.credit_card')}</p>
                                        <p className="font-body text-xs text-foreground/50">{t('checkout.credit_card_sub')}</p>
                                    </div>
                                </label>

                                {/* Cash on Delivery */}
                                <label
                                    className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors rounded-sm ${
                                        data.payment_method === 'cod'
                                            ? 'border-accent bg-accent/5'
                                            : 'border-border hover:border-accent/50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="cod"
                                        checked={data.payment_method === 'cod'}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="accent-[hsl(var(--accent))]"
                                    />
                                    <Truck className="w-5 h-5 text-foreground/60" />
                                    <div>
                                        <p className="font-body font-medium text-sm">{t('checkout.cod')}</p>
                                        <p className="font-body text-xs text-foreground/50">{t('checkout.cod_sub')}</p>
                                    </div>
                                </label>

                                <InputError message={errors.payment_method} className="mt-1" />
                            </div>
                        </div>
                    </div>

                    {/* Right column — Order Summary */}
                    <div className="w-full lg:w-80 shrink-0 border border-border bg-background rounded-sm sticky top-4">
                        <div className="px-6 py-4 border-b border-border">
                            <h2 className="font-display text-xl">{t('checkout.order_summary')}</h2>
                        </div>
                        <div className="px-6 py-5 space-y-3">
                            {/* Items */}
                            {(checkoutItems || []).map((group) => (
                                <div key={group.user?.id} className="mb-3">
                                    <p className="font-body text-xs font-medium text-foreground/50 uppercase tracking-widest mb-2">
                                        {group.user?.name}'s Store
                                    </p>
                                    {(group.items || []).map((item) => (
                                        <div key={item.id} className="flex justify-between font-body text-sm py-1">
                                            <span className="truncate max-w-[180px] text-foreground/70">
                                                {item.title} × {item.quantity}
                                            </span>
                                            <span className="ml-2 whitespace-nowrap">
                                                <CurrencyFormatter amount={item.price * item.quantity} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}

                            <div className="border-t border-border" />

                            {/* Tax line — only when no coupon */}
                            {tax_rate > 0 && !couponData && (
                                <div className="flex justify-between font-body text-sm text-foreground/60">
                                    <span>{t('checkout.tax', { rate: tax_rate })}{prices_include_tax ? ' ' + t('cart.tax_incl') : ''}</span>
                                    <span>
                                        {prices_include_tax
                                            ? t('cart.included')
                                            : <CurrencyFormatter amount={tax_amount} />}
                                    </span>
                                </div>
                            )}

                            {/* Coupon Code */}
                            {!couponData ? (
                                <div>
                                    <p className="font-body text-xs font-medium text-foreground/60 uppercase tracking-widest mb-2">
                                        <Tag className="w-3 h-3 inline mr-1" />{t('checkout.have_coupon')}
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 border border-border px-3 py-2 font-body text-sm bg-background focus:outline-none focus:border-accent rounded-sm uppercase"
                                            placeholder={t('checkout.coupon_placeholder')}
                                            value={couponCode}
                                            onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                                        />
                                        <button
                                            type="button"
                                            className="border border-border px-3 py-2 font-body text-xs uppercase tracking-widest hover:border-accent transition-colors disabled:opacity-50 rounded-sm"
                                            onClick={applyCoupon}
                                            disabled={couponLoading || !couponCode.trim()}
                                        >
                                            {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('checkout.apply_coupon')}
                                        </button>
                                    </div>
                                    {couponError && <p className="font-body text-destructive text-xs mt-1">{couponError}</p>}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-accent/10 border border-accent/30 rounded-sm px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-accent" />
                                        <span className="font-body text-sm text-foreground font-medium">{couponData.code}</span>
                                        <span className="font-body text-xs text-foreground/60">{t('checkout.coupon_applied')}</span>
                                    </div>
                                    <button type="button" onClick={removeCoupon} className="text-destructive hover:opacity-70 transition-opacity">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Coupon breakdown */}
                            {couponData && (
                                <>
                                    <div className="flex justify-between font-body text-sm text-foreground/60">
                                        <span>{t('checkout.subtotal')}</span>
                                        <CurrencyFormatter amount={total_price} />
                                    </div>
                                    <div className="flex justify-between font-body text-sm text-green-600">
                                        <span>{t('checkout.discount', { code: couponData.code })}</span>
                                        <span>- <CurrencyFormatter amount={couponData.discount_amount} /></span>
                                    </div>
                                    {tax_rate > 0 && (
                                        <div className="flex justify-between font-body text-sm text-foreground/60">
                                            <span>{t('checkout.tax', { rate: tax_rate })}{prices_include_tax ? ' ' + t('cart.tax_incl') : ''}</span>
                                            <span>
                                                {prices_include_tax
                                                    ? t('cart.included')
                                                    : <CurrencyFormatter amount={effectiveTaxAmount} />}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="border-t border-border pt-3">
                                <div className="flex justify-between font-body font-semibold text-base">
                                    <span>{t('cart.total')}</span>
                                    <CurrencyFormatter amount={effectiveGrandTotal} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 font-body text-sm uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
                                disabled={processing}
                            >
                                {processing ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> {t('checkout.processing')}</>
                                ) : data.payment_method === 'paymob_cc' ? (
                                    <><CreditCard className="w-4 h-4" /> {t('checkout.pay_card')}</>
                                ) : (
                                    <><Truck className="w-4 h-4" /> {t('checkout.place_order')}</>
                                )}
                            </button>

                            <Link
                                href={route('cart.index')}
                                className="block text-center mt-2 font-body text-xs text-foreground/50 hover:text-foreground transition-colors"
                            >
                                {t('checkout.back_to_cart')}
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
