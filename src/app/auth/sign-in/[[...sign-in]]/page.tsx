import React from 'react'
import { SignIn } from "@clerk/nextjs"
type Props = {}

const SignInPage = (props: Props) => {
  return (
   <div>
    <SignIn/>
   </div>
  )
}

export default SignInPage