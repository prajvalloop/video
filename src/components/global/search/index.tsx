import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useMutationData } from '@/hooks/useMutuationData'
import { useSearch } from '@/hooks/useSearch'

import React from 'react'

type Props = {
    workspaceId:string
}

const Search = ({workspaceId}: Props) => {
  const {query,onSearchQuery,isFetching,onUsers}=useSearch(
    'get-workspace',
    'USERS'
  )
  console.log("query->",query)
  console.log("onUsers->",onUsers)
  console.log("isFetching->",isFetching)
  // WIP
  // const { mutate,isPending}= useMutuationData(['invite-member'],(data:{recieverId:string,email:string})=>{
  //   inviteMembers
  // })

  return (
    <div className='flex flex-col gap-y-5'>
      <Input onChange={onSearchQuery} value={query} className='bg-transparent border-2 outline-none' placeholder='Search for your user...' type="text" />
      {isFetching ? (<div className='flex flex-col gap-y-2'>
        <Skeleton className='w-full h-8 rounded-xl'/>
      </div>): !onUsers?(
        <p className='text-center text-sm text-[#a4a4a4]'>No users found</p>
      ):(
        <div>
          {onUsers.map((user)=>{
              return (
                <div key={user.id} className='flex gap-x-3 items-center border-2 w-ull p-3 rounded-xl'>{user.firstname} {user.lastname}</div>
              )
          })}
          </div>
      )

      }

    </div>
  )
}

export default Search