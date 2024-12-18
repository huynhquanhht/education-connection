import { Column, Entity } from 'typeorm';

@Entity('classes')
export class Class {
  @Column({ name: 'id', type: 'int', generated: 'increment', primary: true })
  id?: number;

  @Column({ name: 'name', type: 'varchar', unique: true })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
