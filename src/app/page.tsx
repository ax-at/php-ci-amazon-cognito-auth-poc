import AuthStatus from "@/components/AuthStatus";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Next.js Cognito Auth</h1>
      <AuthStatus />
    </main>
  );
} 