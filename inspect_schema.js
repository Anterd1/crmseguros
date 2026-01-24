
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspect() {
    const { data, error } = await supabase
        .from('policies')
        .select('*')
        .limit(1)

    if (error) {
        console.error('Error fetching policies:', error)
    } else {
        console.log('Policy structure:', data && data[0] ? Object.keys(data[0]) : 'No data found')
        if (data && data[0]) {
            console.log('Sample policy:', data[0])
        }
    }
}

inspect()
