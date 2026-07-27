import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - CommerceBridge",
  description: "Create a new CommerceBridge account",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
