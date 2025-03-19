/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

interface AuthContextProps {
  currentUser: User | null;
  userRole: "consumer" | "manufacturer" | null;
  loading: boolean;
  register: (
    email: string,
    password: string,
    name: string,
    userType: "consumer" | "manufacturer",
    extraData?: any
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"consumer" | "manufacturer" | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Get user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role as "consumer" | "manufacturer");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register a new user
  async function register(
    email: string,
    password: string,
    name: string,
    userType: "consumer" | "manufacturer",
    extraData?: any
  ) {
    try {
      // Create user with email and password
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name
      await updateProfile(user, {
        displayName: name,
      });

      // Store additional user data in Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        name,
        role: userType,
        createdAt: new Date().toISOString(),
        ...extraData,
      };

      await setDoc(doc(db, "users", user.uid), userData);

      setUserRole(userType);
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  // Login user
  async function login(email: string, password: string) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role as "consumer" | "manufacturer");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // Logout user
  async function logout() {
    try {
      await signOut(auth);
      setUserRole(null);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  const value = {
    currentUser,
    userRole,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
