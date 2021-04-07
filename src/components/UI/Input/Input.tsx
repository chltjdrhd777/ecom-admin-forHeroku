import React from "react";
import { Form } from "react-bootstrap";

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e?: any) => any;
}

export default function Input({ label, type, placeholder, value, onChange }: InputProps) {
  return (
    <Form.Group>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control type={type} placeholder={placeholder} value={value} onChange={onChange} />
    </Form.Group>
  );
}
