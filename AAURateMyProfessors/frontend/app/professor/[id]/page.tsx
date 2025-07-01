"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Star,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ChevronLeft,
  GraduationCap,
  Filter,
  Plus,
  User,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  MessageSquare,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ProfessorPage() {
  const params = useParams()
  const id = params.id as string

  const [professor, setProfessor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [reviewContent, setReviewContent] = useState("")
  const [reviewCourse, setReviewCourse] = useState("")
  const [reviewGrade, setReviewGrade] = useState("")
  const [reviewWorkload, setReviewWorkload] = useState(3)
  const [reviewFairness, setReviewFairness] = useState(3)
  const [reviewDifficulty, setReviewDifficulty] = useState(3)
  const [reviewAttendance, setReviewAttendance] = useState(3)
  const [reviewEngagement, setReviewEngagement] = useState(3)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfessor() {
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professor/${id}/long`)
        const data = await res.json()
        setProfessor(data)
      } catch (err) {
        setProfessor(null)
      }
      setLoading(false)
    }
    fetchProfessor()
  }, [id])

  // After submitting a review, reload professor data
  const reloadProfessor = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professor/${id}/long`)
      const data = await res.json()
      setProfessor(data)
    } catch (err) {
      setProfessor(null)
    }
    setLoading(false)
  }

  const handleSubmitReview = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      // Calculate average rating
      const avgRating = (
        (reviewWorkload + reviewFairness + reviewDifficulty + reviewAttendance + reviewEngagement) / 5
      ).toFixed(2)
      const res = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/professor/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: reviewContent,
          workload: reviewWorkload,
          fairness: reviewFairness,
          difficulty: reviewDifficulty,
          attendance: reviewAttendance,
          engagement: reviewEngagement,
          course_taken: reviewCourse,
          grade: reviewGrade,
          rating: Number(avgRating), // send average rating
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowReviewForm(false)
        setReviewContent("")
        setReviewWorkload(3)
        setReviewFairness(3)
        setReviewDifficulty(3)
        setReviewAttendance(3)
        setReviewEngagement(3)
        setReviewCourse("")
        setReviewGrade("")
        await reloadProfessor()
      } else {
        setSubmitError(data.error || "Failed to submit review.")
      }
    } catch (err) {
      setSubmitError("Failed to submit review.")
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <Link href="/" className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              AAU RateProf
            </span>
          </Link>
        </header>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-lg text-slate-600 font-medium">Loading professor details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!professor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <Link href="/" className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              AAU RateProf
            </span>
          </Link>
        </header>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <User className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Professor Not Found</h2>
            <p className="text-slate-600">The professor you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Prepare reviews and courses
  const reviews = Array.isArray(professor.reviews) ? professor.reviews : []
  const courses = [...new Set(reviews.map((review: any) => review.course_taken).filter((c: string) => c && c.trim() !== ""))]

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review: any) => selectedCourse === "all" || review.course_taken === selectedCourse)
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date || b.created_at || 0).getTime() - new Date(a.date || a.created_at || 0).getTime()
        case "oldest":
          return new Date(a.date || a.created_at || 0).getTime() - new Date(b.date || b.created_at || 0).getTime()
        case "highest":
          return (b.rating || 0) - (a.rating || 0)
        case "lowest":
          return (a.rating || 0) - (b.rating || 0)
        default:
          return 0
      }
    })

  // Rating breakdown
  const ratingBreakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r: any) => {
    if (r.rating && ratingBreakdown[r.rating]) ratingBreakdown[r.rating] += 1
    else if (r.rating) ratingBreakdown[r.rating] = 1
  })

  // Calculate average ratings for different aspects
  const avgWorkload = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.workload || 0), 0) / reviews.length : 0
  const avgFairness = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.fairness || 0), 0) / reviews.length : 0
  const avgDifficulty =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.difficulty || 0), 0) / reviews.length : 0
  const avgEngagement =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.engagement || 0), 0) / reviews.length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header - copied from landing page */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2">
          <GraduationCap className="h-8 w-8 text-emerald-600" />
          <span className="font-bold text-xl text-gray-900">AAU RateMyProfessors</span>
        </Link>

      </header>

      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Enhanced Breadcrumb */}
        <nav
          className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 mb-6 sm:mb-8 bg-white/60 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 w-fit"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-emerald-600 flex items-center gap-1 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Home
          </Link>

          <span className="text-slate-400">/</span>
          <span className="font-medium text-slate-800">{professor.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-6 sm:mb-8">
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-white to-slate-50">
            <CardContent className="p-4 sm:p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
                {/* Professor Image */}
                <div className="flex-shrink-0">
                  {professor.photo_path && !imageError ? (
                    <img
                      src={
                        professor.photo_path
                          ? professor.photo_path.startsWith("http")
                            ? professor.photo_path
                            : `https://portal.aau.edu.et//${professor.photo_path.replace(/^\/+/, "")}`
                          : ""
                      }
                      alt={professor.name}
                      className="w-40 h-40 rounded-2xl object-cover shadow-lg ring-4 ring-white"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-lg ring-4 ring-white">
                      <User className="w-20 h-20 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Professor Info */}
                <div className="flex-1 w-full text-center lg:text-left">
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">{professor.name}</h1>
                  <p className="text-xl text-slate-600 mb-2">{professor.position || professor.title}</p>
                  <p className="text-lg text-emerald-600 font-semibold mb-6">{professor.department}</p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white/80 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold text-slate-900">
                          {professor.rating !== undefined && professor.rating !== null
                            ? Number(professor.rating).toFixed(1)
                            : "-"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">Overall Rating</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                        <span className="text-2xl font-bold text-slate-900">{reviews.length}</span>
                      </div>
                      <p className="text-sm text-slate-600">Reviews</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <BookOpen className="h-5 w-5 text-purple-500" />
                        <span className="text-2xl font-bold text-slate-900">{courses.length}</span>
                      </div>
                      <p className="text-sm text-slate-600">Courses</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <span className="text-2xl font-bold text-slate-900">{avgEngagement.toFixed(1)}</span>
                      </div>
                      <p className="text-sm text-slate-600">Engagement</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Professor Details */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {professor.office || professor.email || professor.phone || professor.officeHours ? (
                  <>
                    {professor.office && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">Office</p>
                          <p className="text-slate-600">{professor.office}</p>
                        </div>
                      </div>
                    )}
                    {professor.email && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Mail className="h-5 w-5 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">Email</p>
                          <p className="text-slate-600 break-all">{professor.email}</p>
                        </div>
                      </div>
                    )}
                    {professor.phone && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Phone className="h-5 w-5 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">Phone</p>
                          <p className="text-slate-600">{professor.phone}</p>
                        </div>
                      </div>
                    )}
                    {professor.officeHours && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Clock className="h-5 w-5 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">Office Hours</p>
                          <p className="text-slate-600">{professor.officeHours}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-slate-500 text-sm text-center py-4">
                    No contact information available.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rating Breakdown */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-emerald-600" />
                  Rating Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-6">{rating}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Progress
                        value={reviews.length > 0 ? ((ratingBreakdown[rating] || 0) / reviews.length) * 100 : 0}
                        className="flex-1 h-3"
                      />
                      <span className="text-sm text-slate-600 w-8 text-right">{ratingBreakdown[rating] || 0}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Workload</span>
                    <span className="text-sm font-bold text-slate-900">{avgWorkload.toFixed(1)}/5</span>
                  </div>
                  <Progress value={(avgWorkload / 5) * 100} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Fairness</span>
                    <span className="text-sm font-bold text-slate-900">{avgFairness.toFixed(1)}/5</span>
                  </div>
                  <Progress value={(avgFairness / 5) * 100} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Difficulty</span>
                    <span className="text-sm font-bold text-slate-900">{avgDifficulty.toFixed(1)}/5</span>
                  </div>
                  <Progress value={(avgDifficulty / 5) * 100} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Engagement</span>
                    <span className="text-sm font-bold text-slate-900">{avgEngagement.toFixed(1)}/5</span>
                  </div>
                  <Progress value={(avgEngagement / 5) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {professor.tags && professor.tags.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-emerald-600" />
                    Student Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professor.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - About and Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">About {professor.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {professor.bio && (
                  <div>
                    <p className="text-slate-700 leading-relaxed">{professor.bio}</p>
                  </div>
                )}

                {/* Education */}
                {professor.education && professor.education.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-emerald-600" />
                      Education
                    </h4>
                    <ul className="space-y-2">
                      {professor.education.map((edu: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-slate-700">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Courses */}
                {courses.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                      Courses Taught
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {courses.map((course) => (
                        <div
                          key={course}
                          className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-100"
                        >
                          <span className="font-medium text-emerald-800">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="space-y-2">
                  {professor.qualification && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Qualification:</span>
                      <span className="text-slate-800">{professor.qualification}</span>
                    </div>
                  )}
                  {professor.college && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">College:</span>
                      <span className="text-slate-800">{professor.college}</span>
                    </div>
                  )}
                  {professor.specialization && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Specialization:</span>
                      <span className="text-slate-800">{professor.specialization}</span>
                    </div>
                  )}
                  {professor.academic_rank && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Academic Rank:</span>
                      <span className="text-slate-800">{professor.academic_rank}</span>
                    </div>
                  )}
                  {professor.nationality && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Nationality:</span>
                      <span className="text-slate-800">{professor.nationality}</span>
                    </div>
                  )}
                  {professor.gender && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Gender:</span>
                      <span className="text-slate-800">{professor.gender}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                    Student Reviews ({filteredReviews.length})
                  </CardTitle>
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Write Review
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Review Form Popup */}
                <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                  <DialogContent className="max-w-lg w-full p-0 max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
                    <DialogHeader className="pt-6 px-6">
                      <DialogTitle>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                            <Plus className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-bold text-xl text-slate-900">Write a Review</span>
                        </div>
                        <p className="text-slate-600 text-sm mt-1">Share your experience to help other students</p>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-slate-700">Course Taken</label>
                          <Input
                            type="text"
                            placeholder="e.g., CS101, MATH201"
                            value={reviewCourse}
                            onChange={(e) => setReviewCourse(e.target.value)}
                            className="rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-slate-700">Grade Received</label>
                          <Input
                            type="text"
                            placeholder="e.g., A, B+, C"
                            value={reviewGrade}
                            onChange={(e) => setReviewGrade(e.target.value)}
                            className="rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2 text-slate-700">Your Review</label>
                        <Textarea
                          placeholder="Share your detailed experience with this professor..."
                          className="min-h-[120px] rounded-lg border-slate-300 focus:border-emerald-500 resize-none"
                          value={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                        />
                      </div>

                      {/* Rating Sliders */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {[
                          { label: "Workload", value: reviewWorkload, setter: setReviewWorkload },
                          { label: "Fairness", value: reviewFairness, setter: setReviewFairness },
                          { label: "Difficulty", value: reviewDifficulty, setter: setReviewDifficulty },
                          { label: "Attendance", value: reviewAttendance, setter: setReviewAttendance },
                          { label: "Engagement", value: reviewEngagement, setter: setReviewEngagement },
                        ].map((item) => (
                          <div key={item.label} className="bg-white rounded-lg p-4 border border-slate-200">
                            <label className="block text-sm font-medium mb-2 text-slate-700">
                              {item.label}: <span className="font-bold text-slate-900">{item.value}</span>
                            </label>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              step={1}
                              value={item.value}
                              onChange={(e) => item.setter(Number(e.target.value))}
                              className="w-full accent-emerald-600"
                              disabled={submitting}
                            />
                          </div>
                        ))}
                      </div>

                      {submitError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-700 text-sm">{submitError}</p>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <Button
                          onClick={handleSubmitReview}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg px-8"
                          disabled={
                            submitting ||
                            !reviewContent.trim()
                          }
                        >
                          {submitting ? "Submitting..." : "Submit Review"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowReviewForm(false)}
                          disabled={submitting}
                          className="rounded-lg border-slate-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                {/* ...rest of your CardContent (filters, reviews list, etc.) ... */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Filter & Sort:</span>
                  </div>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-full sm:w-[200px] bg-white">
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[150px] bg-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="highest">Highest Rated</SelectItem>
                      <SelectItem value="lowest">Lowest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced Reviews List */}
                <div className="space-y-4 sm:space-y-6">
                  {filteredReviews.map((review, idx) => (
                    <div
                      key={review.id || idx}
                      className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Review Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-lg text-slate-900">{review.rating}</span>
                          </div>
                          {review.course_taken && (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                              {review.course_taken}
                            </Badge>
                          )}
                          {review.grade && (
                            <Badge variant="outline" className="border-slate-300">
                              Grade: {review.grade}
                            </Badge>
                          )}
                        </div>
                        {review.date && (
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Calendar className="h-4 w-4" />
                            {review.date}
                          </div>
                        )}
                      </div>

                      {/* Review Content */}
                      <div className="mb-4">
                        <p className="text-slate-700 leading-relaxed">{review.content}</p>
                      </div>

                      {/* Review Metrics */}
                      <div className="flex flex-wrap gap-4 items-center text-sm mt-2">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Clock className="h-4 w-4 text-blue-400" />
                          Workload:{" "}
                          {review.workload}/5
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <Award className="h-4 w-4 text-green-400" />
                          Fairness:{" "}
                          {review.fairness}/5
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <BookOpen className="h-4 w-4 text-orange-400" />
                          Diffculty:{" "}
                          {review.difficulty}/5
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <Users className="h-4 w-4 text-purple-400" />
                          Attendance:{" "}
                          {review.attendance}/5
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <TrendingUp className="h-4 w-4 text-pink-400" />
                          Engagement:{" "}
                          {review.engagement}/5
                        </span>
                      </div>

                      {/* Additional Info */}
                      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                        {review.semester && <span>Semester: {review.semester}</span>}
                        {review.wouldTakeAgain !== undefined && (
                          <span>
                            Would take again:{" "}
                            {review.wouldTakeAgain === true
                              ? "Yes"
                              : review.wouldTakeAgain === false
                                ? "No"
                                : review.wouldTakeAgain}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredReviews.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-600 mb-2">No reviews yet</h3>
                      <p className="text-slate-500">Be the first to share your experience with this professor!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Input component for review form fields
function Input(props: any) {
  return (
    <input
      {...props}
      className={
        "block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors " +
        (props.className || "")
      }
    />
  )
}

// Enhanced Star Rating Input Component
function StarRatingInput({
  value,
  onChange,
  max = 5,
  disabled = false,
}: {
  value: number | ""
  onChange: (v: number) => void
  max?: number
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(max)].map((_, i) => {
          const starValue = i + 1
          return (
            <button
              type="button"
              key={starValue}
              className="focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded transition-transform hover:scale-110"
              onClick={() => !disabled && onChange(starValue)}
              onMouseDown={(e) => e.preventDefault()}
              aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
              disabled={disabled}
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  value && starValue <= value
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-slate-200 text-slate-300 hover:fill-yellow-200 hover:text-yellow-300"
                }`}
              />
            </button>
          )
        })}
      </div>
      {value && (
        <div className="ml-3 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
          <span className="text-sm font-bold">
            {value} / {max}
          </span>
        </div>
      )}
      <span className="text-xs text-slate-500 ml-2">(Click to rate)</span>
    </div>
  )
}
