import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Gym Owner, FitLife Gym",
    content:
      "GymSaaS transformed how we run our gym. Member management is now a breeze, and our revenue has increased by 30% in just 6 months.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Fitness Center Director",
    content:
      "The attendance tracking with QR codes is brilliant. Our members love it, and it saves us so much time every day.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Studio Owner, Yoga Haven",
    content:
      "Best investment we made for our studio. The class scheduling and payment processing features are exactly what we needed.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Loved by Gym Owners
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our customers have to say about GymSaaS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
