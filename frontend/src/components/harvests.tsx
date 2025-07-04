"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Wheat } from "lucide-react"
import type { Harvest } from "@/types"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { useApp } from "@/context/app-context"
import { CreateHarvestDto } from "@/actions/harvests/dto/create-harvest-dto"
import { updateHarvest } from "@/actions/harvests/update-harvest"
import { createHarvest } from "@/actions/harvests/create-harvest"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { harvestSchema } from "@/actions/harvests/schema"
import { deleteHarvest } from "@/actions/harvests/delete-harvest"
import { ConfirmDeleteDialog } from "./confirm-delete-dialog"
import Link from "next/link"
import { useHarvest } from "@/hooks/use-harvest"
import { useFarm } from "@/hooks/use-farm"

export default function HarvestsPage() {
  const { state, refreshHarvests } = useApp()
  const [open, setOpen] = useState(false)
  const { farms, harvests } = state
  const { seasons, getHarvestCropsCount, onDeleteHarvest } = useHarvest()
  const { getFarmName } = useFarm()
  const [editingHarvest, setEditingHarvest] = useState<Harvest | null>(null)


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(harvestSchema),
  })

  const handleSubmitHarvest = async (data: CreateHarvestDto) => {
    try {
      if (editingHarvest) {
        await updateHarvest(editingHarvest?.id, data)
      } else {
        await createHarvest(data)
      }
      reset({
        year: "",
        season: "",
        farmId: "",
      })
      setOpen(false)
      setEditingHarvest(null)
      await refreshHarvests()
    } catch (error) {
      console.error("Erro ao salvar safra:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Safras</h2>
            <p className="text-gray-600">Gerencie as safras cadastradas no sistema</p>
          </div>
          <DialogTrigger asChild>
            <Button disabled={farms.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Safra
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent>
          <div className="fixed inset-0 bg-[#000000b2] bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{editingHarvest ? "Editar Safra" : "Nova Safra"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(handleSubmitHarvest)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="farmId">Fazenda</Label>

                    <Controller
                      name="farmId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma fazenda" />
                          </SelectTrigger>
                          <SelectContent>
                            {farms.map((farm) => (
                              <SelectItem key={farm.id} value={farm.id}>
                                {farm.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.farmId && (
                      <p className="text-red-600 text-sm">{errors.farmId.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Ano</Label>
                    <Input
                      id="year"
                      type="number"
                      min="2000"
                      max="2050"
                      {...register("year")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="season">Temporada</Label>

                    <Controller
                      name="season"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma temporada" />
                          </SelectTrigger>
                          <SelectContent>
                            {seasons.map((season) => (
                              <SelectItem key={season} value={season}>
                                {season}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.season && (
                      <p className="text-red-600 text-sm">{errors.season.message}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingHarvest ? "Atualizar" : "Cadastrar"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOpen(false)
                        setEditingHarvest(null)
                        reset({
                          year: "",
                          season: "",
                          farmId: "",
                        })
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

        {farms.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wheat className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cadastre uma fazenda primeiro</h3>
              <p className="text-gray-600 text-center max-w-md">
                Para cadastrar safras, você precisa ter pelo menos uma fazenda cadastrada no sistema.
              </p>

              <Link href="/farms" className="mt-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Fazenda
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {harvests.map((harvest) => (
            <Card key={harvest.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-lg">
                      {harvest.season} {harvest.year}
                    </DialogTitle>
                    <p className="text-sm text-gray-600">{getFarmName(harvest.farmId)}</p>
                  </div>
                  <Badge variant="outline">{harvest.year}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">{getHarvestCropsCount(harvest.id)} cultura(s) plantada(s)</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"
                      onClick={() => {
                        setEditingHarvest(harvest)
                        reset({
                          year: harvest.year.toString(),
                          season: harvest.season,
                          farmId: harvest.farmId,
                        })
                        setOpen(true)
                      }}
                      disabled={isSubmitting || !farms.length}
                      className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <ConfirmDeleteDialog
                      onDelete={() => onDeleteHarvest(harvest.id)}
                      onCancel={() => setOpen(false)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {harvests?.length === 0 && farms?.length > 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wheat className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma safra cadastrada</h3>
              <p className="text-gray-600 text-center max-w-md mb-4">
                Comece cadastrando a primeira safra para gerenciar as culturas plantadas.
              </p>
              <DialogTrigger asChild>
                <Button
                  disabled={isSubmitting || !farms.length}
                  onClick={() => {
                    setEditingHarvest(null)
                    reset({
                      year: "",
                      season: "",
                      farmId: "",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeira Safra
                </Button>
              </DialogTrigger>
            </CardContent>
          </Card>
        )}
      </div>
    </Dialog>
  )
}
