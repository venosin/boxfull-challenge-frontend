import { redirect } from 'next/navigation';

export default function Home() {
  // Redirigir siempre al login si entran a la raíz
  redirect('/login');
}