
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeUpdates = () => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Listen to courses changes
    const coursesChannel = supabase
      .channel('courses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courses'
        },
        (payload) => {
          console.log('Course update received:', payload);
          setLastUpdate(new Date());
          
          let message = '';
          switch (payload.eventType) {
            case 'INSERT':
              message = `New course "${payload.new.title}" has been added`;
              break;
            case 'UPDATE':
              message = `Course "${payload.new.title}" has been updated`;
              break;
            case 'DELETE':
              message = `A course has been removed`;
              break;
          }
          
          toast({
            title: "Real-time Update",
            description: message,
            duration: 3000,
          });
        }
      )
      .subscribe();

    // Listen to course files changes
    const filesChannel = supabase
      .channel('files-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_files'
        },
        (payload) => {
          console.log('File update received:', payload);
          setLastUpdate(new Date());
          
          let message = '';
          switch (payload.eventType) {
            case 'INSERT':
              message = `New file "${payload.new.file_name}" has been uploaded`;
              break;
            case 'UPDATE':
              message = `File "${payload.new.file_name}" has been updated`;
              break;
            case 'DELETE':
              message = `A file has been removed`;
              break;
          }
          
          toast({
            title: "Real-time Update",
            description: message,
            duration: 3000,
          });
        }
      )
      .subscribe();

    // Listen to assignments changes
    const assignmentsChannel = supabase
      .channel('assignments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assignments'
        },
        (payload) => {
          console.log('Assignment update received:', payload);
          setLastUpdate(new Date());
          
          let message = '';
          switch (payload.eventType) {
            case 'INSERT':
              message = `New assignment "${payload.new.title}" has been created`;
              break;
            case 'UPDATE':
              message = `Assignment "${payload.new.title}" has been updated`;
              break;
            case 'DELETE':
              message = `An assignment has been removed`;
              break;
          }
          
          toast({
            title: "Real-time Update",
            description: message,
            duration: 3000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(coursesChannel);
      supabase.removeChannel(filesChannel);
      supabase.removeChannel(assignmentsChannel);
    };
  }, [toast]);

  return { lastUpdate };
};
