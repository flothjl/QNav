import clsx from "clsx";
import { PropsWithRef, useState, forwardRef } from "react";

interface InputProps {
  label?: string;
  error?: boolean | string;
}

const Input = forwardRef<HTMLInputElement, PropsWithRef<InputProps>>(
  ({ label, error }, ref) => {
    const inputClass = clsx(
      "w-full rounded bg-primary-500 px-3 py-2 mt-1 focus:outline-none",
      error ? "border-2 border-red-500" : ""
    );
    return (
      <div className="mb-2">
        <label className="block">
          {label}
          <input ref={ref} type="text" className={inputClass} />
        </label>
        {error && typeof error === "string" && <div className="text-xs text-red-500">{error}</div>}
      </div>
    );
  }
);

export default Input;
