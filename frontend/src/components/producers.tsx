"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit } from "lucide-react"
import type { DocumentType, Producer } from "@/types"
import { formatDocument } from "@/lib/validations"
import { useApp } from "@/context/app-context"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { producerSchema } from "@/actions/producers/schema"
import { CreateProducerDto } from "@/actions/producers/dto/create-producer-dto"
import { updateProducer } from "@/actions/producers/update-producer"
import { createProducer } from "@/actions/producers/create-producer"
import { ConfirmDeleteDialog } from "./confirm-delete-dialog"
import { useProducer } from "@/hooks/use-producer"

export default function ProducersPage() {
  const { state, refreshProducers } = useApp()
  const { producers } = state
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null)
  const [open, setOpen] = useState(false)
  const { getProducerFarmsCount, getProducerName, onDeleteProducer } = useProducer()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(producerSchema)
  })

  const handleSubmitProducer = async (data: CreateProducerDto) => {
    try {
      if (editingProducer) {
        await updateProducer(editingProducer?.id, data)
      } else {
        await createProducer(data)
      }
      reset({
        name: "",
        document: "",
        documentType: "CPF"
      })
      setOpen(false)
      setEditingProducer(null)
      await refreshProducers()
    } catch (error) {
      console.error("Erro ao cadastrar produtor:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Produtores Rurais</h2>
            <p className="text-gray-600">Gerencie os produtores cadastrados no sistema</p>
          </div>
          <DialogTrigger>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produtor
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent>
          <div className="fixed inset-0 bg-[#000000b2] bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <DialogTitle>{editingProducer ? "Editar Produtor" : "Novo Produtor"}</DialogTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(handleSubmitProducer)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Nome do produtor"
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentType">Tipo de Documento</Label>

                    <Controller
                      name="documentType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value as DocumentType)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de documento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CPF">CPF</SelectItem>
                            <SelectItem value="CNPJ">CNPJ</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.documentType && <p className="text-sm text-red-600">{errors.documentType.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document">{editingProducer?.documentType}</Label>
                    <Input
                      id="document"
                      {...register("document")}
                      placeholder={editingProducer?.documentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
                      maxLength={editingProducer?.documentType === "CPF" ? 14 : 18}
                    />
                    {errors.document && <p className="text-sm text-red-600">{errors.document.message}</p>}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingProducer ? "Atualizar" : "Cadastrar"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOpen(false)
                        reset({
                          name: "",
                          document: "",
                          documentType: "CPF"
                        })
                        setEditingProducer(null)
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {producers.map((producer) => (
            <Card key={producer.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{producer.name}</CardTitle>
                    <p className="text-sm text-gray-600">{formatDocument(producer.document, producer.documentType as DocumentType)}</p>
                  </div>
                  <Badge variant={producer.documentType === "CPF" ? "default" : "secondary"}>
                    {producer.documentType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">{getProducerFarmsCount(producer.id)} fazenda(s) cadastrada(s)</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingProducer(producer)
                        setOpen(true)
                        reset({
                          name: producer.name,
                          document: producer.document,
                          documentType: producer.documentType
                        })
                      }}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <ConfirmDeleteDialog
                      onDelete={() => onDeleteProducer(producer.id)}
                      onCancel={() => setOpen(false)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {producers.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Plus className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produtor cadastrado</h3>
              <p className="text-gray-600 text-center max-w-md mb-4">
                Comece cadastrando o primeiro produtor rural para gerenciar suas propriedades e culturas.
              </p>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingProducer(null)
                    reset({
                      name: "",
                      document: "",
                      documentType: "CPF"
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Produtor
                </Button>
              </DialogTrigger>
            </CardContent>
          </Card>
        )}
      </div>
    </Dialog>
  )
}
