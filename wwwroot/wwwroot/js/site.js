window.onload = function () {
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Lat', 'Long', 'Name'],
            [52.3676, 4.9041, 'Amsterdam'],
            [37.9838, 23.7275, 'Athens'],
            [52.5200, 13.4050, 'Berlin'],
            [50.8503, 4.3517, 'Brussels'],
            [47.4979, 19.0402, 'Budapest'],
            [53.3498, -6.2603, 'Dublin'],
            [60.1695, 24.9354, 'Helsinki'],
            [38.7223, -9.1393, 'Lisbon'],
            [51.5074, -0.1278, 'London'],
            [40.4175, -3.70390, 'Madrid'],
            [59.9139, 10.7522, 'Oslo'],
            [48.8566, 2.3522, 'Paris'],
            [50.0755, 14.4378, 'Prague'],
            [41.9028, 12.4964, 'Rome'],
            [59.3293, 18.0686, 'Stockholm'],
            [48.2082, 16.3738, 'Vienna'],
            [52.2297, 21.0122, 'Warsaw'],
            [55.7558, 37.6173, 'Moscow'],
            [59.4370, 24.7535, 'Tallinn'],
            [56.9496, 24.1052, 'Riga'],
            [54.6872, 25.2797, 'Vilnius'],
            [45.8150, 15.9819, 'Zagreb'],
            [42.6977, 23.3219, 'Sofia'],
            [41.3275, 19.8187, 'Tirana'],
            [39.9334, 32.8597, 'Ankara'],
            [50.4501, 30.5234, 'Kyiv'],
            [55.6759, 12.5655, 'Copenhagen'],
            [44.4268, 26.1025, 'Bucharest']

        ]);

        var options = {
            showTip: true,
            zoomLevel: 4.2,
            center: { lat: 0, lng: 0 }
        };

        var chart = new google.visualization.Map(document.getElementById('container'));
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

        var locationName = tempDiv.querySelector('.weather-widget .col h3').textContent;
        var dateTime = tempDiv.querySelector('.weather-widget .col p').textContent;
        var weatherIcon = tempDiv.querySelector('.weather-icon img').src;
        var temperature = tempDiv.querySelector('.weather-info h2').textContent;
        var weatherDescription = tempDiv.querySelector('.weather-info p').textContent;
        var weatherDetails = tempDiv.querySelector('.weather-details').innerHTML;

        document.querySelector('.weather-widget .col h3').textContent = locationName;
        document.querySelector('.weather-widget .col p').textContent = dateTime;
        document.querySelector('.weather-icon img').src = weatherIcon;
        document.querySelector('.weather-info h2').textContent = temperature;
        document.querySelector('.weather-info p').textContent = weatherDescription;
        document.querySelector('.weather-details').innerHTML = weatherDetails;
    }


}
