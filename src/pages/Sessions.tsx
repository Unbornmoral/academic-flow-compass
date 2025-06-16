
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sessionsData, UploadedFile, CourseItem, Course } from "@/data/sessions";
import FileUpload from "@/components/FileUpload";
import RoleSelector from "@/components/RoleSelector";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRole } from "@/contexts/RoleContext";
import { ArrowLeft } from "lucide-react";

const SessionsPage = () => {
  const { role, setRole, canUpload, canView } = useRole();
  const [courseFiles, setCourseFiles] = useLocalStorage<Record<string, Record<CourseItem, UploadedFile[]>>>('courseFiles', {});
  const [courseUnits, setCourseUnits] = useLocalStorage<Record<string, number>>('courseUnits', {});

  const getCourseKey = (yearName: string, semesterName: string, courseName: string) => {
    return `${yearName}-${semesterName}-${courseName}`;
  };

  const updateCourseFiles = (yearName: string, semesterName: string, courseName: string, itemType: CourseItem, files: UploadedFile[]) => {
    const courseKey = getCourseKey(yearName, semesterName, courseName);
    setCourseFiles(prev => ({
      ...prev,
      [courseKey]: {
        ...prev[courseKey],
        [itemType]: files
      }
    }));
  };

  const getCourseFiles = (yearName: string, semesterName: string, courseName: string, itemType: CourseItem): UploadedFile[] => {
    const courseKey = getCourseKey(yearName, semesterName, courseName);
    return courseFiles[courseKey]?.[itemType] || [];
  };

  const updateCourseUnits = (yearName: string, semesterName: string, courseName: string, units: number) => {
    const courseKey = getCourseKey(yearName, semesterName, courseName);
    setCourseUnits(prev => ({
      ...prev,
      [courseKey]: units
    }));
  };

  const getCourseUnits = (yearName: string, semesterName: string, courseName: string): number => {
    const courseKey = getCourseKey(yearName, semesterName, courseName);
    return courseUnits[courseKey] || 3;
  };

  if (!role) {
    return <RoleSelector onRoleSelect={setRole} />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Sessions - {role === 'developer' ? 'Developer' : role === 'lecturer' ? 'Lecturer' : 'Student'} Mode
        </h1>
        <Button variant="outline" onClick={() => setRole(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Change Role
        </Button>
      </div>

      {!canUpload && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            You are viewing in student mode. You can download and view files but cannot upload new ones.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {sessionsData.map((year) => (
          <Card key={year.name} id={year.name.replace(' ', '-')}>
            <CardHeader>
              <CardTitle className="text-2xl">{year.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {year.semesters.map((semester) => (
                  <AccordionItem value={semester.name} key={semester.name}>
                    <AccordionTrigger className="text-xl">{semester.name}</AccordionTrigger>
                    <AccordionContent>
                      <Accordion type="multiple" className="w-full space-y-4">
                        {semester.courses.map((course) => (
                          <AccordionItem value={course.name} key={course.name}>
                            <AccordionTrigger className="font-semibold">
                              <div className="flex items-center gap-3 w-full">
                                <span className="flex-1 text-left">{course.name}</span>
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  <span className="text-sm text-muted-foreground">Units:</span>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={getCourseUnits(year.name, semester.name, course.name)}
                                    onChange={(e) => updateCourseUnits(year.name, semester.name, course.name, parseInt(e.target.value) || 3)}
                                    className="w-16 h-8 text-sm"
                                    readOnly={!canUpload}
                                  />
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <Accordion type="multiple" className="pl-4 space-y-2">
                                {course.items.map((item) => (
                                  <AccordionItem value={`${course.name}-${item}`} key={item}>
                                    <AccordionTrigger className="text-sm hover:bg-accent rounded-md px-2">
                                      {item}
                                    </AccordionTrigger>
                                    <AccordionContent className="px-2 py-4">
                                      <FileUpload
                                        files={getCourseFiles(year.name, semester.name, course.name, item)}
                                        onFilesChange={(files) => updateCourseFiles(year.name, semester.name, course.name, item, files)}
                                        itemType={`${year.name}-${semester.name}-${course.name}-${item}`}
                                        readOnly={!canUpload}
                                      />
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionsPage;
