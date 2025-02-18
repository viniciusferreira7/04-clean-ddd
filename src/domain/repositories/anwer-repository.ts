import type { Answer } from '../entities/answer'

export interface AnswerRepository {
  create(_answer: Answer): Promise<void>
}
