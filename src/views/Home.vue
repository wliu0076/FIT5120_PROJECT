<section class="hero-section">
  <div class="container">
    <h1>Discover Melbourne's Best Events in Your Language</h1>
    <p>Plan your journey and find events with step-by-step help</p>
    <div class="button-group">
      <router-link to="/events" class="btn btn-primary">
        <i class="mdi mdi-calendar-search"></i>
        Browse Events
      </router-link>
      <router-link to="/navigation" class="btn btn-outline">
        <i class="mdi mdi-map-marker"></i>
        Find Travel Guide
      </router-link>
    </div>
  </div>
</section>

<section class="making-melbourne-simple">
  <div class="container">
    <h2>Making Melbourne Simple to Explore</h2>
    <p>We are dedicated to providing convenient cultural landmark navigation services to help you discover the cultural treasures in the city</p>
  </div>
</section>

<section class="steps-section">
  <div class="container">
    <div class="steps-grid">
      <div class="step-item">
        <div class="step-icon">
          <i class="mdi mdi-calendar"></i>
        </div>
        <h3>Find an Event</h3>
        <p>Browse events in your preferred language</p>
      </div>

      <div class="step-item">
        <div class="step-icon">
          <i class="mdi mdi-map-marker-path"></i>
        </div>
        <h3>Get Travel Guide</h3>
        <p>Get step-by-step directions to the event</p>
      </div>

      <div class="step-item">
        <div class="step-icon">
          <i class="mdi mdi-walk"></i>
        </div>
        <h3>Go Explore</h3>
        <p>Enjoy the event with your community</p>
      </div>
    </div>
  </div>
</section>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #004d40 0%, #00796b 100%);
  color: white;
  padding: 100px 0;
  text-align: center;

  h1 {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s;

    i {
      margin-right: 0.5rem;
    }
  }

  .btn-primary {
    background-color: #2196f3;
    color: white;
    &:hover {
      background-color: #1976d2;
    }
  }

  .btn-outline {
    border: 2px solid white;
    color: white;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.making-melbourne-simple {
  padding: 80px 0;
  background-color: #f8f9fa;
  text-align: center;

  h2 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2rem;
    color: #666;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

.steps-section {
  padding: 60px 0;
  background-color: #fff;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.step-item {
  text-align: center;
  padding: 20px;
}

.step-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background-color: #e8f0fe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 32px;
    color: #1a73e8;
  }
}

h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 12px;
}

p {
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .steps-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style> 