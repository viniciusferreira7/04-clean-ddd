import type { PaginationParams } from '@/core/repositories/pagination-params'

import type { Answer } from '../../enterprise/entities/answer'

export interface AnswerRepository {
  findById(id: string): Promise<Answer | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>
  save(answer: Answer): Promise<void>
  create(answer: Answer): Promise<void>
}
