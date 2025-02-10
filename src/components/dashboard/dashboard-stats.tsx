import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Music,
  ShoppingCart,
  Users,
  Euro,
} from "lucide-react";
import { getDashboardStats } from "@/app/actions";

export async function DashboardStats() {
  const { totalBeats, totalOrders, totalUsers, totalRevenue } =
    await getDashboardStats();

  return (
    <div className="grid grid-cols-2 gap-4 col-span-4 sm:flex sm:flex-row sm:justify-between">
      <Card className="bg-crust border-none shadow-md sm:w-1/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-3 sm:space-x-2 pb-2">
          <CardTitle className="font-medium">Total Beats</CardTitle>
          <Music className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBeats}</div>
        </CardContent>
      </Card>
      <Card className="bg-crust border-none shadow-md sm:w-1/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-2 pb-2">
          <CardTitle className="font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
        </CardContent>
      </Card>
      <Card className="bg-crust border-none shadow-md sm:w-1/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-2 pb-2">
          <CardTitle className="font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </CardContent>
      </Card>
      <Card className="bg-crust border-none shadow-md sm:w-2/5"> 
        <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-2 pb-2">
          <CardTitle className="font-medium">Total Revenue</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalRevenue._sum.total?.toFixed(2).replace(".", ",") || "0,00"}€
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
