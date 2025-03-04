import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose question best answer', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswerRepository,
    )
  })

  it('should be able to chose the question best answer', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      authorId: question.authorId.toString(),
      answerId: answer.id.toString(),
    })

    expect(
      inMemoryQuestionRepository.items.some(
        (item) => item.bestAnswerId === answer.id,
      ),
    ).toBeTruthy()
  })

  it('should not be able to chose the question best answer with wrong answer id', async () => {
    await expect(() =>
      sut.execute({
        authorId: new UniqueEntityId().toString(),
        answerId: 'non-id-question',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to chose the question best answer with wrong question id', async () => {
    const answer = makeAnswer({
      questionId: new UniqueEntityId('non-question-id'),
    })

    await inMemoryAnswerRepository.create(answer)

    await expect(() =>
      sut.execute({
        authorId: answer.authorId.toString(),
        answerId: answer.id.toString(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to chose the question best answer where user is not creator of question`', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      authorId: question.authorId.toString(),
      answerId: answer.id.toString(),
    })

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        answerId: answer.id.toString(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
