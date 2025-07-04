import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateFarmDto } from './create-farm.dto';

describe('CreateFarmDto', () => {
  it('should pass validation when arableArea + vegetationArea <= totalArea', async () => {
    const dto = plainToInstance(CreateFarmDto, {
      name: 'Fazenda Boa',
      city: 'Ribeirão Preto',
      state: 'SP',
      totalArea: 100,
      arableArea: 60,
      vegetationArea: 40,
      producerId: 'producer-123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when arableArea + vegetationArea > totalArea', async () => {
    const dto = plainToInstance(CreateFarmDto, {
      name: 'Fazenda Ruim',
      city: 'Ribeirão Preto',
      state: 'SP',
      totalArea: 100,
      arableArea: 70,
      vegetationArea: 50,
      producerId: 'producer-123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const areasError = errors.find(e => e.property === 'totalArea');
    expect(Object.keys(areasError?.constraints || {})).toContain('IsValidFarmAreasConstraint');
    expect(Object.values(areasError?.constraints || {})).toContain(
      'A soma da área agricultável e vegetação não pode ultrapassar a área total'
    );
  });
});
