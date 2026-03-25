'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, ArrowDownToLine } from 'lucide-react'
import { PurchaseOrdersTable } from './purchase-orders-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/lib/hooks/use-user'
import { toast } from 'sonner'

export default function PurchaseOrdersPage() {
    const { isStaff } = useUser()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ArrowDownToLine className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Purchase Orders</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your purchase orders and inventory restocking
                        </p>
                    </div>
                </div>
                {isStaff ? (
                    <Button asChild className="shadow-md w-full sm:w-auto">
                        <Link href="/dashboard/purchase-orders/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Purchase Order
                        </Link>
                    </Button>
                ) : (
                    <Button
                        onClick={() => toast.error('Only staff and above can create purchase orders')}
                        disabled
                        variant="secondary"
                        className="w-full sm:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Purchase Order
                    </Button>
                )}
            </div>

            <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
                <PurchaseOrdersTable />
            </Suspense>
        </div>
    )
}
