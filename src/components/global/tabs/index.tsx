import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

type Props = {
    triggers:string[],
    children:React.ReactNode,
    defaultValue:string
}

const TabMenu = ({triggers,children,defaultValue}: Props) => {
  return (
    <Tabs defaultValue={defaultValue} className='w-full'>
        <TabsList className='flex justify-start bg-transparent'>
            {triggers.map((trigger)=>(
                <TabsTrigger key={trigger} value={trigger} className='capitalize text-base data-[state=active]:bg-[#1d1d1d] '>
                    {trigger}
                </TabsTrigger>
            ))}
        </TabsList>
        {children}
    </Tabs>
  )
}

export default TabMenu