//
//  ContentView.swift
//  RouteConverter
//
//  Created by Christopher Siang on 19/1/2025.
//

import SwiftUI

struct ContentView: View {
    @State private var mapURL: String = ""
    @State private var showAlert = false
    @State private var alertMessage = ""
    
    func isValidGoogleMapsURL (_ urlString: String) -> Bool {
        guard let url = URL(string: urlString) else {
            return false
        }
        // Check if it's a Google Maps URL
        let isGoogleMaps = url.host?.contains("google.com/maps") ?? false
        let isGooGl = url.host?.contains("goo.gl/maps") ?? false
        
        return isGoogleMaps || isGooGl
    }
    
    // Add this function to handle the URL
    func handleMapURL() {
        // Trim whitespace and newlines
        let trimmedURL = mapURL.trimmingCharacters(in: .whitespacesAndNewlines)
        
        if trimmedURL.isEmpty {
            alertMessage = "Please enter a URL"
            showAlert = true
            return
        }
        
        if !isValidGoogleMapsURL(trimmedURL) {
            alertMessage = "Please enter a valid Google Maps URL"
            showAlert = true
            return
        }
        
        // If we get here, we have a valid URL
        alertMessage = "Valid URL! Ready for conversion"
        showAlert = true
        // We'll add conversion logic in the next step
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                TextField("Paste Google Maps URL", text: $mapURL)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding()
                    .autocapitalization(.none) // Add this to prevent auto-capitalization
                    .disableAutocorrection(true) // Add this to prevent autocorrect
                
                Button(action: handleMapURL) {
                    Text("Convert to GPX")
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
            }
            .padding()
            .navigationTitle("Route Converter")
            .alert(isPresented: $showAlert) {
                Alert(title: Text("Notice"),
                      message: Text(alertMessage),
                      dismissButton: .default(Text("OK")))
            }
        }
    }
}

#Preview {
    ContentView()
}
