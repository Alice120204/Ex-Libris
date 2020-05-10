import {Students} from './students.model';

export interface Class {
  name: string;
  type: string;
  numberOfStudents: number;
  package: string;
  completeStatus: boolean;
}
