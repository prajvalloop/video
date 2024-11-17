'use client'
import { getNotifications, getWorkspaces } from '@/actions/workspace'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useQueryData } from '@/hooks/useQueryData'
import { NotificationProps, WorkspaceProps } from '@/types'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import React from 'react'
import Modal from '../modal'
import { Menu, PlusCircle } from 'lucide-react'
import Search from '../search'
import { MENU_ITEMS } from '@/constants'
import SidebarItem from './sidebar-items'
import { Item } from '@radix-ui/react-select'
import { useQuery } from '@tanstack/react-query'
import WorkspacePlaceholder from './workspace-placeholder'
import GlobalCard from '../global-card'
import { Button } from '@/components/ui/button'
import Loader from '../loader'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import InfoBar from '../info-bar'
import { useDispatch } from 'react-redux'
import { WORKSPACES } from '@/redux/slices/workspaces'



type Props = {
    actionWorskspaceId: string
}

const Sidebar = ({ actionWorskspaceId }: Props) => {
    console.log(actionWorskspaceId)
    const router = useRouter()
    const dispatch=useDispatch()
    const onChangeActiveWorkspace = (value: string) => {
        console.log('change->', value)
        router.push(`/dashboard/${value}`)
    }
    const { data, isFetched } = useQueryData(['user-workspaces'], ()=>getWorkspaces())
    const {data:notifications}=useQueryData(["user-notifications"],()=>getNotifications())
    console.log("notifications->",notifications)
    const { data: workspace } = data as WorkspaceProps
    const {data:count}=notifications as NotificationProps
    const menuItems=MENU_ITEMS(actionWorskspaceId)
    const currentWorkspace=workspace.workspace.find((s)=>s.id===actionWorskspaceId)
    if (isFetched && workspace){
        dispatch(WORKSPACES({workspaces:workspace.workspace}))
    }
    const pathName=usePathname()
    console.log("data->",workspace)
    console.log("pathName->",pathName)

    const SidebarSection= (
        <div className='bg-[#111]  px-4 h-full w-[250px] flex flex-col gap-2 items-center overflow-hidden'>
            <div className='p-4 flex gap-2 justify-center items-center  '>
                <Image src="/opal-logo.svg" height={40} width={40} alt="logo" />
                <p className='text-2xl'>Opal</p>
            </div>
            
                <Select
                    // defaultValue={actionWorskspaceId }  // Ensure a default is set
                    onValueChange={onChangeActiveWorkspace}
                >
                    <SelectTrigger className="text-neutral-400">
                        <SelectValue placeholder="Select a workspace" />  {/* Placeholder */}
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] backdrop-blur-xl">
                        <SelectGroup>
                            <SelectLabel>Workspace</SelectLabel>
                            <Separator />
                            {workspace.workspace.map((workspace) => {
                                return (
                                    <SelectItem key={workspace.id} value={workspace.id}>{workspace.name}</SelectItem>
                                )
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                
               
               
                
            
            
            { currentWorkspace?.type==='PUBLIC' && workspace.subscription?.plan==='PRO' &&  (<Modal trigger={<span className='text-sm w-full cursor-pointer  flex items-center justify-center  rounded-sm p-[5px] gap-2 bg-neutral-800/90 hover:bg-neutral-800/60'>
                    <PlusCircle size={15} className='text-neutral-800/90 fill-neutral-500' />
                    <span className='text-neutral-400 text-semiblood text-xs'>Invite to Workspace</span>
                </span>} title="Invite to workspace" description={"Invite other users to your workspace"}>
                   <Search workspaceId={actionWorskspaceId}></Search>
                </Modal>)}
            
            <p className='w-full text-[#9D9D9D] font-bold mt-4'>Menu</p>
            
            <nav className='w-full'>
                <ul>{menuItems.map((x)=>{
                    return (
                       <SidebarItem href={x.href} icon={x.icon} selected={pathName===x.href} title={x.title} key={x.title} notifications={(x.title==='Notifications' && count._count && count._count.notification)||0} />
                    )
                })}</ul>
            </nav>
            <Separator className='w-4/5' />
            <p className='w-full text-[#9D9D9D] font-bold mt-4'>Workspaces</p>
            {workspace.workspace.length===1 && workspace.members.length===0 && (
                        <div className='w-full '>
                            <p className='text-[#3c3c3c] font-medium text-sm'>{workspace.subscription?.plan==='FREE'?'Upgrade to create workspace':'No workspaces'}</p>
                        </div>
                    )}
            <nav className='w-full'>
                <ul className='h-[80px] overflow-auto  fade-layer'>
                    {workspace.workspace.length >0 && workspace.workspace.map((item)=>{
                       if(item.type!=='PERSONAL'){
                        return (
                           
                            <SidebarItem href={`/dashboard/${item.id}`} selected={pathName===`/dashboard/${item.id}`} title={item.name} notifications={0} key={item.name} icon={ <WorkspacePlaceholder>{item.name.charAt(0)}</WorkspacePlaceholder>  }  />
                            
                            
                           
                        )
                       }
                    })}
                    {workspace.members.length>0 && workspace.members.map((item)=>{
                         return (
                           
                            <SidebarItem href={`/dashboard/${item.WorkSpace.id}`} selected={pathName===`/dashboard/${item.WorkSpace.id}`} title={item.WorkSpace.name} notifications={0} key={item.WorkSpace.name} icon={ <WorkspacePlaceholder>{item.WorkSpace.name.charAt(0)}</WorkspacePlaceholder>  }  />
                            
                            
                           
                        )
                    })}
                    

                </ul>
            </nav>
            <Separator className='w-4/5'/>
            {workspace.subscription?.plan==='FREE' && 
            
            <GlobalCard title={"Upgrade to Pro"} 
            description='Unlock AI features like transcription,AI summary and more.' 
            footer={
                <PaymentButton/>
            }>
                
                </GlobalCard>}
        </div>



    )
    return (<div className='full '>
        <InfoBar/>
        
        <div className='md:hidden my-4 fixed '>
            <Sheet>
                <SheetTrigger className='ml-2'>
                    <Button variant={"ghost"} className='mt-[2px]'>
                        <Menu/>
                    </Button>
                </SheetTrigger>
                <SheetContent side={'left'} className='p-0 w-fit h-full'>
                    {SidebarSection}
                </SheetContent>
            </Sheet>
        </div>
        <div className='md:block hidden h-full'>{SidebarSection}</div>
    </div>
    )

}

export default Sidebar