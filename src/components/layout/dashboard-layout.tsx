'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    Pill,
    Building2,
    Warehouse,
    Users,
    ArrowDownToLine,
    ArrowUpFromLine,
    ArrowLeftRight,
    BarChart3,
    Settings,
    ChevronLeft,
    LogOut,
    Menu,
    X,
    Activity,
    AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/use-user'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Medicines', href: '/dashboard/products', icon: Pill },
    { name: 'Storage Locations', href: '/dashboard/warehouses', icon: Building2 },
    { name: 'Inventory', href: '/dashboard/inventory', icon: Warehouse },
    { name: 'Suppliers', href: '/dashboard/suppliers', icon: Users },
    { name: 'Stock In', href: '/dashboard/purchase-orders', icon: ArrowDownToLine },
    { name: 'Stock Out', href: '/dashboard/sales-orders', icon: ArrowUpFromLine },
    { name: 'Transfers', href: '/dashboard/stock-transfers', icon: ArrowLeftRight },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { user, profile, loading } = useUser()
    const supabase = createClient()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            toast.success('Logged out successfully')
            router.push('/login')
        } catch (error) {
            toast.error('Failed to log out')
        }
    }

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === href
        }
        return pathname.startsWith(href)
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile menu backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden animate-fade-in"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300 lg:translate-x-0',
                    'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-border/50',
                    collapsed ? 'w-20' : 'w-72',
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Sidebar Header with Logo */}
                <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
                    {!collapsed && (
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-teal shadow-md">
                                <Activity className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-lg font-bold text-foreground">
                                    MediStock
                                </h1>
                                <span className="text-xs text-muted-foreground">Medicine Inventory</span>
                            </div>
                        </div>
                    )}
                    {collapsed && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-teal shadow-md mx-auto">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hidden lg:flex hover:bg-accent"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <ChevronLeft className={cn('h-4 w-4 transition-transform duration-300', collapsed && 'rotate-180')} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {navigation.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)

                        return (
                            <div key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                        active
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    )}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <Icon className={cn(
                                        'h-5 w-5 flex-shrink-0 transition-transform duration-200',
                                        !active && 'group-hover:scale-110'
                                    )} />
                                    {!collapsed && (
                                        <span className="animate-fade-in">{item.name}</span>
                                    )}
                                </Link>
                            </div>
                        )
                    })}
                </nav>

                {/* Quick Stats in Sidebar */}
                {!collapsed && (
                    <div className="border-t border-border/50 p-4">
                        <div className="rounded-xl bg-warning/10 p-3 border border-warning/20">
                            <div className="flex items-center gap-2 text-warning">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="text-xs font-medium">Low Stock Alert</span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Check inventory for items below reorder level
                            </p>
                        </div>
                    </div>
                )}

                {/* User Profile */}
                <div className="border-t border-border/50 p-4">
                    {mounted ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-start gap-3 px-2 hover:bg-accent',
                                        collapsed && 'justify-center px-0'
                                    )}
                                >
                                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                                        <AvatarImage src={profile?.avatar_url || undefined} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                            {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    {!collapsed && (
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-sm font-medium text-foreground">
                                                {profile?.full_name || 'User'}
                                            </span>
                                            <span className="text-xs text-muted-foreground capitalize">
                                                {profile?.role || 'viewer'}
                                            </span>
                                        </div>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings" className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="ghost"
                            className={cn(
                                'w-full justify-start gap-3 px-2',
                                collapsed && 'justify-center px-0'
                            )}
                        >
                            <Avatar className="h-9 w-9 border-2 border-primary/20">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    U
                                </AvatarFallback>
                            </Avatar>
                            {!collapsed && (
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-sm font-medium text-foreground">User</span>
                                    <span className="text-xs text-muted-foreground">Loading...</span>
                                </div>
                            )}
                        </Button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className={cn('flex flex-1 flex-col transition-all duration-300', collapsed ? 'lg:ml-20' : 'lg:ml-72')}>
                {/* Top Header */}
                <header className="flex h-16 items-center justify-between border-b border-border/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-4 lg:px-6 sticky top-0 z-40">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>

                    <div className="flex-1" />

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                            <span>System Online</span>
                        </div>
                        <span className="text-sm text-muted-foreground hidden md:block">
                            {user?.email}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gradient-to-br from-background via-background to-accent/5">
                    <div className="animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
