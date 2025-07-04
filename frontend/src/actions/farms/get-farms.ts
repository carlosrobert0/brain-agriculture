'use server'

import { api } from "@/lib/api"

export async function getFarms() {
  try {
    return await api('farms')
  } catch (error) {
    console.error('Error fetching farms:', error)
    throw error
  }
}