import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./user.entity";

@Entity()
export class PostModel{
    @PrimaryGeneratedColumn()
    id: number;

    // 다:1 관계이기 때문에 복수로 적어줍니다.
    @ManyToOne(()=> UserModel, (user)=> user.posts)
    author: UserModel;

    @Column()
    title: string;
}