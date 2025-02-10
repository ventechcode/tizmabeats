import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DashboardTableSkeleton({
  rows,
  columns,
  className,
}: {
  rows: number;
  columns: number;
  className?: string;
}) {
  return (
    <Card
      className={`border-none bg-crust shadow-md ${className} animate-pulse`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-2 pb-2 w-full">
        <CardTitle className="h-4 w-24 bg-surface1 rounded-md"></CardTitle>
        <div className="h-4 w-4 bg-surface1 rounded-md" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-surface1">
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index}>
                  <div className="h-5 w-24 bg-surface1 rounded-md"></div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index} className="border-none">
                {Array.from({ length: columns }).map((_, index) => (
                  <TableCell key={index}>
                    <div className="h-5 w-12 bg-surface1 rounded-md" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
