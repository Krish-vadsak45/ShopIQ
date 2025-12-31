import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Search, ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">
            Shop<span className="text-indigo-600">IQ</span>
          </h1>
          <p className="text-2xl text-gray-600 font-light">
            Detect Fake Reviews. Buy Smarter.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
            <CardContent className="pt-6">
              <Search className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Analyze Reviews</h3>
              <p className="text-gray-600">
                Paste product reviews to instantly detect patterns of fake or
                generated content.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
            <CardContent className="pt-6">
              <ShieldCheck className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Get Verdicts</h3>
              <p className="text-gray-600">
                Receive a clear verdict on whether the product reviews are
                trustworthy.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
            <CardContent className="pt-6">
              <ShoppingBag className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Find Alternatives</h3>
              <p className="text-gray-600">
                Discover better alternative products if the current one is
                suspicious.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="pt-8">
          <Link href="/analyze">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-indigo-600 hover:bg-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Analyzing Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
