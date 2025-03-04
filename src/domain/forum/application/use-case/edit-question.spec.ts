import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { EditQuestionUseCase } from './edit-question'

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

    await sut.execute({
      authorId: authorId.toString(),
      questionId,
      title: 'Edited title',
      content: 'Edited content',
    })

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
    await expect(() =>
      sut.execute({
        authorId: new UniqueEntityId().toString(),
        questionId: 'non-id-question',
        title: 'Edited title',
        content: 'Edited content',
      }),
    ).rejects.toBeInstanceOf(Error)
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

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        questionId,
        title: 'Edited title',
        content: 'Edited content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
