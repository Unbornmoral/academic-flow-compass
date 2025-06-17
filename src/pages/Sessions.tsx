
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RoleSelector from "@/components/RoleSelector";
import AuthModal from "@/components/AuthModal";
import SupabaseFileUpload from "@/components/SupabaseFileUpload";
import SupabaseAssignmentEditor from "@/components/SupabaseAssignmentEditor";
import { useRole } from "@/contexts/RoleContext";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { ArrowLeft, Plus, LogOut } from "lucide-react";

const SessionsPage = () => {
  const { 
    role, 
    setRole, 
    canUpload, 
    canView, 
    canEditCourses, 
    canEditContent, 
    canDeleteCourses,
    canUploadFiles,
    canEditAssignments
  } = useRole();
  
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { courses, createCourse, updateCourse, deleteCourse, loading: dataLoading } = useSupabaseData();
  const [showRoleSelector, setShowRoleSelector] = useState(true);

  // Group courses by year and semester
  const groupedData = courses.reduce((acc, course) => {
    const yearName = course.year_name || 'Unknown Year';
    const semesterName = course.semester_name || 'Unknown Semester';
    
    if (!acc[yearName]) {
      acc[yearName] = {};
    }
    if (!acc[yearName][semesterName]) {
      acc[yearName][semesterName] = [];
    }
    acc[yearName][semesterName].push(course);
    return acc;
  }, {} as Record<string, Record<string, typeof courses>>);

  useEffect(() => {
    if (profile?.role) {
      setRole(profile.role);
      setShowRoleSelector(false);
    }
  }, [profile, setRole]);

  const handleRoleSelect = (selectedRole: typeof role) => {
    setRole(selectedRole);
    setShowRoleSelector(false);
  };

  const handleAddCourse = async (yearName: string, semesterName: string) => {
    try {
      await createCourse({
        title: `New Course ${Date.now()}`,
        year_name: yearName,
        semester_name: semesterName,
        units: 3,
        lecturer_id: user?.id,
      });
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    }
  };

  const handleUpdateCourse = async (courseId: string, updates: any) => {
    try {
      await updateCourse(courseId, updates);
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await deleteCourse(courseId);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Political Science South West UniLag Companion</h1>
        <p className="mb-8 text-lg text-muted-foreground">Please sign in to access the platform</p>
        <AuthModal onAuthSuccess={() => {}} />
      </div>
    );
  }

  if (showRoleSelector || !role) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  const getRoleDisplayName = () => {
    switch (role) {
      case 'developer': return 'Developer (Kamal)';
      case 'administrator': return 'Administrator';
      case 'lecturer': return 'Lecturer';
      case 'student': return 'Student';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Political Science Sessions - {getRoleDisplayName()} Mode
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowRoleSelector(true)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Change Role
          </Button>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {role === 'student' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            You are viewing in student mode. You can download and view files but cannot upload new ones.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(groupedData).map(([yearName, semesters]) => (
          <Card key={yearName}>
            <CardHeader>
              <CardTitle className="text-2xl">{yearName}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(semesters).map(([semesterName, semesterCourses]) => (
                  <AccordionItem value={semesterName} key={semesterName}>
                    <AccordionTrigger className="text-xl">{semesterName}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {canEditCourses && (
                          <div className="flex justify-end">
                            <Button
                              onClick={() => handleAddCourse(yearName, semesterName)}
                              variant="outline"
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Course
                            </Button>
                          </div>
                        )}
                        <Accordion type="multiple" className="w-full space-y-4">
                          {semesterCourses.map((course) => (
                            <AccordionItem value={course.id} key={course.id}>
                              <AccordionTrigger className="font-semibold">
                                <div className="flex items-center gap-3 w-full">
                                  <span className="flex-1 text-left">{course.title}</span>
                                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <span className="text-sm text-muted-foreground">Units:</span>
                                    <Input
                                      type="number"
                                      min="1"
                                      max="10"
                                      value={course.units}
                                      onChange={(e) => handleUpdateCourse(course.id, { units: parseInt(e.target.value) || 3 })}
                                      className="w-16 h-8 text-sm"
                                      readOnly={!canEditCourses}
                                    />
                                    {canEditCourses && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteCourse(course.id)}
                                        className="text-red-600"
                                      >
                                        Delete
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <Accordion type="multiple" className="pl-4 space-y-2">
                                  <AccordionItem value="notes">
                                    <AccordionTrigger className="text-sm hover:bg-accent rounded-md px-2">
                                      NOTES
                                    </AccordionTrigger>
                                    <AccordionContent className="px-2 py-4">
                                      <SupabaseFileUpload
                                        courseId={course.id}
                                        category="NOTES"
                                        readOnly={!canUploadFiles}
                                      />
                                    </AccordionContent>
                                  </AccordionItem>
                                  
                                  <AccordionItem value="assignments">
                                    <AccordionTrigger className="text-sm hover:bg-accent rounded-md px-2">
                                      ASSIGNMENTS/PROJECTS
                                    </AccordionTrigger>
                                    <AccordionContent className="px-2 py-4">
                                      <SupabaseAssignmentEditor
                                        courseId={course.id}
                                        canEdit={canEditAssignments}
                                      />
                                      <div className="mt-4">
                                        <SupabaseFileUpload
                                          courseId={course.id}
                                          category="ASSIGNMENTS/PROJECTS"
                                          readOnly={!canUploadFiles}
                                        />
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                  
                                  <AccordionItem value="past-questions">
                                    <AccordionTrigger className="text-sm hover:bg-accent rounded-md px-2">
                                      PAST QUESTIONS
                                    </AccordionTrigger>
                                    <AccordionContent className="px-2 py-4">
                                      <SupabaseFileUpload
                                        courseId={course.id}
                                        category="PAST QUESTIONS"
                                        readOnly={!canUploadFiles}
                                      />
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {Object.keys(groupedData).length === 0 && (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">No courses available yet.</p>
              {canEditCourses && (
                <Button
                  onClick={() => handleAddCourse('YEAR 1', 'First Semester')}
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Course
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SessionsPage;
