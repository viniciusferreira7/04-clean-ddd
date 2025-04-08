import { type Either, left, right } from '@/core/either'

import { Question } from '../../enterprise/entities/question'
import type { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

interface GetQuestionUseCaseRequest {
  slug: string
}

type GetQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>
export class GetQuestionUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionUseCaseRequest): Promise<GetQuestionUseCaseResponse> {
    const question = await this.questionRepository.findBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({ question })
  }
}
