import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function SectionHeader({ heading, subtext, viewAllHref, viewAllLabel }) {
    return (
        <div className="flex items-end justify-between mb-12">
            <div>
                <h2 className="font-display text-3xl md:text-4xl">{heading}</h2>
                {subtext && <p className="mt-3 text-muted-foreground font-body">{subtext}</p>}
            </div>
            {viewAllHref && (
                <Link href={viewAllHref} className="font-body text-sm uppercase tracking-wider hover-gold-underline pb-1 flex items-center gap-2 hidden sm:flex">
                    {viewAllLabel} <ArrowRight className="w-3 h-3" />
                </Link>
            )}
        </div>
    );
}
