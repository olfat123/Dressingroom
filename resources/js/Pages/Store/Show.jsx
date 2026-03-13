import { useState, useEffect, useCallback, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import ProductItem from '@/Components/App/ProductItem';
import ProductFilterPanel from '@/Components/App/ProductFilterPanel';
import Pagination from '@/Components/App/Pagination';
import { SlidersHorizontal, MapPin, X, ShoppingBag } from 'lucide-react';
import { useTrans } from '@/i18n';
import { useDebounce } from '@/hooks/useDebounce';

export default function StoreShow({ vendor, products, departments = [], filters }) {
    const f = (filters && !Array.isArray(filters)) ? filters : {};
    const t = useTrans();

    const SORT_OPTIONS = [
        { value: 'newest',     label: t('shop.sort.newest') },
        { value: 'price_asc',  label: t('shop.sort.price_asc') },
        { value: 'price_desc', label: t('shop.sort.price_desc') },
        { value: 'name_asc',   label: t('shop.sort.name_asc') },
        { value: 'name_desc',  label: t('shop.sort.name_desc') },
        { value: 'top_rated',  label: t('shop.sort.top_rated') },
    ];

    const [search, setSearch]             = useState(f.search        ?? '');
    const [departmentId, setDepartmentId] = useState(f.department_id ?? '');
    const [categoryId, setCategoryId]     = useState(f.category_id   ?? '');
    const [minPrice, setMinPrice]         = useState(f.min_price      ?? '');
    const [maxPrice, setMaxPrice]         = useState(f.max_price      ?? '');
    const [sort, setSort]                 = useState(f.sort           ?? 'newest');
    const [sidebarOpen, setSidebarOpen]   = useState(false);

    const debouncedSearch   = useDebounce(search);
    const debouncedMinPrice = useDebounce(minPrice);
    const debouncedMaxPrice = useDebounce(maxPrice);

    const isFirstRender = useRef(true);

    const categories = departmentId
        ? (departments.find(d => String(d.id) === String(departmentId))?.categories ?? [])
        : departments.flatMap(d => d.categories);

    const buildParams = useCallback(() => ({
        search:        debouncedSearch   || undefined,
        department_id: departmentId      || undefined,
        category_id:   categoryId        || undefined,
        min_price:     debouncedMinPrice || undefined,
        max_price:     debouncedMaxPrice || undefined,
        sort:          sort !== 'newest' ? sort : undefined,
    }), [debouncedSearch, departmentId, categoryId, debouncedMinPrice, debouncedMaxPrice, sort]);

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        router.get(route('store.show', vendor.store_slug), buildParams(), { preserveState: true, replace: true });
    }, [debouncedSearch, departmentId, categoryId, debouncedMinPrice, debouncedMaxPrice, sort]);

    const handleDepartmentChange = (val) => {
        setDepartmentId(val);
        setCategoryId('');
    };

    const activeFilterCount = [
        search, departmentId, categoryId, minPrice, maxPrice, sort !== 'newest' ? sort : '',
    ].filter(Boolean).length;

    const clearAll = () => {
        setSearch(''); setDepartmentId(''); setCategoryId('');
        setMinPrice(''); setMaxPrice(''); setSort('newest');
    };

    const filterPanelProps = {
        search,        onSearchChange:     setSearch,
        departmentId,  onDepartmentChange: handleDepartmentChange,
        categoryId,    onCategoryChange:   setCategoryId,
        minPrice,      onMinPriceChange:   setMinPrice,
        maxPrice,      onMaxPriceChange:   setMaxPrice,
        departments,
        categories,
        stores: [],
        activeFilterCount,
        onClearAll: clearAll,
    };

    return (
        <AuthenticatedLayout>
            <Head title={vendor.store_name} />

            {/* ── Banner ── */}
            <div className="relative w-full bg-muted overflow-hidden" style={{ minHeight: '200px' }}>
                {vendor.banner_url ? (
                    <img
                        src={vendor.banner_url}
                        alt={`${vendor.store_name} banner`}
                        className="w-full object-cover max-h-[400px]"
                    />
                ) : (
                    <div className="w-full flex items-center justify-center bg-primary" style={{ height: '220px' }}>
                        <span className="font-display text-5xl text-primary-foreground/20 select-none uppercase tracking-widest">
                            {vendor.store_name}
                        </span>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-5 pt-10">
                    <h1 className="font-display text-3xl text-white drop-shadow">{vendor.store_name}</h1>
                    {vendor.store_address && (
                        <p className="flex items-center gap-1 font-body text-white/70 text-sm mt-1">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            {vendor.store_address}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Store description ── */}
            {vendor.store_description && (
                <div className="bg-background border-b border-border">
                    <div className="container mx-auto px-4 py-4">
                        <p className="font-body text-foreground/70 text-sm leading-relaxed">{vendor.store_description}</p>
                    </div>
                </div>
            )}

            {/* ── Toolbar ── */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="font-body text-foreground/50 text-sm">
                        {products.meta?.total
                            ? t('shop.products_found', { count: products.meta.total })
                            : t('store.browse_products')}
                    </p>
                    <div className="flex items-center gap-3">
                        <select
                            className="border border-border px-3 py-1.5 font-body text-sm bg-background focus:outline-none focus:border-accent rounded-sm"
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        <button
                            className="flex items-center gap-1.5 border border-border px-3 py-1.5 font-body text-sm hover:border-accent transition-colors rounded-sm lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            {t('shop.filters')}
                            {activeFilterCount > 0 && (
                                <span className="bg-accent text-white text-xs rounded-full px-1.5 py-0.5 ml-1">{activeFilterCount}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile filter drawer ── */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <div className="relative ml-auto w-72 h-full bg-background shadow-xl overflow-y-auto p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-display text-xl">{t('shop.filters')}</h2>
                            <button onClick={() => setSidebarOpen(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <ProductFilterPanel {...filterPanelProps} />
                    </div>
                </div>
            )}

            {/* ── Main layout ── */}
            <div className="container mx-auto px-4 py-10 flex gap-8">

                {/* Desktop sidebar */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="border border-border bg-background p-5 sticky top-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-display text-lg">{t('shop.filters')}</h2>
                            {activeFilterCount > 0 && (
                                <span className="font-body text-xs text-accent">{activeFilterCount} {t('shop.active')}</span>
                            )}
                        </div>
                        <ProductFilterPanel {...filterPanelProps} />
                    </div>
                </aside>

                {/* Products grid */}
                <div className="flex-1 min-w-0">
                    {products.data.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-foreground/20" />
                            <p className="font-display text-xl text-foreground/40">{t('shop.no_products')}</p>
                            {activeFilterCount > 0 && (
                                <button onClick={clearAll} className="mt-4 font-body text-sm text-destructive hover:underline">
                                    {t('shop.clear_filters')}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                            {products.data.map(product => (
                                <ProductItem product={product} key={product.id} />
                            ))}
                        </div>
                    )}

                    <Pagination meta={products.meta} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
