import { onAuthenticatedUser } from '@/actions/user'
import { getAllUserVideos, getNotifications, getWorkspaceFolders, getWorkspaces, verifyAccessToWorkspace } from '@/actions/workspace'
import GlobalHeader from '@/components/global/global-header'
import Sidebar from '@/components/global/sidebar'
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { redirect } from 'next/navigation'
import React from 'react'
import serialize from 'serialize-javascript'; // Ensure you install this package

type Props = {
    children:React.ReactNode,
    params:{workspaceId:string}
}

const layout = async({children,params:{workspaceId}}: Props) => {
    
    const auth=await onAuthenticatedUser()
    if(!auth.user?.workspace) return redirect('/auth/sign-in')
    if(!auth.user?.workspace.length) return redirect('/auth/sign-in')
    const hasAccess=await verifyAccessToWorkspace(workspaceId)
    if (hasAccess.status!==200) redirect(`/dashboard/${auth.user.workspace[0].id}`)
    if (!hasAccess.data?.workspace) return null
    
    const query = new QueryClient()
    
    await query.prefetchQuery({
         queryKey:['workspace-folders'],
         queryFn:()=>getWorkspaceFolders(workspaceId)
    })
    await query.prefetchQuery({
        queryKey:['user-videos'],
        queryFn:()=>getAllUserVideos(workspaceId)
   })
   await query.prefetchQuery({
    queryKey:['user-workspaces'],
    queryFn:()=>getWorkspaces()
    
})

await query.prefetchQuery({
    queryKey:['user-notifications'],
    queryFn:()=>getNotifications()
})
const dehydratedState = dehydrate(query);
const serializedState = serialize(dehydratedState, { isJSON: true });
// Safely serialize the dehydrated state to prevent XSS vulnerabilities
// const serializedState = serialize(dehydratedState, { isJSON: true });
    return (
    <HydrationBoundary state={JSON.parse(serializedState)}>
        <div className='flex h-screen w-screen'>
            <Sidebar actionWorskspaceId={workspaceId} />
            <div className='w-full pt-28 p-4'>
                <GlobalHeader workspace={hasAccess.data.workspace}/>
                <div className='mt-4'>{children}</div>
            </div>
        </div>
    </HydrationBoundary>
  )
}

export default layout