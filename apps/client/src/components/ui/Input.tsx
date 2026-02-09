import type { InputHTMLAttributes } from "react";

export default function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md bg-[#020617] border border-slate-600 px-3 py-2 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 outline-none ${className}`}
    />
  );
}
