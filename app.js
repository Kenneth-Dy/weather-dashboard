// API key: fc89c9f101565c7713dd9b31eada8d80
let cityList = JSON.parse(localStorage.getItem('cityList')) || []
let lastCity = cityList.length - 1

cityList.forEach(elem => {
  document.getElementById('cities').innerHTML += `
      <button class="btn btn-outline-secondary cityButton">${elem}</button>
      `
})

const page_render = (cityName) => {
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=fc89c9f101565c7713dd9b31eada8d80`)
    .then(res => {
      let weather = res.data
      let lati = res.data.coord.lat
      let long = res.data.coord.lon

      document.getElementById('dailyWeather').innerHTML = `
            <div class="card big-card">
              <div class="card-body">
                <h1 class="display-4">${weather.name} ${moment().format('MM/DD/YYYY')}</h1>
                <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="${weather.weather[0].description}">
                <p>Temperature: ${weather.main.temp} &#8457;</p>
                <p>Humidity: ${weather.main.humidity}%</p>
                <p>Wind Speed: ${weather.wind.speed} MPH</p>
                <p>UV Index: <span class="text-white" id="uv"></span></p>
              </div>
            </div>
          `

      return axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lati}&lon=${long}&exclude=current,minutely,hourly,alerts&units=imperial&appid=fc89c9f101565c7713dd9b31eada8d80`)
    })
    .catch(err => { 
      console.error(err)
      cityList.pop()
      list_render()
      document.getElementById('citySearch').value = `*error* - can't find city`
    })
    .then(res => {
      let daily = res.data.daily

      let uv_index = document.getElementById('uv')
      uv_index.textContent = ` ${daily[0].uvi} `

      if (parseFloat(daily[0].uvi) >= 8) {
        uv_index.classList.add('bg-danger')
      } else if (parseFloat(daily[0].uvi) >= 6) {
        uv_index.classList.add('bg-warning')
      } else if (parseFloat(daily[0].uvi) >= 3) {
        uv_index.classList.add('bg-success')
      } else {
        uv_index.classList.add('bg-info')
      }

      document.getElementById('fore').innerHTML = `<h1 class="display-4">Forecast:</h1>`
      document.getElementById('futureWeather').innerHTML = ''


      for (let i = 1; i < 6; i++) {
        document.getElementById('futureWeather').innerHTML += `
              <div class="card text-white bg-primary">
                <div class="card-body">
                  <h3 class="h5">${moment().add(i, 'd').format('MM/DD/YYYY')}</h3>
                  <p ><img src="http://openweathermap.org/img/wn/${daily[i].weather[0].icon}.png" alt="${daily[i].weather[0].description}"></p>
                  <p>Temp: ${daily[i].temp.day} &#8457;</p>
                  <p>Humidity: ${daily[i].humidity}%</p>
                </div>
              </div>
             `
      }
    })
    .catch(err => { console.error(err) })
}

const list_render = () => {
  localStorage.setItem('cityList', JSON.stringify(cityList))

  document.getElementById('cities').innerHTML = ''
  cityList.forEach(elem => {
    document.getElementById('cities').innerHTML += `
      <button class="btn btn-outline-secondary cityButton">${elem}</button>`
  })
}

document.getElementById('search').addEventListener('click', event => {
  event.preventDefault()
  let cityName = document.getElementById('citySearch').value
  cityList.push(cityName)
  page_render(cityName)
  list_render()
  document.getElementById('citySearch').value = ''
})

document.addEventListener('click', event => {
  if (event.target.classList.contains('cityButton')) {
    page_render(event.target.textContent)
  }
})

page_render(cityList[lastCity])
