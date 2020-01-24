export class Course {
  _id: string;  // ObjectId
  title: string;
  section: string;
}

export class CourseQuery {
  limit?: number;
  skip?: number;
  sortBy?: string;
  orderBy?: string;
}
