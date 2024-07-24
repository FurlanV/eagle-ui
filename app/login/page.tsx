"use client"

import { useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "@/services/auth"

import { useAppDispatch } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const loginRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const dispatch = useAppDispatch()
  const router = useRouter()

  const [signIn, { isLoading }] = useLoginMutation()

  const loginHandler = async () => {
    const email = loginRef.current?.value
    const password = passwordRef.current?.value

    if (email && password) {
      await signIn({ email: email, password: password }).unwrap()

      router.push("/")
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Eagle Eval Environment</h1>
            <p className="text-balance text-muted-foreground">
              Please login to your account.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                ref={loginRef}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input ref={passwordRef} id="password" type="password" required />
            </div>
            <Button className="w-full" onClick={() => loginHandler()}>
              Login
            </Button>
          </div>
          {/* <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div> */}
        </div>
      </div>
      <div className="flex flex-col h-full w-full items-center justify-center bg-muted">
        <h1 className="text-8xl font-bold">TCAG</h1>
      </div>
    </div>
  )
}
