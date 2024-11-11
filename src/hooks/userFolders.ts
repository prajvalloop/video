import { useAppSelector } from "@/redux/store"
import { useEffect, useState } from "react"
import { useMutationData } from "./useMutuationData"
import { getWorkspaceFolders, moveVideoLoaction } from "@/actions/workspace"
import useZodForm from "./useZodForm"
import { moveVideoSchema } from "@/components/forms/change-video-location/schmea"

export const useMoveVideos=(videoId:string,currentWorkspace:string)=>{
    const {folders}=useAppSelector((state)=>state.FolderReducer)
    const {workspaces}=useAppSelector((state)=>state.WorkSpaceReducer)
    
    const [isFetching,setIsFetching]=useState(false)
    const [isFolders, setIsFolders] = useState<
    ({
        _count: {
          videos: number
        }
      } & {
        id: string
        name: string
        createdAt: Date
        workSpaceId: string | null
      })[]
    | undefined
  >(undefined)

  const {mutate,isPending}=useMutationData(['change-video-location'],(data:{
    folder_id:string
    workspace_id:string}
)=>{return moveVideoLoaction(videoId,data.workspace_id,data.folder_id)})

const {errors,onFormSubmit,watch,register}=useZodForm(moveVideoSchema,mutate,{folder_id:null,workspace_id:currentWorkspace})

const fetchFolders=async(workspace:string)=>{
    setIsFetching(true)
    const folders=await getWorkspaceFolders(workspace)
    setIsFetching(false)
    setIsFolders(folders.data)
}
useEffect(()=>{
    fetchFolders(currentWorkspace)
},[])

useEffect(()=>{
    const workspace=watch(async(value)=>{
        if(value.workspace_id) fetchFolders(value.workSpace_id)
    })
return ()=>  workspace.unsubscribe()
},[watch])

return {
    onFormSubmit,
    errors,
    register,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders
}




}