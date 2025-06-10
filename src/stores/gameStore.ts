import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Comment, Game } from '../types';
import api from '../config/api';

export const useGameStore = defineStore('game', () => {
    const games = ref<Game[]>([]);
    const featuredGames = ref<Game[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const commentsLoading = ref<Record<number, boolean>>({});
    const commentsError = ref<Record<number, string | null>>({});

    // Group all methods in a single object
    const methods = {
        // Fetch all games from the API
        fetchGames: async (): Promise<void> => {
            try {
                loading.value = true;
                error.value = null;

                const response = await api.get('/games');
                games.value = response.data;
            } catch (err) {
                console.error('Error fetching games:', err);
                error.value = 'Failed to load games. Please try again later.';
            } finally {
                loading.value = false;
            }
        },

        // Function to fetch comments for a specific game
        fetchComments: async (gameId: number): Promise<void> => {
            try {
                // Set loading state for this game's comments
                commentsLoading.value[gameId] = true;
                commentsError.value[gameId] = null;

                const game = games.value.find((g) => g.id === gameId);
                if (!game) {
                    throw new Error(`Game with ID ${gameId} not found`);
                }

                const response = await api.get(`game-comments/game/${gameId}`);
                game.comments = response.data;
            } catch (err) {
                console.error(`Error fetching comments for game ${gameId}:`, err);
                commentsError.value[gameId] = 'Failed to load comments. Please try again later.';
            } finally {
                commentsLoading.value[gameId] = false;
            }
        },

        // Function to get a single game by ID
        getGameById: async (id: number): Promise<Game | undefined> => {
            try {
                // First check if we already have the game in our store
                const cachedGame = games.value.find((game) => game.id === id);
                if (cachedGame) return cachedGame;

                // If not, fetch it from the API
                const response = await api.get(`games/${id}`);
                return response.data;
            } catch (err) {
                console.error(`Error fetching game with ID ${id}:`, err);
                error.value = 'Failed to load game details. Please try again later.';
                return undefined;
            }
        },

        // Function to add a comment to a game
        // In gameStore.ts
        addComment: async (comment: { gameId: number; content: string }): Promise<void> => {
            try {
                const _response = await api.post('game-comments', comment);

                // After successful submission, refresh comments
                await methods.fetchComments(comment.gameId);
            } catch (err) {
                console.error('Error adding comment:', err);
                throw err;
            }
        },

        // Function to update a comment
        updateComment: async (id: number, text: string): Promise<Comment> => {
            try {
                const response = await api.put(`game-comments/${id}`, { text });
                return response.data;
            } catch (err) {
                console.error(`Failed to update comment ${id}:`, err);
                throw err;
            }
        },

        // Function to delete a comment
        deleteComment: async (id: number): Promise<void> => {
            try {
                await api.delete(`game-comments/${id}`);

                // Remove the comment from all games in the store
                for (const game of games.value) {
                    if (game.comments) {
                        game.comments = game.comments.filter((comment) => comment.id !== id);
                    }
                }
            } catch (err) {
                console.error(`Failed to delete comment ${id}:`, err);
                throw err;
            }
        },

        // Function to add a reaction to a comment
        addReaction: async (commentId: number, type: string): Promise<void> => {
            try {
                await api.post(`game-comments/${commentId}/reactions`, { type });
            } catch (err) {
                console.error(`Failed to add reaction to comment ${commentId}:`, err);
                throw err;
            }
        },

        // Function to remove a reaction from a comment
        removeReaction: async (commentId: number): Promise<void> => {
            try {
                await api.delete(`game-comments/${commentId}/reactions`);
            } catch (err) {
                console.error(`Failed to remove reaction from comment ${commentId}:`, err);
                throw err;
            }
        },

        // Function to fetch featured games
        fetchFeaturedGames: async (): Promise<void> => {
            try {
                loading.value = true;
                error.value = null;

                const response = await api.get('games/featured');
                featuredGames.value = response.data;
            } catch (err) {
                console.error('Error fetching featured games:', err);
                error.value = 'Failed to load featured games. Please try again later.';
                featuredGames.value = [];
            } finally {
                loading.value = false;
            }
        },
    };

    // Return state and methods
    return {
        games,
        featuredGames,
        loading,
        error,
        commentsLoading,
        commentsError,
        ...methods,
    };
});
