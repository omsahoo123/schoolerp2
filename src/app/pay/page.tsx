
import { Suspense } from 'react';
import PaymentForm from '@/components/erp/PaymentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function PaymentPageSkeleton() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Skeleton className="h-14 w-14 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-40 mx-auto" />
                    <Skeleton className="h-5 w-64 mx-auto mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <Skeleton className="h-11 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}


export default function PayPage() {
  return (
    <Suspense fallback={<PaymentPageSkeleton />}>
      <PaymentForm />
    </Suspense>
  );
}
