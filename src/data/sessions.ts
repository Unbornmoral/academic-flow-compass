
export type CourseItem = 'NOTES' | 'ASSIGNMENTS/PROJECTS' | 'PAST QUESTIONS';

export type Course = {
  name: string;
  items: CourseItem[];
};

export type Semester = {
  name: string;
  courses: Course[];
};

export type Year = {
  name: string;
  semesters: Semester[];
};

const generateCourses = (semester: string, year: number): Course[] => {
    return Array.from({ length: 8 }, (_, i) => ({
        name: `Course ${i + 1} for Y${year}S${semester === 'First Semester' ? 1: 2}`,
        items: ['NOTES', 'ASSIGNMENTS/PROJECTS', 'PAST QUESTIONS'],
    }));
}

const generateSemesters = (year: number): Semester[] => {
    return [
        {
            name: 'First Semester',
            courses: generateCourses('First Semester', year)
        },
        {
            name: 'Second Semester',
            courses: generateCourses('Second Semester', year)
        }
    ]
}

export const sessionsData: Year[] = Array.from({ length: 4 }, (_, i) => ({
    name: `YEAR ${i + 1}`,
    semesters: generateSemesters(i + 1)
}));
