
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit3, Plus, Trash2, FileText } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  createdBy: string;
  createdAt: string;
}

interface AssignmentEditorProps {
  assignments: Assignment[];
  onUpdateAssignments: (assignments: Assignment[]) => void;
  canEdit: boolean;
}

const AssignmentEditor = ({ assignments, onUpdateAssignments, canEdit }: AssignmentEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;

    const newAssignment: Assignment = {
      id: editingAssignment?.id || Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      deadline,
      createdBy: "Current User", // This would come from auth context
      createdAt: editingAssignment?.createdAt || new Date().toISOString()
    };

    if (editingAssignment) {
      onUpdateAssignments(assignments.map(a => a.id === editingAssignment.id ? newAssignment : a));
    } else {
      onUpdateAssignments([...assignments, newAssignment]);
    }

    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setTitle(assignment.title);
    setDescription(assignment.description);
    setDeadline(assignment.deadline);
    setIsOpen(true);
  };

  const handleDelete = (assignmentId: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      onUpdateAssignments(assignments.filter(a => a.id !== assignmentId));
    }
  };

  const resetForm = () => {
    setEditingAssignment(null);
    setTitle("");
    setDescription("");
    setDeadline("");
  };

  const openNewAssignment = () => {
    resetForm();
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Assignments & Projects</h4>
        {canEdit && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewAssignment} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter assignment title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter assignment description and requirements"
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline (Optional)</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    {editingAssignment ? "Update" : "Create"} Assignment
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {assignments.length > 0 ? (
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <FileText className="w-5 h-5 mt-0.5 text-blue-600" />
                  <div className="flex-1">
                    <h5 className="font-medium">{assignment.title}</h5>
                    <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                    {assignment.deadline && (
                      <p className="text-xs text-red-600 mt-1">
                        Deadline: {new Date(assignment.deadline).toLocaleString()}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Created by {assignment.createdBy} on {new Date(assignment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(assignment)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(assignment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="mx-auto h-8 w-8 mb-2" />
          <p className="text-sm">No assignments available yet</p>
        </div>
      )}
    </div>
  );
};

export default AssignmentEditor;
