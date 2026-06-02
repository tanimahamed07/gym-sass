import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Settings, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description:
      "Create your account in less than 2 minutes. No credit card required.",
  },
  {
    icon: Settings,
    title: "Set Up Your Gym",
    description:
      "Add members, trainers, classes, and customize your gym profile.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description:
      "Use powerful analytics and automation to scale your gym operations.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in three simple steps and transform your gym management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-border" />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="text-center border-2">
                <CardContent className="pt-6">
                  <div className="mb-6 mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    {index + 1}
                  </div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
