## Cloudflare Workers for Cloudflare RADAR API

Cloudflare Workers which uses the Cloudflare API to fetch data from multiple Cloudflare RADAR endpoints and returns the results as a GeoJSON.

Alternative JSON Output: https://github.com/DavidJKTofan/cloudflare-radar-api

### GeoJSON

Display the output on [geojson.io](https://geojson.io/).

### Get Started

- Replace the `YOUR_ACCOUNT_ID` with your Cloudflare Account ID in the `wrangler.toml` file.

- Replace `'YOUR_API_TOKEN'` with your actual Cloudflare API token in the `worker.js` file.

- Replace `'YOUR_AUTH_EMAIL'` with your Cloudflare account email in the `worker.js` file.

#### Example Output

Using the parameters `7d` and `DE`:

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "country": "DE",
        "layer7Summary": {
          "ddos": "48.1448",
          "waf": "41.76143",
          "ip_reputation": "7.052715",
          "access_rules": "2.478033",
          "bot_management": "0.563022",
          "api_shield": "0.0",
          "data_loss_prevention": "0.0"
        },
        "layer7OriginLocations": [
          {
            "originCountryName": "United States",
            "originCountryAlpha2": "US",
            "value": "33.88264",
            "rank": 1
          },
          {
            "originCountryName": "Germany",
            "originCountryAlpha2": "DE",
            "value": "7.412015",
            "rank": 2
          },
          {
            "originCountryName": "India",
            "originCountryAlpha2": "IN",
            "value": "4.154708",
            "rank": 3
          },
          {
            "originCountryName": "United Kingdom",
            "originCountryAlpha2": "GB",
            "value": "3.918962",
            "rank": 4
          },
          {
            "originCountryName": "China",
            "originCountryAlpha2": "CN",
            "value": "3.591646",
            "rank": 5
          }
        ],
        "botClassSummary": {
          "bot": "54.38295",
          "human": "45.61705"
        },
        "deviceTypeSummary": {
          "desktop": "76.327628",
          "mobile": "23.641822",
          "other": "0.03055"
        },
        "httpVersionSummary": {
          "HTTP/1.x": "45.193363",
          "HTTP/2": "42.09331",
          "HTTP/3": "12.713327"
        }
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          10.4478313,
          51.1638175
        ]
      }
    }
  ]
}
```

### Endpoints

This project fetches data from the following [Cloudflare API endpoints](https://developers.cloudflare.com/api/):

- `attacks/layer7/summary`: Provides a summary of Layer 7 attacks.

- `attacks/layer7/top/locations/origin`: Lists the top locations of Layer 7 attacks by origin.

- `http/summary/bot_class`: Provides a summary of HTTP requests by bot class.

- `http/summary/device_type`: Provides a summary of HTTP requests by device type.

- `http/summary/http_version`: Provides a summary of HTTP requests by HTTP version.

Each endpoint is fetched individually, and the responses are combined and returned as a JSON object.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.
