import { useState, useEffect } from "react";
import CurrencyFormatter from "@/Components/CurrencyFormatter";
import { Link, router } from "@inertiajs/react";
import { X, Minus, Plus } from "lucide-react";
import { productRoute } from '@/Helper';
import { useTrans } from '@/i18n';

export default function CartItem({ item }) {
    const [qty, setQty] = useState(item.quantity);
    const [error, setError] = useState('');
    const t = useTrans();

    useEffect(() => {
        setQty(item.quantity);
    }, [item.quantity]);

    const updateQuantity = (newQty) => {
        const parsed = parseInt(newQty, 10);
        if (isNaN(parsed) || parsed < 1) return;
        setQty(parsed);
        setError('');
        router.put(route('cart.update', item.product_id), {
            quantity: parsed,
            option_ids: item.option_ids,
        }, {
            preserveScroll: true,
            onError: (errors) => {
                setQty(item.quantity);
                setError(Object.values(errors)[0] || 'An error occurred.');
            },
        });
    };

    const onDeleteClick = () => {
        router.delete(route('cart.destroy', item.product_id), {
            data: { cart_item_id: item.id, option_ids: item.option_ids },
            preserveScroll: true,
        });
    };

    return (
        <div className="flex gap-4 md:gap-6 pb-6 border-b border-border/50">
            <Link href={productRoute(item)} className="w-20 h-28 md:w-24 md:h-32 bg-muted flex items-center justify-center shrink-0 rounded-sm overflow-hidden">
                {item.image
                    ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    : <span className="font-display text-xs text-muted-foreground text-center px-2">{item.title}</span>
                }
            </Link>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <Link href={productRoute(item)} className="font-display text-base hover:text-accent transition-colors">{item.title}</Link>
                        {(item.options || []).map(option => (
                            <p key={option.id} className="text-xs font-body text-muted-foreground mt-0.5">
                                {option.type?.name}: {option.name}
                            </p>
                        ))}
                    </div>
                    <button onClick={onDeleteClick} className="text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5">
                        <X size={16} />
                    </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-border rounded-sm">
                        <button
                            type="button"
                            className="p-2 hover:bg-muted transition-colors disabled:opacity-30"
                            onClick={() => updateQuantity(qty - 1)}
                            disabled={qty <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-body text-sm">{qty}</span>
                        <button
                            type="button"
                            className="p-2 hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(qty + 1)}
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    <span className="font-body font-medium">
                        <CurrencyFormatter amount={item.price * qty} />
                    </span>
                </div>
                {error && <p className="text-xs text-destructive mt-1 font-body">{error}</p>}
            </div>
        </div>
    );
}

