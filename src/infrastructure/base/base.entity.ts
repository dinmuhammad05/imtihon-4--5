import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @CreateDateColumn({type:'timestamp'})
    created_at:Date

    @UpdateDateColumn({type:'timestamp'})
    update_at:Date
}