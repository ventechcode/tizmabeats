import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 col-span-4 sm:flex sm:flex-row sm:justify-between animate-pulse">
      <Card className="bg-crust border-none shadow-md sm:w-1/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-2 pb-2">
          <CardTitle className="w-20 h-4 bg-surface1 rounded-md"></CardTitle>
          <div className="h-4 w-4 bg-surface1 rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-10 bg-surface1 rounded-md"></div>
        </CardContent>
      </Card>
      <Card className="bg-crust border-none shadow-md sm:w-1/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-2 pb-2">
          <CardTitle className="w-20 h-4 bg-surface1 rounded-md"></CardTitle>
          <div className="h-4 w-4 bg-surface1 rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-10 bg-surface1 rounded-md"></div>
        </CardContent>
      </Card>
      <Card className="bg-crust border-none shadow-md sm:w-1/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-2 pb-2">
          <CardTitle className="w-20 h-4 bg-surface1 rounded-md"></CardTitle>
          <div className="h-4 w-4 bg-surface1 rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-10 bg-surface1 rounded-md"></div>
        </CardContent>
      </Card>
      <Card className="bg-crust border-none shadow-md sm:w-2/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-2 pb-2">
          <CardTitle className="w-24 h-4 bg-surface1 rounded-md"></CardTitle>
          <div className="h-4 w-4 bg-surface1 rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-14 bg-surface1 rounded-md"></div>
        </CardContent>
      </Card>
    </div>
  );
}
