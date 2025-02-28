import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'

import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: CreateQuestionUseCase

describe('Create question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to create an question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'New question',
      content: 'Content of question',
    })

    expect(question.id).toBeTruthy()
    expect(inMemoryQuestionRepository.items[0].id).toEqual(question.id)
  })
})
