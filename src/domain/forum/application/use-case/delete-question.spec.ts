import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { DeleteQuestionUseCase } from './delete-question'
import { NotAllowedError } from './erros/not-allowed-error'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: DeleteQuestionUseCase

describe('Delete question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to delete question', async () => {
    const authorId = new UniqueEntityId()
    const questionId = 'question-1'

    const newQuestion = makeQuestion(
      {
        authorId,
      },
      new UniqueEntityId(questionId),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: authorId.toString(),
      questionId,
    })

    expect(result.isRight()).toBeTruthy()
    expect(
      inMemoryQuestionRepository.items.every(
        (item) => item.id.toString() !== questionId,
      ),
    ).toBeTruthy()
    expect(inMemoryQuestionRepository.items).toHaveLength(0)
  })

  it('should not be able to delete question with wrong id', async () => {
    const result = await sut.execute({
      authorId: new UniqueEntityId().toString(),
      questionId: 'non-id-question',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete question where user is not creator of question`', async () => {
    const questionId = 'question-1'

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId(questionId),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
