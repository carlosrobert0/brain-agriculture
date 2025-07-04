import { api } from "@/lib/api";

export async function deleteCrop(id: string) {
  try {
    await api(`crops/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting crop:', error);
    throw error;
  }
}