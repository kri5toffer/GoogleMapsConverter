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
    <div className="min-h-screen bg-[#242428] text-white flex flex-col">
      <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto p-8 items-center">
        <h1 className="text-4xl font-bold mb-12 border-b border-[#FC4C02] pb-4 text-[#FC4C02] text-center w-full">Maps to GPX</h1>
        
        <div className="mb-10 border border-gray-700 p-6 rounded-lg bg-[#2A2A2D] w-full max-w-2xl">
          <h2 className="text-xl font-medium mb-4 border-l-4 border-[#FC4C02] pl-3 text-center">Instructions</h2>
          <ol className="list-decimal space-y-2 text-gray-300 mx-auto max-w-md">
            <li>Open Google Maps and create a route from point A to point B</li>
            <li>Copy the URL from your browser's address bar</li>
            <li>Paste the URL below and click "Analyze URL"</li>
            <li>Verify the extracted start and end points</li>
            <li>Click "Convert to GPX" to generate and download the GPX file</li>
          </ol>
        </div>
        
        <div className="mb-8 w-full max-w-2xl">
          <label htmlFor="google-maps-url" className="block text-sm uppercase tracking-wide mb-2 text-center">Google Maps URL</label>
          <input
            id="google-maps-url"
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://maps.app.goo.gl/example or https://www.google.com/maps/dir/..."
            className="w-full p-4 bg-[#2A2A2D] border border-gray-700 rounded-none focus:outline-none focus:border-[#FC4C02] text-white text-center"
          />
        </div>
        
        {error && (
          <div className="mb-6 p-4 border-l-4 border-red-500 bg-[#2A2A2D] w-full max-w-2xl text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        {loading && (
          <div className="mb-6 p-4 border-l-4 border-gray-500 bg-[#2A2A2D] flex items-center justify-center w-full max-w-2xl">
            <svg className="animate-spin mr-3 h-5 w-5 text-[#FC4C02]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-300">Analyzing URL...</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 border-l-4 border-green-500 bg-[#2A2A2D] w-full max-w-2xl text-center">
            <p className="text-green-400">GPX file successfully generated and downloaded!</p>
          </div>
        )}
        
        {routeInfo && (
          <div className="mb-8 p-6 bg-[#2A2A2D] border border-gray-700 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-medium mb-4 border-l-4 border-[#FC4C02] pl-3 text-center">
              {routeInfo.type === 'route' ? 'Route Information' : 'Location Information'}
            </h3>
            
            {routeInfo.type === 'route' ? (
              <div className="space-y-4 text-center">
                <div className="grid grid-cols-1 gap-2">
                  <span className="font-medium text-gray-400">Start Point:</span>
                  <span>{routeInfo.startPoint}</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <span className="font-medium text-gray-400">End Point:</span>
                  <span>{routeInfo.endPoint}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 text-center">
                <span className="font-medium text-gray-400">Location:</span>
                <span>{routeInfo.locationName}</span>
                {routeInfo.coordinates && (
                  <>
                    <span className="font-medium text-gray-400">Coordinates:</span>
                    <span>
                      {routeInfo.coordinates.lat.toFixed(6)}, {routeInfo.coordinates.lng.toFixed(6)}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          <button 
            onClick={handleAnalyzeUrl}
            disabled={loading}
            className="bg-[#FC4C02] text-white px-8 py-4 font-medium transition-all hover:bg-[#E34402] disabled:opacity-50 flex-1 text-center"
          >
            {loading ? 'Analyzing...' : 'Analyze URL'}
          </button>
          
          <button 
            onClick={handleConvert}
            disabled={!routeInfo || loading}
            className="bg-[#FC4C02] text-white px-8 py-4 font-medium transition-all hover:bg-[#E34402] disabled:opacity-50 disabled:cursor-not-allowed flex-1 text-center"
          >
            Convert to GPX
          </button>
        </div>
      </div>
      
      <footer className="p-8 text-center text-gray-400 text-sm border-t border-gray-800">
        <p>© {new Date().getFullYear()} Maps to GPX Converter</p>
      </footer>
    </div>
  );
}

export default App;
