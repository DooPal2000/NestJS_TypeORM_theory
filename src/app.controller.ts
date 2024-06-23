import { Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { ILike, LessThan, Like, MoreThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,

  ) { }

  @Post('users')
  async postUser() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@google.com`
      });
    }
  }
  @Get('users')
  getUsers() {
    return this.userRepository.find({
      where: {
        // // 아닌 경우 가져오기
        // id: Not(101),
        // // 적은 경우 가져오기
        // id: LessThan(110),
        // id:MoreThan(120),
        // id:MoreThanOrEqual(120),

        // //유사값
        // email: Like('%google%'),
        // // 대소문자 구분없는 유사값
        // email: ILike('%google%'),

        // 이외에도 Between, In, IsNull 등이 있다


      },



      // 어떤 프로퍼티를 선택할지
      // 기본값:  모든 프로퍼티를 가져온다
      select: {
        // id: true,
        // createdAt: true,
        // email: true,
        // profile: {
        //   id: true
        // },
      },

      //필터링할 조건을 입력하게 된다. (조건은 and 조건으로 묶인다)
      // 리스트로 제공할 경우, or 조건으로 묶이게 된다.

      // // 관계를 가져오는 법
      // relations: {
      //   profile: true,
      // },

      // 오름차순, 내림차순 정렬
      order: {
        id: 'ASC'
      },

      // // 처음 몇개를 제외할지, 몇개를 가져올지
      // skip: 0,
      // take: 3
    });
  }

  @Patch('users/:id')
  async patchUser(
    @Param('id') id: string,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      }
    });

    return this.userRepository.save({
      ...user,
    })
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'abbcdef@naver.com',
    });

    const profile = await this.profileRepository.save({
      profileImg: 'asdf.jpg',
      user,
    });
    return user;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'postuser@naver.com',
      profile: {
        profileImg: 'asdf.jpg',
      }
    });

    // const profile = await this.profileRepository.save({
    //   profileImg: 'asdf.jpg',
    //   user,
    // });

    console.log(user);

    await this.postRepository.save({
      author: user,
      title: 'post 1',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 2',
    });

    return user;

  }
  @Post('posts/tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'Nestjs 1',
    });
    const post2 = await this.postRepository.save({
      title: 'Programming 2',
    });

    const tag1 = await this.tagRepository.save({
      name: 'JavaScript',
      posts: [post1, post2]
    });
    const tag2 = await this.tagRepository.save({
      name: 'TypeScript',
      posts: [post2]
    });
    const post3 = await this.postRepository.save({
      title: 'NextJs 3',
      tags: [tag1, tag2]
    });
    return true
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      }
    })
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      }
    })
  }




  @Delete('user/:id')
  async deleteUser(@Param('id') userId: number) {
    const post = await this.userRepository.findOne({
      where: {
        id: userId,
      }
    });
    if (!post) {
      throw new NotFoundException();
    }
    await this.userRepository.delete(userId);
    return userId;
  }

  @Delete('user')
  async deleteAllUser(@Param('id') userId: number) {
    const users = await this.userRepository.find({});
    if (!users) {
      throw new NotFoundException();
    }
    for (const user of users) {
      await this.userRepository.delete(user.id);
    }
  }


  @Delete('user/profile')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
    return id;
  }

  @Post('sample')
  async sample() {
    // //모델에 해당하는 객체 생성 -저장 x 
    // const user1 = this.userRepository.create({
    //   email: 'test@codefactory.ai',
    // });

    // // 저장
    // const user2 = this.userRepository.save({
    //   email: 'test@codefactory.ai',
    // });

    // // preload
    // // 입력된 값 기반으로 DB에 있는 데이터 불러오고,
    // // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체 (저장 x)
    // const user3 = await this.userRepository.preload({
    //   id: 101,
    //   email: 'codefactory@codefactory.ai',      
    // })

    // // 삭제하기
    // await this.userRepository.delete(
    //   101,
    // )

    // await this.userRepository.increment({
    //   id: 101,
    // }, 'count', 5)

    // await this.userRepository.decrement({
    //   id: 101,
    // }, 'count', 1)

    // 갯수 카운팅하기
    const count = await this.userRepository.count({
      where: {
        email: ILike('%0%'),
      },
    });

    const sum = await this.userRepository.sum('count',{
      email: ILike('%0%'),
    });

    // average
    const average = await this.userRepository.average('count', {
      id: LessThan(104),
    });

    //최소값 :min, max

    // 만약 이 필터를 넣지 않았다면, 총 갯수가 몇개인지도 반환을 같이 해 준다.
    const userAndCount = await this.userRepository.findAndCount({
      take: 3
    });
  

    return userAndCount;
  }
}
