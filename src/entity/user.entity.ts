import { Column, CreateDateColumn, Entity, Generated, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { ProfileModel } from "./profile.entity";
import { PostModel } from "./post.entity";

enum Role {
    USER = 'user',
    ADMIN = 'admin'
}

@Entity()
export class UserModel {
    // @PrimaryColumn과 차이점 숙지할 것
    // uuid 는 난수 사용한 고유값 생성, 1씩 올라가는 PrimaryGeneratedColumn 과 차이점 숙지
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER,
    })
    role: Role;

    // 이건 데이터 생성되는 날짜와 시간 자동으로 찍힘 == timestamp
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    //데이터가 업데이트 될 때마다 1씩 올라간다.
    @VersionColumn()
    version: number;

    // pk가 아니더라도, 아래와 같이 결합하여 uuid나 1씩 증가를 넣을 수 있습니다.
    @Column()
    @Generated('uuid')
    additionalId: string;

    @OneToOne(() => ProfileModel, (profile) => profile.user, {
        // find() 실행 할때마다 항상 같이 가져올 relation
        eager: true,
        // 저장할때 relation 을 한번에 같이 저장가능
        cascade: true,
        // null 허용여부
        nullable: true,
        // 삭제했을 때...
        // no action -> 아무것도 안함
        // cascade -> 참조하는 row 도 같이삭제
        // set null -> 참조하는 row 에서 참조 id 를 null로 변경
        // set default -> 기본 세팅으로 설정
        onDelete: 'CASCADE',

    })
    @JoinColumn()
    profile: ProfileModel;

    @OneToMany(() => PostModel, (post) => post.author)
    posts: PostModel[];
}