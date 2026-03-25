'use client'

import { Suspense } from 'react'
import { StockTransfersTable } from './stock-transfers-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, ArrowLeftRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/lib/hooks/use-user'
import { toast } from 'sonner'

export default function StockTransfersPage() {
    const { isStaff } = useUser()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ArrowLeftRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Stock Transfers</h1>
                        <p className="text-sm text-muted-foreground">
                            Transfer inventory between warehouses
                        </p>
                    </div>
                </div>
                {isStaff ? (
                    <Button asChild className="shadow-md w-full sm:w-auto">
                        <Link href="/dashboard/stock-transfers/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Transfer
                        </Link>
                    </Button>
                ) : (
                    <Button
                        onClick={() => toast.error('Only staff and above can create stock transfers')}
                        disabled
                        variant="secondary"
                        className="w-full sm:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Transfer
                    </Button>
                )}
            </div>

            <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
                <StockTransfersTable />
            </Suspense>
        </div>
    )
}
