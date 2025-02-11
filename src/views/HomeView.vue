<script setup lang="ts">
interface Game {
  id: number
  title: string
  description: string
  imageUrl: string
}

const games: Game[] = [
  {
    id: 1,
    title: 'Game 1',
    description: 'An exciting adventure game with stunning graphics',
    imageUrl: 'https://placehold.co/300x200',
  },
  // Add more games as needed
]
</script>

<template>
  <div class="website-container">
    <!-- Navigation Header -->
    <nav class="header">
      <div class="logo">
        <img src="https://placehold.co/150x50" alt="Company Logo" />
      </div>
      <div class="nav-links">
        <a href="#" class="nav-link">Home</a>
        <a href="#" class="nav-link">Games</a>
        <a href="#" class="nav-link">About</a>
      </div>
      <div class="auth-section">
        <button class="settings-btn">⚙️</button>
        <a href="#" class="auth-link">Login</a>
        <a href="#" class="auth-link">Register</a>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <h1>Featured Games</h1>
      <div class="games-grid">
        <div v-for="game in games" :key="game.id" class="game-card">
          <img :src="game.imageUrl" :alt="game.title" class="game-image" />
          <h3>{{ game.title }}</h3>
          <p>{{ game.description }}</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>About Us</h4>
          <p>Your gaming platform description</p>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <p>Email: contact@example.com</p>
        </div>
        <div class="footer-section">
          <h4>Follow Us</h4>
          <div class="social-links">
            <a href="#">Twitter</a>
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Gaming Platform. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.website-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1a1a1a;
  color: white;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link,
.auth-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.settings-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 2rem 0;
}

.game-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.game-card:hover {
  transform: translateY(-5px);
}

.game-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.game-card h3 {
  padding: 1rem;
  margin: 0;
}

.game-card p {
  padding: 0 1rem 1rem;
  color: #666;
}

.footer {
  background-color: #1a1a1a;
  color: white;
  padding: 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  color: white;
  text-decoration: none;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #333;
}
</style>
