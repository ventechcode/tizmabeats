import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="gap-2">
      </CardHeader>
      <CardContent className="h-10" />
      <CardFooter>
      </CardFooter>
    </Card>
  )
}

