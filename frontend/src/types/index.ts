export interface Producer {
  id: string
  name: string
  document: string
  documentType: DocumentType
  createdAt: Date
  updatedAt: Date
}

export interface Farm {
  id: string
  name: string
  city: string
  state: string
  totalArea: number
  arableArea: number
  vegetationArea: number
  producerId: string
  producer: Producer
  createdAt: Date
  updatedAt: Date
}

export interface Harvest {
  id: string
  year: number
  season: string
  farmId: string
  farm: Farm
  createdAt: Date
  updatedAt: Date
}

export interface Crop {
  id: string
  name: string
  area: number
  harvestId: string
  harvest: Harvest
  createdAt: Date
  updatedAt: Date
}

export interface DashboardData {
  totalFarms: number
  totalHectares: number
  farmsByState: { state: string; count: number }[]
  cropsByType: { crop: string; area: number }[]
  landUse: { type: string; area: number }[]
}

export const BRAZILIAN_STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

export const CROP_TYPES = [
  "Soja",
  "Milho",
  "Algodão",
  "Café",
  "Cana-de-açúcar",
  "Arroz",
  "Feijão",
  "Trigo",
  "Mandioca",
  "Cacau",
]

export type DocumentType = "CPF" | "CNPJ"