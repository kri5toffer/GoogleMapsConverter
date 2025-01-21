import Foundation

struct GPXPoint {
    let latitude: Double
    let longitude: Double
    let elevation: Double
    
    func toGPXString() -> String {
        return """
            <trkpt lat="\(latitude)" lon="\(longitude)">
                <ele>\(elevation)</ele>
            </trkpt>
        """
    }
}
