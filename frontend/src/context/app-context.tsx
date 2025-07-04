'use client'

import { getCrops } from "@/actions/crops/get-cropts";
import { getFarms } from "@/actions/farms/get-farms";
import { getHarvests } from "@/actions/harvests/get-harvests";
import { getProducers } from "@/actions/producers/get-producers";
import { Crop, DashboardData, Farm, Harvest, Producer } from "@/types";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface AppState {
  producers: Producer[];
  farms: Farm[];
  harvests: Harvest[];
  crops: Crop[];
}

const initialState: AppState = {
  producers: [],
  farms: [],
  harvests: [],
  crops: [],
}

interface AppContextType {
  state: AppState;
  getDashboardData: () => DashboardData;
  refreshAllData: () => Promise<void>;
  refreshCrops: () => Promise<void>;
  refreshFarms: () => Promise<void>;
  refreshHarvests: () => Promise<void>;
  refreshProducers: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const refreshAllData = async () => {
    const [producers, farms, harvests, crops] = await Promise.all([
      getProducers(),
      getFarms(),
      getHarvests(),
      getCrops()
    ]);

    setState({
      producers,
      farms,
      harvests,
      crops
    });
  };

  const refreshCrops = async () => {
    const crops = await getCrops();
    setState(prevState => ({ ...prevState, crops }));
  };

  const refreshFarms = async () => {
    const farms = await getFarms();
    setState(prevState => ({ ...prevState, farms }));
  };

  const refreshHarvests = async () => {
    const harvests = await getHarvests();
    setState(prevState => ({ ...prevState, harvests }));
  };

  const refreshProducers = async () => {
    const producers = await getProducers();
    setState(prevState => ({ ...prevState, producers }));
  };

  useEffect(() => {
    refreshAllData();

    return () => {
      setState(initialState);
    }
  }, [])

  const getDashboardData = (): DashboardData => {
    const totalFarms = state.farms.length;
    const totalHectares = state.crops.reduce((sum, crop) => sum + crop.area, 0);

    const farmsByState = state.farms.reduce((acc, farm) => {
      acc[farm.state] = (acc[farm.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const cropsByType = state.crops.reduce((acc, crop) => {
      acc[crop.name] = (acc[crop.name] || 0) + crop.area;
      return acc;
    }, {} as Record<string, number>);

    const landUse = [
      { type: "Cultivated", area: totalHectares },
      { type: "Vegetation", area: 1000 - totalHectares },
    ];

    return {
      totalFarms,
      totalHectares,
      farmsByState: Object.entries(farmsByState).map(([state, count]) => ({ state, count })),
      cropsByType: Object.entries(cropsByType).map(([crop, area]) => ({ crop, area })),
      landUse,
    };
  };


  return (
    <AppContext.Provider value={{
      state,
      getDashboardData,
      refreshAllData,
      refreshCrops,
      refreshFarms,
      refreshHarvests,
      refreshProducers
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}