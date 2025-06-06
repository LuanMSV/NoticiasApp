import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();
  const router = useRouter();

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <View style={styles.newsItem}>
      <TouchableOpacity 
        onPress={() => router.push({
          pathname: "/news/details",
          params: {
            title: item.title,
            description: item.description,
            urlToImage: item.urlToImage,
            url: item.url
          }
        })} 
        style={styles.newsContent}
      >
        {item.urlToImage && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.urlToImage }}
              style={styles.newsImage}
            />
            <TouchableOpacity 
              onPress={() => removeFavorite(item.url)} 
              style={styles.favoriteButton}
            >
              <Ionicons 
                name="star" 
                size={24} 
                color="#3498db" 
              />
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="star-outline" size={64} color="#666" />
        <Text style={styles.emptyText}>Nenhuma notícia favoritada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Notícias Favoritas</Text>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.url}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
    color: '#3498db',
  },
  list: {
    padding: 16,
  },
  newsItem: {
    backgroundColor: '#dddddd',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  newsContent: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
}); 