addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Replace with your Cloudflare API credentials
  const apiToken = "YOUR_API_TOKEN";
  const authEmail = "YOUR_AUTH_EMAIL";

  // Parameters
  const dateRange = "7d"; // last 7 days
  const location = "DE"; // Germany
  const format = "json"; // JSON format

  // Create an array of API endpoints
  // You can add more endpoints from https://developers.cloudflare.com/api/
  const endpoints = [
    {
      // Get a summary of layer 7 attacks
      name: "layer7Summary",
      url: "attacks/layer7/summary",
    },
    {
      // Get layer 7 top origin locations
      name: "layer7OriginLocations",
      url: "attacks/layer7/top/locations/origin",
    },
    {
      // Get Internet traffic distribution by Bots vs Humans
      name: "botClassSummary",
      url: "http/summary/bot_class",
    },
    {
      // Get Internet traffic distribution by device type
      name: "deviceTypeSummary",
      url: "http/summary/device_type",
    },
    {
      // Get a summary of HTTP versions
      name: "httpVersionSummary",
      url: "http/summary/http_version",
    },
  ];

  // Object to store the responses for each endpoint
  const responses = {};

  // Fetch data from each endpoint and store the responses
  for (const endpoint of endpoints) {
    const params = {
      dateRange,
      location,
      format,
    };
    const apiUrl = `https://api.cloudflare.com/client/v4/radar/${
      endpoint.url
    }?${getQueryString(params)}`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        "X-Auth-Email": authEmail,
      },
    });
    const data = await response.json();
    responses[endpoint.name] = data;
  }

  // GeoJSON
  // Get coordinates from OpenStreetMap API based on location
  const countryCode = location; // Assuming location parameter contains the country code
  const countryCoordinates = await getCountryCoordinates(countryCode);

  // Create GeoJSON feature for the country
  const countryFeature = {
    type: "Feature",
    properties: {
      country: countryCode,
      // responses: responses,
      layer7Summary: responses.layer7Summary.result.summary_0,
      layer7OriginLocations: responses.layer7OriginLocations.result.top_0,
      botClassSummary: responses.botClassSummary.result.summary_0,
      deviceTypeSummary: responses.deviceTypeSummary.result.summary_0,
      httpVersionSummary: responses.httpVersionSummary.result.summary_0,
    },
    geometry: {
      type: "Point",
      coordinates: countryCoordinates,
    },
  };

  // Create GeoJSON object with the country feature and responses
  const geoJsonOutput = {
    type: "FeatureCollection",
    features: [countryFeature],
  };

  // Return the GeoJSON output as JSON
  return new Response(JSON.stringify(geoJsonOutput, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}

function getQueryString(params) {
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
}

async function getCountryCoordinates(countryCode) {
  // Use the OpenStreetMap API to fetch the country coordinates
  const apiUrl = `https://nominatim.openstreetmap.org/search?country=${countryCode}&format=json`;
  const response = await fetch(apiUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36", // Chrome
    },
  });
  const data = await response.json();

  if (data.length > 0) {
    const coordinates = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
    return coordinates;
  } else {
    throw new Error(
      `Failed to retrieve coordinates for country code: ${countryCode}`
    );
  }
}
