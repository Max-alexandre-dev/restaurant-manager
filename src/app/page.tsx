'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
       localStorage.setItem('username', JSON.stringify(email));

      document.cookie = `username=${email}; path=/`
      
      router.push('/dashboard');     
    
  };

  useEffect(() => {
    const username = localStorage.getItem('username')
    if (username) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                required
                className="w-full text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                required
                className="w-full text-sm sm:text-base"
              />
            </div>
            {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
            <Button type="submit" className="w-full text-sm sm:text-base">
              Entrar
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Não tem conta? <a href="/register" className="text-blue-500 hover:underline">Criar Conta</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
