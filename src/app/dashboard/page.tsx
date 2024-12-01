import { onAuthenticatedUser } from '@/actions/user'
import { redirect } from 'next/navigation'

import React from 'react'
export const dynamic = 'force-dynamic'


const Dashboard = async() => {
    ///on authentication
    const auth=await onAuthenticatedUser()
    if (auth.status===200 || auth.status===201) return redirect(`/dashboard/${auth.user?.workspace[0].id}`)
    if (auth.status===400 || auth.status===500 || auth.status===404) return redirect('/auth/sign-in')
    return (
    <div>Dashboard</div>
  )
}

export default Dashboard