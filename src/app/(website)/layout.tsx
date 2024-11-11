import React from 'react'
import LandingPageNavbar from './_components/LandingPageNavbar'

type Props = {
    children:React.ReactNode
}

const Layout = ({children}: Props) => {
  return (
    <div className='flex flex-col px-10 py-10'>
        <LandingPageNavbar/>
        {children}
    </div>
  )
}

export default Layout