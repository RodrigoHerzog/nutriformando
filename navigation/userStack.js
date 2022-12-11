import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home";

import Scan from "../screens/Scan";
import ScanProductInfo from "../screens/ScanProductInfo";

import Perfil from "../screens/Perfil";
import Contact from "../screens/Contact";

import MenuClient from "../screens/MenuClient";
import MenuEmployee from "../screens/MenuEmployee";
import MenuProduct from "../screens/MenuProduct";
import MenuNutRelevance from "../screens/MenuNutRelevance";
import MenuAdvertising from "../screens/MenuAdvertising";

import { BuyPremium } from "../screens/BuyPremium";
import { CreateUserInformation } from "../screens/CreateUserInformation";
import { CreatePremiumUserInformation } from "../screens/CreatePremiumUserInformation";

import CreateIngredient from "../screens/CreateIngredient";
import CreateNutriInfo from "../screens/CreateNutriInfo";
import CreateProduct from "../screens/CreateProduct";
import CreateEmployee from "../screens/CreateEmployee";
import CreateClient from "../screens/CreateClient";
import CreateNutRelevance from "../screens/CreateNutRelevance";
import CreateAdvertising from "../screens/CreateAdvertising";

import ListIngredients from "../screens/ListIngredient";
import ListNutriInfos from "../screens/ListNutriInfos";
import ListProducts from "../screens/ListProducts";
import ListEmployee from "../screens/ListEmployee";
import ListClient from "../screens/ListClient";
import ListNutRelevance from "../screens/ListNutRelevance";
import ListAdvertising from "../screens/ListAdvertising";

import EditIngredient from "../screens/EditIngredient";
import EditNutriInfo from "../screens/EditNutriInfo";
import EditProduct from "../screens/EditProduct";
import EditNutRelevance from "../screens/EditNutRelevance";

const { Navigator, Screen } = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="Home" component={Home} />

      <Screen name="Scan" component={Scan} />
      <Screen name="ScanProductInfo" component={ScanProductInfo} />

      <Screen name="Perfil" component={Perfil} />
      <Screen name="Contact" component={Contact} />

      <Screen name="Menu Product" component={MenuProduct} />
      <Screen name="Menu Employee" component={MenuEmployee} />
      <Screen name="Menu Client" component={MenuClient} />
      <Screen name="Menu NutRelevance" component={MenuNutRelevance} />
      <Screen name="Menu Advertising" component={MenuAdvertising} />

      <Screen name="Buy Premium" component={BuyPremium} />
      <Screen name="Create User Info" component={CreateUserInformation} />
      <Screen
        name="Create Premium User Info"
        component={CreatePremiumUserInformation}
      />

      <Screen name="Create Ingredient" component={CreateIngredient} />
      <Screen name="Create NutriInfo" component={CreateNutriInfo} />
      <Screen name="Create Product" component={CreateProduct} />
      <Screen name="Create Employee" component={CreateEmployee} />
      <Screen name="Create Client" component={CreateClient} />
      <Screen name="Create NutRelevance" component={CreateNutRelevance} />
      <Screen name="Create Advertising" component={CreateAdvertising} />

      <Screen name="List Ingredients" component={ListIngredients} />
      <Screen name="List NutriInfos" component={ListNutriInfos} />
      <Screen name="List Products" component={ListProducts} />
      <Screen name="List Employee" component={ListEmployee} />
      <Screen name="List Client" component={ListClient} />
      <Screen name="List NutRelevance" component={ListNutRelevance} />
      <Screen name="List Advertising" component={ListAdvertising} />

      <Screen name="Edit Ingredient" component={EditIngredient} />
      <Screen name="Edit NutriInfo" component={EditNutriInfo} />
      <Screen name="Edit Product" component={EditProduct} />
      <Screen name="Edit NutRelevance" component={EditNutRelevance} />
    </Navigator>
  );
}
