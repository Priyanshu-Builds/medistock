import { Suspense } from 'react'
import { InventoryTable } from './inventory-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Warehouse } from 'lucide-react'

export default function InventoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Warehouse className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
                    <p className="text-sm text-muted-foreground">
                        View and manage stock levels across all warehouses
                    </p>
                </div>
            </div>

            <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
                <InventoryTable />
            </Suspense>
        </div>
    )
}
