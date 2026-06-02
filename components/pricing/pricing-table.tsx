"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { planService } from "@/src/services";
import type { Plan } from "@/src/services/plan.service";

// Static fallback plans
const fallbackPlans = [
  {
    name: "Basic",
    price: "29",
    description: "Perfect for small gyms and studios",
    badge: null,
    features: [
      "Up to 100 members",
      "Member management",
      "Attendance tracking",
      "Basic reports",
      "Email support",
      "Mobile app access",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "79",
    description: "Best for growing fitness businesses",
    badge: "Most Popular",
    features: [
      "Up to 500 members",
      "Everything in Basic",
      "Class scheduling",
      "Payment processing",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large gyms and chains",
    badge: null,
    features: [
      "Unlimited members",
      "Everything in Pro",
      "Multiple locations",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security",
      "SLA guarantee",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export function PricingTable() {
  const [plans, setPlans] = useState<any[]>(fallbackPlans);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from API
        const response = await planService.getPlans();

        if (response.success && response.data && response.data.length > 0) {
          // Transform API plans to display format
          const apiPlans = response.data
            .filter((plan: Plan) => plan.status === "active")
            .map((plan: Plan, index: number) => ({
              name: plan.name,
              price: plan.price.toString(),
              description: plan.description || "",
              badge: index === 1 ? "Most Popular" : null,
              features: plan.features || [],
              cta: "Start Free Trial",
              highlighted: index === 1,
              currency: plan.currency,
              duration: plan.duration,
              durationType: plan.durationType,
            }));

          if (apiPlans.length > 0) {
            setPlans(apiPlans);
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch plans:", err);
        setError(err.message);
        // Keep using fallback plans
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your needs. All plans include a 14-day
            free trial.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${
                    plan.highlighted
                      ? "border-primary border-2 shadow-lg scale-105"
                      : "border-2"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="px-3 py-1">{plan.badge}</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-6">
                      {plan.price === "Custom" ? (
                        <div className="text-4xl font-bold">Custom</div>
                      ) : (
                        <>
                          <div className="text-4xl font-bold">
                            ${plan.price}
                            <span className="text-lg font-normal text-muted-foreground">
                              /
                              {plan.durationType === "months"
                                ? "month"
                                : plan.durationType || "month"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Billed{" "}
                            {plan.durationType === "months"
                              ? "monthly"
                              : plan.durationType || "monthly"}
                          </p>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={plan.price === "Custom" ? "/contact" : "/register"}
                      className="block"
                    >
                      <Button
                        className="w-full"
                        variant={plan.highlighted ? "default" : "outline"}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-muted-foreground">
                All plans include 14-day free trial. No credit card required.{" "}
                <Link
                  href="/contact"
                  className="text-primary hover:underline font-medium"
                >
                  Need help choosing?
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
