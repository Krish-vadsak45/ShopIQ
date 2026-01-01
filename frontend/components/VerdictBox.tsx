import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel } from "lucide-react";

interface Props {
  verdict: string;
}

export default function VerdictBox({ verdict }: Props) {
  return (
    <Card className="bg-blue-50/50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800">
          <Gavel className="mr-2 h-5 w-5" />
          Verdict
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium text-blue-900">{verdict}</p>
      </CardContent>
    </Card>
  );
}
