import { useRouter } from 'next/router'

import React from 'react'

const Build = () => {
  // Get the query string
  const router = useRouter()
  const query = router.query

  return (
    <div>
      <h1>Build</h1>
      <p>{JSON.stringify(query)}</p>
    </div>
  )
}

export default Build
