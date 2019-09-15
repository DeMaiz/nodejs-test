import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from "typeorm";
import { Length } from "class-validator";
import * as bcrypt from "bcryptjs";
  
@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    @Index()
    public id: number;

    @Column()
    public invoiceId: number;

    @Column("decimal", { precision: 5, scale: 2 })
    public amount: number;

    @Column("decimal", { precision: 5, scale: 2 })
    public selling_price: number;

    @Column({ type: 'date' })
    @Index()
    public date: Date;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}