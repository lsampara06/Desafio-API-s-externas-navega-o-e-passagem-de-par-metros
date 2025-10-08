const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Busca a lista de todas as categorias
export const getCategories = async () => {
    try {
        const response = await fetch(`${BASE_URL}/categories.php`);
        const data = await response.json();
     
        return data.categories || [];
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        throw new Error("Não foi possível carregar as categorias de receitas.");
    }
};


export const getMealDetails = async (mealId) => {
    try {
      
        const response = await fetch(`${BASE_URL}/lookup.php?i=${mealId}`);
        const data = await response.json();
        
        return data.meals ? data.meals[0] : null;
    } catch (error) {
        console.error(`Erro ao buscar detalhes da refeição ${mealId}:`, error);
        throw new Error(`Não foi possível carregar os detalhes da receita.`);
    }
};

export const searchMeals = async (query) => {
    try {
      
        const response = await fetch(`${BASE_URL}/search.php?s=${query}`);
        const data = await response.json();
        
        return data.meals || [];
    } catch (error) {
        console.error(`Erro ao buscar refeições para a query ${query}:`, error);
        throw new Error(`Erro ao buscar receitas. Tente novamente.`);
    }
};
