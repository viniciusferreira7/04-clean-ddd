import type { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionRepository implements QuestionRepository {
  public items: Question[] = []

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    return question ?? null
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    return question ?? null
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
    }
  }
}
