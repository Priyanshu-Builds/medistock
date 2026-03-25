'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pill } from 'lucide-react'
import { ProductsTable } from './products-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/lib/hooks/use-user'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function MedicinesPage() {
    const { isStaff } = useUser()

    return (
        <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Medicines</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your medicine catalog and inventory
                        </p>
                    </div>
                </div>
                {isStaff ? (
                    <Button asChild className="shadow-md w-full sm:w-auto">
                        <Link href="/dashboard/products/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Medicine
                        </Link>
                    </Button>
                ) : (
                    <Button
                        onClick={() => toast.error('Only staff and above can add medicines')}
                        disabled
                        variant="secondary"
                        className="w-full sm:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Medicine
                    </Button>
                )}
            </div>

            <Suspense fallback={<MedicinesTableSkeleton />}>
                <ProductsTable />
            </Suspense>
        </motion.div>
    )
}

function MedicinesTableSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-[500px] rounded-xl" />
        </div>
    )
}
