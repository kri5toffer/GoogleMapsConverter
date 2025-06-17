export const extractRouteInfo = async (url) => {
  // Check if it's a short URL (maps.app.goo.gl or goo.gl/maps)
  if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) { // Example: "https://maps.app.goo.gl/xyz" or "https://goo.gl/maps/xyz"
    try {
      // Try to extract route info from a standard URL pattern first
      // For full Google Maps URLs with coordinates in the path
      const dirRegex = /\/maps\/dir\/([^/]+)\/([^/]+)\//; // Example: "/maps/dir/New+York/Los+Angeles/"
      const dirMatch = url.match(dirRegex); // Example: ["maps/dir/New+York/Los+Angeles/", "New+York", "Los+Angeles"]

      if (dirMatch) {
        // Remove plus symbols and decode URI components for human-readable places
        const startPoint = decodeURIComponent(dirMatch[1].replace(/\+/g, ' ')); // Example: "New York"
        const endPoint = decodeURIComponent(dirMatch[2].replace(/\+/g, ' ')); // Example: "Los Angeles"
        
        return {
          type: 'route',
          startPoint, // Example: "New York"
          endPoint, // Example: "Los Angeles"
          // We don't have exact coordinates here, but we have place names
          startCoordinates: { lat: null, lng: null }, // Example: {lat: null, lng: null}
          endCoordinates: { lat: null, lng: null } // Example: {lat: null, lng: null}
        };
      }

      // Try to extract multiple coordinates from the URL using regex
      const coordsRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/g;
      const matches = [...url.matchAll(coordsRegex)];

      if (matches.length >= 2) {
        // We found at least two sets of coordinates (likely start and end)
        const startCoords = { 
          lat: parseFloat(matches[0][1]), 
          lng: parseFloat(matches[0][2]) 
        };
        const endCoords = { 
          lat: parseFloat(matches[matches.length - 1][1]), 
          lng: parseFloat(matches[matches.length - 1][2]) 
        };

        return {
          type: 'route',
          startPoint: `Latitude: ${startCoords.lat.toFixed(6)}, Longitude: ${startCoords.lng.toFixed(6)}`,
          endPoint: `Latitude: ${endCoords.lat.toFixed(6)}, Longitude: ${endCoords.lng.toFixed(6)}`,
          startCoordinates: startCoords,
          endCoordinates: endCoords
        };
      }

      // If we can't find coordinates in the URL, look for place names
      const placesRegex = /\/place\/([^/@]+)/g;
      const placeMatches = [...url.matchAll(placesRegex)];

      if (placeMatches.length > 0) {
        // We found at least one place name
        const places = placeMatches.map(match => 
          decodeURIComponent(match[1].replace(/\+/g, ' '))
        );

        // Try to find a single coordinate that might represent a point
        const singleCoordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        let coordinates = null;
        
        if (singleCoordMatch) {
          coordinates = {
            lat: parseFloat(singleCoordMatch[1]),
            lng: parseFloat(singleCoordMatch[2])
          };
        }

        return {
          type: 'location',
          locationName: places[0],
          coordinates
        };
      }

      // If all else fails, try to extract just a single coordinate
      const singleCoordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (singleCoordMatch) {
        const coordinates = {
          lat: parseFloat(singleCoordMatch[1]),
          lng: parseFloat(singleCoordMatch[2])
        };

        return {
          type: 'location',
          locationName: 'Pinned Location',
          coordinates
        };
      }

      throw new Error('Could not extract route or location information from the URL');
    } catch (error) {
      console.error('Error extracting route info:', error);
      throw new Error('Could not parse Google Maps URL. This might not be a valid route URL.');
    }
  } else {
    // Handle standard Google Maps URLs
    // Check for directions URL format
    const dirRegex = /\/maps\/dir\/([^/]+)\/([^/]+)\//;
    const dirMatch = url.match(dirRegex);

    if (dirMatch) {
      // Extract origin and destination from dir URL
      const startPoint = decodeURIComponent(dirMatch[1].replace(/\+/g, ' '));
      const endPoint = decodeURIComponent(dirMatch[2].replace(/\+/g, ' '));

      return {
        type: 'route',
        startPoint,
        endPoint,
        startCoordinates: { lat: null, lng: null },
        endCoordinates: { lat: null, lng: null }
      };
    }

    // Try to extract coordinates from the standard URL
    const coordsRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/g;
    const matches = [...url.matchAll(coordsRegex)];

    if (matches.length >= 2) {
      // We have multiple coordinates - likely a route
      const startCoords = { 
        lat: parseFloat(matches[0][1]), 
        lng: parseFloat(matches[0][2]) 
      };
      const endCoords = { 
        lat: parseFloat(matches[matches.length - 1][1]), 
        lng: parseFloat(matches[matches.length - 1][2]) 
      };

      return {
        type: 'route',
        startPoint: `Latitude: ${startCoords.lat.toFixed(6)}, Longitude: ${startCoords.lng.toFixed(6)}`,
        endPoint: `Latitude: ${endCoords.lat.toFixed(6)}, Longitude: ${endCoords.lng.toFixed(6)}`,
        startCoordinates: startCoords,
        endCoordinates: endCoords,
        waypoints: matches.slice(1, -1).map(match => ({
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2])
        }))
      };
    } else if (matches.length === 1) {
      // We have a single coordinate - likely a location
      const coordinates = {
        lat: parseFloat(matches[0][1]),
        lng: parseFloat(matches[0][2])
      };

      return {
        type: 'location',
        locationName: 'Pinned Location',
        coordinates
      };
    }

    // Fall back to the legacy coordinate extraction method
    const atRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const atMatch = url.match(atRegex);
    
    if (atMatch) {
      const lat = parseFloat(atMatch[1]);
      const lng = parseFloat(atMatch[2]);
      
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error('Invalid coordinates extracted from URL');
      }
      
      return { 
        type: 'location',
        locationName: 'Pinned Location',
        coordinates: { lat, lng }
      };
    }
    
    throw new Error('Could not extract coordinates or route information from the URL');
  }
}; 