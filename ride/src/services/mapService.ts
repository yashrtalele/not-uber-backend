import axios from "axios";

interface GeocodeResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GeocodeResponse {
  status: string;
  results: GeocodeResult[];
}

interface DistanceMatrixElement {
  status: string;
  duration: {
    text: string;
    value: number;
  };
  distance: {
    text: string;
    value: number;
  };
}

interface DistanceMatrixRow {
  elements: DistanceMatrixElement[];
}

interface DistanceMatrixResponse {
  status: string;
  rows: DistanceMatrixRow[];
}

interface Prediction {
  description: string;
  place_id: string;
}

interface AutocompleteResponse {
  status: string;
  predictions: Prediction[];
}

const getAddressCoordinate = async (address: string) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await axios.get<GeocodeResponse>(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        ltd: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getDistanceTime = async (current: string, destination: string) => {
  if (!current || !destination) {
    throw new Error("Current and destination are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    current
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get<DistanceMatrixResponse>(url);
    if (response.data.status === "OK") {
      if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
        throw new Error("No routes found");
      }

      return response.data.rows[0].elements[0];
    } else {
      throw new Error("Unable to fetch distance and time");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getAutoCompleteSuggestions = async (input: string) => {
  if (!input) {
    throw new Error("query is required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  try {
    const response = await axios.get<AutocompleteResponse>(url);
    if (response.data.status === "OK") {
      return response.data.predictions.map((prediction) => prediction.description).filter((value) => value);
    } else {
      throw new Error("Unable to fetch suggestions");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// const getDriverInTheRadius = async (ltd, lng, radius) => { };

export { getAddressCoordinate, getAutoCompleteSuggestions, getDistanceTime };
