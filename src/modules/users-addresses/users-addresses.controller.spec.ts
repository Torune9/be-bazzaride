import { Test, TestingModule } from '@nestjs/testing';
import { UsersAddressesController } from './users-addresses.controller';
import { UsersAddressesService } from './users-addresses.service';

describe('UsersAddressesController', () => {
  let controller: UsersAddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersAddressesController],
      providers: [UsersAddressesService],
    }).compile();

    controller = module.get<UsersAddressesController>(UsersAddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
