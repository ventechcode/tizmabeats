import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from "@/utils/prisma"
import { Clock } from "lucide-react"

export async function RecentOrders() {
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  })

  return (
    <Card className="col-span-3 border-none bg-crust shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-2 pb-2 w-full">
        <CardTitle>Recent Orders</CardTitle>
        <Clock  className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-subtext0">
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order: any) => (
              <TableRow key={order.id} className="text-subtext0 border-none">
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{order.total.toFixed(2).replace('.', ',')}€</TableCell>
                <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

