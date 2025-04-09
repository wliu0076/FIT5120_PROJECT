<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import html2canvas from 'html2canvas/dist/html2canvas.esm.js'
import { jsPDF } from 'jspdf'

const event = ref({
  title: 'Melbourne Arts Festival 2025',
  location: 'Federation Square, Melbourne',
  date: 'April 10, 2025',
  time: '14:00 - 22:00',
  coordinates: { lat: -37.818085, lng: 144.968124 } // Federation Square coordinates
})

const map = ref(null)
const directionsService = ref(null)
const directionsRenderer = ref(null)
const transportMode = ref('TRANSIT')
const routeSummary = ref({
  duration: '',
  distance: '',
  arrival: ''
})
const routeSteps = ref([])

const userLocation = ref({
  lat: -37.818267, 
  lng: 144.952974  // Default to Southern Cross Station coordinates; will be updated if user grants permission
})

async function getUserLocation() {
  console.log('Attempting to get user location...');
  if ('geolocation' in navigator) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      });
      console.log('User location acquired:', position);

      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log('Updated userLocation:', userLocation.value);

      // 如果地图已加载，则立即计算路线
      if (map.value) {
        console.log('Map is loaded, calculating route...');
        calculateRoute();
      } else {
        console.log('Map is not loaded yet, waiting for map initialization...');
      }
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  } else {
    console.warn('Geolocation is not supported by this browser.');
  }
}

async function changeTransportMode(mode) {
  transportMode.value = mode
  await calculateRoute()
}

async function calculateRoute() {
  if (!directionsService.value || !directionsRenderer.value) return

  const request = {
    origin: userLocation.value,
    destination: event.value.coordinates,
    travelMode: google.maps.TravelMode[transportMode.value]
  }

  try {
    const result = await directionsService.value.route(request)
    directionsRenderer.value.setDirections(result)

    const leg = result.routes[0].legs[0]

    routeSummary.value = {
      duration: leg.duration.text,
      distance: leg.distance.text,
      arrival: calculateArrivalTime(leg.duration.value)
    }

    // Build a detailed steps array
    const detailedSteps = []

    for (const step of leg.steps) {
      if (step.travel_mode === 'WALKING') {
        // For WALKING steps, fetch detailed route using WALKING mode
        try {
          const walkResult = await directionsService.value.route({
            origin: step.start_location,
            destination: step.end_location,
            travelMode: google.maps.TravelMode.WALKING
          })

          const subSteps = walkResult.routes[0].legs[0].steps.map(subStep => ({
            instructions: subStep.instructions,
            distance: subStep.distance.text,
            duration: subStep.duration.text
          }))

          detailedSteps.push(...subSteps)
        } catch (walkError) {
          console.warn('WALKING detail fetch failed, fallback to original step.')
          detailedSteps.push({
            instructions: step.instructions,
            distance: step.distance?.text || '',
            duration: step.duration?.text || ''
          })
        }
      } else if (step.travel_mode === 'TRANSIT') {
    // bus train station
    const transitDetails = step.transit;
    console.log('Step mode:', step.travel_mode);
    console.log('Transit Details:', step.transit);
        let timingInfo = '';
        if (transitDetails) {
          const departure = transitDetails.departure_time ? transitDetails.departure_time.text : '';
          const arrival = transitDetails.arrival_time ? transitDetails.arrival_time.text : '';
          let lineName = '';
          if (transitDetails.line) {
            lineName = transitDetails.line.short_name || transitDetails.line.name || '';
          }
          timingInfo = ` (Depart: ${departure}, Arrive: ${arrival}${lineName ? ', via ' + lineName : ''})`;
        }
        console.log('完整的JSON数据:', JSON.stringify(result, null, 2));
        detailedSteps.push({
          instructions: step.instructions + timingInfo,
          distance: step.distance?.text || '',
          duration: step.duration?.text || ''
        });
      } 
    else {
        detailedSteps.push({
          instructions: step.instructions,
          distance: step.distance?.text || '',
          duration: step.duration?.text || ''
        })
      }
    }

    routeSteps.value = detailedSteps
  } catch (error) {
    console.error('Direction request failed:', error)
  }
}

function calculateArrivalTime(durationInSeconds) {
  const now = new Date()
  const arrivalTime = new Date(now.getTime() + durationInSeconds * 1000)
  return arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function savePDF() {
  try {
    const contentDiv = document.createElement('div')
    contentDiv.style.padding = '20px'
    contentDiv.style.background = 'white'
    
    contentDiv.innerHTML = `
      <h1 style="font-size: 24px; margin-bottom: 10px;">${event.value.title}</h1>
      <p style="margin-bottom: 20px;">${event.value.location} • ${event.value.date} • ${event.value.time}</p >
      <div style="margin-bottom: 20px;">
        <p><strong>Total Distance:</strong> ${routeSummary.value.distance}</p >
        <p><strong>Estimated Time:</strong> ${routeSummary.value.duration}</p >
        <p><strong>Expected Arrival:</strong> ${routeSummary.value.arrival}</p >
      </div>
      <h2 style="font-size: 18px; margin-bottom: 10px;">Step-by-Step Instructions:</h2>
    `
    
    const stepsHtml = routeSteps.value.map((step, index) => `
      <div style="margin-bottom: 15px;">
        <div style="display: flex; align-items: start;">
          <div style="width: 24px; height: 24px; background: #3B82F6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
            ${index + 1}
          </div>
          <div>
            <p style="margin: 0;">${step.instructions}</p >
            <p style="margin: 0; color: #666; font-size: 14px;">${step.distance} • ${step.duration}</p >
          </div>
        </div>
      </div>
    `).join('')
    
    contentDiv.innerHTML += stepsHtml
    
    document.body.appendChild(contentDiv)
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    const canvas = await html2canvas(contentDiv, {
      scale: 2,
      useCORS: true,
      logging: false
    })
    
    document.body.removeChild(contentDiv)
    
    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    
    pdf.save(`${event.value.title} - Navigation Guide.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF. Please try again.')
  }
}

function initMap() {
  const mapOptions = {
    zoom: 13,
    center: event.value.coordinates,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false
  }

  map.value = new google.maps.Map(document.getElementById('map'), mapOptions)
  directionsService.value = new google.maps.DirectionsService()
  directionsRenderer.value = new google.maps.DirectionsRenderer({
    map: map.value,
    suppressMarkers: false
  })

  // 如果用户位置已获取，则直接计算路线
  if (userLocation.value && userLocation.value.lat) {
    calculateRoute()
  }
}

onMounted(() => {
  // 先请求用户位置，这样会弹出授权提示
  getUserLocation()
  
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`
  script.async = true
  script.defer = true
  window.initMap = initMap
  document.head.appendChild(script)
})

onUnmounted(() => {
  delete window.initMap
  const script = document.querySelector('script[src*="maps.googleapis.com"]')
  if (script) {
    script.remove()
  }
})
</script>

<style scoped>
.step-item {
  position: relative;
}

.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 15px;
  top: 40px;
  bottom: -20px;
  width: 2px;
  background-color: #e5e7eb;
}
</style>