// app/page.tsx
'use client'
import Link from "next/link"

export default function Page() {
  return (
    <Link href='/about' color='blue.400' _hover={{ color: 'blue.500' }}>
      About
    </Link>
  )
}