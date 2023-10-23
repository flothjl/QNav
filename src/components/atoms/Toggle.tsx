import { PropsWithRef, forwardRef } from "react";

interface InputProps {
  label?: string;
}

const Toggle = forwardRef<HTMLInputElement, PropsWithRef<InputProps>>(
  ({ label }, ref) => {
    return (
      <div className="mb-3">
        <label className="relative inline-flex w-max cursor-pointer items-center align-middle">
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
          />
          <div className="peer h-6 w-11 rounded-full bg-primary-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:bg-secondary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
          <span className="ml-3 text-sm">
            {label}
          </span>
        </label>
      </div>
    );
  }
);

export default Toggle;
