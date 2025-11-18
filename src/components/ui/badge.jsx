export function Badge({ children, className = "" }) {
  return <span className={`bg-gray-100 border px-2 py-1 rounded-lg text-xs ${className}`}>{children}</span>;
}