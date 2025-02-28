import { Question } from '../../enterprise/entities/question'
import type { QuestionRepository } from '../repositories/question-repository'

interface GetQuestionUseCaseRequest {
  slug: string
}

interface GetQuestionUseCaseResponse {
  question: Question
}

export class GetQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionUseCaseRequest): Promise<GetQuestionUseCaseResponse> {
    const question = await this.questionRepository.findBySlug(slug)

    if (!question) {
      throw new Error('Question not found.')
    }

    return { question }
  }
}
