import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1>About Seed Store</h1>
        <div className="about-content">
          <section className="about-section">
            <h2>Our Story</h2>
            <p>
              Seed Store was founded with a passion for helping gardeners and plant enthusiasts 
              grow beautiful, healthy plants. We understand that every garden is unique, and 
              that's why we offer personalized seed recommendations based on your specific 
              growing conditions.
            </p>
          </section>

          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              Our mission is to make gardening accessible to everyone by providing high-quality 
              seeds, expert advice, and personalized recommendations. We believe that everyone 
              should have the opportunity to experience the joy of growing their own plants.
            </p>
          </section>

          <section className="about-section">
            <h2>What We Offer</h2>
            <ul className="about-list">
              <li>
                <strong>Wide Variety:</strong> We offer a diverse selection of seeds for 
                vegetables, flowers, herbs, and more.
              </li>
              <li>
                <strong>Personalized Recommendations:</strong> Our intelligent recommendation 
                system suggests the best seeds based on your soil type, climate, and water 
                conditions.
              </li>
              <li>
                <strong>Quality Assurance:</strong> All our seeds are carefully selected and 
                tested to ensure high germination rates and quality.
              </li>
              <li>
                <strong>Expert Support:</strong> Our team of gardening experts is here to 
                help you succeed in your gardening journey.
              </li>
              <li>
                <strong>Convenient Shopping:</strong> Easy online ordering with secure payment 
                and fast delivery options.
              </li>
            </ul>
          </section>

          <section className="about-section">
            <h2>How Our Recommendation System Works</h2>
            <p>
              Our advanced recommendation system analyzes your specific growing conditions to 
              suggest the perfect seeds for your garden:
            </p>
            <div className="recommendation-info">
              <div className="info-card">
                <h3>Soil Type Analysis</h3>
                <p>
                  We consider your soil type (clay, sandy, loamy, silt, chalky, or peaty) to 
                  recommend seeds that thrive in your specific soil conditions.
                </p>
              </div>
              <div className="info-card">
                <h3>Climate Matching</h3>
                <p>
                  Whether you live in a tropical, temperate, arid, continental, or polar climate, 
                  we match seeds that are best suited for your region.
                </p>
              </div>
              <div className="info-card">
                <h3>Water Requirements</h3>
                <p>
                  We factor in your water availability (low, moderate, or high) to suggest 
                  plants that match your watering capabilities.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Our Commitment</h2>
            <p>
              At Seed Store, we are committed to providing you with the best possible experience. 
              From the moment you browse our catalog to the day your seeds arrive, we ensure 
              quality, reliability, and excellent customer service. We believe in sustainable 
              gardening practices and are dedicated to helping you create a thriving garden 
              that brings joy and beauty to your life.
            </p>
          </section>

          <section className="about-section">
            <h2>Contact Us</h2>
            <p>
              Have questions? We'd love to hear from you! Visit our{' '}
              <a href="/contact">Contact</a> page to get in touch with our team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;

