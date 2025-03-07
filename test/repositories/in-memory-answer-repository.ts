import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswerRepository implements AnswerRepository {
  public items: Answer[] = []

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)

    return answer ?? null
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = answer
    }
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)
  }
}
