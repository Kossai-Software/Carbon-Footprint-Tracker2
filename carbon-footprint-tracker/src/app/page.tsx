'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Leaf, Car, Zap, Smartphone, TrendingDown, Trophy, Target } from 'lucide-react'

type FootprintCategory = 'diet' | 'transport' | 'energy' | 'digital'

interface FootprintData {
  diet: {
    meatMeals: number
    vegetarianMeals: number
    veganMeals: number
  }
  transport: {
    walkingHours: number
    cyclingHours: number
    busHours: number
    trainHours: number
    carKm: number
    flightsShort: number
    flightsLong: number
  }
  energy: {
    electricityHours: number
    heatingHours: number
  }
  digital: {
    streamingHours: number
    cloudStorage: number
    gamingHours: number
  }
}

const TIPS = {
  diet: [
    { title: 'Meat-Free Mondays', impact: 'Reduce weekly meat consumption by 14%', effort: 'Low' },
    { title: 'Plant-Based Swaps', impact: 'Replace 2-3 meals with plant alternatives', effort: 'Medium' },
    { title: 'Local & Seasonal', impact: 'Reduce food transport emissions', effort: 'Medium' },
    { title: 'Reduce Food Waste', impact: 'Save ~330kg CO2/year per person', effort: 'Low' },
  ],
  transport: [
    { title: 'Walk or Cycle', impact: 'Zero emissions for trips under 3km', effort: 'Medium' },
    { title: 'Public Transport', impact: 'Up to 90% lower emissions than driving', effort: 'Medium' },
    { title: 'Carpooling', impact: 'Share emissions with others', effort: 'Low' },
    { title: 'Virtual Meetings', impact: 'Reduce business travel footprint', effort: 'Low' },
  ],
  energy: [
    { title: 'LED Bulbs', impact: '75% less energy than incandescent', effort: 'Low' },
    { title: 'Unplug Devices', impact: 'Eliminate phantom power usage', effort: 'Low' },
    { title: 'Natural Light', impact: 'Reduce artificial lighting needs', effort: 'Low' },
    { title: 'Thermostat Adjustment', impact: 'Save 1°C = 10% heating/cooling', effort: 'Low' },
  ],
  digital: [
    { title: 'Cloud Cleanup', impact: 'Delete unused files and emails', effort: 'Low' },
    { title: 'Streaming Quality', impact: 'Lower from HD to SD when possible', effort: 'Low' },
    { title: 'Device Lifespan', impact: 'Keep devices longer before replacement', effort: 'Medium' },
    { title: 'Dark Mode', impact: 'Save battery on OLED screens', effort: 'Low' },
  ],
}

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Emma Green', reduction: 42, avatar: '🌱' },
  { rank: 2, name: 'James Eco', reduction: 38, avatar: '🌿' },
  { rank: 3, name: 'Sophie Clean', reduction: 35, avatar: '🍃' },
  { rank: 4, name: 'Alex Nature', reduction: 32, avatar: '🌲' },
  { rank: 5, name: 'Mia Planet', reduction: 29, avatar: '🌍' },
]

