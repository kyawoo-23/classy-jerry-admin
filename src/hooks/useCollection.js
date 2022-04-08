import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { collection, onSnapshot } from "firebase/firestore"

export const useCollection = (col) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    let colRef = collection(db, col)
    setIsPending(true)

    const unsub = onSnapshot(colRef, snapshot => {
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({ ...doc.data(), id: doc.id })
      })
      
      // update state
      setDocuments(results)
      setError(null)
      setIsPending(false)
    }, (err) => {
      setError('Could not fetch data')
      console.log(err.message)
      setIsPending(false)
    })

    // unsub on unmount
    return () => unsub()
  }, [col])

  return { documents, error, isPending }
}
