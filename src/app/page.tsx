'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
    Pill, 
    BarChart3, 
    Building2, 
    TrendingUp, 
    Shield, 
    Zap, 
    CheckCircle2,
    ArrowRight,
    Users,
    Clock,
    AlertTriangle,
    Activity,
    Package,
    Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Check if user is already logged in
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                router.push('/dashboard')
            }
        }
        checkUser()
    }, [router])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    }

    const features = [
        {
            icon: Pill,
            title: 'Medicine Management',
            description: 'Track medicines with batch numbers, expiry dates, manufacturers, and dosage information',
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
        {
            icon: Building2,
            title: 'Multi-Location Storage',
            description: 'Manage inventory across pharmacies, warehouses, and hospital departments',
            color: 'text-success',
            bgColor: 'bg-success/10',
        },
        {
            icon: Clock,
            title: 'Expiry Tracking',
            description: 'Automated alerts for medicines approaching expiry to prevent wastage',
            color: 'text-warning',
            bgColor: 'bg-warning/10',
        },
        {
            icon: BarChart3,
            title: 'Stock Analytics',
            description: 'Comprehensive reports on stock levels, movements, and consumption patterns',
            color: 'text-info',
            bgColor: 'bg-info/10',
        },
        {
            icon: AlertTriangle,
            title: 'Low Stock Alerts',
            description: 'Real-time notifications when medicines fall below reorder levels',
            color: 'text-warning',
            bgColor: 'bg-warning/10',
        },
        {
            icon: Shield,
            title: 'Role-Based Access',
            description: 'Secure access control for pharmacists, managers, and staff members',
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
    ]

    const benefits = [
        'Real-time inventory tracking',
        'Expiry date management',
        'Automated stock alerts',
        'Multi-location support',
        'Batch & lot tracking',
        'Mobile-responsive design',
    ]

    if (!mounted) {
        return null
    }

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-accent/10">
            {/* Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="border-b border-border/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50"
            >
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-teal shadow-md">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg text-foreground">MediStock</span>
                            <span className="text-xs text-muted-foreground hidden sm:block">Medicine Inventory</span>
                        </div>
                    </motion.div>
                    <div className="flex gap-3">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="ghost" asChild>
                                <Link href="/login">Log in</Link>
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button asChild className="shadow-md">
                                <Link href="/signup">Get Started</Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8"
                        >
                            <motion.div variants={itemVariants} className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    <span>Modern Medicine Inventory Solution</span>
                                </motion.div>
                                <motion.h1
                                    initial={{ y: 60, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                                    className="text-4xl lg:text-6xl font-bold tracking-tight"
                                >
                                    <span className="text-foreground">
                                        Medicine Inventory
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                                        Made Simple
                                    </span>
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 60, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
                                    className="text-xl text-muted-foreground max-w-xl"
                                >
                                    Streamline your pharmacy operations with real-time tracking, 
                                    expiry management, and automated alerts. Built for healthcare professionals.
                                </motion.p>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button size="lg" className="w-full sm:w-auto shadow-lg" asChild>
                                        <Link href="/signup">
                                            Start Free Trial
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                                        <Link href="/login">Log in</Link>
                                    </Button>
                                </motion.div>
                            </motion.div>

                            {/* Benefits List */}
                            <motion.div
                                variants={itemVariants}
                                className="grid grid-cols-2 gap-3 pt-4"
                            >
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={benefit}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="h-3 w-3 text-success" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">{benefit}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right Content - Illustration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative">
                                {/* Main Card */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-lg border border-border/50 p-6"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-10 w-10 rounded-xl gradient-teal flex items-center justify-center">
                                            <Activity className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">Medicine Dashboard</h3>
                                            <p className="text-xs text-muted-foreground">Real-time inventory</p>
                                        </div>
                                    </div>
                                    
                                    {/* Mock Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="rounded-xl bg-primary/10 p-4">
                                            <Pill className="h-5 w-5 text-primary mb-2" />
                                            <p className="text-2xl font-bold text-foreground">1,247</p>
                                            <p className="text-xs text-muted-foreground">Total Medicines</p>
                                        </div>
                                        <div className="rounded-xl bg-warning/10 p-4">
                                            <AlertTriangle className="h-5 w-5 text-warning mb-2" />
                                            <p className="text-2xl font-bold text-foreground">23</p>
                                            <p className="text-xs text-muted-foreground">Low Stock</p>
                                        </div>
                                    </div>
                                    
                                    {/* Mock List */}
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                                    <Pill className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-3 w-24 bg-muted rounded" />
                                                    <div className="h-2 w-16 bg-muted rounded mt-1" />
                                                </div>
                                                <div className="h-6 w-16 bg-success/20 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Floating Cards */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-soft-lg border border-border/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-success flex items-center justify-center">
                                            <CheckCircle2 className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-foreground">Stock Updated</p>
                                            <p className="text-xs text-muted-foreground">+500 units added</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-soft-lg border border-border/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-warning flex items-center justify-center animate-pulse-soft">
                                            <Clock className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-foreground">Expiry Alert</p>
                                            <p className="text-xs text-muted-foreground">12 items this month</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-4 py-16 lg:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-4 mb-12"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                            Everything You Need for{' '}
                            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                                Medicine Inventory
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Purpose-built features for pharmacies, hospitals, and medical stores
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-border/50 hover:border-primary/30 shadow-soft hover:shadow-soft-lg transition-all duration-300"
                            >
                                <div className={`h-12 w-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-16 lg:py-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-3xl gradient-teal p-8 lg:p-12 text-center text-white"
                    >
                        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                            <h2 className="text-3xl lg:text-4xl font-bold">
                                Ready to Modernize Your Pharmacy?
                            </h2>
                            <p className="text-lg text-white/80">
                                Join healthcare professionals who trust MediStock for their inventory management
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-lg" asChild>
                                        <Link href="/signup">
                                            Start Free Trial
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                                        <Link href="/login">Log in</Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="border-t border-border/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
            >
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-teal">
                                <Activity className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-semibold text-foreground">MediStock</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} MediStock. All rights reserved.
                        </p>
                    </div>
                </div>
            </motion.footer>
        </div>
    )
}
