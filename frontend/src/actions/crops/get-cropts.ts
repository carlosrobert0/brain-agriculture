'use server'

import { api } from "@/lib/api";

export async function getCrops() {
  try {
    return await api('crops');
  } catch (error) {
    console.error('Error fetching crops:', error);
    throw error;
  }
}