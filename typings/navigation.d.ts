import { RNFirebase } from "react-native-firebase";
import { ButtonProps } from "react-native-paper";

interface ScreenProps {
    linkAccounts?: boolean,
    title?: string,
    onError?: (error: any) => void
    onSuccess?: (ok: any) => void
}

interface SignInScreenProps extends ScreenProps {
    onSuccess?: (credential: RNFirebase.UserCredential) => void
}

interface SignInButtonProps extends ScreenProps, ButtonProps {
    onSuccess?: (credential: RNFirebase.UserCredential) => void
}