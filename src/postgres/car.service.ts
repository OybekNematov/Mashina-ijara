import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) {}

  async findAll(query: any): Promise<Car[]> {
    const { make, model, sortBy, order, page, limit, fields } = query;

    const qb = this.carRepository.createQueryBuilder('car');

    // Filterlash
    if (make) {
      qb.andWhere('car.make = :make', { make });
    }
    if (model) {
      qb.andWhere('car.model = :model', { model });
    }

    // Sortlash
    if (sortBy && order) {
      qb.orderBy(`car.${sortBy}`, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC');
    }

    // Pagination
    const pageNum = page || 1;
    const limitNum = limit || 10;
    qb.skip((pageNum - 1) * limitNum).take(limitNum);

    // Limit fields
    if (fields) {
      const selectedFields = fields.split(',').map((field: string) => `car.${field}`);
      qb.select(selectedFields);
    }

    return await qb.getMany();
  }
}
