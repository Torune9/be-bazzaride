import { Test, TestingModule } from '@nestjs/testing';
import { UsersAddressesService } from './users-addresses.service';

describe('UsersAddressesService', () => {
  let service: UsersAddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersAddressesService],
    }).compile();

    service = module.get<UsersAddressesService>(UsersAddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
