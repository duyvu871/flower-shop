'use client'


import { Input, Button } from '@nextui-org/react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import {useToast} from "@/hooks/useToast";

export const Form = () => {
    const {error: errorMessage, success} = useToast()
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await signIn('credentials', {
                redirect: false,
                role: 'admin',
                email,
                password,
                callbackUrl
            })
            console.log('Res', res)
            if (!res?.error) {
                router.push(callbackUrl)
            } else {
                errorMessage('Mật khẩu hoặc tài khoản không đúng!')
            }
        } catch (err: any) {}
    }

    return (
        <form onSubmit={onSubmit} className="space-y-12 w-full sm:w-[400px]">
            <div className="grid w-full items-center gap-1.5">
                <Input
                    className="w-full"
                    label="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                />
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Input
                    className="w-full"
                    required
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                />
            </div>
            <div className="w-full">
                <Button className="w-full" size="lg">
                    Login
                </Button>
            </div>
        </form>
    )
}