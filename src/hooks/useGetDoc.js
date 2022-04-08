import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"

export const useGetDoc = (col, docu) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    setIsPending(true)
    if (docu) {
      const docRef = doc(db, col, docu);
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
          setDocument(docSnap.data())
          setError(null)
          setIsPending(false)
        } else {
          console.log("not found")
          setIsPending(false)
        }
      }).catch(err => {
        console.log("error", err)
      })
    }
  }, [col, docu])

  return { document, error, isPending }
}
