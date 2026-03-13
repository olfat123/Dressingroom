import { X, Search } from 'lucide-react';
import { useTrans } from '@/i18n';

function FilterField({ label, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-xs font-body font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
            {children}
        </div>
    );
}

function FilterSelect({ value, onChange, children }) {
    return (
        <select
            className="w-full border border-border px-3 py-2 font-body text-sm bg-background focus:outline-none focus:border-accent rounded-sm"
            value={value}
            onChange={e => onChange(e.target.value)}
        >
            {children}
        </select>
    );
}

export default function ProductFilterPanel({
    search,        onSearchChange,
    departmentId,  onDepartmentChange,
    categoryId,    onCategoryChange,
    storeId,       onStoreChange,
    minPrice,      onMinPriceChange,
    maxPrice,      onMaxPriceChange,
    departments,
    categories,
    stores = [],
    activeFilterCount,
    onClearAll,
}) {
    const t = useTrans();

    return (
        <div className="flex flex-col gap-5">
            {/* Search */}
            <FilterField label={t('filter.search')}>
                <div className="relative">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    <input
                        type="text"
                        className="w-full border border-border ps-8 pe-3 py-2 font-body text-sm bg-background focus:outline-none focus:border-accent rounded-sm"
                        placeholder={t('filter.search_placeholder')}
                        value={search}
                        onChange={e => onSearchChange(e.target.value)}
                    />
                </div>
            </FilterField>

            <div className="border-t border-border" />

            {/* Department */}
            <FilterField label={t('filter.department')}>
                <FilterSelect value={departmentId} onChange={onDepartmentChange}>
                    <option value="">{t('filter.all_departments')}</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </FilterSelect>
            </FilterField>

            {/* Category */}
            <FilterField label={t('filter.category')}>
                <FilterSelect value={categoryId} onChange={onCategoryChange}>
                    <option value="">{t('filter.all_categories')}</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </FilterSelect>
            </FilterField>

            {/* Store */}
            {stores.length > 0 && (
                <FilterField label={t('filter.store')}>
                    <FilterSelect value={storeId} onChange={onStoreChange}>
                        <option value="">{t('filter.all_stores')}</option>
                        {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </FilterSelect>
                </FilterField>
            )}

            <div className="border-t border-border" />

            {/* Price Range */}
            <FilterField label={t('filter.price_range')}>
                <div className="flex gap-2">
                    <input
                        type="number"
                        className="w-full border border-border px-3 py-2 font-body text-sm bg-background focus:outline-none focus:border-accent rounded-sm"
                        placeholder={t('filter.min')}
                        min={0}
                        value={minPrice}
                        onChange={e => onMinPriceChange(e.target.value)}
                    />
                    <input
                        type="number"
                        className="w-full border border-border px-3 py-2 font-body text-sm bg-background focus:outline-none focus:border-accent rounded-sm"
                        placeholder={t('filter.max')}
                        min={0}
                        value={maxPrice}
                        onChange={e => onMaxPriceChange(e.target.value)}
                    />
                </div>
            </FilterField>

            {/* Clear all */}
            {activeFilterCount > 0 && (
                <>
                    <div className="border-t border-border" />
                    <button onClick={onClearAll} className="flex items-center gap-1.5 text-sm font-body text-destructive hover:underline">
                        <X className="w-3.5 h-3.5" />
                        {t('shop.clear_filters')}
                    </button>
                </>
            )}
        </div>
    );
}
