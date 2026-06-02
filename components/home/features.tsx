import {
  Users,
  Calendar,
  CreditCard,
  UserCheck,
  BarChart3,
  Bell,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "Member Management",
    description:
      "Easily manage member profiles, track memberships, and handle renewals.",
  },
  {
    icon: Calendar,
    title: "Class Scheduling",
    description:
      "Create and manage classes, assign trainers, and track enrollments.",
  },
  {
    icon: CreditCard,
    title: "Payment Processing",
    description:
      "Accept payments, generate invoices, and track revenue effortlessly.",
  },
  {
    icon: UserCheck,
    title: "Attendance Tracking",
    description:
      "QR code check-ins, manual logging, and real-time attendance reports.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Comprehensive insights into your gym performance and member behavior.",
  },
  {
    icon: Bell,
    title: "Announcements",
    description:
      "Communicate with members through instant notifications and updates.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything You Need to Run Your Gym
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to simplify gym management and grow your
            business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary transition-colors"
            >
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
