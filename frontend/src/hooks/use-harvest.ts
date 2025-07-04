import { deleteHarvest } from "@/actions/harvests/delete-harvest";
import { useApp } from "@/context/app-context";

export function useHarvest() {
  const { state, refreshHarvests } = useApp();

  const seasons = ["Verão", "Outono", "Inverno", "Primavera", "Safra", "Safrinha"]

  const getHarvestInfo = (harvestId: string) => {
    const harvest = state.harvests.find((h) => h.id === harvestId)
    if (!harvest) return "Safra não encontrada"

    const farm = state.farms.find((farm) => farm.id === harvest.farmId)
    return `${harvest.season} ${harvest.year} - ${farm?.name || "Fazenda"}`
  }

  const getHarvestCropsCount = (harvestId: string) => {
    return state.crops.filter((crop) => crop.harvestId === harvestId).length
  }

  const onDeleteHarvest = async (harvestId: string) => {
    try {
      await deleteHarvest(harvestId)
      await refreshHarvests()
    } catch (error) {
      console.error("Error deleting harvest:", error)
    }
  }

  return { seasons, getHarvestInfo, getHarvestCropsCount, onDeleteHarvest };
}