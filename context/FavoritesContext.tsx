import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NewsItem {
  title: string;
  description: string;
  urlToImage: string;
  url: string;
}

interface FavoritesContextType {
  favorites: NewsItem[];
  addFavorite: (news: NewsItem) => Promise<void>;
  removeFavorite: (url: string) => Promise<void>;
  isFavorite: (url: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<NewsItem[]>([]);

  // Carrega os favoritos do AsyncStorage quando o app inicia
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const addFavorite = async (news: NewsItem) => {
    try {
      const newFavorites = [...favorites, news];
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
    }
  };

  const removeFavorite = async (url: string) => {
    try {
      const newFavorites = favorites.filter(item => item.url !== url);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  const isFavorite = (url: string) => {
    return favorites.some(item => item.url === url);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
} 