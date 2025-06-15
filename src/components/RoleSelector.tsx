
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, BookOpen, Settings } from "lucide-react";

type Role = 'student' | 'lecturer' | 'developer' | null;

interface RoleSelectorProps {
  onRoleSelect: (role: Role) => void;
}

const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  const [showDeveloperInput, setShowDeveloperInput] = useState(false);
  const [developerCode, setDeveloperCode] = useState("");

  const handleDeveloperAccess = () => {
    if (developerCode === "dev123") { // Simple developer code
      onRoleSelect('developer');
    } else {
      alert("Invalid developer code");
      setDeveloperCode("");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-center">Select Your Role</h1>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onRoleSelect('student')}>
            <CardHeader className="text-center">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>Enter as Student</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Access course materials, notes, and assignments
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onRoleSelect('lecturer')}>
            <CardHeader className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Enter as Lecturer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Upload and manage course content
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDeveloperInput(!showDeveloperInput)}
            className="text-muted-foreground"
          >
            <Settings className="w-4 h-4 mr-2" />
            Developer Access
          </Button>
        </div>

        {showDeveloperInput && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Developer Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Enter developer code"
                value={developerCode}
                onChange={(e) => setDeveloperCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleDeveloperAccess()}
              />
              <Button onClick={handleDeveloperAccess} className="w-full">
                Access
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoleSelector;
