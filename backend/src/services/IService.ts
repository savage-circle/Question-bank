export interface IService<IEntity, TCreateDTO> {
  deleteAsync(id: number): Promise<void>;
  getAllAsync(options?: Record<string, number | undefined>): Promise<IEntity[]>;
  getByIdAsync(id: number): Promise<IEntity | null>;
  existsAsync(id: number): Promise<boolean>;
  createAsync(data: TCreateDTO): Promise<IEntity>;
  updateAsync(id: number, data: TCreateDTO): Promise<IEntity>;
}
