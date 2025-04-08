import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete answer comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository)
  })

  it('should be able to delete answer comment', async () => {
    const authorId = new UniqueEntityId()
    const answerCommentId = 'answer-comment-1'

    const newAnswer = makeAnswerComment(
      {
        authorId,
      },
      new UniqueEntityId(answerCommentId),
    )

    await inMemoryAnswerCommentRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: authorId.toString(),
      answerCommentId,
    })

    expect(result.isRight()).toBeTruthy()
    expect(
      inMemoryAnswerCommentRepository.items.every(
        (item) => item.id.toString() !== answerCommentId,
      ),
    ).toBeTruthy()

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete answer comment with wrong id', async () => {
    const result = await sut.execute({
      authorId: new UniqueEntityId().toString(),
      answerCommentId: 'non-id-answer-comment',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete answer comment where user is not creator of answer`', async () => {
    const answerCommentId = 'answer-comment-1'

    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId(answerCommentId),
    )

    await inMemoryAnswerCommentRepository.create(newAnswerComment)

    const result = await sut.execute({
      authorId: 'author-2',
      answerCommentId,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
