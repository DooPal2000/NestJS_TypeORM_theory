import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { PostModel } from "./post.entity";

@Entity()
export class TagModel{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(()=>PostModel, (post)=> post.tags)
    posts: PostModel[];
    
    @Column()
    name: string;
}