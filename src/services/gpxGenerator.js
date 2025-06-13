export const generateGpxContent = (routeData) => {
  const timestamp = new Date().toISOString();
  const routeName = routeData.type === 'location' ? 
    routeData.locationName || 'Google Maps Location' : 
    `Route: ${routeData.startPoint} to ${routeData.endPoint}`;
  
  if (routeData.type === 'location') {
    // Generate GPX for a single point
    const { lat, lng } = routeData.coordinates;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="StravaGPX" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${routeName}</name>
    <author>
      <name>Google Maps URL to GPX Converter</name>
      <link href="https://maps.google.com"/>
    </author>
    <copyright author="OpenStreetMap contributors">
      <year>${new Date().getFullYear()}</year>
      <license>https://www.openstreetmap.org/copyright</license>
    </copyright>
  </metadata>
  <wpt lat="${lat}" lon="${lng}">
    <ele>0.0</ele>
    <name>${routeName}</name>
    <time>${timestamp}</time>
  </wpt>
</gpx>`;
  } else if (routeData.type === 'route') {
    // Generate GPX for a route (with track points)
    let routePoints = [];
    
    // Add start point if we have coordinates
    if (routeData.startCoordinates && routeData.startCoordinates.lat !== null) {
      routePoints.push(routeData.startCoordinates);
    }
    
    // Add any waypoints if available
    if (routeData.waypoints && routeData.waypoints.length > 0) {
      routePoints = [...routePoints, ...routeData.waypoints];
    }
    
    // Add end point if we have coordinates
    if (routeData.endCoordinates && routeData.endCoordinates.lat !== null) {
      routePoints.push(routeData.endCoordinates);
    }
    
    // If we don't have any coordinates but have place names, create a special GPX
    if (routePoints.length === 0) {
      return `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="StravaGPX" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${routeName}</name>
    <author>
      <name>Google Maps URL to GPX Converter</name>
      <link href="https://maps.google.com"/>
    </author>
    <copyright author="OpenStreetMap contributors">
      <year>${new Date().getFullYear()}</year>
      <license>https://www.openstreetmap.org/copyright</license>
    </copyright>
    <desc>Route from ${routeData.startPoint} to ${routeData.endPoint}. Note: Exact coordinates not available.</desc>
    <link href="https://maps.google.com"/>
  </metadata>
</gpx>`;
    }
    
    // Create trackpoints XML with elevation data
    const trackpointsXml = routePoints.map((point, index) => {
      // Generate a simple elevation based on the point index to mimic the sample file
      // This is just a placeholder since we don't have actual elevation data
      const elevation = 50 + Math.random() * 30; // Random elevation between 50-80m
      return `   <trkpt lat="${point.lat}" lon="${point.lng}">
    <ele>${elevation.toFixed(2)}</ele>
   </trkpt>`;
    }).join('\n');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="StravaGPX" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
 <metadata>
  <name>${routeName}</name>
  <author>
   <name>Google Maps URL to GPX Converter</name>
   <link href="https://maps.google.com"/>
  </author>
  <copyright author="OpenStreetMap contributors">
   <year>${new Date().getFullYear()}</year>
   <license>https://www.openstreetmap.org/copyright</license>
  </copyright>
  <link href="https://maps.google.com"/>
 </metadata>
 <trk>
  <name>${routeName}</name>
  <link href="https://maps.google.com"/>
  <type>cycling</type>
  <trkseg>
${trackpointsXml}
  </trkseg>
 </trk>
</gpx>`;
  }
  
  throw new Error('Invalid route data format');
}; 