import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, reviews, size = 14, showValue = false, className = '' }) => (
    <div className={`flex items-center gap-1.5 ${className}`}>
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    size={size}
                    className={star <= Math.round(rating) ? 'fill-accent text-accent' : 'fill-transparent text-border'}
                />
            ))}
        </div>
        {showValue && <span className="text-sm font-body text-muted-foreground">{rating}</span>}
        {reviews !== undefined && <span className="text-sm font-body text-muted-foreground">({reviews})</span>}
    </div>
);

export default RatingStars;
