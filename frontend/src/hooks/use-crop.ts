import { deleteCrop } from "@/actions/crops/delete-crop";
import { useApp } from "@/context/app-context";

export function useCrop() {
  const { state, refreshCrops } = useApp();

  const onDeleteCrop = async (cropId: string) => {
    try {
      await deleteCrop(cropId)
      await refreshCrops()
    } catch (error) {
      console.error("Error deleting crop:", error)
    }
  }

  return { onDeleteCrop };
}