import { deleteProducer } from "@/actions/producers/delete-producer"
import { useApp } from "@/context/app-context"

export function useProducer() {
  const { state, refreshProducers } = useApp()

  const getProducerName = (producerId: string) => {
    const producer = state.producers.find((p) => p.id === producerId)
    return producer?.name || "Produtor não encontrado"
  }

  const getProducerFarmsCount = (producerId: string) => {
    return state.farms.filter((farm) => farm.producerId === producerId).length
  }

  const onDeleteProducer = async (producerId: string) => {
    try {
      await deleteProducer(producerId)
      await refreshProducers()
    } catch (error) {
      console.error("Erro ao excluir produtor:", error)
    }
  }

  return { getProducerName, getProducerFarmsCount, onDeleteProducer }
}