'use client'
import { getWorkspaces } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import React from 'react'
import Modal from '../modal'
import { Button } from '@/components/ui/button'
import FolderDuotone from '@/components/icons/folder-duotone'
import WorkspaceForm from '@/components/forms/workspace-form'

type Props = {}

const CreateWorkspace = (props: Props) => {
  const {data}=useQueryData(['user-workspaces'] , getWorkspaces)
  const {data:plan}=data as {
    status:number,
    data:{
        subscription:{
            plan:'PRO' | 'FREE'
        } | null
    }
  }
  if (plan.subscription?.plan==='FREE') return <></>
  if (plan.subscription?.plan==='PRO') return (
    <Modal title="Create a workspace" description={"This action cannot be undone. This will permanently delete your account and remove your data from our servers"} trigger={<Button className='bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl'>
        <FolderDuotone/>
        Create a Workspace
    </Button>}><WorkspaceForm/></Modal>
  )

    return (
    <div>CreateWorkspace</div>
  )
}

export default CreateWorkspace