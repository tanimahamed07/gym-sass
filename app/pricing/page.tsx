import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PricingTable } from "@/components/pricing/pricing-table";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PricingTable />
      </main>
      <Footer />
    </div>
  );
}
