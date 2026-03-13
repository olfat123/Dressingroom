import { Heart } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';

const WishlistButton = ({ productId, className = '', size = 20 }) => {
    const { wishlistedProductIds = [], auth } = usePage().props;
    const isWishlisted = wishlistedProductIds.includes(productId);
    const form = useForm({});

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth?.user) {
            window.location.href = route('login');
            return;
        }
        form.post(route('account.wishlist.toggle', productId), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <button
            onClick={handleClick}
            className={`transition-all duration-200 hover:scale-110 ${className}`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart
                size={size}
                className={`transition-colors ${isWishlisted ? 'fill-accent text-accent' : 'text-muted-foreground hover:text-accent'}`}
            />
        </button>
    );
};

export default WishlistButton;
