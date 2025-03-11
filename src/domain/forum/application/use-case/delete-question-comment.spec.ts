import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete question comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository)
  })

  it('should be able to delete question comment', async () => {
    const authorId = new UniqueEntityId()
    const questionCommentId = 'question-comment-1'

    const newQuestion = makeQuestionComment(
      {
        authorId,
      },
      new UniqueEntityId(questionCommentId),
    )

    await inMemoryQuestionCommentRepository.create(newQuestion)

    await sut.execute({
      authorId: authorId.toString(),
      questionCommentId,
    })

    expect(
      inMemoryQuestionCommentRepository.items.every(
        (item) => item.id.toString() !== questionCommentId,
      ),
    ).toBeTruthy()

    expect(inMemoryQuestionCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete question comment with wrong id', async () => {
    await expect(() =>
      sut.execute({
        authorId: new UniqueEntityId().toString(),
        questionCommentId: 'non-id-question-comment',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to delete question comment where user is not creator of question`', async () => {
    const questionCommentId = 'question-comment-1'

    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId(questionCommentId),
    )

    await inMemoryQuestionCommentRepository.create(newQuestionComment)

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        questionCommentId,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
