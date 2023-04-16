import React from 'react'
import Navbar from '@/Components/Navbar'
import Footer from '@/Components/Footer'

export default function Layouts({ children }) {
    return (
    <>
      <Navbar />
        <main>{children}</main>
      <Footer />
    </>
  )
}