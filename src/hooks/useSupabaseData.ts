
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  title: string;
  year_name: string;
  semester_name: string;
  units: number;
  lecturer_id?: string;
}

interface CourseFile {
  id: string;
  course_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  category: 'NOTES' | 'ASSIGNMENTS/PROJECTS' | 'PAST QUESTIONS';
  uploaded_by?: string;
  download_count: number;
  created_at: string;
}

interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  deadline?: string;
  created_by?: string;
  created_at: string;
}

export const useSupabaseData = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [files, setFiles] = useState<CourseFile[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    setupRealtimeSubscriptions();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesResult, filesResult, assignmentsResult] = await Promise.all([
        supabase.from('courses').select('*').order('created_at', { ascending: false }),
        supabase.from('course_files').select('*').order('created_at', { ascending: false }),
        supabase.from('assignments').select('*').order('created_at', { ascending: false })
      ]);

      if (coursesResult.data) setCourses(coursesResult.data);
      if (filesResult.data) setFiles(filesResult.data);
      if (assignmentsResult.data) setAssignments(assignmentsResult.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const coursesChannel = supabase
      .channel('courses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        fetchData();
      })
      .subscribe();

    const filesChannel = supabase
      .channel('files-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'course_files' }, () => {
        fetchData();
      })
      .subscribe();

    const assignmentsChannel = supabase
      .channel('assignments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(coursesChannel);
      supabase.removeChannel(filesChannel);
      supabase.removeChannel(assignmentsChannel);
    };
  };

  const createCourse = async (courseData: Omit<Course, 'id'>) => {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    const { data, error } = await supabase
      .from('courses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteCourse = async (id: string) => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  const uploadFile = async (file: File, courseId: string, category: CourseFile['category']) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${courseId}/${category}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('political-science')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from('course_files')
      .insert([
        {
          course_id: courseId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          category,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const downloadFile = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const { data, error } = await supabase.storage
      .from('political-science')
      .download(file.file_path);

    if (error) throw error;

    // Increment download count
    await supabase
      .from('course_files')
      .update({ download_count: file.download_count + 1 })
      .eq('id', fileId);

    // Create download URL
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteFile = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('political-science')
      .remove([file.file_path]);

    if (storageError) throw storageError;

    // Delete from database
    const { error } = await supabase
      .from('course_files')
      .delete()
      .eq('id', fileId);

    if (error) throw error;
  };

  const createAssignment = async (assignmentData: Omit<Assignment, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('assignments')
      .insert([{
        ...assignmentData,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateAssignment = async (id: string, updates: Partial<Assignment>) => {
    const { data, error } = await supabase
      .from('assignments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteAssignment = async (id: string) => {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  return {
    courses,
    files,
    assignments,
    loading,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadFile,
    downloadFile,
    deleteFile,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
};
