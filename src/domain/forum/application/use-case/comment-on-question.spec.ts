import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { CommentOnQuestionUseCase } from './comment-on-question'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: CommentOnQuestionUseCase

describe('Comment on question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionRepository.create(question)

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: question.id.toString(),
      content: 'New comment',
    })

    expect(result.isRight()).toBeTruthy()
    expect(
      inMemoryQuestionCommentRepository.items.some(
        (item) =>
          item.authorId.toString() === 'author-1' &&
          item.content === 'New comment' &&
          item.questionId.toString() === question.id.toString(),
      ),
    ).toBeTruthy()
  })

  it('should not be able to comment on question with wrong question id', async () => {
    const result = await sut.execute({
      authorId: new UniqueEntityId().toString(),
      questionId: 'non-id-question',
      content: 'New comment',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
