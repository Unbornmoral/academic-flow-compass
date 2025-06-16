
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { Course, CourseItem } from "@/data/sessions";

interface CourseEditorProps {
  course: Course;
  yearName: string;
  semesterName: string;
  onUpdateCourse: (yearName: string, semesterName: string, oldCourseName: string, updatedCourse: Partial<Course>) => void;
  onDeleteCourse: (yearName: string, semesterName: string, courseName: string) => void;
  canEditContent: boolean;
}

const CourseEditor = ({ 
  course, 
  yearName, 
  semesterName, 
  onUpdateCourse, 
  onDeleteCourse,
  canEditContent 
}: CourseEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedName, setEditedName] = useState(course.name);
  const [editedItems, setEditedItems] = useState<CourseItem[]>(course.items);
  const [newItem, setNewItem] = useState("");

  const handleSave = () => {
    onUpdateCourse(yearName, semesterName, course.name, {
      name: editedName,
      items: editedItems
    });
    setIsOpen(false);
  };

  const handleAddItem = () => {
    if (newItem.trim() && !editedItems.includes(newItem.trim() as CourseItem)) {
      setEditedItems([...editedItems, newItem.trim() as CourseItem]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (itemToRemove: CourseItem) => {
    setEditedItems(editedItems.filter(item => item !== itemToRemove));
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${course.name}"? This action cannot be undone.`)) {
      onDeleteCourse(yearName, semesterName, course.name);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="ml-2">
          <Edit3 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="course-name">Course Name</Label>
            <Input
              id="course-name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          </div>
          
          {canEditContent && (
            <div>
              <Label>Course Items</Label>
              <div className="space-y-2 mt-2">
                {editedItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={item} readOnly className="flex-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new item"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                  />
                  <Button onClick={handleAddItem} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            {canEditContent && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Course
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEditor;
