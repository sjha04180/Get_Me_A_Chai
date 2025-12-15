import React from 'react'
import PaymentPage from '@/components/PaymentPage'
import { notFound } from "next/navigation"
import { connectDb } from "@/db/connectDb"
import User from '@/models/User'


export default async function Page({ params }) {
  const { username } = await params

  //If the username is not represent in the database show 404
  const checkUser = async () => {
    await connectDb()
    let u = await User.findOne({ username: username })
    if (!u) {
      return notFound()
    }
  }
  await checkUser()

  return (
    <>
      <PaymentPage username={username} />
    </>
  )


}

export async function generateMetadata({ params }) {
   const { username } = await params
  return {
    title: `Support ${username} - Get Me A Chai`,
  }
}