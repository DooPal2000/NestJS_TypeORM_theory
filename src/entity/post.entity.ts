import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./user.entity";
import { TagModel } from "./tag.entity";

@Entity()
export class PostModel{
    @PrimaryGeneratedColumn()
    id: number;

    // 다:1 관계이기 때문에 복수로 적어줍니다.
    @ManyToOne(()=> UserModel, (user)=> user.posts)
    author: UserModel;

    @ManyToMany(()=>TagModel, (tag)=> tag.posts)
    @JoinTable()
    tags: TagModel[];

    @Column()
    title: string;
}