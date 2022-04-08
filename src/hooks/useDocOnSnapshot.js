import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { doc, onSnapshot } from "firebase/firestore"

export const useDocOnSnapshot = (col, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    let colRef = doc(db, col, id)
    setIsPending(true)

    const unsub = onSnapshot(colRef, doc => {
      // update state
      setDocument(doc.data())
      setError(null)
      setIsPending(false)
    }, (err) => {
      setError('Could not fetch data')
      console.log(err.message)
      setIsPending(false)
    })

    // unsub on unmount
    return () => unsub()
  }, [col, id])

  return { document, error, isPending }
}
