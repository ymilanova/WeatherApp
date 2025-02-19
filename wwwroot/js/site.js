
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    document.body.classList.add(savedTheme);

  
    document.getElementById('theme-toggle').addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        document.body.classList.remove(currentTheme);
        document.body.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
    });
});

window.onload = function () {

    
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Lat', 'Long'],
            [52.3676, 4.9041], // Amsterdam, Netherlands

            [37.97945, 23.71622], // Athens, Greece

            [52.509347,13.426213], // Berlin, Germany

            [50.8503, 4.3517], // Brussels, Belgium

            [47.4979, 19.0402], // Budapest, Hungary

            [53.350140, -6.266155], // Dublin, Ireland

            [60.1695, 24.9354], // Helsinki, Finland

            [38.71667, - 9.13333], // Lisbon, Portugal

            [51.5074, -0.1278], // London, United Kingdom

            [40.41, - 3.702], // Madrid, Spain

            [59.9139, 10.7522], // Oslo, Norway

            [48.8566, 2.3522], // Paris, France

            [50.073658, 14.418540], // Prague, Czech Republic

            [41.964591,12.668029], // Rome, Italy

            [59.3293, 18.0686], // Stockholm, Sweden

            [48.2082, 16.3738], // Vienna, Austria

            [52.2297, 21.0122], // Warsaw, Poland

            [55.7558, 37.6173], // Moscow, Russia

            [59.4370, 24.7535], // Tallinn, Estonia

            [56.9496, 24.1052], // Riga, Latvia

            [54.6872, 25.2797], // Vilnius, Lithuania

            [45.82649, 15.983826], // Zagreb, Croatia

            [42.6977, 23.3219], // Sofia, Bulgaria

            [41.3275, 19.8187], // Tirana, Albania

            [39.887649,32.793537], // Ankara, Turkey

            [50.430038, 30.534069], // Kyiv, Ukraine

            [55.674149,12.551847], // Copenhagen, Denmark

            [44.43225, 26.10626] // Bucharest, Romania

        ]);

        var options = {
           
            zoomLevel: 4.2,
            
        };

        var chart = new google.visualization.Map(document.getElementById('map'));
       
        chart.draw(data, options);

        google.visualization.events.addListener(chart, 'select', function () {
            var selection = chart.getSelection();
            if (selection.length > 0) {
                var row = selection[0].row;
                var latitude = data.getValue(row, 0);
                var longitude = data.getValue(row, 1);
                sendDataToController(latitude, longitude);
            }
        });
    }
    google.charts.setOnLoadCallback(drawChart);

    function sendDataToController(latitude, longitude) {
        $.ajax({
            url: '/Home/Index',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ Lat: latitude, Lng: longitude }),
            success: function (data) {
                console.log('Success:', data);
             
                updateWeatherWidget(data);
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    }


    function updateWeatherWidget(data) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = data;

        var locationName = tempDiv.querySelector('.col h3').textContent;
        var dateTime = tempDiv.querySelector('.col p').textContent;
        var weatherIcon = tempDiv.querySelector('.weather-icon img').src;
        var temperature = tempDiv.querySelector('.weather-info h2').textContent;
        var weatherDescription = tempDiv.querySelector('.weather-info p').textContent;
        var weatherDetails = tempDiv.querySelector('.weather-details').innerHTML;

        document.querySelector('.col h3').textContent = locationName;
        document.querySelector('.col p').textContent = dateTime;
        document.querySelector('.weather-icon img').src = weatherIcon;
        document.querySelector('.weather-info h2').textContent = temperature;
        document.querySelector('.weather-info p').textContent = weatherDescription;
        document.querySelector('.weather-details').innerHTML = weatherDetails;
    }


}
