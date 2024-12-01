import { onAuthenticatedUser } from '@/actions/user'
import { redirect } from 'next/navigation'

import React from 'react'

// Add this export at the top of the file
export const dynamic = 'force-dynamic'

const AuthCallBack = async() => {
    ///on authentication
    const auth=await onAuthenticatedUser()
    console.log('authstatus',auth.status)
    if (auth.status===200 || auth.status===201) return redirect(`/dashboard/${auth.user?.workspace[0].id}`)
    if (auth.status===400 || auth.status===500 || auth.status===404) return redirect('/auth/sign-in')
    
}

export default AuthCallBack