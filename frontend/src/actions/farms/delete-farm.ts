import { api } from "@/lib/api";

export async function deleteFarm(id: string) {
  try {
    await api(`farms/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting farm:', error);
    throw error;
  }
}