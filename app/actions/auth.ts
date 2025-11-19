'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createUser, verifyUser, setSession, clearSession } from '@/lib/auth'

function isRedirectError(error: any): boolean {
  return error?.message === 'NEXT_REDIRECT' || error?.digest?.startsWith('NEXT_REDIRECT')
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  if (!email || !password || !name) {
    return { error: 'All fields are required' }
  }

  try {
    const user = await createUser(email, password, name)
    await setSession(user.id)
    revalidatePath('/', 'layout')
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error
    }
    
    if (error.message?.includes('duplicate key') || error.code === '23505') {
      return { error: 'An account with this email already exists. Please sign in instead.' }
    }
    return { error: 'Failed to create account. Please try again.' }
  }
  
  redirect('/')
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    const user = await verifyUser(email, password)
    
    if (!user) {
      return { error: 'Invalid email or password. Please check your credentials and try again.' }
    }

    await setSession(user.id)
    revalidatePath('/', 'layout')
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error
    }
    console.error('[SignIn Action] Sign in error:', error)
    return { error: 'Failed to sign in. Please try again.' }
  }
  
  redirect('/')
}

export async function signOut() {
  await clearSession()
  redirect('/auth/signin')
}
