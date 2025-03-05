"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Filter, 
  ThumbsUp, 
  MessageSquare, 
  MoreHorizontal, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  MapPin
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const mockDiscussions = [
  {
    id: "1",
    title: "Dangerous intersection needs traffic light",
    content:
      "The intersection of Oak and Main has had 3 accidents this month. We need to petition the city for a traffic light before someone gets seriously hurt.",
    author: {
      name: "Jennifer Wilson",
      avatar: "/placeholder.svg?height=40&width=40&text=JW",
    },
    category: "traffic",
    votes: 42,
    comments: 15,
    createdAt: "2023-11-10T14:30:00Z",
    isHot: true,
    location: { lat: 37.7749, lng: -122.4194 } // Example location
  },
  {
    id: "2",
    title: "Playground equipment in Central Park is damaged",
    content:
      "Several pieces of playground equipment in Central Park are broken and have sharp edges. Children could get hurt. The city needs to repair or replace them.",
    author: {
      name: "Marcus Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=MJ",
    },
    category: "parks",
    votes: 28,
    comments: 7,
    createdAt: "2023-11-12T09:15:00Z",
    isHot: false,
    location: { lat: 37.7833, lng: -122.4167 } // Example location
  },
  {
    id: "3",
    title: "Street lights out on Elm Street for over a week",
    content:
      "The entire block of Elm Street between 5th and 6th Avenue has had no street lighting for over a week. It's very dangerous at night.",
    author: {
      name: "Sarah Thompson",
      avatar: "/placeholder.svg?height=40&width=40&text=ST",
    },
    category: "lighting",
    votes: 35,
    comments: 12,
    createdAt: "2023-11-14T18:45:00Z",
    isHot: true,
    location: { lat: 37.7699, lng: -122.4111 } // Example location
  },
  {
    id: "4",
    title: "Flooding on River Road after heavy rain",
    content:
      "River Road near the bridge consistently floods after heavy rain. The drainage system needs to be improved to prevent this recurring issue.",
    author: {
      name: "David Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=DC",
    },
    category: "flooding",
    votes: 19,
    comments: 8,
    createdAt: "2023-11-15T11:20:00Z",
    isHot: false,
    location: { lat: 37.7649, lng: -122.4194 } // Example location
  },
  {
    id: "5",
    title: "Proposal for community clean-up day",
    content:
      "I'm proposing a community clean-up day for the riverside park area. We could organize volunteers and get supplies from the local hardware store.",
    author: {
      name: "Lisa Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40&text=LR",
    },
    category: "community",
    votes: 31,
    comments: 22,
    createdAt: "2023-11-16T15:10:00Z",
    isHot: true,
    location: { lat: 37.7869, lng: -122.4000 } // Example location
  },
]

const mockUpdates = [
  {
    id: "1",
    title: "Pothole on Main Street repaired",
    content: "The city has filled the large pothole on Main Street that was reported last week.",
    status: "resolved",
    updatedAt: "2023-11-17T10:30:00Z",
    originalReportId: "123",
    location: { lat: 37.7790, lng: -122.4200 } // Example location
  },
  {
    id: "2",
    title: "Broken swing at Westside Park",
    content: "Parks department has scheduled repairs for the broken swing set for next Tuesday.",
    status: "in_progress",
    updatedAt: "2023-11-16T14:45:00Z",
    originalReportId: "124",
    location: { lat: 37.7820, lng: -122.4150 } // Example location
  },
  {
    id: "3",
    title: "Fallen tree removed from Cedar Lane",
    content: "Public works has removed the fallen tree that was blocking Cedar Lane after the storm.",
    status: "resolved",
    updatedAt: "2023-11-15T09:20:00Z",
    originalReportId: "125",
    location: { lat: 37.7700, lng: -122.4100 } // Example location
  },
]

// Distance threshold in meters to trigger alerts (500 meters = ~0.3 miles)
const ALERT_DISTANCE_THRESHOLD = 500;

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in meters
};

