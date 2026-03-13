import { Link } from '@inertiajs/react';
import RatingStars from './RatingStars';
import { useTrans, useLocale } from '@/i18n';

const VendorCard = ({ vendor }) => {
    const t = useTrans();
    const locale = useLocale();
    const name = (locale === 'ar' && vendor.name_ar) ? vendor.name_ar : vendor.name;
    const description = (locale === 'ar' && vendor.description_ar) ? vendor.description_ar : vendor.description;

    return (
        <Link
            href={route('store.show', vendor.store_slug || vendor.id)}
            className="bg-card p-6 rounded-sm hover:shadow-lg transition-all duration-300 group border border-border/50 block"
        >
            <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center mb-4 font-display text-xl font-semibold group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                {vendor.avatar_url
                    ? <img src={vendor.avatar_url} alt={name} className="w-full h-full object-cover" />
                    : name?.charAt(0)}
            </div>
            <h3 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">{name}</h3>
            {description && (
                <p className="text-sm text-muted-foreground font-body mb-3 line-clamp-2">{description}</p>
            )}
            {vendor.rating > 0 && <RatingStars rating={vendor.rating} size={12} showValue />}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                {vendor.products_count !== undefined && (
                    <span className="text-xs font-body text-muted-foreground">{vendor.products_count} {t('home.products')}</span>
                )}
                <span className="text-xs font-body font-medium text-accent uppercase tracking-wider ms-auto">{t('home.visitStore')}</span>
            </div>
        </Link>
    );
};

export default VendorCard;
