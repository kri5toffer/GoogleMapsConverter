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
    
    func isValidGoogleMapURL (_ urlString: String) -> Bool {
        guard let url = URL(string: urlString) else {
            return false
        }
        // Check if it's a Google Maps URL
        let isGoogleMaps = url.host?.contains("google.com/maps") ?? false
        let isGooGl = url.host?.contains("goo.gl/maps") ?? false
        
        return isGoogleMaps || isGooGl
    }
    
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                TextField("Paste Google Maps URL", text: $mapURL)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding()
                
                Button(action: {
                    // We'll add conversion logic later
                    if mapURL.isEmpty {
                        alertMessage = "Please enter a URL"
                        showAlert = true
                    }
                }) {
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
                Alert(title: Text("Notice"), message: Text(alertMessage), dismissButton: .default(Text("OK")))
            }
        }
    }
}

#Preview {
    ContentView()
}
