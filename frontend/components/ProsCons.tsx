import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  pros: string[];
  cons: string[];
}

export default function ProsCons({ pros, cons }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Pros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start text-green-800">
                <span className="mr-2 mt-1">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <XCircle className="mr-2 h-5 w-5" />
            Cons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start text-red-800">
                <span className="mr-2 mt-1">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
