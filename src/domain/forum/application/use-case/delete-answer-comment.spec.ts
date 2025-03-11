import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

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

    await sut.execute({
      authorId: authorId.toString(),
      answerCommentId,
    })

    expect(
      inMemoryAnswerCommentRepository.items.every(
        (item) => item.id.toString() !== answerCommentId,
      ),
    ).toBeTruthy()

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete answer comment with wrong id', async () => {
    await expect(() =>
      sut.execute({
        authorId: new UniqueEntityId().toString(),
        answerCommentId: 'non-id-answer-comment',
      }),
    ).rejects.toBeInstanceOf(Error)
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

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        answerCommentId,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
