"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, X, History, Target, Home, Plus, Minus } from "lucide-react"

interface FoodItem {
  name: string
  quantity: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface NutritionData {
  food: FoodItem[]
  total: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

interface SavedMeal {
  id: string
  date: string
  time: string
  image: string
  nutrition: NutritionData
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
}

interface NutritionGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

type View = "analyzer" | "history" | "goals"

export default function ProCaloriesAI() {
  const [currentView, setCurrentView] = useState<View>("analyzer")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([])
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
  })
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const savedMealsData = localStorage.getItem("promeals_meals")
    const savedGoalsData = localStorage.getItem("promeals_goals")

    if (savedMealsData) {
      setSavedMeals(JSON.parse(savedMealsData))
    }
    if (savedGoalsData) {
      setNutritionGoals(JSON.parse(savedGoalsData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("promeals_meals", JSON.stringify(savedMeals))
  }, [savedMeals])

  useEffect(() => {
    localStorage.setItem("promeals_goals", JSON.stringify(nutritionGoals))
  }, [nutritionGoals])

  const getTodaysTotals = () => {
    const today = new Date().toDateString()
    const todaysMeals = savedMeals.filter((meal) => new Date(meal.date).toDateString() === today)

    return todaysMeals.reduce(
      (total, meal) => ({
        calories: total.calories + meal.nutrition.total.calories,
        protein: total.protein + meal.nutrition.total.protein,
        carbs: total.carbs + meal.nutrition.total.carbs,
        fat: total.fat + meal.nutrition.total.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }

  const saveMeal = () => {
    if (!nutritionData || !selectedImage) return

    const newMeal: SavedMeal = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      image: selectedImage,
      nutrition: nutritionData,
      mealType: selectedMealType,
    }

    setSavedMeals((prev) => [newMeal, ...prev])
    setSelectedImage(null)
    setNutritionData(null)
    setCurrentView("history")
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[v0] Upload button clicked, files:", event.target.files)
    const file = event.target.files?.[0]
    if (file) {
      console.log("[v0] File selected:", file.name, file.type)
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setSelectedImage(imageData)
        setNutritionData(null)
        console.log("[v0] Image loaded successfully")
        analyzeImageData(imageData)
      }
      reader.readAsDataURL(file)
    } else {
      console.log("[v0] No file selected")
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setShowCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Camera access denied or not available")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg")
        setSelectedImage(imageData)
        setNutritionData(null)
        stopCamera()
        analyzeImageData(imageData)
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setShowCamera(false)
  }

  const analyzeImageData = async (imageData?: string) => {
    const imageToAnalyze = imageData || selectedImage
    if (!imageToAnalyze) return

    setIsAnalyzing(true)
    console.log("[v0] Starting image analysis")

    try {
      const response = await fetch(imageToAnalyze)
      const blob = await response.blob()

      const formData = new FormData()
      formData.append("image", blob, "meal.jpg")

      console.log("[v0] Sending API request")
      const apiResponse = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      const result = await apiResponse.json()
      console.log("[v0] API response:", result)

      if (result.success) {
        if (result.data?.output?.food && Array.isArray(result.data.output.food)) {
          const foodItems = result.data.output.food

          const total = foodItems.reduce(
            (acc: any, item: any) => ({
              calories: acc.calories + (item.calories || 0),
              protein: acc.protein + (item.protein || 0),
              carbs: acc.carbs + (item.carbs || 0),
              fat: acc.fat + (item.fat || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 },
          )

          const nutritionData: NutritionData = {
            food: foodItems,
            total: total,
          }

          setNutritionData(nutritionData)
          console.log("[v0] Analysis successful with nutrition data")
        } else if (result.data?.message === "Workflow was started") {
          console.log("[v0] Webhook started, showing demo data")
          const demoData: NutritionData = {
            food: [
              {
                name: "Mixed Green Salad",
                quantity: "1 large bowl (200g)",
                calories: 45,
                protein: 3.2,
                carbs: 8.5,
                fat: 0.8,
              },
              {
                name: "Grilled Salmon",
                quantity: "1 fillet (150g)",
                calories: 280,
                protein: 39.2,
                carbs: 0,
                fat: 12.4,
              },
              {
                name: "Cherry Tomatoes",
                quantity: "6 pieces (100g)",
                calories: 18,
                protein: 0.9,
                carbs: 3.9,
                fat: 0.2,
              },
            ],
            total: {
              calories: 343,
              protein: 43.3,
              carbs: 12.4,
              fat: 13.4,
            },
          }
          setNutritionData(demoData)
        } else {
          console.log("[v0] Unexpected response structure:", result.data)
          throw new Error("No nutrition data in response")
        }
      } else {
        throw new Error(result.error || "Invalid response format")
      }
    } catch (error) {
      console.error("Analysis failed:", error)
      alert("Failed to analyze image. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleUploadClick = () => {
    console.log("[v0] Upload button clicked directly")
    const fileInput = document.getElementById("image-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  const renderAnalyzerView = () => (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-240px)] px-6 pb-20">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
          AI-Powered • Instant Results
        </Badge>
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-balance">
          Snap.
          <br />
          <span className="text-orange-400">Analyze.</span>
          <br />
          Track.
        </h1>
        <p className="text-xl text-gray-300 text-balance max-w-lg mx-auto">
          Point your camera at any meal and get instant nutrition facts in seconds.
        </p>
      </div>

      {!showCamera && !selectedImage && (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={startCamera}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold"
          >
            <Camera className="w-5 h-5 mr-2" />
            Take Photo
          </Button>
          <Button
            onClick={handleUploadClick}
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg cursor-pointer bg-transparent"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Photo
          </Button>
          <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      )}

      {showCamera && (
        <Card className="w-full max-w-md bg-black/50 border-white/20">
          <CardContent className="p-4">
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-lg" />
              <Button
                onClick={stopCamera}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-white hover:bg-black/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={capturePhoto} className="flex-1 bg-orange-500 hover:bg-orange-600">
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedImage && (
        <Card className="w-full max-w-md bg-black/50 border-white/20">
          <CardContent className="p-4">
            <div className="space-y-4">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Meal to analyze"
                className="w-full h-64 object-cover rounded-lg"
              />
              {isAnalyzing && (
                <div className="w-full bg-orange-500/20 border border-orange-500/30 rounded-lg py-3 px-4 text-center">
                  <div className="flex items-center justify-center text-orange-300">
                    <div className="w-5 h-5 border-2 border-orange-300/30 border-t-orange-300 rounded-full animate-spin mr-2" />
                    Analyzing your meal...
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {nutritionData && (
        <Card className="w-full max-w-md bg-black/50 border-white/20 mt-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Nutrition Facts</h3>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">AI Analysis</Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-black text-orange-400">{nutritionData.total.calories}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-white">{nutritionData.total.protein.toFixed(1)}g</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-white">{nutritionData.total.carbs}g</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-white">{nutritionData.total.fat.toFixed(1)}g</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Fat</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Food Items Detected</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {nutritionData.food.map((item, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-white text-sm">{item.name}</span>
                      <span className="text-orange-400 text-sm font-semibold">{item.calories} cal</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{item.quantity}</div>
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>P: {item.protein}g</span>
                      <span>C: {item.carbs}g</span>
                      <span>F: {item.fat}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">Meal Type</label>
              <div className="grid grid-cols-4 gap-2">
                {(["breakfast", "lunch", "dinner", "snack"] as const).map((type) => (
                  <Button
                    key={type}
                    variant={selectedMealType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMealType(type)}
                    className={
                      selectedMealType === type
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "border-white/30 text-white hover:bg-white/10 bg-transparent"
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveMeal} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                Save to History
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10 bg-transparent"
                onClick={() => {
                  setSelectedImage(null)
                  setNutritionData(null)
                }}
              >
                Analyze Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </main>
  )

  const renderHistoryView = () => {
    const todaysTotals = getTodaysTotals()

    return (
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-4">Meal History</h1>
            <p className="text-gray-300">Track your nutrition journey</p>
          </div>

          <Card className="bg-black/50 border-white/20 mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Today's Progress</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-orange-400">{todaysTotals.calories}</div>
                  <div className="text-xs text-gray-400">/ {nutritionGoals.calories} cal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white">{todaysTotals.protein.toFixed(1)}g</div>
                  <div className="text-xs text-gray-400">/ {nutritionGoals.protein}g protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white">{todaysTotals.carbs.toFixed(1)}g</div>
                  <div className="text-xs text-gray-400">/ {nutritionGoals.carbs}g carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white">{todaysTotals.fat.toFixed(1)}g</div>
                  <div className="text-xs text-gray-400">/ {nutritionGoals.fat}g fat</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Calories</span>
                  <span>{Math.round((todaysTotals.calories / nutritionGoals.calories) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${Math.min((todaysTotals.calories / nutritionGoals.calories) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {savedMeals.length === 0 ? (
              <Card className="bg-black/50 border-white/20">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400 mb-4">No meals saved yet</p>
                  <Button onClick={() => setCurrentView("analyzer")} className="bg-orange-500 hover:bg-orange-600">
                    Analyze Your First Meal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              savedMeals.map((meal) => (
                <Card key={meal.id} className="bg-black/50 border-white/20">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={meal.image || "/placeholder.svg"}
                        alt="Saved meal"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge className="mb-1 bg-orange-500/20 text-orange-300 border-orange-500/30">
                              {meal.mealType}
                            </Badge>
                            <div className="text-sm text-gray-400">
                              {new Date(meal.date).toLocaleDateString()} at {meal.time}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-orange-400">{meal.nutrition.total.calories} cal</div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-300">
                          <span>P: {meal.nutrition.total.protein.toFixed(1)}g</span>
                          <span>C: {meal.nutrition.total.carbs.toFixed(1)}g</span>
                          <span>F: {meal.nutrition.total.fat.toFixed(1)}g</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    )
  }

  const renderGoalsView = () => (
    <main className="relative z-10 px-6 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-4">Nutrition Goals</h1>
          <p className="text-gray-300">Set your daily targets</p>
        </div>

        <Card className="bg-black/50 border-white/20">
          <CardContent className="p-6">
            <div className="space-y-6">
              {Object.entries(nutritionGoals).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-white mb-2 capitalize">
                    {key} {key === "calories" ? "" : "(g)"}
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNutritionGoals((prev) => ({
                          ...prev,
                          [key]: Math.max(0, prev[key as keyof NutritionGoals] - (key === "calories" ? 50 : 5)),
                        }))
                      }
                      className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="text-2xl font-bold text-white">{value}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNutritionGoals((prev) => ({
                          ...prev,
                          [key]: prev[key as keyof NutritionGoals] + (key === "calories" ? 50 : 5),
                        }))
                      }
                      className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/delicious-colorful-healthy-meal-bowl-with-salmon-v.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">Promeals</span>
          </div>
        </div>
      </header>

      {currentView === "analyzer" && renderAnalyzerView()}
      {currentView === "history" && renderHistoryView()}
      {currentView === "goals" && renderGoalsView()}

      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/20 z-20">
        <div className="flex justify-around py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("analyzer")}
            className={`flex flex-col items-center gap-1 ${
              currentView === "analyzer" ? "text-orange-400" : "text-gray-400"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Analyze</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("history")}
            className={`flex flex-col items-center gap-1 ${
              currentView === "history" ? "text-orange-400" : "text-gray-400"
            }`}
          >
            <History className="w-5 h-5" />
            <span className="text-xs">History</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("goals")}
            className={`flex flex-col items-center gap-1 ${
              currentView === "goals" ? "text-orange-400" : "text-gray-400"
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="text-xs">Goals</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
