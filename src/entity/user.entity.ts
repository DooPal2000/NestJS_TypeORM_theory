import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity()
export class UserModel{
    // @PrimaryColumn과 차이점 숙지할 것
    // uuid 는 난수 사용한 고유값 생성, 1씩 올라가는 PrimaryGeneratedColumn 과 차이점 숙지
    @PrimaryGeneratedColumn('uuid')
    id: number;
    
    @Column()
    title: string;

    // 이건 데이터 생성되는 날짜와 시간 자동으로 찍힘 == timestamp
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()    
    updateAt: Date;

    //데이터가 업데이트 될 때마다 1씩 올라간다.
    @VersionColumn()
    version: number;
}