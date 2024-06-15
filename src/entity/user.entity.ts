import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

enum Role{
    USER = 'user',
    ADMIN = 'admin'
}

@Entity()
export class UserModel{
    // @PrimaryColumn과 차이점 숙지할 것
    // uuid 는 난수 사용한 고유값 생성, 1씩 올라가는 PrimaryGeneratedColumn 과 차이점 숙지
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        type: 'varchar',
        // 데이터베이스 칼럼 이름
        // 프로퍼티 이름으로 자동 유추됨
        name: 'title',

        //값의 길이
        length: 300,

        // null이 가능한지
        nullable: true,       

        //true : 처음 저장할때만 값 지정 가능
        //false: 이후에는 값 변경 불가능
        update: false,

        //기본값이 true
        // find() 를 실행시, 기본으로 값을 불러올지
        select: true,

        //기본 값, 아무것도 입력하지 않았을 때 입력되는 값
        default: 'default value',
        
        // 칼럼중에서 유일무이한 값이 되어야 하는지
        unique: false,
    })
    title: string;
    
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
    @Generated()
    additionalId: number;
}