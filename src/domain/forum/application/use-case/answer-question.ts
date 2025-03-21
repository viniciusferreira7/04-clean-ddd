import { type Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { Answer } from '../../enterprise/entities/answer'
import type { AnswerRepository } from '../repositories/answer-repository'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    })

    await this.answerRepository.create(answer)

    return right({ answer })
  }
}
