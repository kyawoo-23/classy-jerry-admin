import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert'

export default function Error({ err }) {
  const [show, setShow] = useState(true)

  return (
    show && (
      <Alert className='mt-3' onClose={() => setShow(false)} variant="danger" dismissible>
        <span>{err}</span>
      </Alert>
    )
  )
}
