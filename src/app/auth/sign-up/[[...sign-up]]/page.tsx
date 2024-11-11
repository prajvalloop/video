import React from 'react'
import {  SignUp } from "@clerk/nextjs"
type Props = {}

const SignUpPage = (props: Props) => {
  return (
   <div>
    <SignUp/>
   </div>
  )
}

export default SignUpPage