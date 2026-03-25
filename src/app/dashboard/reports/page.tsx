'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InventoryValuation } from './inventory-valuation'
import { StockMovement } from './stock-movement'
import { LowStockAlerts } from './low-stock-alerts'
import { SalesAnalytics } from './sales-analytics'
import { PurchaseAnalytics } from './purchase-analytics'
import { BarChart3 } from 'lucide-react'

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
                    <p className="text-sm text-muted-foreground">
                        View detailed reports and analytics for your inventory
                    </p>
                </div>
            </div>

            <Tabs defaultValue="valuation" className="space-y-4">
                <div className="overflow-x-auto">
                    <TabsList>
                        <TabsTrigger value="valuation">Inventory Valuation</TabsTrigger>
                        <TabsTrigger value="movement">Stock Movement</TabsTrigger>
                        <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
                        <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
                        <TabsTrigger value="purchases">Purchase Analytics</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="valuation">
                    <InventoryValuation />
                </TabsContent>

                <TabsContent value="movement">
                    <StockMovement />
                </TabsContent>

                <TabsContent value="low-stock">
                    <LowStockAlerts />
                </TabsContent>

                <TabsContent value="sales">
                    <SalesAnalytics />
                </TabsContent>

                <TabsContent value="purchases">
                    <PurchaseAnalytics />
                </TabsContent>
            </Tabs>
        </div>
    )
}
