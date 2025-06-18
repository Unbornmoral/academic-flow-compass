import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Users, Calendar, Mail, GraduationCap, FileText } from "lucide-react";
import AIChat from "@/components/AIChat";

const Index = () => {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Political Science UniLag Companion
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore course materials, lecture notes, and past questions for your Political Science studies at University of Lagos with real-time updates.
              </p>
            </div>
            <div className="space-x-4 pt-6">
              <Button asChild size="lg">
                <Link to="/sessions">Explore Sessions</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Access comprehensive resources, connect with peers, and stay updated with the latest events in real-time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sessions Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Academic Sessions</CardTitle>
                <CardDescription>
                  Browse course materials by year and semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Access notes, assignments, and past questions organized by academic sessions.
                </p>
                <Button asChild className="w-full">
                  <Link to="/sessions">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    View Sessions
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* About Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>About Us</CardTitle>
                <CardDescription>
                  Learn about our mission and vision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover our commitment to providing quality educational resources.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/about">
                    <Users className="w-4 h-4 mr-2" />
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Events Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Events</CardTitle>
                <CardDescription>
                  Stay updated with academic events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View upcoming seminars, workshops, and important academic dates.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/events">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Events
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <CardHeader>
                <Mail className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>
                  Get in touch with our team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Have questions or need support? We're here to help you succeed.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Start Learning?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Join thousands of students who are already using our platform to excel in their studies.
              </p>
            </div>
            <div className="space-x-4 pt-6">
              <Button asChild size="lg">
                <Link to="/sessions">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Component */}
      <AIChat />
    </div>
  );
};

export default Index;
