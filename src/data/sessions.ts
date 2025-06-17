export type CourseItem = 'NOTES' | 'ASSIGNMENTS/PROJECTS' | 'PAST QUESTIONS';

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string; // base64 encoded file data
  uploadDate: string;
};

export type Assignment = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  createdBy: string;
  createdAt: string;
};

export type Course = {
  name: string;
  units: number;
  items: CourseItem[];
  files: {
    [key in CourseItem]: UploadedFile[];
  };
  assignments: Assignment[];
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
    return Array.from({ length: 12 }, (_, i) => ({
        name: `Course ${i + 1} for Y${year}S${semester === 'First Semester' ? 1: 2}`,
        units: 3, // default units
        items: ['NOTES', 'ASSIGNMENTS/PROJECTS', 'PAST QUESTIONS'],
        files: {
            'NOTES': [],
            'ASSIGNMENTS/PROJECTS': [],
            'PAST QUESTIONS': []
        },
        assignments: []
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
