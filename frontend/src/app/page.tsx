import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  MessageCircle,
  BookOpen,
  Users,
  DollarSign,
  MapPin,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: "Academic Guidance",
      description:
        "Get information about majors, courses, and academic requirements",
      gradient: "from-purple-100 to-purple-200",
      iconColor: "text-purple-600",
    },
    {
      icon: DollarSign,
      title: "Financial Planning",
      description:
        "Learn about tuition costs, financial aid, and scholarship opportunities",
      gradient: "from-blue-100 to-blue-200",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      title: "Campus Life",
      description: "Discover dormitories, clubs, activities, and student life",
      gradient: "from-cyan-100 to-cyan-200",
      iconColor: "text-cyan-600",
    },
    {
      icon: MapPin,
      title: "Application Process",
      description:
        "Step-by-step guidance through college applications and admissions",
      gradient: "from-teal-100 to-teal-200",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">CollegeGPT</span>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Sign In
                </Button>
              </SignInButton>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  Get Started
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-xl transform hover:scale-105 transition-transform duration-200">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CollegeGPT
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your AI-powered assistant for all things college. Get instant
            answers about admissions, costs, majors, campus life, and more.
          </p>
          <div className="flex justify-center space-x-4">
            <SignedIn>
              <Link href="/chat">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Chatting
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Sign In to Chat
                </Button>
              </SignInButton>
            </SignedOut>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-2 border-purple-200 text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg"
            >
              <CardHeader>
                <div className="flex justify-center mb-2">
                  <div
                    className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-full shadow-md`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start Card */}
        <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Ready to Get Started?
            </CardTitle>
            <CardDescription>
              Ask me anything about college and get instant, helpful answers
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-200 hover:from-purple-200 hover:to-purple-300 transition-all duration-200"
              >
                College costs
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-200 hover:from-blue-200 hover:to-blue-300 transition-all duration-200"
              >
                Application process
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-700 border-cyan-200 hover:from-cyan-200 hover:to-cyan-300 transition-all duration-200"
              >
                Available majors
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 border-teal-200 hover:from-teal-200 hover:to-teal-300 transition-all duration-200"
              >
                Campus life
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-emerald-200 hover:from-emerald-200 hover:to-emerald-300 transition-all duration-200"
              >
                Financial aid
              </Badge>
            </div>
            <Link href="/chat">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Your College Journey
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
