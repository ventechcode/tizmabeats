import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from "@/utils/prisma"
import { Trophy } from "lucide-react"

export async function TopProducers() {
  const topProducers = await prisma.producer.findMany({
    take: 5,
    include: {
      _count: {
        select: { beats: true },
      },
    },
    orderBy: {
      beats: {
        _count: "desc",
      },
    },
  })

  return (
    <Card className="col-span-1 border-none bg-crust shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-2 pb-2 w-full">
        <CardTitle>Top Producers</CardTitle>
        <Trophy className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-subtext0">
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Total Beats</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducers.map((producer: any) => (
              <TableRow key={producer.id} className="text-subtext0 border-none">
                <TableCell>{producer.username}</TableCell>
                <TableCell>{`${producer.surname} ${producer.lastname}`}</TableCell>
                <TableCell>{producer._count.beats}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

