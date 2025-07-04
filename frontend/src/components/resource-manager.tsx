"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Sprout } from "lucide-react"
import { type Crop, CROP_TYPES } from "@/types"
import { Dialog, DialogContent, DialogTrigger, DialogClose, Close } from "@radix-ui/react-dialog"
import Link from "next/link"
import { useApp } from "@/context/app-context"
import { createCrop } from "@/actions/crops/create-crop"
import { updateCrop } from "@/actions/crops/update-crop"
import { CreateCropDto } from "@/actions/crops/dto/create-crop-dto"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cropSchema } from "@/actions/crops/schema"
import { deleteCrop } from "@/actions/crops/delete-crop"
import { ConfirmDeleteDialog } from "./confirm-delete-dialog"

export default function ResourceManager() {
  const [open, setOpen] = useState(false)
  const { state: appState, refreshCrops } = useApp()
  const { crops, harvests, farms } = appState
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null)

  const handleDelete = async (cropId: string) => {
    try {
      await deleteCrop(cropId)
      await refreshCrops()
    } catch (error) {
      console.error("Error deleting crop:", error)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm({
    defaultValues: {
      harvestId: editingCrop?.harvestId || "",
      name: editingCrop?.name || "",
      area: editingCrop?.area || 0,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(cropSchema),
  })

  const handleSubmitCrop = async (data: CreateCropDto) => {
    try {
      if (editingCrop) {
        await updateCrop(editingCrop?.id, data)
      } else {
        await createCrop(data)
      }
      reset({
        harvestId: "",
        name: "",
        area: 0,
      })
      setEditingCrop(null)
      setOpen(false)
      await refreshCrops()
    } catch (error) {
      setEditingCrop(null)
      console.error("Error creating crop:", error)
    }
  }

  const getHarvestInfo = (harvestId: string) => {
    const harvest = harvests.find((h) => h.id === harvestId)
    if (!harvest) return "Safra não encontrada"

    const farm = farms.find((f) => f.id === harvest.farmId)
    return `${harvest.season} ${harvest.year} - ${farm?.name || "Fazenda"}`
  }

  const handleClose = () => {
    setOpen(false)
    setEditingCrop(null)
    reset({
      harvestId: "",
      name: "",
      area: 0,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Culturas</h2>
            <p className="text-gray-600">Gerencie as culturas plantadas nas safras</p>
          </div>
          <DialogTrigger asChild>
            <Button
              disabled={harvests?.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Cultura
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent>
          <div className="fixed inset-0 bg-[#000000b2] flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Nova Cultura</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(handleSubmitCrop)}
                  className="space-y-4 w-full">
                  <div className="space-y-2 w-full">
                    <Label htmlFor="harvestId">Safra</Label>
                    <Controller
                      name="harvestId"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma safra" />
                          </SelectTrigger>
                          <SelectContent>
                            {harvests?.map((harvest) => (
                              <SelectItem key={harvest.id} value={harvest.id}>
                                {getHarvestInfo(harvest.id)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.harvestId && (
                      <p className="text-red-600 text-xs">{errors.harvestId.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Tipo de Cultura</Label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma cultura" />
                          </SelectTrigger>
                          <SelectContent>
                            {CROP_TYPES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Área Plantada (hectares)</Label>
                    <Input
                      id="area"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("area", { valueAsNumber: true })}
                    />
                    {errors.area && (
                      <p className="text-xs text-red-500">{errors.area.message}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {
                        editingCrop ? (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            {
                              isSubmitting ? "Atualizando..." : "Atualizar"
                            }
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            {
                              isSubmitting ? "Cadastrando..." : "Cadastrar"
                            }
                          </>
                        )
                      }
                    </Button>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" onClick={handleClose}>
                        Cancelar
                      </Button>
                    </DialogClose>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </DialogContent>

        {harvests?.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Sprout className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cadastre uma safra primeiro</h3>
              <p className="text-gray-600 text-center max-w-md">
                Para cadastrar culturas, você precisa ter pelo menos uma safra cadastrada no sistema.
              </p>
              <Link href="/harvests" className="mt-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Safra
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops?.map((crop: any) => (
            <Card key={crop.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{crop.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {crop.harvestId ? `Safra: ${getHarvestInfo(crop.harvestId)}` : "Safra não definida"}
                    </p>
                  </div>
                  <Badge variant="outline">{crop.area.toLocaleString("pt-BR")} ha</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Área Plantada:</p>
                    <p className="text-sm text-gray-600">{crop.area.toLocaleString("pt-BR")} hectares</p>
                  </div>

                  <div className="flex gap-2">
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setEditingCrop(crop)
                          setOpen(true)
                          reset({
                            harvestId: crop.harvestId,
                            name: crop.name,
                            area: crop.area,
                          })
                        }}
                        disabled={isSubmitting || harvests?.length === 0}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <ConfirmDeleteDialog
                      onDelete={() => handleDelete(crop.id)}
                      onCancel={() => setOpen(false)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {crops?.length === 0 && harvests?.length > 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Sprout className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma cultura cadastrada</h3>
              <p className="text-gray-600 text-center max-w-md mb-4">
                Comece cadastrando a primeira cultura para acompanhar o que está sendo plantado.
              </p>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeira Cultura
                </Button>
              </DialogTrigger>
            </CardContent>
          </Card>
        )}
      </div>
    </Dialog>
  )
}
