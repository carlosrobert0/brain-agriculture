import { api } from "@/lib/api";

export async function deleteHarvest(id: string) {
  try {
    await api(`harvests/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting harvest:', error);
    throw error;
  }
}