import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from "@/utils/prisma"

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
    <Card>
      <CardHeader>
        <CardTitle>Top Producers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Total Beats</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducers.map((producer: any) => (
              <TableRow key={producer.id}>
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

