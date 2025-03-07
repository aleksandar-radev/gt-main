<script setup lang="ts"></script>

<template>
  <div class="about-container">
    <h1>About Our Gaming Platform</h1>

    <div class="about-content">
      <section class="about-section">
        <h2>Our Mission</h2>
        <p>
          Welcome to our gaming platform! We are dedicated to bringing you the best gaming
          experience possible. Our mission is to create a community where gamers can discover new
          games, connect with other players, and share their gaming experiences.
        </p>
      </section>

      <section class="about-section">
        <h2>Our Story</h2>
        <p>
          Founded in 2023, our platform started as a small project by a group of passionate gamers
          who wanted to create a better way to discover and discuss games. Since then, we've grown
          into a thriving community with thousands of active users.
        </p>
        <p>
          Our team consists of developers, designers, and gaming enthusiasts who work tirelessly to
          improve the platform and add new features based on community feedback.
        </p>
      </section>

      <section class="about-section">
        <h2>Our Features</h2>
        <ul class="features-list">
          <li>
            <strong>Game Discovery</strong> - Find new games that match your interests and
            preferences.
          </li>
          <li><strong>Community Reviews</strong> - Read honest reviews from other gamers.</li>
          <li><strong>Discussion</strong> - Join conversations about your favorite games.</li>
          <li>
            <strong>Game Tracking</strong> - Keep track of games you've played and want to play.
          </li>
        </ul>
      </section>

      <section class="about-section">
        <h2>Contact Us</h2>
        <p>Have questions, suggestions, or feedback? We'd love to hear from you!</p>
        <p>
          Email: <a href="mailto:contact@example.com">contact@example.com</a><br />
          Twitter: <a href="https://twitter.com/example" target="_blank">@GamingPlatform</a><br />
          Discord: <a href="https://discord.gg/example" target="_blank">Join our server</a>
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-section {
  background-color: rgb(179, 177, 177);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #f7f7f7;
  margin-top: 0;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

p {
  line-height: 1.6;
  color: var(--color-text);
}

.features-list {
  padding-left: 1.5rem;
}

.features-list li {
  margin-bottom: 1rem;
  line-height: 1.4;
}

a {
  color: #0e3e5e;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .about-container {
    padding: 1rem;
  }

  .about-section {
    padding: 1rem;
  }
}
</style>
