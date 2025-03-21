import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from './erros/not-allowed-error'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to edit a question', async () => {
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
      title: 'Edited title',
      content: 'Edited content',
    })

    expect(result.isRight()).toBeTruthy()

    expect(
      inMemoryQuestionRepository.items.some((item) => {
        const isSameAuthorId = item.authorId === authorId
        const isSameQuestionId = item.id.toString() === questionId
        const isSameTitleId = item.title === 'Edited title'
        const isSameContentId = item.content === 'Edited content'

        return (
          isSameAuthorId && isSameQuestionId && isSameTitleId && isSameContentId
        )
      }),
    ).toBeTruthy()

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: 'Edited title',
      content: 'Edited content',
    })
  })

  it('should not be able to edit question with wrong id', async () => {
    const result = await sut.execute({
      authorId: new UniqueEntityId().toString(),
      questionId: 'non-id-question',
      title: 'Edited title',
      content: 'Edited content',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit question where user is not creator of question`', async () => {
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
      title: 'Edited title',
      content: 'Edited content',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
