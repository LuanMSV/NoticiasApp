import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function NewsDetailsScreen() {
  const { title, description, urlToImage, url } = useLocalSearchParams();

  const handleOpenLink = () => {
    if (url) {
      Linking.openURL(url as string);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {urlToImage && (
        <Image
          source={{ uri: urlToImage as string }}
          style={styles.image}
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleOpenLink}
        >
          <Text style={styles.buttonText}>Ler matéria completa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 