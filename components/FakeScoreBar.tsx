import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  probability: number;
}

export default function FakeScoreBar({ probability }: Props) {
  const getColor = (prob: number) => {
    if (prob > 70) return "bg-red-500";
    if (prob > 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fake Review Probability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress
          value={probability}
          className="h-4"
          indicatorClassName={getColor(probability)}
        />
        <p className="text-sm text-muted-foreground text-right font-medium">
          {probability}% chance of fake reviews
        </p>
      </CardContent>
    </Card>
  );
}
