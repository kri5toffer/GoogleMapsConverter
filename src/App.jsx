import { useState } from 'react';
import { extractRouteInfo } from './services/urlExtractor';
import { generateGpxContent } from './services/gpxGenerator';
import { downloadGpxFile } from './utils/fileDownloader';

function App() {  // This is the main function that creates our React app - it's like the container for all our features
  const [url, setUrl] = useState(''); // This creates a variable 'url' to store the Google Maps URL that users type in, and setUrl is a function we use to update it
  const [error, setError] = useState(''); // This creates a variable 'error' to show error messages to users when something goes wrong, and setError lets us set new error messages
  const [success, setSuccess] = useState(false); // This creates a variable 'success' that we use to show when things worked correctly - true means success, false means not yet successful
  const [loading, setLoading] = useState(false); // This creates a variable 'loading' that we use to show when the app is working on something - true means loading, false means not loading
  const [routeInfo, setRouteInfo] = useState(null); // This creates a variable 'routeInfo' to store all the information we get from the Google Maps URL, and setRouteInfo lets us save new information

  const handleUrlChange = (e) => { // This is a function that React calls whenever someone types in the URL input box - 'e' is the event object that React gives us with information about what changed
    setUrl(e.target.value); // We use the setUrl function (that useState gave us) to save whatever the user typed (e.target.value) into our url variable
    setError(''); // We use setError to clear out any error message by setting it to an empty string - this gives the user a fresh start when they start typing again
    setSuccess(false); // We use setSuccess to set our success flag back to false since we're starting fresh with new input
    setRouteInfo(null); // We use setRouteInfo to clear out any previously saved route information by setting it to null, since the new URL might give us different route info
  };

  const handleAnalyzeUrl = async () => {
    if (!url.trim()) {
      setError('Please enter a Google Maps URL');
      return;
    }

    setError('');
    setSuccess(false);
    setRouteInfo(null);
    setLoading(true);
    
    try {
      const routeData = await extractRouteInfo(url);
      setRouteInfo(routeData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleConvert = () => {
    if (!routeInfo) {
      setError('Please analyze the URL first');
      return;
    }

    try {
      const gpxContent = generateGpxContent(routeInfo);
      downloadGpxFile(gpxContent, routeInfo);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Google Maps URL to GPX Converter</h1>
        
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-800">Instructions</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Open Google Maps and create a route from point A to point B</li>
            <li>Copy the URL from your browser's address bar</li>
            <li>Paste the URL below and click "Analyze URL"</li>
            <li>Verify the extracted start and end points</li>
            <li>Click "Convert to GPX" to generate and download the GPX file</li>
          </ol>
        </div>
        
        <div className="mb-6">
          <label htmlFor="google-maps-url" className="block text-sm font-medium text-gray-700 mb-2">Google Maps URL</label>
          <input
            id="google-maps-url"
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://maps.app.goo.gl/example or https://www.google.com/maps/dir/..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        {loading && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Analyzing URL...</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
            <p>GPX file successfully generated and downloaded!</p>
          </div>
        )}
        
        {routeInfo && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              {routeInfo.type === 'route' ? 'Route Information' : 'Location Information'}
            </h3>
            
            {routeInfo.type === 'route' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  <span className="col-span-1 font-medium text-gray-600">Start Point:</span>
                  <span className="col-span-3">{routeInfo.startPoint}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="col-span-1 font-medium text-gray-600">End Point:</span>
                  <span className="col-span-3">{routeInfo.endPoint}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                <span className="col-span-1 font-medium text-gray-600">Location:</span>
                <span className="col-span-3">{routeInfo.locationName}</span>
                {routeInfo.coordinates && (
                  <>
                    <span className="col-span-1 font-medium text-gray-600">Coordinates:</span>
                    <span className="col-span-3">
                      {routeInfo.coordinates.lat.toFixed(6)}, {routeInfo.coordinates.lng.toFixed(6)}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={handleAnalyzeUrl}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze URL'}
          </button>
          
          <button 
            onClick={handleConvert}
            disabled={!routeInfo || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Convert to GPX
          </button>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Google Maps URL to GPX Converter</p>
      </footer>
    </div>
  );
}

export default App;
