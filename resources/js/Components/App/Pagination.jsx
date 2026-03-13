import { Link } from '@inertiajs/react';

export default function Pagination({ meta, className = '' }) {
    if (!meta || meta.last_page <= 1) return null;

    return (
        <div className={`mt-10 flex justify-center gap-2 flex-wrap ${className}`}>
            {meta.links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url ?? '#'}
                    className={`inline-flex items-center justify-center w-9 h-9 text-sm font-body border transition-colors rounded-sm ${
                        link.active
                            ? 'bg-primary text-primary-foreground border-primary'
                            : !link.url
                            ? 'text-muted-foreground border-border opacity-40 pointer-events-none'
                            : 'border-border hover:border-accent hover:text-accent'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

