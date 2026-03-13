import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CurrencyFormatter from '@/Components/CurrencyFormatter';
import ProductItem from '@/Components/App/ProductItem';
import { useState } from 'react';
import { useTrans, useLocale } from '@/i18n';
import { ShoppingBag, Heart, MapPin, Pencil, Trash2, Plus, RefreshCw, X, ChevronDown } from 'lucide-react';

const STATUS_COLORS = {
    pending:    'bg-amber-100 text-amber-800',
    processing: 'bg-blue-100 text-blue-800',
    paid:       'bg-blue-100 text-blue-800',
    shipped:    'bg-purple-100 text-purple-800',
    delivered:  'bg-green-100 text-green-800',
    completed:  'bg-green-100 text-green-800',
    cancelled:  'bg-red-100 text-red-800',
    refunded:   'bg-gray-100 text-gray-700',
    failed:     'bg-red-100 text-red-800',
};

const CANCELLABLE_STATUSES = ['pending', 'processing'];

// ─── Orders Tab ──────────────────────────────────────────────────────────────
function OrdersTab({ orders }) {
    const [expanded, setExpanded] = useState(null);
    const t = useTrans();
    const locale = useLocale();
    const itemTitle = (item) => (locale === 'ar' && item.product?.title_ar) ? item.product.title_ar : item.product?.title;

    if (!orders.length) {
        return (
            <div className="text-center py-16">
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">{t('account.orders.empty_title')}</h3>
                <p className="text-muted-foreground mb-6">{t('account.orders.empty_sub')}</p>
                <Link href={route('shop')} className="inline-block bg-primary text-primary-foreground px-6 py-2 text-sm tracking-wide hover:opacity-90 transition-opacity">
                    {t('account.browse_shop')}
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="border border-border bg-background">
                    <div
                        className="p-4 cursor-pointer"
                        onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-muted-foreground text-sm">{t('account.orders.order_label')}</span>
                                <span className="font-semibold">#{order.id}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">{order.created_at}</span>
                                <CurrencyFormatter amount={order.total_price} />
                                <ChevronDown className={`h-4 w-4 transition-transform ${expanded === order.id ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        {/* Item thumbnails preview */}
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {order.items.slice(0, 4).map((item) => (
                                <div key={item.id} className="relative">
                                    {item.product?.image_url ? (
                                        <img
                                            src={item.product.image_url}
                                            alt={itemTitle(item)}
                                            className="w-12 h-12 object-cover border border-border"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-muted flex items-center justify-center text-muted-foreground text-xs">img</div>
                                    )}
                                    {item.quantity > 1 && (
                                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">×{item.quantity}</span>
                                    )}
                                </div>
                            ))}
                            {order.items.length > 4 && (
                                <div className="w-12 h-12 bg-muted flex items-center justify-center text-sm font-semibold border border-border">
                                    +{order.items.length - 4}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Expandable details */}
                    {expanded === order.id && (
                        <div className="border-t border-border px-6 py-4 space-y-4">
                            {/* Items list */}
                            <div>
                                <h4 className="font-semibold mb-3 text-xs uppercase tracking-widest text-muted-foreground">{t('account.orders.items_heading')}</h4>
                                <div className="space-y-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            {item.product?.image_url ? (
                                                <img src={item.product.image_url} alt={itemTitle(item)} className="w-14 h-14 object-cover" />
                                            ) : (
                                                <div className="w-14 h-14 bg-muted" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                {item.product ? (
                                                    <Link href={route('product.show', item.product.slug)} className="font-medium hover:text-accent transition-colors truncate block">
                                                        {itemTitle(item)}
                                                    </Link>
                                                ) : (
                                                    <span className="font-medium text-muted-foreground">{t('account.orders.product_removed')}</span>
                                                )}
                                                <span className="text-sm text-muted-foreground">{t('account.orders.qty')} {item.quantity}</span>
                                            </div>
                                            <CurrencyFormatter amount={item.price * item.quantity} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping info */}
                            {order.shipping_address && (
                                <div>
                                    <h4 className="font-semibold mb-1 text-xs uppercase tracking-widest text-muted-foreground">{t('account.orders.shipped_to')}</h4>
                                    <p className="text-sm">
                                        {order.shipping_name} — {order.shipping_address}, {order.shipping_city}, {order.shipping_country}
                                    </p>
                                </div>
                            )}

                            {/* Payment */}
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                <span className="text-sm text-muted-foreground capitalize">
                                    {t('account.orders.payment')}: {order.payment_method ?? 'N/A'}
                                </span>
                                <div className="flex items-center gap-2 font-semibold">
                                    <span>{t('account.orders.total')}:</span>
                                    <CurrencyFormatter amount={order.total_price} />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                                <button
                                    className="flex items-center gap-2 border border-border px-3 py-1.5 text-sm hover:border-accent hover:text-accent transition-colors"
                                    onClick={() => router.post(route('account.orders.reorder', order.id))}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Reorder
                                </button>

                                {CANCELLABLE_STATUSES.includes(order.status) && (
                                    <button
                                        className="flex items-center gap-2 border border-red-200 text-red-600 px-3 py-1.5 text-sm hover:bg-red-50 transition-colors"
                                        onClick={() => {
                                            if (confirm(t('account.orders.cancel_confirm', { id: order.id }))) {
                                                router.post(route('account.orders.cancel', order.id));
                                            }
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                        {t('account.orders.cancel_btn')}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Favourites Tab ───────────────────────────────────────────────────────────
function FavouritesTab({ wishlist }) {
    const t = useTrans();
    if (!wishlist.length) {
        return (
            <div className="text-center py-16">
                <Heart className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">{t('account.favourites.empty_title')}</h3>
                <p className="text-muted-foreground mb-6">{t('account.favourites.empty_sub')}</p>
                <Link href={route('shop')} className="inline-block bg-primary text-primary-foreground px-6 py-2 text-sm tracking-wide hover:opacity-90 transition-opacity">
                    {t('account.browse_shop')}
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlist.map((product) => (
                <ProductItem key={product.id} product={product} />
            ))}
        </div>
    );
}

// ─── Addresses Tab ────────────────────────────────────────────────────────────
function AddressesTab({ addresses }) {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const t = useTrans();

    const emptyForm = { name: '', phone: '', address: '', city: '', state: '', country: 'Egypt', zip: '', is_default: false };

    const createForm = useForm({ ...emptyForm });
    const editForm = useForm({ ...emptyForm });
    const deleteForm = useForm({});
    const defaultForm = useForm({});

    const startEdit = (addr) => {
        setEditingId(addr.id);
        editForm.setData({
            name: addr.name,
            phone: addr.phone ?? '',
            address: addr.address,
            city: addr.city,
            state: addr.state ?? '',
            country: addr.country,
            zip: addr.zip ?? '',
            is_default: addr.is_default,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        editForm.reset();
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('account.addresses.store'), {
            preserveScroll: true,
            onSuccess: () => { createForm.reset(); setShowForm(false); },
        });
    };

    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route('account.addresses.update', id), {
            preserveScroll: true,
            onSuccess: () => cancelEdit(),
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this address?')) return;
        deleteForm.delete(route('account.addresses.delete', id), { preserveScroll: true });
    };

    const setDefault = (id) => {
        defaultForm.post(route('account.addresses.default', id), { preserveScroll: true });
    };

    const fieldClass = "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors";
    const labelClass = "block text-sm font-medium text-foreground mb-1";

    const AddressForm = ({ form, onSubmit, onCancel, submitLabel }) => (
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 border border-border">
            <div>
                <label className={labelClass}>{t('checkout.full_name')} *</label>
                <input className={fieldClass} value={form.data.name} onChange={e => form.setData('name', e.target.value)} required />
                {form.errors.name && <span className="text-red-600 text-xs mt-1 block">{form.errors.name}</span>}
            </div>
            <div>
                <label className={labelClass}>{t('checkout.phone')}</label>
                <input className={fieldClass} value={form.data.phone} onChange={e => form.setData('phone', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
                <label className={labelClass}>{t('checkout.street_address')} *</label>
                <input className={fieldClass} value={form.data.address} onChange={e => form.setData('address', e.target.value)} required />
                {form.errors.address && <span className="text-red-600 text-xs mt-1 block">{form.errors.address}</span>}
            </div>
            <div>
                <label className={labelClass}>{t('checkout.city')} *</label>
                <input className={fieldClass} value={form.data.city} onChange={e => form.setData('city', e.target.value)} required />
                {form.errors.city && <span className="text-red-600 text-xs mt-1 block">{form.errors.city}</span>}
            </div>
            <div>
                <label className={labelClass}>{t('checkout.state')}</label>
                <input className={fieldClass} value={form.data.state} onChange={e => form.setData('state', e.target.value)} />
            </div>
            <div>
                <label className={labelClass}>{t('checkout.country')} *</label>
                <input className={fieldClass} value={form.data.country} onChange={e => form.setData('country', e.target.value)} required />
            </div>
            <div>
                <label className={labelClass}>{t('checkout.zip')}</label>
                <input className={fieldClass} value={form.data.zip} onChange={e => form.setData('zip', e.target.value)} />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
                <input
                    type="checkbox"
                    className="accent-[hsl(var(--accent))] w-4 h-4"
                    checked={form.data.is_default}
                    onChange={e => form.setData('is_default', e.target.checked)}
                    id={`default-${submitLabel}`}
                />
                <label htmlFor={`default-${submitLabel}`} className="text-sm cursor-pointer">{t('account.addresses.set_default_label')}</label>
            </div>
            <div className="sm:col-span-2 flex gap-2">
                <button type="submit" className="bg-primary text-primary-foreground px-5 py-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-50" disabled={form.processing}>{submitLabel}</button>
                <button type="button" className="border border-border px-5 py-2 text-sm hover:border-accent hover:text-accent transition-colors" onClick={onCancel}>{t('account.addresses.cancel')}</button>
            </div>
        </form>
    );

    return (
        <div className="space-y-4">
            {/* Add new address button */}
            {!showForm && (
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent transition-colors">
                    <Plus className="h-5 w-5" />
                    {t('account.addresses.add_new')}
                </button>
            )}

            {showForm && (
                <div className="border border-border bg-background">
                    <div className="p-4 border-b border-border">
                        <h3 className="font-display text-base font-semibold">{t('account.addresses.new_address')}</h3>
                    </div>
                    <div className="p-4">
                        <AddressForm
                            form={createForm}
                            onSubmit={submitCreate}
                            onCancel={() => { setShowForm(false); createForm.reset(); }}
                            submitLabel={t('account.addresses.save')}
                        />
                    </div>
                </div>
            )}

            {/* Address list */}
            {!addresses.length && !showForm && (
                <div className="text-center py-16">
                    <MapPin className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
                    <h3 className="font-display text-xl font-semibold mb-2">{t('account.addresses.empty_title')}</h3>
                    <p className="text-muted-foreground">{t('account.addresses.empty_sub')}</p>
                </div>
            )}

            {addresses.map((addr) => (
                <div key={addr.id} className="border border-border bg-background">
                    {editingId === addr.id ? (
                        <div className="p-4">
                            <h3 className="font-display text-base font-semibold mb-3">{t('account.addresses.edit_address')}</h3>
                            <AddressForm
                                form={editForm}
                                onSubmit={(e) => submitEdit(e, addr.id)}
                                onCancel={cancelEdit}
                                submitLabel={t('account.addresses.update')}
                            />
                        </div>
                    ) : (
                        <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold">{addr.name}</span>
                                        {addr.is_default && <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary font-medium">{t('account.addresses.default_badge')}</span>}
                                    </div>
                                    {addr.phone && <p className="text-sm text-muted-foreground">{addr.phone}</p>}
                                    <p className="text-sm">{addr.address}</p>
                                    <p className="text-sm">{addr.city}{addr.state ? `, ${addr.state}` : ''}, {addr.country}{addr.zip ? ` ${addr.zip}` : ''}</p>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    {!addr.is_default && (
                                        <button
                                            onClick={() => setDefault(addr.id)}
                                            className="text-xs px-2 py-1 border border-border hover:border-accent hover:text-accent transition-colors"
                                            title={t('account.addresses.set_default')}
                                        >
                                            {t('account.addresses.set_default')}
                                        </button>
                                    )}
                                    <button onClick={() => startEdit(addr)} className="p-1.5 border border-border hover:border-accent hover:text-accent transition-colors" title="Edit">
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(addr.id)} className="p-1.5 border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AccountIndex({ orders, wishlist, addresses }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const t = useTrans();

    const [activeTab, setActiveTab] = useState('orders');

    const tabs = [
        { key: 'orders',     label: t('account.tab_orders'),     count: orders.length,    icon: <ShoppingBag className="h-4 w-4" /> },
        { key: 'favourites', label: t('account.tab_favourites'), count: wishlist.length,  icon: <Heart className="h-4 w-4" /> },
        { key: 'addresses',  label: t('account.tab_addresses'),  count: addresses.length, icon: <MapPin className="h-4 w-4" /> },
    ];

    // Avatar initials
    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <AuthenticatedLayout>
            <Head title={t('account.page_title')} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        {/* Profile card */}
                        <div className="border border-border bg-background p-6 text-center mb-4">
                            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-3">
                                {initials}
                            </div>
                            <h2 className="font-display text-lg font-semibold">{user.name}</h2>
                            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
                            <Link href={route('profile.edit')} className="inline-block mt-3 text-sm border border-border px-3 py-1 hover:border-accent hover:text-accent transition-colors">
                                {t('account.edit_profile')}
                            </Link>
                        </div>

                        {/* Nav */}
                        <div className="border border-border bg-background divide-y divide-border">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                                        activeTab === tab.key
                                            ? 'bg-primary/5 text-accent font-medium border-l-2 border-accent'
                                            : 'hover:bg-muted/50 text-foreground'
                                    }`}
                                >
                                    {tab.icon}
                                    <span className="flex-1">{tab.label}</span>
                                    {tab.count > 0 && (
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 min-w-0">
                        {/* Tab header */}
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="font-display text-2xl font-semibold">
                                {tabs.find((tab) => tab.key === activeTab)?.label}
                            </h1>
                            {/* Mobile tab switcher */}
                            <div className="flex gap-1 lg:hidden">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`p-2 border transition-colors ${
                                            activeTab === tab.key
                                                ? 'border-accent text-accent'
                                                : 'border-border text-muted-foreground hover:border-accent'
                                        }`}
                                    >
                                        {tab.icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeTab === 'orders' && <OrdersTab orders={orders} />}
                        {activeTab === 'favourites' && <FavouritesTab wishlist={wishlist} />}
                        {activeTab === 'addresses' && <AddressesTab addresses={addresses} />}
                    </main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
