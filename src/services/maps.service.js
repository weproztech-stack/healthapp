const axios = require("axios");

const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;

// NEARBY DOCTORS/LABS SEARCH (Places API)

const searchNearbyPlaces = async ({ latitude, longitude, keyword, radiusKm = 10 }) => {
  try {
    if (!GOOGLE_MAPS_KEY) {
      console.warn(" Google Maps not configured");
      return [];
    }

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${latitude},${longitude}`,
          radius: radiusKm * 1000,
          keyword,
          key: GOOGLE_MAPS_KEY,
        },
      }
    );

    return response.data.results || [];
  } catch (error) {
    console.error(" Places API error:", error.message);
    return [];
  }
};


// ETA CALCULATE KARNA (Distance Matrix API)
// Home visit + Lab collector ke liye

const calculateETA = async ({ originLat, originLng, destLat, destLng }) => {
  try {
    if (!GOOGLE_MAPS_KEY) {
      console.warn(" Google Maps not configured");
      return { duration: "N/A", distance: "N/A" };
    }

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins: `${originLat},${originLng}`,
          destinations: `${destLat},${destLng}`,
          mode: "driving",
          key: GOOGLE_MAPS_KEY,
        },
      }
    );

    const element = response.data.rows[0]?.elements[0];

    if (!element || element.status !== "OK") {
      return { duration: "N/A", distance: "N/A" };
    }

    return {
      duration: element.duration.text,       // "25 mins"
      durationSeconds: element.duration.value, // 1500
      distance: element.distance.text,       // "12.3 km"
      distanceMeters: element.distance.value, // 12300
    };
  } catch (error) {
    console.error(" Distance Matrix error:", error.message);
    return { duration: "N/A", distance: "N/A" };
  }
};

// ─────────────────────────────────────────
// ADDRESS SE COORDINATES (Geocoding)
// ─────────────────────────────────────────
const getCoordinatesFromAddress = async (address) => {
  try {
    if (!GOOGLE_MAPS_KEY) return null;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address,
          key: GOOGLE_MAPS_KEY,
        },
      }
    );

    const location = response.data.results[0]?.geometry?.location;
    if (!location) return null;

    return {
      latitude: location.lat,
      longitude: location.lng,
    };
  } catch (error) {
    console.error(" Geocoding error:", error.message);
    return null;
  }
};

// ─────────────────────────────────────────
// COORDINATES SE ADDRESS (Reverse Geocoding)
// ─────────────────────────────────────────
const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    if (!GOOGLE_MAPS_KEY) return null;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: GOOGLE_MAPS_KEY,
        },
      }
    );

    return response.data.results[0]?.formatted_address || null;
  } catch (error) {
    console.error(" Reverse Geocoding error:", error.message);
    return null;
  }
};

module.exports = {
  searchNearbyPlaces,
  calculateETA,
  getCoordinatesFromAddress,
  getAddressFromCoordinates,
};