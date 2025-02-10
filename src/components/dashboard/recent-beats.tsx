import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/utils/prisma";
import { Clock } from "lucide-react";

export async function RecentBeats() {
  const recentBeats = await prisma.beat.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { producer: true, licenses: { include: { licenseOption: true}} },
  });

  return (
    <Card className="col-span-4 border-none bg-crust shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-2 pb-2 w-full">
        <CardTitle>Recent Beats</CardTitle>
        <Clock className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-subtext0">
              <TableHead>Name</TableHead>
              <TableHead>Licenses</TableHead>
              <TableHead>Producer</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>BPM</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBeats.map((beat: any) => (
              <TableRow key={beat.id} className="text-subtext0 border-none">
                <TableCell>{beat.name}</TableCell>
                <TableCell>{beat.licenses.map((l: any) => l?.licenseOption?.name).join(',')}</TableCell>
                <TableCell>{beat.producer.username}</TableCell>
                <TableCell>{beat.genre}</TableCell>
                <TableCell>{beat.bpm}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
