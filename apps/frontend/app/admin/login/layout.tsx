import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - CommerceBridge",
  description: "Sign in to your CommerceBridge admin dashboard",
};

export default function AdminLoginLayout({
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
