export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={'bg-primary text-primary-foreground px-5 py-2 text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 ' + className}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
