'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/input'
import { Badge, StatusBadge, MedicineCategoryBadge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/use-user'
import { 
    MoreHorizontal, 
    Edit, 
    Trash2, 
    Eye, 
    Pill,
    Package,
    AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { getFirstProductImage } from '@/lib/utils/product-images'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { motion } from 'framer-motion'

interface Medicine {
    id: string
    sku: string
    name: string
    image_url: string | null
    category: { name: string } | null
    unit_price: number
    cost_price: number
    is_active: boolean
    reorder_level: number
    product_images?: Array<{ image_url: string; is_primary: boolean }>
}

export function ProductsTable() {
    const [medicines, setMedicines] = useState<Medicine[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()
    const { isManager } = useUser()

    useEffect(() => {
        fetchMedicines()
    }, [])

    const fetchMedicines = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
          id,
          sku,
          name,
          image_url,
          unit_price,
          cost_price,
          is_active,
          reorder_level,
          category:categories(name),
          product_images(image_url, is_primary)
        `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setMedicines(data as any || [])
        } catch (error: any) {
            toast.error('Failed to load medicines')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return

        if (!isManager) {
            toast.error('You do not have permission to delete medicines')
            setDeleteId(null)
            return
        }

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', deleteId)

            if (error) throw error

            toast.success('Medicine deleted successfully')
            setMedicines(medicines.filter((m) => m.id !== deleteId))
            setDeleteId(null)
        } catch (error: any) {
            toast.error('Failed to delete medicine')
            console.error(error)
        }
    }

    const filteredMedicines = medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Loading medicines...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="w-full max-w-sm">
                    <SearchInput
                        placeholder="Search medicines by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{filteredMedicines.length} medicines</span>
                </div>
            </div>

            {/* Medicine Table */}
            <Card className="border-0 shadow-soft overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-[60px] font-semibold">Image</TableHead>
                            <TableHead className="font-semibold">SKU</TableHead>
                            <TableHead className="font-semibold">Medicine Name</TableHead>
                            <TableHead className="font-semibold">Category</TableHead>
                            <TableHead className="font-semibold">Unit Price</TableHead>
                            <TableHead className="font-semibold">Cost Price</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMedicines.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-48">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                            <Pill className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-lg font-medium text-foreground mb-1">No medicines found</p>
                                        <p className="text-sm text-muted-foreground">
                                            {searchTerm 
                                                ? 'Try adjusting your search terms' 
                                                : 'Add your first medicine to get started'}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMedicines.map((medicine: any, index) => {
                                const productImages = Array.isArray(medicine.product_images)
                                    ? medicine.product_images
                                    : medicine.product_images
                                        ? [medicine.product_images]
                                        : []
                                const displayImage = getFirstProductImage(productImages) || medicine.image_url

                                return (
                                    <motion.tr
                                        key={medicine.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="group border-b border-border/50 hover:bg-accent/30 transition-colors duration-200"
                                    >
                                        <TableCell>
                                            {displayImage ? (
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/50 group-hover:border-primary/30 transition-colors">
                                                    <Image
                                                        src={displayImage}
                                                        alt={medicine.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg border border-border/50 bg-muted/50 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                                                    <Pill className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-muted-foreground">
                                            {medicine.sku}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-foreground">{medicine.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            {(medicine.category as any)?.name ? (
                                                <MedicineCategoryBadge category={(medicine.category as any).name} />
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ${medicine.unit_price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            ${medicine.cost_price.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge 
                                                status={medicine.is_active ? 'in-stock' : 'out-of-stock'}
                                            >
                                                {medicine.is_active ? 'Active' : 'Inactive'}
                                            </StatusBadge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon-sm"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => router.push(`/dashboard/products/${medicine.id}`)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            if (!isManager) {
                                                                toast.error('Only managers can edit medicines')
                                                                return
                                                            }
                                                            router.push(`/dashboard/products/${medicine.id}/edit`)
                                                        }}
                                                        disabled={!isManager}
                                                        className="cursor-pointer"
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Medicine
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            if (!isManager) {
                                                                toast.error('Only managers can delete medicines')
                                                                return
                                                            }
                                                            setDeleteId(medicine.id)
                                                        }}
                                                        disabled={!isManager}
                                                        className="text-destructive focus:text-destructive cursor-pointer"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </motion.tr>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">
                                    This action cannot be undone. This will permanently delete the medicine
                                    and all associated inventory records.
                                </AlertDialogDescription>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete} 
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete Medicine
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
