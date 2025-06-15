
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sessionsData } from "@/data/sessions";
import { Download } from "lucide-react";

const SessionsPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-center">Sessions</h1>
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
                            <AccordionTrigger className="font-semibold">{course.name}</AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-4 space-y-2">
                                {course.items.map((item) => (
                                  <div key={item} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                                    <span>{item}</span>
                                    <Button variant="ghost" size="icon">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
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
