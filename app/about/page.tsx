import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Target, Users, Zap } from "lucide-react";

const team = [
  {
    name: "John Smith",
    role: "CEO & Founder",
    bio: "10+ years in fitness industry",
  },
  {
    name: "Sarah Johnson",
    role: "CTO",
    bio: "Former Google engineer",
  },
  {
    name: "Mike Chen",
    role: "Head of Product",
    bio: "Product leader at top SaaS companies",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Customer Success",
    bio: "Dedicated to customer satisfaction",
  },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To empower gym owners with the best technology to grow their business and serve their members better.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "We build our product based on customer feedback and are committed to their success.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We constantly innovate to bring the latest technology to the fitness industry.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                About GymSaaS
              </h1>
              <p className="text-xl text-muted-foreground">
                We&apos;re on a mission to revolutionize gym management with
                powerful, easy-to-use software that helps fitness businesses
                thrive.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  GymSaaS was founded in 2020 by a team of fitness enthusiasts
                  and tech professionals who saw firsthand the challenges gym
                  owners face in managing their businesses.
                </p>
                <p>
                  After spending years in the fitness industry, we realized that
                  most gym management software was either too complex, too
                  expensive, or simply didn&apos;t meet the needs of modern
                  fitness businesses.
                </p>
                <p>
                  So we set out to build something better. Today, GymSaaS serves
                  thousands of gyms worldwide, helping them streamline
                  operations, engage members, and grow their revenue.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="text-center border-2">
                  <CardContent className="pt-6">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground">
                Passionate people building the future of gym management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarFallback className="text-2xl">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