export default function ForumPage() {
  const [activeTab, setActiveTab] = useState("discussions")
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }) // Default to San Francisco
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [nearbyHazards, setNearbyHazards] = useState([])
  const [showMap, setShowMap] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapLoadError, setMapLoadError] = useState(null)
  
  // Helper function to load Google Maps script
  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return; // Script already loaded
    }
    
    try {
      const googleMapScript = document.createElement('script');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      googleMapScript.async = true;
      googleMapScript.defer = true;
      
      googleMapScript.addEventListener('load', () => {
        setMapLoaded(true);
      });
      
      googleMapScript.addEventListener('error', () => {
        setMapLoadError('Failed to load Google Maps API. Check your API key.');
      });
      
      document.head.appendChild(googleMapScript);
    } catch (error) {
      setMapLoadError('Error loading Google Maps: ' + error.message);
    }
  };

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(userPos)
          setMapCenter(userPos)
          
          // Check for nearby hazards
          const activeHazards = [
            ...mockDiscussions.filter(d => d.isHot),
            ...mockUpdates.filter(u => u.status !== "resolved")
          ]
          
          const nearby = activeHazards.filter(hazard => {
            const distance = calculateDistance(
              userPos.lat, 
              userPos.lng, 
              hazard.location.lat, 
              hazard.location.lng
            )
            return distance < ALERT_DISTANCE_THRESHOLD
          })
          
          setNearbyHazards(nearby)
        },
        (error) => {
          console.error("Error getting location: ", error)
          setLocationError("Unable to access your location. Please enable location services to receive alerts about nearby hazards.")
        },
        { enableHighAccuracy: true }
      )
    } else {
      setLocationError("Geolocation is not supported by your browser")
    }
  }, [])
  
  // Only load Google Maps when map is shown
  useEffect(() => {
    if (showMap && !mapLoaded && !mapLoadError) {
      loadGoogleMapsScript();
    }
  }, [showMap, mapLoaded, mapLoadError]);

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getCategoryBadge = (category) => {
    const colors = {
      traffic: "bg-red-100 text-red-800",
      parks: "bg-green-100 text-green-800",
      lighting: "bg-yellow-100 text-yellow-800",
      flooding: "bg-blue-100 text-blue-800",
      community: "bg-purple-100 text-purple-800",
    }
    return (
      <Badge className={colors[category] || "bg-gray-100 text-gray-800"}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
    }
  }

  const renderMap = () => {
    if (!mapLoaded) {
      return (
        <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
          <p className="text-gray-500">Loading map...</p>
        </div>
      );
    }
    
    if (mapLoadError) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Map Error</AlertTitle>
          <AlertDescription>{mapLoadError}</AlertDescription>
        </Alert>
      );
    }
    
    const GoogleMap = window.google.maps.Map;
    const LatLng = window.google.maps.LatLng;
    const Marker = window.google.maps.Marker;
    const InfoWindow = window.google.maps.InfoWindow;
    
    const mapRef = document.getElementById('google-map');
    
    if (!mapRef.__map) {
      // Initialize the map
      const map = new GoogleMap(mapRef, {
        center: new LatLng(mapCenter.lat, mapCenter.lng),
        zoom: 13,
      });
      mapRef.__map = map;
      
      // Add user location marker if available
      if (userLocation) {
        new Marker({
          position: new LatLng(userLocation.lat, userLocation.lng),
          map: map,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
          title: "Your Location",
        });
      }
      
      // Add discussion markers
      mockDiscussions.forEach(discussion => {
        const marker = new Marker({
          position: new LatLng(discussion.location.lat, discussion.location.lng),
          map: map,
          icon: {
            url: getCategoryMarkerIcon(discussion.category),
          },
          title: discussion.title,
        });
        
        // Add click event for info window
        marker.addListener('click', () => {
          const infoWindow = new InfoWindow({
            content: `
              <div style="max-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 5px;">${discussion.title}</h3>
                <p style="font-size: 12px; margin-bottom: 5px;">${discussion.content.substring(0, 100)}...</p>
                <div style="margin-top: 8px;">
                  <span style="background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
                    ${discussion.category}
                  </span>
                </div>
              </div>
            `
          });
          infoWindow.open(map, marker);
        });
      });
      
      // Add update markers
      mockUpdates.forEach(update => {
        const marker = new Marker({
          position: new LatLng(update.location.lat, update.location.lng),
          map: map,
          icon: {
            url: getStatusMarkerIcon(update.status),
          },
          title: update.title,
        });
        
        // Add click event for info window
        marker.addListener('click', () => {
          const infoWindow = new InfoWindow({
            content: `
              <div style="max-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 5px;">${update.title}</h3>
                <p style="font-size: 12px; margin-bottom: 5px;">${update.content}</p>
                <div style="margin-top: 8px;">
                  <span style="background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
                    ${update.status}
                  </span>
                </div>
              </div>
            `
          });
          infoWindow.open(map, marker);
        });
      });
    }
    
    return null;
  };
  
  // Determine marker color based on category
  const getCategoryMarkerIcon = (category) => {
    const colors = {
      traffic: "red",
      parks: "green",
      lighting: "yellow",
      flooding: "blue",
      community: "purple",
    }
    return `https://maps.google.com/mapfiles/ms/icons/${colors[category] || "red"}-dot.png`
  }
  
  // Determine marker color based on status
  const getStatusMarkerIcon = (status) => {
    switch (status) {
      case "resolved":
        return "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
      case "in_progress":
        return "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      default:
        return "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Community Forum</h1>
        <p className="text-gray-600">
          Discuss safety concerns, vote on priorities, and track progress on hazard resolutions.
        </p>
      </div>
      
      {/* Location Error Alert */}
      {locationError && (
        <Alert className="mb-6" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Location Error</AlertTitle>
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}
      
      {/* Nearby Hazards Alert */}
      {nearbyHazards.length > 0 && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200 text-yellow-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Safety Alert</AlertTitle>
          <AlertDescription>
            There {nearbyHazards.length === 1 ? 'is' : 'are'} {nearbyHazards.length} active hazard{nearbyHazards.length === 1 ? '' : 's'} near your location:
            <ul className="list-disc pl-5 mt-2">
              {nearbyHazards.slice(0, 3).map((hazard) => (
                <li key={hazard.id}>
                  {hazard.title} 
                  {hazard.category && ` (${hazard.category})`}
                  {hazard.status && ` - ${hazard.status.replace('_', ' ')}`}
                </li>
              ))}
              {nearbyHazards.length > 3 && <li>...and {nearbyHazards.length - 3} more</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Map Toggle Button */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
      </div>
      
      {/* Google Map */}
      {showMap && (
        <div className="mb-6">
          <div 
            id="google-map" 
            style={{ 
              width: "100%", 
              height: "400px", 
              borderRadius: "8px"
            }}
          >
            {renderMap()}
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search discussions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="flex items-center gap-1">Start New Discussion</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="updates">Hazard Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-6">
          {mockDiscussions.map((discussion) => (
            <Card key={discussion.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      {discussion.title}
                      {discussion.isHot && (
                        <Badge variant="outline" className="border-red-500 text-red-500">
                          <TrendingUp className="mr-1 h-3 w-3" /> Hot
                        </Badge>
                      )}
                      {userLocation && calculateDistance(
                        userLocation.lat, 
                        userLocation.lng, 
                        discussion.location.lat, 
                        discussion.location.lng
                      ) < ALERT_DISTANCE_THRESHOLD && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          <AlertTriangle className="mr-1 h-3 w-3" /> Nearby
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <div className="flex items-center">
                        <Avatar className="mr-2 h-6 w-6">
                          <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                          <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {discussion.author.name}
                      </div>
                      <span>•</span>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(discussion.createdAt)}
                      </div>
                      <span>•</span>
                      {getCategoryBadge(discussion.category)}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Save</DropdownMenuItem>
                      <DropdownMenuItem>Report</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p>{discussion.content}</p>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{discussion.votes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>{discussion.comments}</span>
                    </Button>
                  </div>
                  <Button size="sm">Join Discussion</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="updates" className="space-y-6">
          {mockUpdates.map((update) => (
            <Card key={update.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {update.title}
                      {userLocation && calculateDistance(
                        userLocation.lat, 
                        userLocation.lng, 
                        update.location.lat, 
                        update.location.lng
                      ) < ALERT_DISTANCE_THRESHOLD && update.status !== "resolved" && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          <AlertTriangle className="mr-1 h-3 w-3" /> Nearby
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(update.updatedAt)}
                      </div>
                      <span>•</span>
                      {getStatusBadge(update.status)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{update.content}</p>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <div className="flex w-full items-center justify-between">
                  <Button variant="outline" size="sm">
                    View Original Report
                  </Button>
                  <Button size="sm">Add Comment</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}