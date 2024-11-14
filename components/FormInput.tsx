"use client";

import React from "react";
import { useController, Control, FieldError } from "react-hook-form";
import { Input } from "@/components/ui/input"; // import from shadcn/ui

interface FormInputProps {
    name: string;
    control: Control;
    label?: string;
    placeholder?: string;
    type?: string;
    error?: FieldError;
}

const FormInput: React.FC<FormInputProps> = ({
    name,
    control,
    label,
    placeholder = "",
    type = "text",
    error,
}) => {
    // Use the useController hook to connect the input to react-hook-form
    const { field } = useController({
        name,
        control,
    });

    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <Input
                id={name}
                {...field}
                placeholder={placeholder}
                type={type}
                className={`mt-1 block w-full ${
                    error ? "border-red-500" : "bg-slate-950"
                }`}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
        </div>
    );
};

export default FormInput;
