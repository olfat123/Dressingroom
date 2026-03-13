import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTrans } from '@/i18n';

const SearchBar = ({ variant = 'header', onClose }) => {
    const t = useTrans();
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        router.get(route('shop'), { search: query.trim() });
        onClose?.();
    };

    const isHero = variant === 'hero';

    return (
        <form onSubmit={handleSubmit} className={`relative ${isHero ? 'w-full max-w-lg' : 'w-full'}`}>
            <div className={`flex items-center gap-3 border bg-background ${isHero ? 'border-border/50 px-5 py-3.5 shadow-sm' : 'border-border px-4 py-2.5'}`}>
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={t('hero.searchPlaceholder') || 'Search products...'}
                    className="flex-1 bg-transparent font-body text-sm focus:outline-none placeholder:text-muted-foreground/60"
                />
                {query && (
                    <button type="button" onClick={() => setQuery('')}>
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                )}
            </div>
        </form>
    );
};

export default SearchBar;
