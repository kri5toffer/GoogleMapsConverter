export const downloadGpxFile = (gpxContent, routeInfo) => {
  // Create downloadable file
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const downloadUrl = URL.createObjectURL(blob);
  
  // Create a hidden download link
  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  
  // Set the filename based on the route info
  if (routeInfo.type === 'route') {
    downloadLink.download = `route_${routeInfo.startPoint.substring(0, 10)}_to_${routeInfo.endPoint.substring(0, 10)}.gpx`.replace(/[\s,:]/g, '_');
  } else {
    downloadLink.download = `location_${routeInfo.locationName.substring(0, 20)}.gpx`.replace(/[\s,:]/g, '_');
  }
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  // Clean up the object URL
  URL.revokeObjectURL(downloadUrl);
}; 