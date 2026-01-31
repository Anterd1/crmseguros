'use server'

import { createClient } from "@/lib/supabase/server"

export interface DashboardStats {
  activePolicies: number
  totalClients: number
  pendingClaims: number
  monthlyRevenue: number
  policyBreakdown: {
    vida: number
    gmm: number
    auto: number
    danos: number
  }
}

export async function getDashboardStats(agentFilter?: string) {
  try {
    const supabase = await createClient()

    // Helper to apply agent filter
    const applyFilter = (query: any) => {
      if (agentFilter && agentFilter !== 'all') {
        return query.eq('agent', agentFilter)
      }
      return query
    }

    // Get active policies count
    let activePoliciesQuery = supabase
      .from('policies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Activa')

    activePoliciesQuery = applyFilter(activePoliciesQuery)
    const { count: activePoliciesCount } = await activePoliciesQuery

    // Get policy type breakdowns
    const getCountByType = async (types: string[]) => {
      let query = supabase
        .from('policies')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Activa')
        .in('type', types)

      query = applyFilter(query)
      const { count } = await query
      return count || 0
    }

    const vidaCount = await getCountByType(['vida', 'Vida'])
    const gmmCount = await getCountByType(['gmm', 'GMM', 'Gastos Médicos Mayores'])
    const autoCount = await getCountByType(['autos', 'Autos', 'Auto'])
    const danosCount = await getCountByType(['hogar', 'Hogar', 'rc', 'Responsabilidad Civil', 'daños', 'Daños'])

    // Get clients count
    const { count: clientsCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })

    // Get pending claims
    const { count: pendingClaimsCount } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true })
      .in('status', ['Abierto', 'En Proceso'])

    // Calculate monthly revenue from commissions
    const currentMonth = new Date().toISOString().slice(0, 7)
    const { data: monthlyCommissions } = await supabase
      .from('commissions')
      .select('amount')
      .gte('payment_date', `${currentMonth}-01`)
      .lt('payment_date', `${currentMonth}-32`)

    const monthlyRevenue = monthlyCommissions?.reduce((sum, comm) => sum + (comm.amount || 0), 0) || 0

    return {
      success: true,
      data: {
        activePolicies: activePoliciesCount || 0,
        totalClients: clientsCount || 0,
        pendingClaims: pendingClaimsCount || 0,
        monthlyRevenue,
        policyBreakdown: {
          vida: vidaCount,
          gmm: gmmCount,
          auto: autoCount,
          danos: danosCount,
        }
      } as DashboardStats
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return { success: false, error: 'Error al obtener estadísticas' }
  }
}

export async function getExpiringPolicies(daysAhead: number = 60, agentFilter?: string) {
  try {
    const supabase = await createClient()
    
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + daysAhead)

    let query = supabase
      .from('policies')
      .select('id, policy_number, end_date, clients(first_name, last_name)')
      .eq('status', 'Activa')
      .lte('end_date', futureDate.toISOString())
      .order('end_date', { ascending: true })

    if (agentFilter && agentFilter !== 'all') {
      query = query.eq('agent', agentFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching expiring policies:', error)
      return { success: false, error: error.message }
    }

    // Calculate days until expiration for each
    const policiesWithDays = data?.map(policy => {
      const now = new Date()
      const expDate = new Date(policy.end_date)
      const daysUntil = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        ...policy,
        daysUntilExpiration: daysUntil
      }
    }) || []

    return { success: true, data: policiesWithDays }
  } catch (error) {
    console.error('Error fetching expiring policies:', error)
    return { success: false, error: 'Error al obtener pólizas por vencer' }
  }
}
