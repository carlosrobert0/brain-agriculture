'use server'

import { api } from "@/lib/api"

export async function getHarvests() {
  try {
    return await api('harvests')
  } catch (error) {
    console.error('Error fetching harvests:', error)
    throw error
  }
}