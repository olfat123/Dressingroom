import { useState, useEffect, useCallback, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import ProductItem from '@/Components/App/ProductItem';
import ProductFilterPanel from '@/Components/App/ProductFilterPanel';
import Pagination from '@/Components/App/Pagination';
import { SlidersHorizontal, X, ShoppingBag } from 'lucide-react';
import { useTrans } from '@/i18n';
import { useDebounce } from '@/hooks/useDebounce';

export default function Shop({ products, departments = [], stores = [], filters }) {
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
    const [storeId, setStoreId]           = useState(f.store_id       ?? '');
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
        store_id:      storeId           || undefined,
        min_price:     debouncedMinPrice || undefined,
        max_price:     debouncedMaxPrice || undefined,
        sort:          sort !== 'newest' ? sort : undefined,
    }), [debouncedSearch, departmentId, categoryId, storeId, debouncedMinPrice, debouncedMaxPrice, sort]);

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        router.get(route('shop'), buildParams(), { preserveState: true, replace: true });
    }, [debouncedSearch, departmentId, categoryId, storeId, debouncedMinPrice, debouncedMaxPrice, sort]);

    const handleDepartmentChange = (val) => {
        setDepartmentId(val);
        setCategoryId('');
    };

    const activeFilterCount = [
        search, departmentId, categoryId, storeId, minPrice, maxPrice, sort !== 'newest' ? sort : '',
    ].filter(Boolean).length;

    const clearAll = () => {
        setSearch(''); setDepartmentId(''); setCategoryId('');
        setStoreId(''); setMinPrice(''); setMaxPrice(''); setSort('newest');
    };

    const filterPanelProps = {
        search,        onSearchChange:     setSearch,
        departmentId,  onDepartmentChange: handleDepartmentChange,
        categoryId,    onCategoryChange:   setCategoryId,
        storeId,       onStoreChange:      setStoreId,
        minPrice,      onMinPriceChange:   setMinPrice,
        maxPrice,      onMaxPriceChange:   setMaxPrice,
        departments,
        categories,
        stores,
        activeFilterCount,
        onClearAll: clearAll,
    };

    return (
        <AuthenticatedLayout>
            <Head title={t('shop.heading')} />

            {/* Page Header */}
            <div className="bg-secondary border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h1 className="font-display text-4xl">{t('shop.heading')}</h1>
                    <p className="mt-2 text-muted-foreground font-body">
                        {products.meta?.total
                            ? t('shop.products_found', { count: products.meta.total })
                            : t('shop.browse_all')}
                    </p>
                </div>
            </div>

            {/* Mobile filter drawer */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <div className="relative ms-auto w-72 h-full bg-card shadow-xl overflow-y-auto p-6 flex flex-col gap-4">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-8">
                {/* Desktop sidebar */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="bg-card border border-border/50 p-5 sticky top-24 rounded-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-display text-lg">{t('shop.filters')}</h2>
                            {activeFilterCount > 0 && (
                                <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 font-body rounded-sm">{activeFilterCount}</span>
                            )}
                        </div>
                        <ProductFilterPanel {...filterPanelProps} />
                    </div>
                </aside>

                {/* Products */}
                <div className="flex-1 min-w-0">
                    {/* Sort + mobile toggle bar */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            className="flex items-center gap-2 border border-border px-4 py-2 font-body text-sm lg:hidden hover:border-accent transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            {t('shop.filters')}
                            {activeFilterCount > 0 && (
                                <span className="w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">{activeFilterCount}</span>
                            )}
                        </button>
                        <div className="flex items-center gap-2 ms-auto">
                            <span className="text-sm font-body text-muted-foreground hidden sm:block">{t('shop.sort.label') || 'Sort:'}</span>
                            <select
                                className="border border-border px-3 py-2 font-body text-sm bg-background focus:outline-none focus:border-accent rounded-sm"
                                value={sort}
                                onChange={e => setSort(e.target.value)}
                            >
                                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {products.data.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="font-display text-2xl text-muted-foreground mb-4">{t('shop.no_products')}</p>
                            {activeFilterCount > 0 && (
                                <button onClick={clearAll} className="text-sm font-body text-accent hover:underline">
                                    {t('shop.clear_filters')}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.data.map(product => <ProductItem product={product} key={product.id} />)}
                        </div>
                    )}

                    <Pagination meta={products.meta} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
