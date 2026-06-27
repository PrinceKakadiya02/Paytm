"use client";

type TextInputProps = {
  placeholder: string;
  onChange: (value: string) => void;
  label: string;
  value?: string;
  type?: "text" | "number" | "password" | "email";
  disabled?: boolean;
};

export const TextInput = ({
  placeholder,
  onChange,
  label,
  value,
  type = "text",
  disabled = false,
}: TextInputProps) => {
  return (
    <div className="pt-2">
      <label className="mb-2 block text-sm font-medium text-gray-900">
        {label}
      </label>

      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      />
    </div>
  );
};