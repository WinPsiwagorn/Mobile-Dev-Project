import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  getDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Bill } from "./types"

const COLLECTION = "bills"

// Create a new bill
export const addBill = async (bill: Omit<Bill, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...bill,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding bill:", error)
    throw error
  }
}

// Get a bill by ID
export const getBill = async (id: string): Promise<Bill | null> => {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate().toISOString() : data.dueDate,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Bill
    }
    return null
  } catch (error) {
    console.error("Error getting bill:", error)
    throw error
  }
}

// Get all bills for a user
export const getUserBills = async (userId: string): Promise<Bill[]> => {
  try {
    const q = query(collection(db, COLLECTION), where("userId", "==", userId), orderBy("dueDate"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate().toISOString() : data.dueDate,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Bill
    })
  } catch (error) {
    console.error("Error getting user bills:", error)
    throw error
  }
}

// Update a bill
export const updateBill = async (id: string, bill: Partial<Bill>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION, id)
    await updateDoc(docRef, {
      ...bill,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating bill:", error)
    throw error
  }
}

// Delete a bill
export const deleteBill = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting bill:", error)
    throw error
  }
}

// Listen to bills for a user in real-time
export const subscribeToUserBills = (userId: string, callback: (bills: Bill[]) => void) => {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId), orderBy("dueDate"))

  return onSnapshot(
    q,
    (querySnapshot) => {
      const bills = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate().toISOString() : data.dueDate,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Bill
      })
      callback(bills)
    },
    (error) => {
      console.error("Error listening to bills:", error)
    },
  )
}
