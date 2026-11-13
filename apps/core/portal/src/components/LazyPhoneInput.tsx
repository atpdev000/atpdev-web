"use client";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface LazyPhoneInputProps {
  id?: string;
  value?: string;
  onChange: (value?: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function LazyPhoneInput({ id, value, onChange, className, style }: LazyPhoneInputProps) {
  return (
    <PhoneInput
      id={id}
      international
      defaultCountry="PE"
      value={value}
      onChange={onChange}
      className={className}
      style={style}
    />
  );
}
