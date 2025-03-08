<template>
    <div class="website-container">
        <!-- Navigation Header -->
        <nav class="header">
            <div class="logo">
                <img src="https://placehold.co/150x50" alt="Company Logo" />
            </div>
            <div class="nav-links">
                <router-link to="/" class="nav-link">Games</router-link>
                <router-link to="/about" class="nav-link">About</router-link>
            </div>
            <div class="auth-section">
                <button class="settings-btn">⚙️</button>
                <a href="/login" class="auth-link">Login</a>
                <a href="/register" class="auth-link">Register</a>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <router-view></router-view>
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
                <p>© 2024 Gaming Platform. All rights reserved.</p>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts"></script>

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

    .nav-link.router-link-active {
        color: #3498db;
        font-weight: bold;
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
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
    }

    .footer {
        background-color: #1a1a1a;
        color: white;
        padding: 2rem;
        margin-top: auto;
    }

    .footer-content {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        margin-bottom: 2rem;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }

    .social-links {
        display: flex;
        gap: 1rem;
    }

    .social-links a {
        color: white;
        text-decoration: none;
        transition: color 0.2s;
    }

    .social-links a:hover {
        color: #3498db;
    }

    .footer-bottom {
        text-align: center;
        padding-top: 2rem;
        border-top: 1px solid #333;
    }

    @media (max-width: 768px) {
        .footer-content {
            grid-template-columns: 1fr;
        }

        .nav-links {
            display: none;
        }
    }
</style>
