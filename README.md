# NoticiasApp

Aplicativo de notícias desenvolvido com React Native e Expo.


## 🚀 Funcionalidades

### 1. Listagem de Notícias
- Exibição de notícias em cards
- Imagem destacada
- Título e fonte
- Data de publicação
- Efeito de pressão nos cards

### 2. Sistema de Favoritos
- Adicionar/remover notícias dos favoritos
- Persistência local com AsyncStorage
- Indicador visual de status
- Lista dedicada de favoritos

### 3. Filtros e Busca
- Busca por texto
- Filtro por categorias
- Interface modal para seleção de categorias
- Limpeza de filtros

### 4. Detalhes da Notícia
- Visualização completa da notícia
- Imagem em destaque
- Link para matéria original
- Layout otimizado para leitura


## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework principal
- **Expo**: Plataforma de desenvolvimento
- **TypeScript**: Tipagem estática
- **Axios**: Requisições HTTP
- **AsyncStorage**: Armazenamento local
- **Expo Router**: Navegação
- **Vector Icons**: Ícones


## 💻 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/NoticiasApp.git
```

2. Instale as dependências:
```bash
cd NoticiasApp
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

4. Inicie o projeto:
```bash
npm start
```

## 🎯 Uso

1. **Lista de Notícias**
   - Role para ver mais notícias
   - Toque em uma notícia para ver detalhes
   - Use o botão de estrela para favoritar

2. **Busca e Filtros**
   - Digite na barra de busca
   - Use o botão de filtro para categorias
   - Limpe os filtros com o botão X

3. **Favoritos**
   - Acesse a aba de favoritos
   - Gerencie suas notícias salvas
   - Remova favoritos deslizando


## 🎯 Decisões Técnicas

### 1. Escolha do Framework e Plataforma
- **React Native + Expo**: Escolhido pela facilidade de desenvolvimento multiplataforma
- **TypeScript**: Implementado para garantir tipagem estática e melhor manutenibilidade
- **Expo Router**: Adotado para gerenciamento de rotas com suporte nativo

### 2. Gerenciamento de Estado
- **Context API**: Utilizado para gerenciar estado global (favoritos) por ser nativo e adequado para o escopo
- **Estado Local**: Implementado para estados específicos de componentes
- **AsyncStorage**: Escolhido para persistência local por ser simples e eficiente para o caso de uso

### 3. Padrões de Arquitetura
- **Clean Architecture**: Adotada para separar responsabilidades e facilitar testes
- **Repository Pattern**: Implementado para abstrair a fonte de dados

### 4. Performance
- **FlatList**: Escolhida para renderização eficiente de listas longas
- **Memoização**: Implementada em componentes para evitar re-renders desnecessários
- **Lazy Loading**: Utilizado para carregamento de imagens

### 5. UI/UX
- **Pressable**: Adotado em vez de TouchableOpacity para melhor controle de interações
- **Animated API**: Utilizada para animações suaves e feedback visual
- **Modal**: Implementado para filtros por ser mais intuitivo em mobile

### 6. Segurança
- **Validação de Dados**: Implementada em todas as entradas de usuário
- **Tratamento de Erros**: Estrutura robusta para lidar com falhas de API

### 7. Escalabilidade
- **Arquitetura Modular**: Facilita adição de novas features
- **Componentes Reutilizáveis**: Reduz duplicação de código
- **Interfaces Extensíveis**: Permite fácil expansão de funcionalidades

### 8. Integração com APIs
- **Axios**: Escolhido para requisições HTTP por sua simplicidade e recursos
- **Cache**: Estratégia implementada para reduzir chamadas à API
