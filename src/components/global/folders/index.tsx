'use client'
import FolderDuotone from '@/components/icons/folder-duotone'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import Folder from './folder'
import { useQueryData } from '@/hooks/useQueryData'
import { getWorkspaceFolders } from '@/actions/workspace'
import { useMutationDataState } from '@/hooks/useMutuationData'
import { useDispatch } from 'react-redux'
import { FOLDERS } from '@/redux/slices/folders'

type Props = {
    workspaceId:string
}
export type FoldersProps={
    status:number,
    data:({
        _count:{
            videos:number
        }
    } & {
        id :string,
        name:string,
        createdAt:Date,
        workspaceId:string | null
    } )[]
}

const Folders = ({workspaceId}: Props) => {
    // get folders
    const dispatch=useDispatch()
    const {data,isFetched}=useQueryData(['workspace-folders'],()=>getWorkspaceFolders(workspaceId))
    const {latestVariables}=useMutationDataState(["create-folder"])
    const {data:folders,status} = data as FoldersProps
    console.log('folders->',folders)
    console.log('status->',status)
    console.log("latestvariables->",latestVariables)
    if (isFetched && folders){
        dispatch(FOLDERS({folders:folders}))
    }
    // console.log("Folders->",data)
    return (
    <div className='flex flex-col gap-4 '>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
                <FolderDuotone/>
                <h2 className='text-[#BDBDBD] text-xl'>Folders</h2>
            </div>
            <div className='flex items-center gap-2'>
                <p className='text-[#BDBDBD]'>See all</p>
                <ArrowRight color='#707070'/>
            </div>

        </div>
        <section className={cn(status!==200&& 'justify-center',"flex items-center gap-4 overflow-x-auto overflow-y-hidden w-full")}>
        {
            status!==200?  <p className='text-neutral-300'>No folders</p> :( <>
            {latestVariables && latestVariables.status==='pending' && (<Folder name={latestVariables.variables.name} id={latestVariables.variables.id} optimistic/>)} 
            {folders.map((folder)=>{
                return <Folder name={folder.name} count={folder._count.videos} id={folder.id} key={folder.id} />
            })}</>)
        }
        
        
        
        
        </section>


    </div>
  )
}

export default Folders