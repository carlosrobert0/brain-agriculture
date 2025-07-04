import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // CORS
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })

  // API prefix
  // app.setGlobalPrefix(configService.get("API_PREFIX", "api"))

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle(configService.get("SWAGGER_TITLE", "Brain Agriculture API"))
    .setDescription(configService.get("SWAGGER_DESCRIPTION", "API para gestão de produtores rurais"))
    .setVersion(configService.get("SWAGGER_VERSION", "1.0"))
    .addTag("producers", "Operações relacionadas aos produtores rurais")
    .addTag("farms", "Operações relacionadas às propriedades rurais")
    .addTag("harvests", "Operações relacionadas às safras")
    .addTag("crops", "Operações relacionadas às culturas")
    .addTag("dashboard", "Operações relacionadas ao dashboard")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("/docs", app, document)

  const port = configService.get("PORT", 3001)
  await app.listen(port)

  console.log(`🚀 Application is running on: http://localhost:${port}`)
  console.log(`📚 Swagger documentation: http://localhost:${port}/docs`)
}

bootstrap()
