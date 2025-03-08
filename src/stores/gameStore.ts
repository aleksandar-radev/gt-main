import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Comment, Game } from '../types';

export const useGameStore = defineStore('game', () => {
    const games = ref<Game[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const commentsLoading = ref<Record<number, boolean>>({});
    const commentsError = ref<Record<number, string | null>>({});

    // Mock API function to simulate fetching games from an API
    const fetchGames = async (): Promise<void> => {
        try {
            loading.value = true;
            error.value = null;

            // For now, we'll simulate a network delay and return mock data
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Mock API response
            games.value = [
                {
                    id: 1,
                    name: 'adventure-quest',
                    title: 'Adventure Quest',
                    category: 'Game',
                    rating: 4.5,
                    description:
                        'An exciting adventure game with stunning graphics and immersive storytelling. Embark on an epic journey across vast landscapes and discover hidden treasures. Battle fierce enemies and solve intricate puzzles to progress through the story.',
                    imageUrl: 'https://placehold.co/300x200/orange/white?text=Adventure+Quest',
                },
                {
                    id: 2,
                    name: 'space-explorer',
                    title: 'Space Explorer',
                    category: 'Game',
                    rating: 4.5,
                    description:
                        'Explore the vast universe and discover new planets in this sci-fi adventure. Pilot your spaceship through asteroid fields, engage in intergalactic diplomacy, and upgrade your technology to reach the furthest corners of the galaxy.',
                    imageUrl: 'https://placehold.co/300x200/blue/white?text=Space+Explorer',
                },
                {
                    id: 3,
                    name: 'mystical-kingdoms',
                    title: 'Mystical Kingdoms',
                    category: 'Game',
                    rating: 4.5,
                    description:
                        'Build your fantasy kingdom and defend it against magical enemies. Recruit legendary heroes, research powerful spells, and form alliances with neighboring realms to establish your dominance in this enchanted world.',
                    imageUrl: 'https://placehold.co/300x200/purple/white?text=Mystical+Kingdoms',
                },
                {
                    id: 4,
                    name: 'racing-legends',
                    title: 'Racing Legends',
                    category: 'Game',
                    rating: 4.5,
                    description:
                        'High-speed racing with customizable vehicles and challenging tracks. Experience realistic physics, dynamic weather conditions, and a career mode that takes you from amateur races to professional championships.',
                    imageUrl: 'https://placehold.co/300x200/red/white?text=Racing+Legends',
                },
                {
                    id: 5,
                    name: 'zombie-survival',
                    title: 'Zombie Survival',
                    category: 'Game',
                    rating: 4.5,
                    description:
                        'Survive in a post-apocalyptic world filled with zombies and danger. Scavenge for supplies, build fortifications, and form alliances with other survivors. Every decision matters in this intense survival simulation.',
                    imageUrl: 'https://placehold.co/300x200/green/white?text=Zombie+Survival',
                },
            ];
        } catch (err) {
            console.error('Error fetching games:', err);
            error.value = 'Failed to load games. Please try again later.';
        } finally {
            loading.value = false;
        }
    };

    // Function to fetch comments for a specific game
    const fetchComments = async (gameId: number): Promise<void> => {
        try {
            // Set loading state for this game's comments
            commentsLoading.value[gameId] = true;
            commentsError.value[gameId] = null;

            const game = games.value.find((g) => g.id === gameId);
            if (!game) {
                throw new Error(`Game with ID ${gameId} not found`);
            }

            // For now, we'll simulate a network delay and return mock data
            await new Promise((resolve) => setTimeout(resolve, 600));

            // Generate random number of comments (1-5)
            const commentCount = Math.floor(Math.random() * 5) + 1;

            // Mock comments data
            const mockComments: Comment[] = Array.from({ length: commentCount }).map((_, index) => ({
                id: index + 1,
                gameId,
                username: `user${Math.floor(Math.random() * 1000)}`,
                text: getRandomComment(game.title),
                timestamp: getRandomTimestamp(),
            }));

            game.comments = mockComments;
        } catch (err) {
            console.error(`Error fetching comments for game ${gameId}:`, err);
            commentsError.value[gameId] = 'Failed to load comments. Please try again later.';
        } finally {
            commentsLoading.value[gameId] = false;
        }
    };

    // Function to get game by ID
    const getGameById = (id: number): Game | undefined => {
        return games.value.find((game) => game.id === id);
    };

    // Helper function to generate random comments
    function getRandomComment(gameTitle: string): string {
        const comments = [
            `I love ${gameTitle}! It's the best game I've played this year.`,
            `${gameTitle} has amazing graphics but the storyline could be better.`,
            `Has anyone figured out how to beat the final boss in ${gameTitle}?`,
            `Just started playing ${gameTitle} and I'm already addicted!`,
            `The multiplayer mode in ${gameTitle} needs some improvement.`,
            `${gameTitle} is worth every penny. Highly recommended!`,
            `The latest update for ${gameTitle} fixed a lot of bugs.`,
            `Can't wait for the sequel to ${gameTitle}!`,
            `${gameTitle} is too easy, needs more challenging levels.`,
            `The soundtrack in ${gameTitle} is absolutely beautiful.`,
        ];
        return comments[Math.floor(Math.random() * comments.length)];
    }

    // Helper function to generate random timestamps within the last week
    function getRandomTimestamp(): string {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 7); // 0-6 days ago
        const hoursAgo = Math.floor(Math.random() * 24); // 0-23 hours ago
        const minutesAgo = Math.floor(Math.random() * 60); // 0-59 minutes ago

        now.setDate(now.getDate() - daysAgo);
        now.setHours(now.getHours() - hoursAgo);
        now.setMinutes(now.getMinutes() - minutesAgo);

        return now.toISOString();
    }

    // Add this method to your gameStore
    function addComment(comment: Partial<Comment>) {
        try {
            // Here you would typically make an API call to save the comment
            // For example:
            // const response = await api.post('/comments', comment)

            // For now, let's simulate a successful API call
            const newComment: Comment = {
                id: Date.now(), // Generate a temporary ID
                gameId: comment.gameId!,
                username: comment.username!,
                text: comment.text!,
                timestamp: comment.timestamp!,
            };

            // Add the comment to the game
            // const gameIndex = games.value.findIndex((g) => g.id === comment.gameId)
            // if (gameIndex >= 0) {
            //   if (!games[gameIndex].comments) {
            //     games[gameIndex].comments = []
            //   }
            //   games[gameIndex].comments.push(newComment)
            // }

            return newComment;
        } catch (error) {
            console.error('Failed to add comment:', error);
            throw error;
        }
    }

    return {
        games,
        loading,
        error,
        commentsLoading,
        commentsError,
        addComment,
        fetchGames,
        fetchComments,
        getGameById,
    };
});
