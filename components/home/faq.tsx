import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the free trial work?",
    answer:
      "You get full access to all features for 14 days. No credit card required. After the trial, choose a plan that fits your needs or continue with our free plan.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes! You can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your data will remain accessible for 30 days after cancellation.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use bank-level encryption (SSL/TLS) to protect your data. All data is backed up daily and stored in secure data centers with 99.9% uptime.",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes! All plans include email support. Pro and Enterprise plans get priority support and access to our dedicated success team.",
  },
  {
    question: "Can I import my existing member data?",
    answer:
      "Yes, we provide easy data import tools. Our team can also help with migration from other systems at no additional cost.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, and bank transfers. For Enterprise plans, we also offer invoicing.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-muted/50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Have questions? We have answers.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={index.toString()}
                className="border rounded-lg px-6 bg-background"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
