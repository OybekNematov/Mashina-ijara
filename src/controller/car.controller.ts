import { Controller, Get, Query } from '@nestjs/common';
import { CarService } from './car.service';
import { Car } from './car.entity';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  async getAllCars(@Query() query: any): Promise<Car[]> {
    return this.carService.findAll(query);
  }
}

