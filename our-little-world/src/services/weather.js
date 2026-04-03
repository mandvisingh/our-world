import { weatherDescription } from '../utils/edmonton'

const EDMONTON_COORDS = { lat: 53.5461, lon: -113.4938 }

export async function fetchEdmontonWeather() {
  const { lat, lon } = EDMONTON_COORDS
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=America%2FEdmonton`

  const res = await fetch(url)
  const data = await res.json()

  return {
    temp: Math.round(data.current.temperature_2m),
    condition: weatherDescription(data.current.weather_code),
  }
}
