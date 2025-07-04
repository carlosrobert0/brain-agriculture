"use client"

import { CustomPieChart } from "@/components/pie-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/context/app-context"
import { BarChart3, MapPin, Wheat, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { getDashboardData } = useApp()
  const dashboardData = getDashboardData()

  const stateChartData = dashboardData.farmsByState.map((item) => ({
    name: item.state,
    value: item.count,
  }))

  const cropChartData = dashboardData.cropsByType.map((item) => ({
    name: item.crop,
    value: item.area,
  }))

  const landUseChartData = dashboardData.landUse.map((item) => ({
    name: item.type,
    value: item.area,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Fazendas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.totalFarms}
            </div>
            <p className="text-xs text-muted-foreground">Propriedades cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Hectares</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.totalHectares.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground">Área total registrada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Culturas Plantadas</CardTitle>
            <Wheat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.cropsByType.length}
            </div>
            <p className="text-xs text-muted-foreground">Tipos diferentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Área Cultivada</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.cropsByType.reduce((sum, crop) => sum + crop.area, 0).toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground">Hectares em cultivo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {stateChartData.length > 0 && <CustomPieChart data={stateChartData} title="Fazendas por Estado" />}

        {cropChartData.length > 0 && <CustomPieChart data={cropChartData} title="Culturas por Área (hectares)" />}

        {landUseChartData.some((item) => item.value > 0) && (
          <CustomPieChart data={landUseChartData.filter((item) => item.value > 0)} title="Uso do Solo" />
        )}
      </div>

      {dashboardData.totalFarms === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum dado encontrado</h3>
            <p className="text-gray-600 text-center max-w-md">
              Comece cadastrando produtores rurais e suas propriedades para visualizar os dados no dashboard.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
