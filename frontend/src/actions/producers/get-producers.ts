'use server'

import { api } from "@/lib/api"

export async function getProducers() {
  try {
    return await api('producers')
  } catch (error) {
    console.error('Error fetching producers:', error)
    throw error
  }
}