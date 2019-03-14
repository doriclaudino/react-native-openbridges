import { RNFirebase } from "react-native-firebase";
import { ButtonProps } from "react-native-paper";

export interface FacebookLoginProps extends ButtonProps {
    linkAccounts?: boolean
    onSuccess?: (credential: RNFirebase.UserCredential) => void
    onError?: (error: any) => void
}
