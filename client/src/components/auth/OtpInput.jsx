// components/ui/OtpInput.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

export default function OtpInput({ digits = 6, value, onChange }) {
  const inputsRef = useRef([]);
  const [visible, setVisible] = useState(false);
  const [hiddenDigits, setHiddenDigits] = useState(Array(digits).fill(false));

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;

    const newValue = value.split("");
    newValue[index] = val[0];
    onChange(newValue.join(""));
    scheduleHide(index);
    if (index < digits - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;

    const newValue = value.split("");
    for (let i = 0; i < digits; i++) {
      newValue[i] = pasted[i] || "";
      scheduleHide(i);
    }
    onChange(newValue.join(""));
    const nextIndex = pasted.length >= digits ? digits - 1 : pasted.length;
    inputsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      } else if (index > 0) {
        const newValue = value.split("");
        newValue[index - 1] = "";
        onChange(newValue.join(""));
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const scheduleHide = (index) => {
    setHiddenDigits((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
    setTimeout(() => {
      setHiddenDigits((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });
    }, 500);
  };

  useEffect(() => {
    if (value.length === 0) {
      inputsRef.current[0]?.focus();
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex space-x-2">
        {Array.from({ length: digits }).map((_, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={
              visible || !hiddenDigits[i] ? value[i] || "" : value[i] ? "●" : ""
            }
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            ref={(el) => (inputsRef.current[i] = el)}
            className="w-10 h-12 text-center border border-zinc-300 rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-black"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="text-zinc-600 text-sm flex items-center gap-1 hover:underline"
      >
        {visible ? (
          <>
            <IoMdEyeOff /> Hide
          </>
        ) : (
          <>
            <IoEye /> Show
          </>
        )}
      </button>
    </div>
  );
}
