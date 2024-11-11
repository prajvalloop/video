"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

type Props = {
    children:React.ReactNode
}
const client=new QueryClient()
const ReactQueryProvider = ({children}: Props) => {
  return (
    <QueryClientProvider client={client}>
        {children}
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default ReactQueryProvider