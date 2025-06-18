
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, BookOpen, Settings, Shield } from "lucide-react";

type Role = 'student' | 'lecturer' | 'administrator' | 'developer' | null;

interface RoleSelectorProps {
  onRoleSelect: (role: Role) => void;
}

const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  const [showPasswordInput, setShowPasswordInput] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const handlePasswordAccess = (role: Role, correctPassword: string) => {
    if (password === correctPassword) {
      onRoleSelect(role);
    } else {
      alert(`Invalid ${role} password`);
      setPassword("");
    }
  };

  const showPasswordPrompt = (role: string) => {
    setShowPasswordInput(role);
    setPassword("");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-center">Political Science UniLag Companion</h1>
      <p className="mb-8 text-lg text-muted-foreground text-center">Select Your Role to Access the Platform</p>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => showPasswordPrompt('lecturer')}>
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

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => showPasswordPrompt('administrator')}>
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <CardTitle>Enter as Administrator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Full course management and content editing
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => showPasswordPrompt('developer')}
            className="text-muted-foreground"
          >
            <Settings className="w-4 h-4 mr-2" />
            Developer Access
          </Button>
        </div>

        {showPasswordInput && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center capitalize">{showPasswordInput} Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder={`Enter ${showPasswordInput} password`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const passwords = {
                      lecturer: 'lecturer123',
                      administrator: 'admin123',
                      developer: 'kamal3278'
                    };
                    handlePasswordAccess(showPasswordInput as Role, passwords[showPasswordInput as keyof typeof passwords]);
                  }
                }}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    const passwords = {
                      lecturer: 'lecturer123',
                      administrator: 'admin123',
                      developer: 'kamal3278'
                    };
                    handlePasswordAccess(showPasswordInput as Role, passwords[showPasswordInput as keyof typeof passwords]);
                  }} 
                  className="flex-1"
                >
                  Access
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowPasswordInput(null);
                    setPassword("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoleSelector;
