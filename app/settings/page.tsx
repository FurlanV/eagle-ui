"use client"

import { useState } from "react"
import { useAppSelector } from "@/lib/hooks"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { AuthWrapper } from "@/components/auth-wrapper"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
})

// Account form schema
const accountFormSchema = z.object({
  notifications: z.boolean().default(true),
  email_notifications: z.boolean().default(true),
  api_key: z.string().optional(),
})

// Appearance form schema
const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
})

// Change password form schema
const passwordFormSchema = z.object({
  current_password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  new_password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirm_password: z.string().min(8, { message: "Password must be at least 8 characters." }),
}).refine(data => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})

export default function SettingsPage() {
  const { toast } = useToast()
  const user = useAppSelector((state) => state.auth.user)
  const [isLoading, setIsLoading] = useState(false)

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      surname: user?.surname || "",
      username: user?.username || "",
      email: user?.email || "",
    },
  })

  // Account form
  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      notifications: true,
      email_notifications: true,
      api_key: "eagleAPIKey12345",
    },
  })

  // Appearance form
  const appearanceForm = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: "system",
    },
  })

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  // Submit handlers
  function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    setIsLoading(true)
    setTimeout(() => {
      console.log(data)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
      setIsLoading(false)
    }, 1000)
  }

  function onAccountSubmit(data: z.infer<typeof accountFormSchema>) {
    setIsLoading(true)
    setTimeout(() => {
      console.log(data)
      toast({
        title: "Account preferences updated",
        description: "Your account preferences have been successfully updated.",
      })
      setIsLoading(false)
    }, 1000)
  }

  function onAppearanceSubmit(data: z.infer<typeof appearanceFormSchema>) {
    setIsLoading(true)
    setTimeout(() => {
      console.log(data)
      toast({
        title: "Appearance settings updated",
        description: "Your appearance settings have been successfully updated.",
      })
      setIsLoading(false)
    }, 1000)
  }

  function onPasswordSubmit(data: z.infer<typeof passwordFormSchema>) {
    setIsLoading(true)
    setTimeout(() => {
      console.log(data)
      toast({
        title: "Password changed",
        description: "Your password has been successfully changed.",
      })
      passwordForm.reset({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <AuthWrapper>
      <main className="flex flex-row">
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-full">
            <section className="flex flex-col w-full p-4 gap-4">
              <div className="gap-2 flex flex-row justify-between items-center w-full">
                <div>
                  <h1 className="text-2xl font-bold">Settings</h1>
                  <h4 className="text-sm text-md">
                    Manage your account settings and preferences
                  </h4>
                </div>
              </div>

              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full md:w-[400px] grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                
                {/* Profile Settings */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>
                        Update your personal information here. This information will be displayed publicly.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="surname"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Surname</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your surname" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={profileForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="example@eagle.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update profile"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Account Settings */}
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Preferences</CardTitle>
                      <CardDescription>
                        Manage your account preferences and notification settings.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Form {...accountForm}>
                        <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
                          <div className="space-y-4">
                            <FormField
                              control={accountForm.control}
                              name="notifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      In-app Notifications
                                    </FormLabel>
                                    <FormDescription>
                                      Receive notifications about your activity within the app.
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={accountForm.control}
                              name="email_notifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Email Notifications
                                    </FormLabel>
                                    <FormDescription>
                                      Receive email notifications about your activity.
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <Separator className="my-6" />
                          
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">API Access</h3>
                            <FormField
                              control={accountForm.control}
                              name="api_key"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>API Key</FormLabel>
                                  <FormControl>
                                    <div className="flex space-x-2">
                                      <Input
                                        {...field}
                                        type="password"
                                        disabled
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          toast({
                                            title: "API Key Regenerated",
                                            description: "Your API key has been regenerated. Make sure to save it somewhere safe.",
                                          })
                                        }}
                                      >
                                        Regenerate
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    Your API key is used to authenticate API requests.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save changes"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Appearance Settings */}
                <TabsContent value="appearance">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>
                        Customize how the application looks for you.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Form {...appearanceForm}>
                        <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)} className="space-y-6">
                          <FormField
                            control={appearanceForm.control}
                            name="theme"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Theme</FormLabel>
                                <div className="relative w-max">
                                  <FormControl>
                                    <select
                                      className="w-full h-10 pl-3 pr-10 bg-background border border-input rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                                      value={field.value}
                                      onChange={field.onChange}
                                    >
                                      <option value="light">Light</option>
                                      <option value="dark">Dark</option>
                                      <option value="system">System</option>
                                    </select>
                                  </FormControl>
                                </div>
                                <FormDescription>
                                  Select the theme for the application.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save preferences"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Password Settings */}
                <TabsContent value="password">
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                          <FormField
                            control={passwordForm.control}
                            name="current_password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Enter your current password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="new_password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Enter your new password" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Password must be at least 8 characters long.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="confirm_password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Confirm your new password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Changing..." : "Change password"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
      </main>
    </AuthWrapper>
  )
}
