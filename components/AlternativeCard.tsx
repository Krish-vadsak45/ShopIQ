import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface Alternative {
  productName: string;
  reason: string;
}

interface Props {
  alternative: Alternative;
}

export default function AlternativeCard({ alternative }: Props) {
  return (
    <Card className="bg-yellow-50/50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center text-yellow-800">
          <Lightbulb className="mr-2 h-5 w-5" />
          Better Alternative
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-bold text-yellow-900 mb-2">
          {alternative.productName}
        </h3>
        <p className="text-yellow-800">{alternative.reason}</p>
      </CardContent>
    </Card>
  );
}
