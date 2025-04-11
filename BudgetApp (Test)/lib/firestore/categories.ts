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
  getDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Category } from "./types"

const COLLECTION = "categories"

// Create a new category
export const addCategory = async (category: Omit<Category, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding category:", error)
    throw error
  }
}

// Get a category by ID
export const getCategory = async (id: string): Promise<Category | null> => {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Category
    }
    return null
  } catch (error) {
    console.error("Error getting category:", error)
    throw error
  }
}

// Get all categories for a user
export const getUserCategories = async (userId: string): Promise<Category[]> => {
  try {
    const q = query(collection(db, COLLECTION), where("userId", "==", userId), orderBy("name"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Category
    })
  } catch (error) {
    console.error("Error getting user categories:", error)
    throw error
  }
}

// Update a category
export const updateCategory = async (id: string, category: Partial<Category>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION, id)
    await updateDoc(docRef, {
      ...category,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating category:", error)
    throw error
  }
}

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting category:", error)
    throw error
  }
}

// Listen to categories for a user in real-time
export const subscribeToUserCategories = (userId: string, callback: (categories: Category[]) => void) => {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId), orderBy("name"))

  return onSnapshot(
    q,
    (querySnapshot) => {
      const categories = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Category
      })
      callback(categories)
    },
    (error) => {
      console.error("Error listening to categories:", error)
    },
  )
}
