import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  loading,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={loading}
      className="flex cursor-pointer items-center gap-2 rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-600 disabled:opacity-50"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
