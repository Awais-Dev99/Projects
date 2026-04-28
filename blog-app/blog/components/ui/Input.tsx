"use client";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  type?: string;
};

export default function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full 
          px-4 py-2 
          rounded-xl 
          border border-gray-300 
          bg-white
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          focus:border-transparent
          transition
        "
      />
    </div>
  );
}