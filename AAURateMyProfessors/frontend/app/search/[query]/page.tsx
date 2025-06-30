"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Filter, SortAsc, GraduationCap, ChevronLeft, MapPin, User } from "lucide-react"
import Link from "next/link"

export default function SearchResultsPage() {
    const router = useRouter()
    const pathname = usePathname()
    // Extract query from /search/[query]
    const pathParts = pathname.split("/")
    const query = decodeURIComponent(pathParts[pathParts.length - 1] || "")

    const [searchQuery, setSearchQuery] = useState(query)
    const [sortBy, setSortBy] = useState("rating")
    const [filterDepartment, setFilterDepartment] = useState("all")
    const [filteredResults, setFilteredResults] = useState<any[]>([])
    const [departments, setDepartments] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    // Track which images failed to load
    const [imageErrorIds, setImageErrorIds] = useState<{ [id: string]: boolean }>({})

    // Fetch from Flask API when query changes
    useEffect(() => {
        async function fetchResults() {
            setLoading(true)
            try {
                const res = await fetch(
                    `process.env.NEXT_PUBLIC_API_URL/api/search?q=${encodeURIComponent(query)}`,
                    { cache: "no-store" },
                )
                const data = await res.json()
                setFilteredResults(data.results || [])
                setDepartments([
                    ...new Set((data.results || []).map((prof: any) => prof.department).filter(Boolean)),
                ])
            } catch (err) {
                setFilteredResults([])
                setDepartments([])
            }
            setLoading(false)
            setSearchQuery(query)
        }
        fetchResults()
    }, [query])

    // Filter and sort results client-side
    const displayedResults = filteredResults
        .filter((prof) => (filterDepartment === "all" ? true : prof.department === filterDepartment))
        .sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return (b.rating || 0) - (a.rating || 0)
                case "reviews":
                    return (b.reviewCount || 0) - (a.reviewCount || 0)
                case "name":
                    return (a.name || "").localeCompare(b.name || "")
                case "difficulty":
                    return (a.difficulty || 0) - (b.difficulty || 0)
                default:
                    return 0
            }
        })

    const handleSearch = () => {
        if (searchQuery.trim().length > 0) {
            router.push(`/search/${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const handleImgError = (id: string) => {
        setImageErrorIds((prev) => ({ ...prev, [id]: true }))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2">
          <GraduationCap className="h-8 w-8 text-emerald-600" />
          <span className="font-bold text-xl text-gray-900">AAU RateMyProfessors</span>
        </Link>
        <div className="ml-auto flex items-center w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search professors or departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 text-base border-2 border-gray-200 focus:border-emerald-500 rounded-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim().length > 0) {
                  router.push(`/search/${encodeURIComponent(searchQuery.trim())}`)
                }
              }}
            />
          </div>
          <Button
            className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => {
              if (searchQuery.trim().length > 0) {
                router.push(`/search/${encodeURIComponent(searchQuery.trim())}`)
              }
            }}
          >
            Search
          </Button>
        </div>
      </header>



            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <Link href="/" className="hover:text-emerald-600 flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Home
                    </Link>
                    
                    
                    {query && (
                        <>
                            <span>/</span>
                            <span className="font-medium">"{query}"</span>
                        </>
                    )}
                </div>

                {/* Results Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {query ? `Search Results for "${query}"` : "All Professors"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {loading
                                ? "Loading..."
                                : `Found ${displayedResults.length} professor${
                                        displayedResults.length !== 1 ? "s" : ""
                                  }`}
                        </p>
                    </div>

                    {/* Filters and Sort */}
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[150px]">
                                <SortAsc className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rating">Highest Rated</SelectItem>
                                <SelectItem value="reviews">Most Reviews</SelectItem>
                                <SelectItem value="name">Name A-Z</SelectItem>
                                <SelectItem value="difficulty">Easiest First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedResults.map((professor) => (
                        <Link key={professor.id} href={`/professor/${professor.id}`}>
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-emerald-200">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        {(professor.photo_path && !imageErrorIds[professor.id]) ? (
                                            <img
                                                src={
                                                    professor.photo_path
                                                        ? professor.photo_path.startsWith("http")
                                                            ? professor.photo_path
                                                            : `https://portal.aau.edu.et//${professor.photo_path.replace(/^\/+/, "")}`
                                                        : ""
                                                }
                                                alt={professor.name}
                                                className="w-16 h-16 rounded-full object-cover bg-gray-200"
                                                onError={() => handleImgError(professor.id)}
                                            />
                                        ) : (
                                            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200">
                                                <User className="w-8 h-8 text-gray-400" />
                                            </span>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg text-gray-900 truncate">
                                                {professor.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {professor.position || professor.title}
                                            </p>
                                            <p className="text-sm text-emerald-600 font-medium">
                                                {professor.department}
                                            </p>
                                            {professor.email && (
                                                <p className="text-xs text-gray-500 break-all">{professor.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    {professor.rating !== undefined && professor.rating !== null && (
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                <span className="font-bold text-lg">{professor.rating.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Courses */}
                                    {professor.courses && professor.courses.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-sm text-gray-500 mb-2">Courses:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {professor.courses.slice(0, 3).map((course: string) => (
                                                    <Badge key={course} variant="secondary" className="text-xs">
                                                        {course}
                                                    </Badge>
                                                ))}
                                                {professor.courses.length > 3 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{professor.courses.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {professor.tags && professor.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {professor.tags.slice(0, 2).map((tag: string) => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    {/* Office */}
                                    {professor.office && (
                                        <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                                            <MapPin className="h-3 w-3" />
                                            {professor.office}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* No Results */}
                {!loading && displayedResults.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No professors found</h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search terms or filters to find what you're looking for.
                        </p>
                        <Button
                            onClick={() => {
                                setSearchQuery("")
                                setFilterDepartment("all")
                                router.push("/search/")
                            }}
                            variant="outline"
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
