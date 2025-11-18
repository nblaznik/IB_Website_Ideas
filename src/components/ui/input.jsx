export function Input({ className = "", ...props }) {
  return <input {...props} className={`border rounded-xl px-3 py-2 text-sm w-full ${className}`} />;
}