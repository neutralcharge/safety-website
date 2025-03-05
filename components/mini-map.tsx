"use client"

import { useState, useEffect, useRef } from "react"
import { Loader } from "lucide-react"
import Script from 'next/script';

type MiniMapProps = {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
    color?: string;
  }>;
  clickable?: boolean;
  onMarkerClick?: (index: number) => void;
  height?: string;
}

export default function MiniMap({
  latitude = 40.7128,
  longitude = -74.0060,
  zoom = 13,
  markers = [],
  clickable = true,
  onMarkerClick,
  height = "100%"
}: MiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapLoaded, setMapLoaded] = useState(false)
  
  useEffect(() => {
    if (mapLoaded && mapRef.current && !mapInstanceRef.current) {
      initializeMap()
    }
  }, [mapLoaded])
  
  const initializeMap = () => {
    if (!mapRef.current) return;
    
    try {
      const mapOptions = {
        center: { lat: latitude, lng: longitude },
        zoom: zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
        scrollwheel: clickable,
        draggable: clickable,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      };
      
      const map = new google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;
      
      markers.forEach((marker, index) => {
        const mapMarker = new google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: map,
          title: marker.title || "",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: marker.color || "#ff0000",
            fillOpacity: 1,
            strokeWeight: 1,
          },
        });
        
        if (clickable && onMarkerClick) {
          mapMarker.addListener("click", () => onMarkerClick(index));
        }
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };
  
  return (
    <div style={{ height, position: "relative" }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Loader className="animate-spin" />
        </div>
      )}
      <div ref={mapRef} style={{ height: "100%" }} />
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`}
        onLoad={() => setMapLoaded(true)}
        strategy="lazyOnload"
      />
    </div>
  );
}
