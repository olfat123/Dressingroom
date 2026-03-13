const PriceTag = ({ price, originalPrice, size = 'md', currency = '' }) => {
    const textSize = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' }[size];
    const origSize = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[size];

    const fmt = (v) => currency ? `${currency}${v}` : v;

    return (
        <div className="flex items-center gap-2">
            <span className={`font-body ${textSize} font-medium`}>{fmt(price)}</span>
            {originalPrice && (
                <span className={`font-body ${origSize} text-muted-foreground line-through`}>{fmt(originalPrice)}</span>
            )}
            {originalPrice && (
                <span className="text-xs font-body font-medium text-accent px-1.5 py-0.5 bg-accent/10 rounded-sm">
                    -{Math.round((1 - price / originalPrice) * 100)}%
                </span>
            )}
        </div>
    );
};

export default PriceTag;
