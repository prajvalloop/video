import React from 'react'

type Props = {children:React.ReactNode}

const WorkspacePlaceholder = ({children}: Props) => {
  return (
    <span className='bg-[#545454] flex items-center font-bold justify-center  px-2  rounded-sm text-[#1D1D1D]'>
        {children}
    </span>
  )
}

export default WorkspacePlaceholder