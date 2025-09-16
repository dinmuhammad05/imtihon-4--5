import { HttpException } from '@nestjs/common';
import {
  Repository,
  DeepPartial,
  FindOptionsWhere,
  FindOneOptions,
  FindManyOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';
import { successRes } from '../response/successRes';
import { ISuccessRes } from 'src/common';

export class BaseService<CreateDto, UpdateDto, Entity extends { id: string }> {
  constructor(private readonly repository: Repository<Entity>) {}

  get getRepository() {
    return this.repository;
  }

  async create(dto: CreateDto): Promise<ISuccessRes> {
    let data = this.repository.create(dto as DeepPartial<Entity>);
    data = await this.repository.save(data);
    return successRes(data, 201);
  }

  async findAll(where?: FindManyOptions<Entity>): Promise<ISuccessRes> {
    const data = await this.repository.find(where);
    return successRes(data);
  }

  async findOneById(
    id: string,
    options?: FindOneOptions<Entity>,
  ): Promise<ISuccessRes> {
    const data = await this.repository.findOne({
      where: { id } as FindOptionsWhere<Entity>,
      ...options,
    });

    if (!data) {
      throw new HttpException('Not found', 404);
    }

    return successRes(data);
  }

  async update(id: string, dto: UpdateDto): Promise<ISuccessRes> {
    await this.findOneById(id);
    const data = await this.repository.update(
      id,
      dto as unknown as QueryDeepPartialEntity<Entity>,
    );

    return successRes(data);
  }

  async remove(id: string): Promise<ISuccessRes> {
    await this.findOneById(id);
    await this.repository.delete(id);
    return successRes({});
  }
}
