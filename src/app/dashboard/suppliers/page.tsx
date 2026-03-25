'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'
import { SuppliersTable } from './suppliers-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/lib/hooks/use-user'
import { toast } from 'sonner'

export default function SuppliersPage() {
    const { isManager } = useUser()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Suppliers</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your supplier relationships
                        </p>
                    </div>
                </div>
                {isManager ? (
                    <Button asChild className="shadow-md w-full sm:w-auto">
                        <Link href="/dashboard/suppliers/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Supplier
                        </Link>
                    </Button>
                ) : (
                    <Button
                        onClick={() => toast.error('Only managers can create suppliers')}
                        disabled
                        variant="secondary"
                        className="w-full sm:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Supplier
                    </Button>
                )}
            </div>

            <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
                <SuppliersTable />
            </Suspense>
        </div>
    )
}
