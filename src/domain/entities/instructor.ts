import { Entity } from '../../core/entities/entity'
import type { UniqueEntityId } from '../../core/entities/value-object/unique-entity-id'

interface InstructorProps {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  static create(props:InstructorProps, id?: UniqueEntityId){
        const instructor = new Instructor(props, id)
    
        return instructor
      }
}