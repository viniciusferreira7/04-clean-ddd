import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import type { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionRepository implements QuestionRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    return question ?? null
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    return question ?? null
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = question
    }
  }

  async create(question: Question): Promise<void> {
    this.items.push(question)
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
      this.questionAttachmentsRepository.deleteManyByQuestionId(
        question.id.toString(),
      )
    }
  }
}
