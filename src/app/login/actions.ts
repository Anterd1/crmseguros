'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validación básica
    if (!email || !password) {
        return redirect(`/login?error=${encodeURIComponent('Por favor completa todos los campos')}`)
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        // Mensajes de error más amigables
        let errorMessage = error.message
        if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Correo o contraseña incorrectos'
        } else if (error.message.includes('Email not confirmed')) {
            errorMessage = 'Por favor confirma tu correo electrónico'
        }
        return redirect(`/login?error=${encodeURIComponent(errorMessage)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validación básica
    if (!email || !password) {
        return redirect(`/register?error=${encodeURIComponent('Por favor completa todos los campos')}`)
    }

    if (password.length < 8) {
        return redirect(`/register?error=${encodeURIComponent('La contraseña debe tener al menos 8 caracteres')}`)
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        let errorMessage = error.message
        if (error.message.includes('already registered')) {
            errorMessage = 'Este correo ya está registrado'
        }
        return redirect(`/register?error=${encodeURIComponent(errorMessage)}`)
    }

    revalidatePath('/', 'layout')
    redirect(`/login?message=${encodeURIComponent('¡Cuenta creada! Revisa tu correo para confirmar tu cuenta.')}`)
}

export async function logout() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error al cerrar sesión:', error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/login')
}

