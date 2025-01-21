class RouteConverter {
    // Function to fetch directions from Google
    func fetchDirections(from origin: String, to destination: String) async throws -> [GPXPoint] {
        // Create URL components for the API request
        var components = URLComponents(string: GoogleMapsConfig.baseURL)!
        components.queryItems = [
            URLQueryItem(name: "origin", value: origin),
            URLQueryItem(name: "destination", value: destination),
            URLQueryItem(name: "key", value: GoogleMapsConfig.apiKey)
        ]
        
        // Create and configure the URL request
        guard let url = components.url else {
            throw URLError(.badURL)
        }
        
        // Make the API call
        let (data, response) = try await URLSession.shared.data(from: url)
        
        // Check if response is valid
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        
        // Decode the JSON response
        let directionsResponse = try JSONDecoder().decode(DirectionsResponse.self, from: data)
        
        // Convert to GPX points
        var gpxPoints: [GPXPoint] = []
        
        // Extract locations from each route step
        for route in directionsResponse.routes {
            for leg in route.legs {
                for step in leg.steps {
                    // Add start location
                    gpxPoints.append(GPXPoint(
                        latitude: step.startLocation.lat,
                        longitude: step.startLocation.lng,
                        elevation: 0  // Google doesn't provide elevation
                    ))
                    
                    // Add end location
                    gpxPoints.append(GPXPoint(
                        latitude: step.endLocation.lat,
                        longitude: step.endLocation.lng,
                        elevation: 0
                    ))
                }
            }
        }
        
        return gpxPoints
    }
}
