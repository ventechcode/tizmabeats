import { cn } from "@/utils/cn"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className={cn("flex flex-col gap-4 xl:space-y-0 xl:grid xl:items-start xl:gap-8", className)} {...props}>
      {children}
    </div>
  )
}
