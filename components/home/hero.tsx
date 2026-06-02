import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-6">
            🎉 <span className="ml-2">Now with AI-powered insights</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            Manage Your Gym
            <span className="text-primary"> Effortlessly</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            All-in-one gym management software. Handle memberships, attendance,
            payments, classes, and more from a single powerful platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Pricing
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
              Cancel anytime
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-30">
          <div className="aspect-square w-[800px] bg-gradient-to-r from-primary to-purple-600 rounded-full" />
        </div>
      </div>
    </section>
  );
}
