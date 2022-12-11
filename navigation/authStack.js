import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "../screens/Welcome";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";

const { Navigator, Screen } = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="Welcome" component={Welcome} />
      <Screen name="Sign In" component={SignIn} />
      <Screen name="Sign Up" component={SignUp} />
    </Navigator>
  );
}
