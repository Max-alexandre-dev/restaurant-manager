'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AUTH_TOKEN_KEY = 'authToken';
const MOCK_TOKEN = 'mock-token-123';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        router.replace('/dashboard');
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validUsername = process.env.NEXT_PUBLIC_VALID_USERNAME;
    const validPassword = process.env.NEXT_PUBLIC_VALID_PASSWORD;

    if (username === validUsername && password === validPassword) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, MOCK_TOKEN);
        localStorage.setItem('username', username);
      }
      router.push('/dashboard');
    } else {
      setError('Usuário ou senha inválidos');
    }
  };

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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-sm sm:text-base"
              />
            </div>
            {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
            <Button type="submit" className="w-full text-sm sm:text-base">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
