'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, GradientCard } from '@/components/ui/card'
import { 
    Pill, 
    DollarSign, 
    AlertTriangle, 
    TrendingUp, 
    Clock, 
    Package,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { format, differenceInDays } from 'date-fns'
import Image from 'next/image'
import { getFirstProductImage } from '@/lib/utils/product-images'
import { motion } from 'framer-motion'

interface DashboardStats {
    totalMedicines: number
    totalInventoryValue: number
    lowStockCount: number
    totalMovements: number
    expiringCount?: number
    outOfStockCount?: number
}

interface RecentMovement {
    id: string
    type: string
    quantity: number
    created_at: string
    product: {
        name: string
        sku: string
        image_url: string | null
        product_images?: Array<{ image_url: string; is_primary: boolean }> | { image_url: string; is_primary: boolean } | null
    }
    warehouse: {
        name: string
    }
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
}

export function DashboardContent() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [recentMovements, setRecentMovements] = useState<RecentMovement[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchDashboardData()

        // Subscribe to real-time updates
        const channel = supabase
            .channel('dashboard-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => {
                fetchDashboardData()
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, () => {
                fetchDashboardData()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchDashboardData = async () => {
        try {
            // Fetch total medicines
            const { count: medicinesCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true)

            // Fetch inventory value
            const { data: inventoryData } = await supabase
                .from('inventory')
                .select('total_quantity, product:products(cost_price)')

            const totalValue = inventoryData?.reduce((sum, item) => {
                const costPrice = (item.product as any)?.cost_price || 0
                return sum + (item.total_quantity * costPrice)
            }, 0) || 0

            // Fetch low stock alerts
            const { data: lowStockData } = await supabase
                .from('low_stock_alerts')
                .select('*')

            // Fetch total stock movements
            const { count: movementsCount } = await supabase
                .from('transactions')
                .select('*', { count: 'exact', head: true })

            // Fetch recent stock movements
            const { data: recentTrans } = await supabase
                .from('transactions')
                .select(`
          id,
          type,
          quantity,
          created_at,
          product:products(name, sku, image_url, product_images(image_url, is_primary)),
          warehouse:warehouses(name)
        `)
                .order('created_at', { ascending: false })
                .limit(8)

            setStats({
                totalMedicines: medicinesCount || 0,
                totalInventoryValue: totalValue,
                lowStockCount: lowStockData?.length || 0,
                totalMovements: movementsCount || 0,
            })

            setRecentMovements(recentTrans as any || [])
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <DashboardSkeleton />
    }

    const getMovementBadge = (type: string) => {
        const variants: Record<string, { variant: any; label: string }> = {
            restock: { variant: 'success', label: 'Stock In' },
            sale: { variant: 'warning', label: 'Stock Out' },
            return: { variant: 'info', label: 'Return' },
            adjustment: { variant: 'secondary', label: 'Adjustment' },
            transfer_in: { variant: 'success', label: 'Transfer In' },
            transfer_out: { variant: 'warning', label: 'Transfer Out' },
        }
        return variants[type] || { variant: 'secondary', label: type }
    }

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Page Header */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                    Welcome back! Here's your medicine inventory overview.
                </p>
            </motion.div>

            {/* Stats Cards with Gradients */}
            <motion.div 
                variants={itemVariants}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
                {/* Total Medicines */}
                <GradientCard variant="teal">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-white/80">Total Medicines</p>
                            <p className="text-3xl font-bold">{stats?.totalMedicines || 0}</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Pill className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/70">
                        <Activity className="h-3 w-3" />
                        <span>Active in catalog</span>
                    </div>
                </GradientCard>

                {/* Inventory Value */}
                <GradientCard variant="mint">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-white/80">Inventory Value</p>
                            <p className="text-3xl font-bold">
                                ${(stats?.totalInventoryValue || 0).toLocaleString('en-US', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                })}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/70">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>Total stock value</span>
                    </div>
                </GradientCard>

                {/* Low Stock Alerts */}
                <GradientCard variant="warning">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-white/80">Low Stock Alerts</p>
                            <p className="text-3xl font-bold">{stats?.lowStockCount || 0}</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center animate-pulse-soft">
                            <AlertTriangle className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/70">
                        <Clock className="h-3 w-3" />
                        <span>Below reorder level</span>
                    </div>
                </GradientCard>

                {/* Stock Movements */}
                <Card className="border-0 shadow-soft">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Stock Movements</p>
                                <p className="text-3xl font-bold text-foreground">{stats?.totalMovements || 0}</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                            <Package className="h-3 w-3" />
                            <span>All-time transactions</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Recent Stock Movements */}
            <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-soft">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Recent Stock Movements</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Latest inventory transactions
                                </p>
                            </div>
                            <Badge variant="secondary" className="hidden sm:flex">
                                {recentMovements.length} Recent
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentMovements.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Package className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground">
                                    No stock movements yet. Start by adding medicines and managing inventory.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentMovements.map((movement, index) => {
                                    const badge = getMovementBadge(movement.type)
                                    const product = movement.product as any
                                    const productImages = product?.product_images
                                        ? Array.isArray(product.product_images)
                                            ? product.product_images
                                            : [product.product_images]
                                        : []
                                    const displayImage = getFirstProductImage(productImages) || product?.image_url

                                    return (
                                        <motion.div
                                            key={movement.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors duration-200"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                {displayImage ? (
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/50 flex-shrink-0">
                                                        <Image
                                                            src={displayImage}
                                                            alt={product?.name || 'Medicine'}
                                                            fill
                                                            className="object-cover"
                                                            sizes="48px"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg border border-border/50 bg-muted flex items-center justify-center flex-shrink-0">
                                                        <Pill className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div className="space-y-1 flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-medium text-foreground truncate">
                                                            {product?.name || 'Unknown Medicine'}
                                                        </p>
                                                        <Badge variant={badge.variant as any} className="text-xs">
                                                            {badge.label}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="font-mono">SKU: {product?.sku || 'N/A'}</span>
                                                        <span>•</span>
                                                        <span>{(movement.warehouse as any)?.name || 'Unknown Location'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0 pl-4">
                                                <p className={`font-semibold ${
                                                    movement.type === 'sale' || movement.type === 'transfer_out' 
                                                        ? 'text-warning' 
                                                        : 'text-success'
                                                }`}>
                                                    {movement.type === 'sale' || movement.type === 'transfer_out' ? '-' : '+'}
                                                    {movement.quantity}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(new Date(movement.created_at), 'MMM d, h:mm a')}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>
            
            {/* Stats Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-36 rounded-xl" />
                ))}
            </div>
            
            {/* Table Skeleton */}
            <Skeleton className="h-96 rounded-xl" />
        </div>
    )
}
