export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
