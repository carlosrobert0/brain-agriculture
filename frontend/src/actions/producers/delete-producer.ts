import { api } from "@/lib/api";

export async function deleteProducer(id: string) {
  try {
    await api(`producers/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting procuder:', error);
    throw error;
  }
}