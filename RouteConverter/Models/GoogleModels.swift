import Foundation

// Configuration
struct GoogleMapsConfig {
    static let apiKey = "YOUR_API_KEY_HERE"
    static let baseURL = "https://maps.googleapis.com/maps/api/directions/json"
}

// API Response Models
struct DirectionsResponse: Codable {
    let routes: [Route]
}

struct Route: Codable {
    let legs: [Leg]
}

struct Leg: Codable {
    let steps: [Step]
}

struct Step: Codable {
    let startLocation: Location
    let endLocation: Location
    
    enum CodingKeys: String, CodingKey {
        case startLocation = "start_location"
        case endLocation = "end_location"
    }
}

struct Location: Codable {
    let lat: Double
    let lng: Double
}
