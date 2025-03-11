import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { CommentOnAnswerUseCase } from './comment-on-answer'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: CommentOnAnswerUseCase

describe('Comment on answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      authorId: 'author-1',
      answerId: answer.id.toString(),
      content: 'New comment',
    })

    expect(
      inMemoryAnswerCommentRepository.items.some(
        (item) =>
          item.authorId.toString() === 'author-1' &&
          item.content === 'New comment' &&
          item.answerId.toString() === answer.id.toString(),
      ),
    ).toBeTruthy()
  })

  it('should not be able to comment on answer with wrong answer id', async () => {
    await expect(() =>
      sut.execute({
        authorId: new UniqueEntityId().toString(),
        answerId: 'non-id-answer',
        content: 'New comment',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
