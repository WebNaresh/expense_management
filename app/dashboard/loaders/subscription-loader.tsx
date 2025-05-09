import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionLoader() {
  return (
    <Card className="border-2 hover:border-primary/20 transition-colors duration-300">
      <CardHeader className="p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <Skeleton className="h-9 w-32" />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
