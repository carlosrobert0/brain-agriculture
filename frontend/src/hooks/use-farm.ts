import { deleteFarm } from "@/actions/farms/delete-farm"
import { useApp } from "@/context/app-context"

export function useFarm() {
  const { refreshFarms, state } = useApp()
  const onDeleteFarm = async (farmId: string) => {
    try {
      await deleteFarm(farmId)
      await refreshFarms()
    } catch (error) {
      console.error("Error deleting farm:", error)
    }
  }

  const getFarmHarvestsCount = (farmId: string) => {
    return state.harvests.filter((harvest) => harvest.farmId === farmId).length
  }

  const getFarmName = (farmId: string) => {
    const farm = state.farms.find((f) => f.id === farmId)
    return farm?.name || "Fazenda não encontrada"
  }

  return { onDeleteFarm, getFarmHarvestsCount, getFarmName }
}