import { Test, TestingModule } from '@nestjs/testing';
import { UserCreateDto } from '../user/dto/usercreate.dto';
import { User } from '../user/entity/user.entity';
import { PostService } from './post.service';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CaslPermission } from '../casl/casl-ability.factory/casl-ability.factory';
import { PostCreateDto } from './dto/postCreate.dto';

describe('Auth Controller', () => {
  let service: PostService;
  let postRepository: Repository<Post>;

  let mockUser: User = {
    id: 'Id1',
    email: 'test@gmail.com',
    password: '123456',
    role: 'reader',
    firstName: '',
    lastName: '',
  };

  let mockPost: Post = {
    title: 'test',
    content: 'test',
    authorId: 'Id1',
    category: 'test',
    id: 'PId1',
  };

  let mockPostRepostory = {
    create: jest.fn((post: PostCreateDto) => {
      return Promise.resolve(post);
    }),
    find: jest.fn(() => {
      return [];
    }),
    save: jest.fn((post: PostCreateDto) => post),
    findOneBy: jest.fn((id: string) => {
      return Promise.resolve(mockPost);
    }),
    update: jest.fn((id: string, post: PostCreateDto) => {
      return Promise.resolve(mockPost);
    }),
    delete: jest.fn((id: string) => Promise.resolve(mockPost)),
  };

  let mockCaslPermission = {
    can: jest.fn((action: string, resource: string) => true),
    defineAbility: jest.fn((user: User) => true),
    throwUnlessCan: jest.fn((action: string, resource: string) => true),
  };
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: CaslPermission, useValue: mockCaslPermission },
        { provide: getRepositoryToken(Post), useValue: mockPostRepostory },
      ],
    }).compile();
    postRepository = moduleRef.get<Repository<Post>>(getRepositoryToken(Post));
    service = moduleRef.get<PostService>(PostService);
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
    expect(postRepository).toBeDefined();
  });

  it('should create a post', async () => {
    const mokePost: Post = {
      title: 'test',
      content: 'test',
      authorId: 'Id1',
      category: 'test',
      id: 'PId1',
    };

    const post = await service.create(mokePost, mockUser);
    console.log(post);
    expect(mockPostRepostory.create).toHaveBeenCalled();
    expect(mockPostRepostory.save).toHaveBeenCalled();
    expect(post).toEqual(mokePost);
  });

  it('should return all posts', async () => {
    const posts = await service.findAll();
    expect(mockPostRepostory.find).toHaveBeenCalled();
    expect(posts).toEqual([]);
  });

  it('should return a post', async () => {
    const posts = await service.findOne('PId1');

    expect(mockPostRepostory.findOneBy).toBeCalledWith({ id: 'PId1' });
    expect(posts).toEqual(mockPost);
  });

  //   it('should update a post', async () => {
  //     const mokePost: Post = {
  //       title: 'test',
  //       content: 'test',
  //       authorId: 'Id1',
  //       category: 'test',
  //       id: 'Id1',
  //     };

  //     const posts = await service.update(
  //       '2d4c2457-2fcf-4104-ae0f-0bdb03122c8f',
  //       mokePost,
  //       mockUser,
  //     );
  //     console.log('post', posts);
  //     expect(mockPostRepostory.update).toBeCalledWith('Id1', mokePost);
  //     expect(mockCaslPermission.defineAbility).toBeCalledWith(mockUser);
  //     // expect(posts).toEqual(mokePost);
  //   });

  //   it('should delete a post', async () => {
  //     const posts = await service.delete('Id1', mockUser);
  //     console.log('post', posts);
  //     // expect(mockPostRepostory.delete).toBeCalledWith('Id1');
  //     // expect(posts).toEqual({});
  //   });
});
