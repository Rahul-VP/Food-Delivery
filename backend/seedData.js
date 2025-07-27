import mongoose from 'mongoose';
import foodModel from './models/foodModel.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleFoodData = [
    // Salad Category
    {
        name: "Greek salad",
        description: "Fresh and healthy Greek salad with olives and feta cheese",
        price: 12,
        category: "Salad",
        image: "food_1.png"
    },
    {
        name: "Veg salad",
        description: "Delicious vegetable salad with fresh greens",
        price: 18,
        category: "Salad",
        image: "food_2.png"
    },
    {
        name: "Clover Salad",
        description: "Fresh clover salad with mixed vegetables",
        price: 16,
        category: "Salad",
        image: "food_3.png"
    },
    {
        name: "Chicken Salad",
        description: "Protein-rich chicken salad with fresh vegetables",
        price: 24,
        category: "Salad",
        image: "food_4.png"
    },
    
    // Rolls Category
    {
        name: "Lasagna Rolls",
        description: "Delicious lasagna rolls with rich tomato sauce",
        price: 14,
        category: "Rolls",
        image: "food_5.png"
    },
    {
        name: "Peri Peri Rolls",
        description: "Spicy peri peri rolls with tangy sauce",
        price: 12,
        category: "Rolls",
        image: "food_6.png"
    },
    {
        name: "Chicken Rolls",
        description: "Tasty chicken rolls with special sauce",
        price: 20,
        category: "Rolls",
        image: "food_7.png"
    },
    {
        name: "Veg Rolls",
        description: "Healthy vegetable rolls with fresh ingredients",
        price: 15,
        category: "Rolls",
        image: "food_8.png"
    },
    
    // Deserts Category
    {
        name: "Ripple Ice Cream",
        description: "Delicious ripple ice cream with chocolate swirls",
        price: 14,
        category: "Deserts",
        image: "food_9.png"
    },
    {
        name: "Fruit Ice Cream",
        description: "Fresh fruit ice cream with real fruit pieces",
        price: 22,
        category: "Deserts",
        image: "food_10.png"
    },
    {
        name: "Jar Ice Cream",
        description: "Creamy ice cream served in a jar",
        price: 10,
        category: "Deserts",
        image: "food_11.png"
    },
    {
        name: "Vanilla Ice Cream",
        description: "Creamy vanilla ice cream dessert",
        price: 12,
        category: "Deserts",
        image: "food_12.png"
    },
    
    // Sandwich Category
    {
        name: "Chicken Sandwich",
        description: "Delicious chicken sandwich with fresh bread",
        price: 12,
        category: "Sandwich",
        image: "food_13.png"
    },
    {
        name: "Vegan Sandwich",
        description: "Healthy vegan sandwich with plant-based ingredients",
        price: 18,
        category: "Sandwich",
        image: "food_14.png"
    },
    {
        name: "Grilled Sandwich",
        description: "Perfectly grilled sandwich with melted cheese",
        price: 16,
        category: "Sandwich",
        image: "food_15.png"
    },
    {
        name: "Bread Sandwich",
        description: "Classic bread sandwich with fresh fillings",
        price: 24,
        category: "Sandwich",
        image: "food_16.png"
    },
    
    // Cake Category
    {
        name: "Cup Cake",
        description: "Sweet and fluffy cup cake",
        price: 14,
        category: "Cake",
        image: "food_17.png"
    },
    {
        name: "Vegan Cake",
        description: "Delicious vegan cake for everyone",
        price: 12,
        category: "Cake",
        image: "food_18.png"
    },
    
    // Pure Veg Category
    {
        name: "Veg Pasta",
        description: "Fresh vegetable pasta with rich tomato sauce",
        price: 16,
        category: "Pure Veg",
        image: "food_19.png"
    },
    {
        name: "Veg Noodles",
        description: "Stir-fried vegetable noodles with soy sauce",
        price: 14,
        category: "Pure Veg",
        image: "food_20.png"
    },
    {
        name: "Veg Curry",
        description: "Spicy vegetable curry with aromatic spices",
        price: 18,
        category: "Pure Veg",
        image: "food_21.png"
    },
    {
        name: "Veg Biryani",
        description: "Fragrant vegetable biryani with basmati rice",
        price: 22,
        category: "Pure Veg",
        image: "food_22.png"
    },
    
    // Pasta Category
    {
        name: "Spaghetti Carbonara",
        description: "Classic spaghetti carbonara with creamy sauce",
        price: 20,
        category: "Pasta",
        image: "food_23.png"
    },
    {
        name: "Penne Arrabbiata",
        description: "Spicy penne arrabbiata with tomato sauce",
        price: 18,
        category: "Pasta",
        image: "food_24.png"
    },
    {
        name: "Fettuccine Alfredo",
        description: "Creamy fettuccine alfredo with parmesan cheese",
        price: 24,
        category: "Pasta",
        image: "food_25.png"
    },
    {
        name: "Mac and Cheese",
        description: "Classic mac and cheese with melted cheddar",
        price: 16,
        category: "Pasta",
        image: "food_26.png"
    },
    
    // Noodles Category
    {
        name: "Chicken Noodles",
        description: "Stir-fried chicken noodles with vegetables",
        price: 18,
        category: "Noodles",
        image: "food_27.png"
    },
    {
        name: "Beef Noodles",
        description: "Savory beef noodles with rich broth",
        price: 22,
        category: "Noodles",
        image: "food_28.png"
    },
    {
        name: "Shrimp Noodles",
        description: "Fresh shrimp noodles with garlic sauce",
        price: 26,
        category: "Noodles",
        image: "food_29.png"
    },
    {
        name: "Veg Noodles",
        description: "Healthy vegetable noodles with soy sauce",
        price: 14,
        category: "Noodles",
        image: "food_30.png"
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing food data
        await foodModel.deleteMany({});
        console.log('🗑️ Cleared existing food data');

        // Insert sample food data
        const result = await foodModel.insertMany(sampleFoodData);
        console.log(`✅ Added ${result.length} food items to database`);

        console.log('🎉 Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase(); 