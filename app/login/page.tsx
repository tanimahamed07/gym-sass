import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Dumbbell } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GymSaaS</span>
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
