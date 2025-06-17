# Google Maps Route to GPX File Converter (In-development)

A React application that converts Google Maps routes to GPX files for use in GPS devices and fitness applications.

## Why I Built This

As a cyclist, I got really frustrated with my Wahoo device's routing. It kept sending me down tiny side streets and weird shortcuts that weren't great for cycling. But I noticed that Google Maps actually gives much better cycling routes - it seems to understand which roads are better for bikes. The problem was, I couldn't easily get these Google Maps routes onto my Wahoo. I'd find a fast route on Google Maps, but then I'd be stuck trying to recreate it manually on my Wahoo, which was a pain. So I built this tool to take my Google Maps routes and convert them to GPX files that work with my Wahoo, using Google's better routing algorithm instead of Wahoo's.

## Project Structure

```
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   ├── services/        # Core functionality
│   │   ├── urlExtractor.js    # URL parsing and route extraction
│   │   └── gpxGenerator.js    # GPX file generation
│   ├── utils/           # Utility functions
│   │   └── fileDownloader.js  # File download handling
│   └── index.css       
├── public/              
├── index.html           # HTML 
├── vite.config.js      
├── tailwind.config.js  
├── postcss.config.js   
└── eslint.config.js   
```

## TO-DO List

- [ ] Fix URL parsing for short URLs (maps.app.goo.gl)
- [ ] Add real elevation data support
- [ ] Improve waypoint handling for complex routes

- [ ] Add route preview before conversion
- [ ] Better error messages for invalid URLs

- [ ] Custom GPX file naming
- [ ] Display distance and elevation profile

## Blockers

1. URL Parsing Challenges
   - Short URLs (maps.app.goo.gl) are problematic because they require an extra step to resolve to the full URL before we can extract coordinates
   - Google Maps uses different URL formats for different types of routes (directions, places, coordinates), requiring multiple parsing strategies
   - Some URLs contain encoded characters or special formats that need careful handling

2. Technical Constraints
   - Google Routing API are in legacy mode, I think we can only work with what's visible in the URL, limiting the route data we can extract
   - Elevation data is currently simulated (random values between 50-80m) since we don't have access to real elevation data
   - The conversion process relies heavily on URL parsing, which means any changes to Google Maps' URL structure could break the converter

3. User Experience Limitations
   - Users need to manually copy and paste Google Maps URLs
   - No preview of the route before conversion
   - No way to edit or adjust the route after conversion
   - Limited support for different cycling preferences (road vs. trail, avoiding hills, etc.)

## Collaboration

This project is has already been developed at [mapstogpx.com](https://mapstogpx.com/). 
I have been in contact to try to working together with

## Contributing

Feel free to let me know your improvements to this project/

## License

This project is open source and available under the MIT License.

