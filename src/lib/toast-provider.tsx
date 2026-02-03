"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#fff",
          color: "#000",
          borderRadius: "8px",
          fontSize: "0.9rem",
        },
        success: {
          iconTheme: { primary: "#2563eb", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#dc2626", secondary: "#fff" },
        },
      }}
    />
  );
}