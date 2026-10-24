import { useState } from 'react';
import { iconEye } from '../assets/auth-images';

export default function FormField({
  label,
  icon,
  type = 'text',
  placeholder,
  toggleablePassword = false,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && visible ? 'text' : type;

  return (
    <label className="flex w-full flex-col gap-1">
      <span className="px-1 font-body text-xs font-medium uppercase tracking-[0.6px] text-brand-text">
        {label}
      </span>
      <span className="relative flex w-full items-center">
        {icon && (
          <img src={icon} alt="" className="pointer-events-none absolute left-[12px] h-4 w-4 opacity-70" />
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-[#e4beb9] bg-brand-bg py-3 text-base sm:py-[15px] sm:text-sm text-brand-ink placeholder:text-gray-500 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red ${
            icon ? 'pl-[41px]' : 'pl-4'
          } ${isPassword && toggleablePassword ? 'pr-10' : 'pr-4'}`}
          {...props}
        />
        {isPassword && toggleablePassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-[12px] flex items-center justify-center"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            <img src={iconEye} alt="" className="h-[13px] w-[18px] opacity-70" />
          </button>
        )}
      </span>
    </label>
  );
}
