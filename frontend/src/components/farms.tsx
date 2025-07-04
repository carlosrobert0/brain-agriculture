"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { BRAZILIAN_STATES, type Farm } from "@/types"
import { useApp } from "@/context/app-context"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { farmSchema } from "@/actions/farms/schema"
import { deleteFarm } from "@/actions/farms/delete-farm"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateFarmDto } from "@/actions/farms/dto/create-farm-dto"
import { updateFarm } from "@/actions/farms/update-farm"
import { createFarm } from "@/actions/farms/create-farm"
import { ConfirmDeleteDialog } from "./confirm-delete-dialog"
import Link from "next/link"
import { useFarm } from "@/hooks/use-farm"
import { useProducer } from "@/hooks/use-producer"

export default function FarmsPage() {
  const { state, refreshFarms } = useApp()
  const [open, setOpen] = useState(false)
  const { farms, producers } = state
  const { onDeleteFarm, getFarmHarvestsCount } = useFarm()
  const { getProducerName } = useProducer()
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(farmSchema),
  })

  const handleSubmitFarm = async (data: CreateFarmDto) => {
    try {
      if (editingFarm) {
        await updateFarm(editingFarm.id, data)
      } else {
        await createFarm(data)
      }
      await refreshFarms()
      reset({
        producerId: "",
        name: "",
        city: "",
        state: "",
        totalArea: 0,
        arableArea: 0,
        vegetationArea: 0
      })
      setEditingFarm(null)
      setOpen(false)
    } catch (error) {
      console.error("Error submitting farm:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Propriedades Rurais</h2>
            <p className="text-gray-600">Gerencie as fazendas cadastradas no sistema</p>
          </div>
          <DialogTrigger asChild>
            <Button
              disabled={producers.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Fazenda
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent>
          <div className="fixed inset-0 bg-[#000000b2] bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <DialogTitle>
                  {editingFarm ? "Editar Fazenda" : "Nova Fazenda"}
                </DialogTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(handleSubmitFarm)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="producerId">Produtor</Label>

                    <Controller
                      name="producerId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um produtor" />
                          </SelectTrigger>
                          <SelectContent>
                            {state.producers.map((producer) => (
                              <SelectItem key={producer.id} value={producer.id}>
                                {producer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.producerId && <p className="text-sm text-red-600">{errors.producerId.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Fazenda</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Nome da fazenda"
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="Cidade"
                    />
                    {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>

                    <Controller
                      name="state"
                      control={control}
                      defaultValue={editingFarm?.state || ""}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {BRAZILIAN_STATES.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalArea">Área Total (hectares)</Label>
                    <Input
                      id="totalArea"
                      type="number"
                      step="0.01"
                      {...register("totalArea", { valueAsNumber: true })}
                      placeholder="0.00"
                    />
                    {errors.totalArea && <p className="text-sm text-red-600">{errors.totalArea.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arableArea">Área Agricultável (hectares)</Label>
                    <Input
                      id="arableArea"
                      type="number"
                      step="0.01"
                      {...register("arableArea", { valueAsNumber: true })}
                      placeholder="0.00"
                    />
                    {errors.arableArea && <p className="text-sm text-red-600">{errors.arableArea.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vegetationArea">Área de Vegetação (hectares)</Label>
                    <Input
                      id="vegetationArea"
                      type="number"
                      step="0.01"
                      {...register("vegetationArea", { valueAsNumber: true })}
                      placeholder="0.00"
                    />
                    {errors.vegetationArea && <p className="text-sm text-red-600">{errors.vegetationArea.message}</p>}
                  </div>


                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingFarm ? "Atualizar" : "Cadastrar"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        reset({
                          producerId: "",
                          name: "",
                          city: "",
                          state: "",
                          totalArea: 0,
                          arableArea: 0,
                          vegetationArea: 0
                        })
                        setEditingFarm(null)
                        setOpen(false)
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </DialogContent>

        {producers.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cadastre um produtor primeiro</h3>
              <p className="text-gray-600 text-center max-w-md">
                Para cadastrar fazendas, você precisa ter pelo menos um produtor rural cadastrado no sistema.
              </p>

              <Link href="/producers" className="mt-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Produtor
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <Card key={farm.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{farm.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {farm.city}, {farm.state}
                    </p>
                  </div>
                  <Badge variant="outline">{farm.state}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Produtor:</p>
                    <p className="text-sm text-gray-600">{getProducerName(farm.producerId)}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Total</p>
                      <p className="text-gray-600">{farm.totalArea.toLocaleString("pt-BR")} ha</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Agricultável</p>
                      <p className="text-gray-600">{farm.arableArea.toLocaleString("pt-BR")} ha</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Vegetação</p>
                      <p className="text-gray-600">{farm.vegetationArea.toLocaleString("pt-BR")} ha</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">{getFarmHarvestsCount(farm.id)} safra(s) cadastrada(s)</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingFarm(farm)
                        setOpen(true)
                        reset({
                          producerId: farm.producerId,
                          name: farm.name,
                          city: farm.city,
                          state: farm.state,
                          totalArea: farm.totalArea,
                          arableArea: farm.arableArea,
                          vegetationArea: farm.vegetationArea
                        })
                      }}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <ConfirmDeleteDialog
                      onDelete={() => onDeleteFarm(farm.id)}
                      onCancel={() => setOpen(false)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {farms.length === 0 && producers.length > 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma fazenda cadastrada</h3>
              <p className="text-gray-600 text-center max-w-md mb-4">
                Comece cadastrando a primeira propriedade rural para gerenciar safras e culturas.
              </p>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeira Fazenda
                </Button>
              </DialogTrigger>
            </CardContent>
          </Card>
        )}
      </div>
    </Dialog>
  )
}
