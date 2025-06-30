"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Star,
  Users,
  BookOpen,
  TrendingUp,
  Shield,
  MessageSquare,
  GraduationCap,
  Building2,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const departments = [
  "Computer Science",
  "Engineering",
  "Medicine",
  "Business Administration",
  "Law",
  "Social Sciences",
  "Natural Sciences",
  "Languages",
  "Agriculture",
  "Education",
]

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim().length > 0) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchClick = () => {
    if (searchQuery.trim().length > 0) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2">
          <GraduationCap className="h-8 w-8 text-emerald-600" />
          <span className="font-bold text-xl text-gray-900">AAU RateMyProfessors</span>
        </Link>

      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                    <Building2 className="w-3 h-3 mr-1" />
                    Addis Ababa University
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                    Discover the Best
                    <span className="text-emerald-600 block">Professors at AAU</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl leading-relaxed">
                    Discover honest reviews and ratings from AAU students to help you prepare for your courses.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search professors or departments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-3 text-base border-2 border-gray-200 focus:border-emerald-500 rounded-lg"
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                    onClick={handleSearchClick}
                  >
                    Start Searching
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>

                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <Image
                    src="https://taaac.ca/sites/default/files/styles/landscape_3_2_1800/public/ET_Addis_asv2018-01_img13_University_gate.jpg?itok=l4hwlRRq"
                    width={500}
                    height={500}
                    alt="Students studying at AAU"
                    className="rounded-2xl shadow-2xl"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <Users className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">3,000+</div>
                        <div className="text-sm text-gray-500">Teachers</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border">
                    <div className="flex items-center gap-3">
                      <div className="bg-teal-100 p-2 rounded-lg">
                        <Star className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">1,200+</div>
                        <div className="text-sm text-gray-500">Professor Reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  Why Choose AAU RateProf
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides comprehensive insights to help you make the best academic decisions at Addis
                  Ababa University.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card className="border-2 border-gray-100 hover:border-emerald-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-emerald-100 p-3 rounded-lg">
                      <Star className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Honest Reviews</h3>
                  </div>
                  <p className="text-gray-600">
                    Read authentic reviews from fellow AAU students about teaching quality, course difficulty, and
                    professor accessibility.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 hover:border-emerald-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-teal-100 p-3 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Professor Insights</h3>
                  </div>
                  <p className="text-gray-600">
                    Access student feedback and experince to better understand your assigned professors.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 hover:border-emerald-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Shield className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Completely Anonymous</h3>
                  </div>
                  <p className="text-gray-600">
                    All reviews are Completely private so you can share your honest opinions without any fear of reprecussions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-4xl font-bold text-white">850+</div>
                <div className="text-emerald-100">Professors Rated</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-4xl font-bold text-white">1200+</div>
                <div className="text-emerald-100">Student Reviews</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-4xl font-bold text-white">All</div>
                <div className="text-emerald-100">Departments Covered</div>
              </div>

            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                Simple Process
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">How It Works</h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <Search className="h-12 w-12 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Search & Discover</h3>
                <p className="text-gray-600">
                  Use our intelligent search to find professors by name, department, or course code.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <BookOpen className="h-12 w-12 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Read Reviews</h3>
                <p className="text-gray-600">
                  Browse detailed reviews covering teaching style, course difficulty, and more.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <MessageSquare className="h-12 w-12 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Share Your Experience</h3>
                <p className="text-gray-600">Help fellow students by sharing your own honest reviews and ratings.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                  Ready to Make Better Academic Choices?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of AAU students who are already using our platform to enhance their academic
                  experience.
                </p>
              </div>
              <div className="space-x-4">
<Button
  size="lg"
  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
>
  Start Searching
</Button>

              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
        <p className="text-xs text-gray-500">
          © 2024 AAU RateProf. All rights reserved. Made for Addis Ababa University students.
        </p>

      </footer>
    </div>
  )
}
