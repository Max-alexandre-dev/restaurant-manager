import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {ContainerPage} from './container'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const username = cookieStore.get('username')?.value

  if (!username) {
    redirect('/') // redireciona antes de renderizar a página
  }

  return (
    <div>
    
      <ContainerPage />
    </div>
  )
}

