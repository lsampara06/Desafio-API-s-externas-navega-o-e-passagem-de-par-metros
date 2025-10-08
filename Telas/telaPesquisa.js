import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import CardItem from '../components/CardItem';
import { searchMeals } from '../api/mealdb'; // Usaremos a busca por nome para a consulta

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('Chicken'); // Estado inicial para demonstrar a lista
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false); // Estado de Loading (Sugestão de UX)
    const [error, setError] = useState(''); // Estado de Erro (Sugestão de UX)

    const fetchMeals = useCallback(async (query) => {
        if (!query.trim()) {
            setMeals([]);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const result = await searchMeals(query);
            setMeals(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Busca inicial ao montar a tela
    useEffect(() => {
        fetchMeals(searchQuery);
    }, [fetchMeals, searchQuery]);

    const handleItemPress = (mealId) => {
        // Usa o React Navigation para ir para a tela de detalhes, passando o ID
        navigation.navigate('Details', { mealId });
    };

    const renderItem = ({ item }) => (
        <CardItem
            title={item.strMeal}
            // A The MealDB fornece uma URL de imagem de miniatura
            imageUrl={item.strMealThumb} 
            onPress={() => handleItemPress(item.idMeal)}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Campo de Pesquisa (Tela de Consulta) */}
            <TextInput
                style={styles.searchInput}
                placeholder="Pesquise por uma receita (ex: Beef, Chicken)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => fetchMeals(searchQuery)} // Aciona a busca ao submeter
            />

            {/* Feedback Visual (Loading States e Mensagens de Erro) */}
            {loading && (
                <View style={styles.feedbackContainer}>
                    <ActivityIndicator size="large" color="#FF6347" />
                    <Text>Carregando receitas...</Text>
                </View>
            )}

            {error ? (
                <View style={styles.feedbackContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={meals}
                    keyExtractor={(item) => item.idMeal}
                    renderItem={renderItem}
                    // Implementação básica de UX: mensagem de lista vazia
                    ListEmptyComponent={!loading && !error && searchQuery.trim() ? (
                        <View style={styles.feedbackContainer}>
                            <Text>Nenhuma receita encontrada para "{searchQuery}".</Text>
                        </View>
                    ) : null}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    feedbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    searchInput: {
        height: 50,
        backgroundColor: '#fff',
        margin: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    }
});

export default SearchScreen;