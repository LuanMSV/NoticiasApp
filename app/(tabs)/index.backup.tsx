// Importando os componentes necessários do React Native
import { StyleSheet, FlatList, ActivityIndicator, View, Text, Image, TextInput, TouchableOpacity, ScrollView, Modal, Pressable, Animated } from 'react-native';
// Importando hooks do React para gerenciamento de estado e efeitos
import { useEffect, useState, useCallback, useRef } from 'react';
// Importando axios para fazer requisições HTTP
import axios from 'axios';
import { useRouter } from 'expo-router'; // Importando useRouter
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../context/FavoritesContext';

// Interface que define a estrutura de cada item de notícia
interface NewsItem {
  id: string;
  title: string;
  description: string;
  urlToImage: string;
  publishedAt: string;
  name: string;
  url: string;
  source: {
    name: string;
  };
  content: string;
}

// Lista de categorias disponíveis
const categories = [
  { id: 'general', name: 'Geral' },
  { id: 'technology', name: 'Tecnologia' },
  { id: 'business', name: 'Negócios' },
  { id: 'sports', name: 'Esportes' },
  { id: 'entertainment', name: 'Entretenimento' },
  { id: 'health', name: 'Saúde' },
  { id: 'science', name: 'Ciência' },
];

export default function HomeScreen() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [modalVisible, setModalVisible] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const router = useRouter();

  // Referências para as animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Efeito para iniciar as animações quando o componente montar
  useEffect(() => {
    // Animação inicial de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação de pulso contínuo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Função para buscar notícias por texto
  const getNewsBySearch = async (query: string) => {
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    try {
      setLoading(true);
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          country: 'us',
          apiKey: '361fa26158d34009985d94c489b0e97a',
          q: query,
        }
      });
      
      setNews(response.data.articles);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      setLoading(false);
    }
  };

  // Função para buscar notícias por categoria
  const getNewsByCategory = async (category: string) => {
      const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    try {
      setLoading(true);
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          country: 'us',
          apiKey: '361fa26158d34009985d94c489b0e97a',
          category: category,
        }
      });
      
      setNews(response.data.articles);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      setLoading(false);
    }
  };

  // Carrega as notícias iniciais
  useEffect(() => {
    getNewsByCategory('general');
  }, []);

  // Atualiza as notícias quando a categoria mudar
  useEffect(() => {
    if (!searchQuery) {
      getNewsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  // Função para executar a busca
  const handleSearch = () => {
    if (searchQuery) {
      getNewsBySearch(searchQuery);
    } else {
      getNewsByCategory(selectedCategory);
    }
  };

  // Função para limpar a busca
  const clearSearch = () => {
    setSearchQuery('');
    getNewsByCategory(selectedCategory);
  };

  // Função para obter o nome da categoria selecionada
  const getSelectedCategoryName = () => {
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.name : 'Geral';
  };

  // Função para limpar o filtro
  const clearFilter = () => {
    setSelectedCategory('general');
    getNewsByCategory('general');
  };

  // Função para aplicar o filtro de categoria
  const applyCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (!searchQuery) {
      getNewsByCategory(categoryId);
    }
    setModalVisible(false);
  };

  // Função para alternar o estado de favorito
  const toggleFavorite = async (item: NewsItem) => {
    if (isFavorite(item.url)) {
      await removeFavorite(item.url);
    } else {
      await addFavorite({
        title: item.title,
        description: item.description,
        urlToImage: item.urlToImage,
        url: item.url
      });
    }
  };

  // Função que renderiza cada item da lista de notícias
  const renderNewsItem = ({ item, index }: { item: NewsItem, index: number }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.newsItem,
        pressed && styles.newsItemPressed
      ]}
      onPress={() => router.push({
        pathname: "/news/details",
        params: {
          title: item.title,
          description: item.description,
          urlToImage: item.urlToImage,
          url: item.url
        }
      })}
    >
      <View style={styles.newsContent}>
        {item.urlToImage && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.urlToImage }}
              style={styles.newsImage}
            />
            <TouchableOpacity 
              onPress={() => toggleFavorite(item)} 
              style={styles.favoriteButton}
            >
              <Ionicons 
                name={isFavorite(item.url) ? "star" : "star-outline"} 
                size={24} 
                color={isFavorite(item.url) ? "#3498db" : "#666"} 
              />
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.bottomInfoContainer}>
          <Text style={styles.sourceText}>Fonte: {item.source.name}</Text>
          <Text style={styles.dateText}>{item.publishedAt}</Text>
        </View>
      </View>
    </Pressable>
  );

  // Se estiver carregando, mostra o indicador de loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Renderiza a lista de notícias
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: pulseAnim }
            ],
          },
        ]}
      >
        <Text style={styles.appTitle}>NoticiasApp</Text>
      </Animated.View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar notícias..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Ionicons name="search" size={24} color="#3498db" />
        </TouchableOpacity>
        {searchQuery ? (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearSearch}
          >
            <Ionicons name="close-circle" size={24} color="#666" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="filter" size={24} color="#3498db" />
          </TouchableOpacity>
        )}
      </View>

      {selectedCategory !== 'general' && (
        <View style={styles.currentFilterContainer}>
          <Text style={styles.currentFilterText}>
            Categoria: {getSelectedCategoryName()}
          </Text>
          <TouchableOpacity 
            style={styles.clearFilterButton}
            onPress={clearFilter}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por Categoria</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    selectedCategory === category.id && styles.categoryOptionSelected
                  ]}
                  onPress={() => applyCategoryFilter(category.id)}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    selectedCategory === category.id && styles.categoryOptionTextSelected
                  ]}>
                    {category.name}
                  </Text>
                  {selectedCategory === category.id && (
                    <Ionicons name="checkmark" size={24} color="#3498db" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <FlatList
        // Dados que serão renderizados na lista (agora a lista 'news' diretamente)
        data={news}
        // Função que define como cada item será renderizado
        renderItem={renderNewsItem}
        // Função que gera uma chave única para cada item
        keyExtractor={(item, index) => index.toString()}
        // Estilo do container da lista
        contentContainerStyle={[styles.newsList, { paddingTop: 8 }]}
      />
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Container do loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilo da lista de notícias
  newsList: {
    padding: 16,
  },
  // Estilo de cada item de notícia
  newsItem: {
    backgroundColor: '#dddddd',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    transform: [{ scale: 1 }],
  },
  newsItemPressed: {
    backgroundColor: '#cccccc',
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
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
  // Estilo do título da notícia
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  // Estilo da descrição da notícia
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  // Container para fonte e data na mesma linha
  bottomInfoContainer: {
    flexDirection: 'row', // Coloca os itens lado a lado
    justifyContent: 'space-between', // Alinha um na esquerda e outro na direita
    alignItems: 'center', // Centraliza verticalmente
    marginTop: 8, // Espaçamento do conteúdo acima
  },
  // Estilo da fonte/autor
  sourceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c5282',
    fontStyle: 'italic',
    // margin direita não é necessário com space-between
  },
  // Estilo da data de publicação
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    // alinhamento e margin topo não são necessários com o container
  },
  // Estilo para o campo de busca
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  // Estilo para o título do aplicativo
  titleContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 32,
    marginBottom: 8,
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  currentFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  currentFilterText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  clearFilterButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    maxHeight: '80%',
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryOptionSelected: {
    backgroundColor: '#f8f9fa',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#333',
  },
  categoryOptionTextSelected: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  searchButton: {
    padding: 8,
    marginRight: 8,
  },
  clearButton: {
    padding: 8,
    marginRight: 8,
  },
}); 