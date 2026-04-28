"use client";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
}: Props) {
  const base =
    "w-full py-2.5 rounded-xl font-medium transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}