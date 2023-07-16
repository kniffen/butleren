export interface WeatherData {
  name: string;
  dt: number;
  timezone: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  },
  weather: [{
    main: string;
    icon: string;
    description: string;
  }],
  wind: {
    speed: number;
    deg: number;
  },
  rain: {
    '1h': number;
  },
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  },
}
