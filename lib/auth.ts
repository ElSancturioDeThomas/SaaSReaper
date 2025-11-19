import { cookies } from 'next/headers'
import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please check your .env.local file."
  );
}

// Ensure the connection string is properly formatted
// Remove any trailing whitespace and ensure it's a valid string
let connectionString = databaseUrl.trim();

// If using pooler endpoint, try converting to non-pooler for serverless driver
// The serverless driver may need the direct connection endpoint
if (connectionString.includes('-pooler.')) {
  // Replace pooler endpoint with direct endpoint
  connectionString = connectionString.replace('-pooler.', '.');
}

const sql = neon(connectionString)

export interface User {
  id: string
  email: string
  name: string | null
  created_at: Date
}

export async function hashPassword(password: string): Promise<string> {
  // ⚠️ SECURITY WARNING: SHA-256 is NOT secure for password hashing
  // This is vulnerable to rainbow table attacks and brute force
  // TODO: Replace with bcrypt before production deployment
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function createUser(email: string, password: string, name: string): Promise<User> {
  const hashedPassword = await hashPassword(password)
  
  const result = await sql`
    INSERT INTO users_sync (email, password_hash, name)
    VALUES (${email}, ${hashedPassword}, ${name})
    RETURNING id, email, name, created_at
  `
  
  return result[0] as User
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  const hashedPassword = await hashPassword(password)
  
  try {
    const result = await sql`
      SELECT id, email, name, created_at, password_hash
      FROM users_sync
      WHERE email = ${email}
    `
    
    if (result.length === 0) {
      return null
    }
    
    const user = result[0] as any
    
    if (user.password_hash !== hashedPassword) {
      return null
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at
    } as User
  } catch (error: any) {
    console.error('[Auth] Error verifying user:', error)
    throw error
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, name, created_at
    FROM users_sync
    WHERE id = ${userId}
  `
  
  if (result.length === 0) return null
  
  return result[0] as User
}

export async function setSession(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set('session', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  return session?.value || null
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getCurrentUser(): Promise<User | null> {
  const userId = await getSession()
  if (!userId) return null
  
  const user = await getUserById(userId)
  return user
}