export default function CarbonFootprintTracker() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [showResults, setShowResults] = useState(false)

  const [footprintData, setFootprintData] = useState<FootprintData>({
    diet: {
      meatMeals: 7,
      vegetarianMeals: 0,
      veganMeals: 0,
    },
    transport: {
      walkingHours: 2,
      cyclingHours: 1,
      busHours: 2,
      trainHours: 1,
      carKm: 30,
      flightsShort: 0,
      flightsLong: 0,
    },
    energy: {
      electricityHours: 50,
      heatingHours: 40,
    },
    digital: {
      streamingHours: 10,
      cloudStorage: 5,
      gamingHours: 5,
    },
  })

  const calculateFootprint = () => {
    // Based on Prof. Mike Berners-Lee's methodology
    // Values are in kg CO2e per week

    // Diet: ~2.5kg per meat meal, 1.7kg per vegetarian, 1.5kg per vegan
    const dietFootprint =
      footprintData.diet.meatMeals * 2.5 +
      footprintData.diet.vegetarianMeals * 1.7 +
      footprintData.diet.veganMeals * 1.5

    // Transport (per week)
    const transportFootprint =
      footprintData.transport.walkingHours * 0 +
      footprintData.transport.cyclingHours * 0 +
      footprintData.transport.busHours * 0.1 +
      footprintData.transport.trainHours * 0.06 +
      footprintData.transport.carKm * 0.2 +
      footprintData.transport.flightsShort * 50 +
      footprintData.transport.flightsLong * 150

    // Energy: ~0.5kg per kWh, UK avg 3.5 kWh/day = 1.75kg/day
    const energyFootprint =
      footprintData.energy.electricityHours * 0.2 +
      footprintData.energy.heatingHours * 0.3

    // Digital: streaming (~0.05kg/hr), storage (~0.01kg/GB), gaming (~0.1kg/hr)
    const digitalFootprint =
      footprintData.digital.streamingHours * 0.05 +
      footprintData.digital.cloudStorage * 0.01 +
      footprintData.digital.gamingHours * 0.1

    const totalFootprint = dietFootprint + transportFootprint + energyFootprint + digitalFootprint

    return {
      total: totalFootprint,
      diet: dietFootprint,
      transport: transportFootprint,
      energy: energyFootprint,
      digital: digitalFootprint,
    }
  }

  const results = calculateFootprint()

  const weeklyTarget = 25 // kg CO2e per week (sustainable target)
  const reductionPotential = Math.round(((results.total - weeklyTarget) / results.total) * 100)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Carbon Footprint Tracker
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  For University Students
                </p>
              </div>
            </div>
            <Badge variant="outline" className="gap-1">
              <Target className="w-3 h-3" />
              Weekly Target: {weeklyTarget} kg CO₂e
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="results">
              Results & Tips
              {showResults && <Badge className="ml-2 bg-green-600">New</Badge>}
            </TabsTrigger>
            <TabsTrigger value="leaderboard">Green Campus</TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            {/* Hero Card */}
            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Track Your Carbon Footprint
                </CardTitle>
                <CardDescription>
                  Estimate your weekly carbon emissions based on your daily habits. Based on
                  Prof. Mike Berners-Lee's methodology.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Diet Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Diet
                  </CardTitle>
                  <CardDescription>Weekly meal distribution (21 meals total)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>Meat-based meals</label>
                      <span className="font-semibold">{footprintData.diet.meatMeals} meals</span>
                    </div>
                    <Slider
                      value={[footprintData.diet.meatMeals]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          diet: { ...footprintData.diet, meatMeals: value },
                        })
                      }
                      max={21}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>Vegetarian meals</label>
                      <span className="font-semibold">{footprintData.diet.vegetarianMeals} meals</span>
                    </div>
                    <Slider
                      value={[footprintData.diet.vegetarianMeals]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          diet: { ...footprintData.diet, vegetarianMeals: value },
                        })
                      }
                      max={21}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>Vegan meals</label>
                      <span className="font-semibold">{footprintData.diet.veganMeals} meals</span>
                    </div>
                    <Slider
                      value={[footprintData.diet.veganMeals]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          diet: { ...footprintData.diet, veganMeals: value },
                        })
                      }
                      max={21}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Total: {footprintData.diet.meatMeals + footprintData.diet.vegetarianMeals + footprintData.diet.veganMeals}/21 meals
                  </div>
                </CardContent>
              </Card>

              {/* Transport Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-600" />
                    Transport
                  </CardTitle>
                  <CardDescription>Weekly travel habits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>🚶 Walking</label>
                      <span className="font-semibold">{footprintData.transport.walkingHours} hrs</span>
                    </div>
                    <Slider
                      value={[footprintData.transport.walkingHours]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          transport: { ...footprintData.transport, walkingHours: value },
                        })
                      }
                      max={20}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>🚴 Cycling</label>
                      <span className="font-semibold">{footprintData.transport.cyclingHours} hrs</span>
                    </div>
                    <Slider
                      value={[footprintData.transport.cyclingHours]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          transport: { ...footprintData.transport, cyclingHours: value },
                        })
                      }
                      max={20}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>🚌 Bus</label>
                      <span className="font-semibold">{footprintData.transport.busHours} hrs</span>
                    </div>
                    <Slider
                      value={[footprintData.transport.busHours]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          transport: { ...footprintData.transport, busHours: value },
                        })
                      }
                      max={20}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>🚂 Train</label>
                      <span className="font-semibold">{footprintData.transport.trainHours} hrs</span>
                    </div>
                    <Slider
                      value={[footprintData.transport.trainHours]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          transport: { ...footprintData.transport, trainHours: value },
                        })
                      }
                      max={20}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>🚗 Car driving</label>
                      <span className="font-semibold">{footprintData.transport.carKm} km</span>
                    </div>
                    <Slider
                      value={[footprintData.transport.carKm]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          transport: { ...footprintData.transport, carKm: value },
                        })
                      }
                      max={200}
                      min={0}
                      step={5}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>✈️ Short flights</label>
                      <span className="font-semibold">{footprintData.transport.flightsShort}</span>
                    </div>
                    <Slider
                      value={[footprintData.transport.flightsShort]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          transport: { ...footprintData.transport, flightsShort: value },
                        })
                      }
                      max={5}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>✈️ Long flights</label>
                      <span className="font-semibold">{footprintData.transport.flightsLong}</span>
                    </div>
                    <Slider
                      value={[footprintData.transport.flightsLong]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          transport: { ...footprintData.transport, flightsLong: value },
                        })
                      }
                      max={5}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Energy Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Energy Use
                  </CardTitle>
                  <CardDescription>Weekly energy consumption at home</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>⚡ Electricity usage</label>
                      <span className="font-semibold">{footprintData.energy.electricityHours} hrs</span>
                    </div>
                    <Slider
                      value={[footprintData.energy.electricityHours]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          energy: { ...footprintData.energy, electricityHours: value },
                        })
                      }
                      max={100}
                      min={0}
                      step={5}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>🔥 Heating usage</label>
                      <span className="font-semibold">{footprintData.energy.heatingHours} hrs</span>
                    </div>
                    <Slider
                      value={[footprintData.energy.heatingHours]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          energy: { ...footprintData.energy, heatingHours: value },
                        })
                      }
                      max={100}
                      min={0}
                      step={5}
                      className="cursor-pointer"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Digital Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    Digital Habits
                  </CardTitle>
                  <CardDescription>Weekly digital consumption</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>📺 Video streaming</label>
                      <span className="font-semibold">{footprintData.digital.streamingHours} hrs</span>
                    </div>
                    <Slider
                      value={[footprintData.digital.streamingHours]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          digital: { ...footprintData.digital, streamingHours: value },
                        })
                      }
                      max={50}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>☁️ Cloud storage</label>
                      <span className="font-semibold">{footprintData.digital.cloudStorage} GB</span>
                    </div>
                    <Slider
                      value={[footprintData.digital.cloudStorage]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          digital: { ...footprintData.digital, cloudStorage: value },
                        })
                      }
                      max={50}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>🎮 Gaming</label>
                      <span className="font-semibold">{footprintData.digital.gamingHours} hrs</span>
                    </div>
                    <Slider
                      value={[footprintData.digital.gamingHours]}
                      onValueChange={([value]) =>
                        setFootprintData({
                          ...footprintData,
                          digital: { ...footprintData.digital, gamingHours: value },
                        })
                      }
                      max={50}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calculate Button */}
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={() => {
                  setShowResults(true)
                  setActiveTab('results')
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-12"
              >
                Calculate My Footprint
              </Button>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Summary Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Your Weekly Carbon Footprint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {results.total.toFixed(1)} kg
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Weekly CO₂e</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {(results.total * 52).toFixed(0)} kg
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Yearly CO₂e</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {reductionPotential}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Potential Reduction</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Progress to sustainable target ({weeklyTarget} kg)
                      </span>
                      <span className="font-semibold">
                        {Math.min(100, Math.round((weeklyTarget / results.total) * 100))}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, (weeklyTarget / results.total) * 100)}
                      className="h-3"
                    />
                    {results.total > weeklyTarget && (
                      <p className="text-sm text-orange-600 mt-2 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        You're {((results.total - weeklyTarget) / weeklyTarget * 100).toFixed(0)}% over target.
                        Use our tips below to reduce!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Breakdown Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Footprint Breakdown</CardTitle>
                  <CardDescription>By category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-600" />
                          Diet
                        </span>
                        <span className="font-semibold">
                          {results.diet.toFixed(1)} kg ({((results.diet / results.total) * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <Progress
                        value={(results.diet / results.total) * 100}
                        className="h-2 bg-green-100 dark:bg-green-900"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-blue-600" />
                          Transport
                        </span>
                        <span className="font-semibold">
                          {results.transport.toFixed(1)} kg ({((results.transport / results.total) * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <Progress
                        value={(results.transport / results.total) * 100}
                        className="h-2 bg-blue-100 dark:bg-blue-900"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-600" />
                          Energy
                        </span>
                        <span className="font-semibold">
                          {results.energy.toFixed(1)} kg ({((results.energy / results.total) * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <Progress
                        value={(results.energy / results.total) * 100}
                        className="h-2 bg-yellow-100 dark:bg-yellow-900"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-purple-600" />
                          Digital
                        </span>
                        <span className="font-semibold">
                          {results.digital.toFixed(1)} kg ({((results.digital / results.total) * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <Progress
                        value={(results.digital / results.total) * 100}
                        className="h-2 bg-purple-100 dark:bg-purple-900"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    Actionable Tips
                  </CardTitle>
                  <CardDescription>Reduce your footprint by 15%</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {(Object.entries(TIPS) as [FootprintCategory, typeof TIPS[FootprintCategory]][]).map(([category, tips]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="font-semibold capitalize flex items-center gap-2">
                            {category === 'diet' && <Leaf className="w-4 h-4 text-green-600" />}
                            {category === 'transport' && <Car className="w-4 h-4 text-blue-600" />}
                            {category === 'energy' && <Zap className="w-4 h-4 text-yellow-600" />}
                            {category === 'digital' && <Smartphone className="w-4 h-4 text-purple-600" />}
                            {category}
                          </h4>
                          <div className="space-y-2 pl-6">
                            {tips.map((tip, index) => (
                              <div
                                key={index}
                                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                              >
                                <div className="font-medium mb-1">{tip.title}</div>
                                <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                  {tip.impact}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {tip.effort} Effort
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Green Campus Leaderboard
                </CardTitle>
                <CardDescription>
                  Students making the biggest impact. Updated weekly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {LEADERBOARD_DATA.map((student) => (
                    <div
                      key={student.rank}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        student.rank === 1
                          ? 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20'
                          : student.rank === 2
                          ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20'
                          : student.rank === 3
                          ? 'border-amber-600 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-white dark:bg-gray-800 rounded-full shadow">
                          {student.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{student.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            #{student.rank} on leaderboard
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {student.reduction}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            footprint reduced
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-300 text-center">
                    🌱 Join the leaderboard! Track your weekly progress and compete ethically
                    with fellow students to reduce carbon footprints together.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              Carbon Footprint Tracker - Based on Prof. Mike Berners-Lee's methodology
            </p>
            <p className="text-xs">
              Empowering university students to make sustainable choices and reduce their carbon
              footprint by 15% through actionable insights.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}