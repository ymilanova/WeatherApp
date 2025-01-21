using System.Diagnostics;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using WeatherApp.Models;

namespace WeatherApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly HttpClient client = new HttpClient();

        [HttpGet]
        public IActionResult Index()
        {
            var response = client.GetFromJsonAsync<AllWeather>("https://api.openweathermap.org/data/2.5/weather?lat=51.46&lon=7.22&appid=b496262a837196953e9961e4c0d6d128&lang=de&units=metric").Result;

            var currentIcon = GetCurrentIcon(response.weather.Select(_ => _.main).First(),response.weather.Select(_=>_.icon).First());
            ViewBag.CurrentIcon=currentIcon;
            var currentTime = GetCurrentTime(response.timezone);
            ViewBag.CurrentTime = currentTime;
            return View(response);
        }

        [HttpPost]
        public IActionResult Index([FromBody] Coordinates coordinates)
        {
            string latitude = coordinates.Lat.ToString();
            string longitude = coordinates.Lng.ToString();
            
            var response = client.GetFromJsonAsync<AllWeather>($"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid=b496262a837196953e9961e4c0d6d128&lang=de&units=metric").Result;
            var currentIcon = GetCurrentIcon(response.weather.Select(_ => _.main).First(), response.weather.Select(_ => _.icon).First());
            ViewBag.CurrentIcon = currentIcon;
            var currentTime = GetCurrentTime(response.timezone); ViewBag.CurrentTime = currentTime;
            return View("Index", response);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        private DateTime GetCurrentTime(int timezoneOffset) 
        { 
            var utcNow = DateTime.UtcNow;
            var currentTime = utcNow.AddSeconds(timezoneOffset);
            return currentTime; 
        }


        private string GetCurrentIcon(string status, string iconCode)
        {
            string weatherIcon;
            
            switch (status)
            {
                case "Clear":
                    weatherIcon = iconCode.EndsWith("d") ? "clear-day.svg" : "clear-night.svg";
                    break;
                case "Clouds":
                    weatherIcon = iconCode.EndsWith("d") ? "partly-cloudy-day.svg" : "partly-cloudy-night.svg";
                    break;
                case "Rain":
                    weatherIcon = "rain.svg"; 
                    break;
                case "Drizzle": weatherIcon = "drizzle.svg";
                    break;
                case "Thunderstorm":
                    weatherIcon = iconCode.EndsWith("d") ? "thunderstorms-day.svg" : "thunderstorms-night.svg";
                    break;
                case "Snow":
                    weatherIcon = "snow.svg"; 
                    break;
                case "Mist":
                    weatherIcon = "mist.svg";
                    break;
                case "Smoke": weatherIcon = "smoke.svg";
                    break;
                case "Haze":
                    weatherIcon = iconCode.EndsWith("d") ? "haze-day.svg" : "haze-night.svg";
                    break;
                case "Dust":
                    weatherIcon = iconCode.EndsWith("d") ? "dust-day.svg" : "dust-night.svg";
                    break;
                case "Fog":
                    weatherIcon = iconCode.EndsWith("d") ? "fog-day.svg" : "fog-night.svg";
                    break;
                case "Hail":
                    weatherIcon = "hail.svg";
                    break;
                case "Tornado":
                    weatherIcon = iconCode.EndsWith("d") ? "tornado-day.svg" : "tornado-night.svg";
                    break;
                default:
                    weatherIcon = "clear-day.svg";
                    break;
            }
            return weatherIcon;
        }
    }
}
