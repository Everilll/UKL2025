import { Test, TestingModule } from '@nestjs/testing';
import { PenjadwalanService } from './penjadwalan.service';

describe('PenjadwalanService', () => {
  let service: PenjadwalanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PenjadwalanService],
    }).compile();

    service = module.get<PenjadwalanService>(PenjadwalanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
