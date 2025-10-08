import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { getMealDetails } from '../api/mealdb';

const DetailsScreen = ({ route }) => {
    // Recebe o ID da navegação
    const { mealId } = route.params; 
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const details = await getMealDetails(mealId);
                if (details) {
                    setMeal(details);
                } else {
                    setError('Detalhes da receita não encontrados.');
                }
            } catch (err) {
                Alert.alert("Erro", err.message); // Usa Alert para erros críticos de fetch
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [mealId]);

    // Lógica para extrair ingredientes e medidas do objeto da API (a The MealDB usa chaves dinâmicas)
    const getIngredients = (mealData) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredientKey = `strIngredient${i}`;
            const measureKey = `strMeasure${i}`;

            if (mealData[ingredientKey] && mealData[ingredientKey].trim() !== '') {
                ingredients.push({
                    name: mealData[ingredientKey],
                    measure: mealData[measureKey]
                });
            }
        }
        return ingredients;
    };

    if (loading) {
        return (
            <View style={styles.feedbackContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text>Buscando detalhes da receita...</Text>
            </View>
        );
    }

    if (error || !meal) {
        return (
            <View style={styles.feedbackContainer}>
                <Text style={styles.errorText}>Não foi possível carregar os detalhes.</Text>
            </View>
        );
    }

    const ingredientsList = getIngredients(meal);

    return (
        // Uso de ScrollView para garantir que todo o conteúdo seja visível (Requisito: ScrollView)
        <ScrollView style={styles.container}> 
            <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
            
            <View style={styles.content}>
                <Text style={styles.title}>{meal.strMeal}</Text>
                
                <View style={styles.tagContainer}>
                    <Text style={styles.tag}>{meal.strCategory}</Text>
                    <Text style={styles.tag}>{meal.strArea}</Text>
                </View>

                {/* Seção de Ingredientes */}
                <Text style={styles.subTitle}>Ingredientes</Text>
                {ingredientsList.map((ing, index) => (
                    <Text key={index} style={styles.listItem}>
                        • **{ing.measure}** {ing.name}
                    </Text>
                ))}

                {/* Seção de Instruções */}
                <Text style={styles.subTitle}>Instruções</Text>
                <Text style={styles.instructions}>{meal.strInstructions}</Text>

                {/* Link para o vídeo no YouTube (Exemplo de Detalhe Avançado) */}
                {meal.strYoutube && (
                    <Text style={styles.youtubeLink} onPress={() => Alert.alert("Abrir Link", "Abrir link do YouTube não implementado neste código de exemplo.")}>
                        ▶ Ver Vídeo no YouTube
                    </Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    feedbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    tagContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tag: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginRight: 10,
        fontSize: 12,
        color: '#555',
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#FF6347', // Cor de destaque para títulos
    },
    listItem: {
        fontSize: 16,
        marginBottom: 5,
    },
    instructions: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify',
    },
    youtubeLink: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 20,
        fontSize: 16,
    }
});

export default DetailsScreen;