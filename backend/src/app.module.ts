import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "./prisma/prisma.module"
import { ProducersModule } from "./producers/producers.module"
import { FarmsModule } from "./farms/farms.module"
import { HarvestsModule } from "./harvests/harvests.module"
import { CropsModule } from "./crops/crops.module"
import { DashboardModule } from "./dashboard/dashboard.module"
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ProducersModule,
    FarmsModule,
    HarvestsModule,
    CropsModule,
    DashboardModule,
  ],
})
export class AppModule { }
