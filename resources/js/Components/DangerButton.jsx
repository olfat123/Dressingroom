export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `border border-red-200 text-red-600 px-5 py-2 text-sm hover:bg-red-50 transition-colors disabled:opacity-50 ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
