import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - CommerceBridge",
  description: "Sign in to your CommerceBridge account",
};

export default function LoginLayout({
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
