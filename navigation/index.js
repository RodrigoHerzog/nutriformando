import { useState, useEffect, setState } from "react";

import { NavigationContainer } from "@react-navigation/native";

import Welcome from "../screens/Welcome";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";
import Home from "../screens/Home";

import Scan from "../screens/Scan";
import ScanProductInfo from "../screens/ScanProductInfo";

import Perfil from "../screens/Perfil";
import Contact from "../screens/Contact";

import MenuProduct from "../screens/MenuProduct";
import MenuEmployee from "../screens/MenuEmployee";
import MenuClient from "../screens/MenuClient";
import MenuNutRelevance from "../screens/MenuNutRelevance";
import MenuAdvertising from "../screens/MenuAdvertising";

import BuyPremium from "../screens/BuyPremium";
import CreateUserInformation from "../screens/CreateUserInformation";
import CreatePremiumUserInformation from "../screens/CreatePremiumUserInformation";

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

import { Loading } from "../components/Loading";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import auth from "@react-native-firebase/auth";

const { Navigator, Screen } = createNativeStackNavigator();

export default function RootNavigation() {
  const [loading, setIsLoading] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((response) => {
      setUser(response);
      setIsLoading(false);
    });
    return subscriber;
  }, []);

  if (loading) {
    return <Loading />;
  }

  const authScreens = {
    Welcome: Welcome,
    "Sign In": SignIn,
    "Sign Up": SignUp,
  };

  const homeScreens = {
    Home: Home,

    Scan: Scan,
    ScanProductInfo: ScanProductInfo,

    Perfil: Perfil,
    Contact: Contact,

    "Menu Product": MenuProduct,
    "Menu Client": MenuClient,
    "Menu Employee": MenuEmployee,
    "Menu NutRelevance": MenuNutRelevance,
    "Menu Advertising": MenuAdvertising,

    "Create User Info": CreateUserInformation,
    "Create Premium User Info": CreatePremiumUserInformation,

    "Create Ingredient": CreateIngredient,
    "Create NutriInfo": CreateNutriInfo,
    "Create Product": CreateProduct,
    "Create Employee": CreateEmployee,
    "Create Client": CreateClient,
    "Create NutRelevance": CreateNutRelevance,
    "Create Advertising": CreateAdvertising,

    "List Ingredients": ListIngredients,
    "List NutriInfos": ListNutriInfos,
    "List Products": ListProducts,
    "List Employee": ListEmployee,
    "List Client": ListClient,
    "List NutRelevance": ListNutRelevance,
    "List Advertising": ListAdvertising,

    "Edit Ingredient": EditIngredient,
    "Edit NutriInfo": EditNutriInfo,
    "Edit Product": EditProduct,
    "Edit NutRelevance": EditNutRelevance,

    "Buy Premium": BuyPremium,
  };

  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
        }}
      >
        {Object.entries({
          ...(user ? homeScreens : authScreens),
        }).map(([name, component]) => (
          <Screen key={name} name={name} component={component} />
        ))}
      </Navigator>
    </NavigationContainer>
  );
}
