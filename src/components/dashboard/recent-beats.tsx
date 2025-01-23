import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from "@/utils/prisma"
import { Beat } from "@/types"

export async function RecentBeats() {
  const recentBeats = await prisma.beat.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { producer: true },
  })

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Beats</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Producer</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>BPM</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBeats.map((beat: any) => (
              <TableRow key={beat.id}>
                <TableCell>{beat.name}</TableCell>
                <TableCell>{beat.producer.username}</TableCell>
                <TableCell>{beat.genre}</TableCell>
                <TableCell>{beat.bpm}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

