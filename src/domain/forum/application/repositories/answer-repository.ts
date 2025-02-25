import type { Answer } from '../../enterprise/entities/answer'

export interface AnswerRepository {
  create(_answer: Answer): Promise<void>
}
