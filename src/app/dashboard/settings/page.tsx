'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSettings } from './profile-settings'
import { SecuritySettings } from './security-settings'
import { UserManagement } from './user-management'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Settings</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <ProfileSettings />
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <SecuritySettings />
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <UserManagement />
                </TabsContent>
            </Tabs>
        </div>
    )
}
