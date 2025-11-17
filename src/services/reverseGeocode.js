import axios from "axios";

export const reverseGeocode = async (lat, lng) => {
  try {
    // Replace with your own api key from google maps 
    const apiKey = "";  
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.status === "OK") {
      console.log("Google Maps API Key:", apiKey);
      const results = response.data.results;
      return results[0]?.formatted_address || "Unknown location";
    } else {
      console.error("Geocoding failed:", response.data.status);
      return "Unknown location";
    }
  } catch (error) {
    console.error("Error during reverse geocoding:", error);
    return "Unknown location";
  }
};
