import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  db,
  googleProvider,
  isFirebaseConfigured,
} from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

const AuthContext = createContext({
  currentUser: null,
  userProfile: null,
  loading: true,
  isConfigured: false,
  signupCustomerWithEmail: async () => {},
  signupContractorWithEmail: async () => {},
  loginWithEmail: async () => {},
  loginWithGoogle: async () => {},
  completeProfile: async () => {},
  logout: async () => {},
  updateContractorProfile: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synchronize Firestore user profile whenever Firebase Auth user changes
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Real-time listener on users/{uid}
        const userDocRef = doc(db, "users", user.uid);
        unsubscribeProfile = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data());
            } else {
              setUserProfile(null);
            }
            setLoading(false);
          },
          (err) => {
            console.error("[GRUHAM Auth] Error fetching user profile:", err);
            setLoading(false);
          }
        );
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  // 1. Email Signup for Customer
  const signupCustomerWithEmail = async ({ email, password, name, phone }) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase is not configured. Please add your credentials to .env.");
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const profileData = {
      uid,
      email,
      name,
      phone: phone || "",
      role: "customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", uid), profileData);
    setUserProfile(profileData);
    return profileData;
  };

  // 2. Email Signup for Contractor
  const signupContractorWithEmail = async (contractorData) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase is not configured. Please add your credentials to .env.");
    }
    const { email, password, name, phone, city, area, experience, specialization, specializations, bio, price_range } = contractorData;
    
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const userProfileData = {
      uid,
      email,
      name,
      phone: phone || "",
      role: "contractor",
      city: city || "",
      area: area || "",
      experience: Number(experience) || 0,
      specialization: specialization || "Civil Construction",
      specializations: specializations || [specialization || "Civil Construction"],
      bio: bio || "",
      price_range: price_range || "standard",
      verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to private users collection
    await setDoc(doc(db, "users", uid), userProfileData);

    // Save public directory entry to contractors collection
    const contractorPublicData = {
      id: uid,
      uid,
      name,
      email,
      phone: phone || "",
      city: city || "",
      area: area || "",
      experience: Number(experience) || 0,
      experience_years: Number(experience) || 0,
      specialization: specialization || "Civil Construction",
      specializations: specializations || [specialization || "Civil Construction"],
      rating: 5.0,
      projects: 0,
      completed_projects: 0,
      total_reviews: 0,
      verified: true,
      profile_type: "verified_contractor",
      bio: bio || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await setDoc(doc(db, "contractors", uid), contractorPublicData);
    setUserProfile(userProfileData);
    return userProfileData;
  };

  // 3. Login with Email & Password
  const loginWithEmail = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase is not configured. Please add your credentials to .env.");
    }
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // Fetch user role from Firestore
    const userSnap = await getDoc(doc(db, "users", uid));
    if (userSnap.exists()) {
      const data = userSnap.data();
      setUserProfile(data);
      return data;
    }
    return null;
  };

  // 4. Google Sign-In with Role Handling
  const loginWithGoogle = async (intendedRole = "customer") => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase is not configured. Please add your credentials to .env.");
    }

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const uid = user.uid;

    // Check if user already exists in Firestore
    const userDocRef = doc(db, "users", uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      // Returning user - maintain existing role and profile
      const data = userSnap.data();
      setUserProfile(data);
      return { isNewUser: false, profile: data };
    } else {
      // First-time Google user - create document with the pre-selected role
      const isContractor = intendedRole === "contractor";
      const newProfile = {
        uid,
        email: user.email || "",
        name: user.displayName || "User",
        photoURL: user.photoURL || "",
        phone: user.phoneNumber || "",
        role: intendedRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        needsProfileCompletion: true,
      };

      await setDoc(userDocRef, newProfile);

      if (isContractor) {
        // Create initial contractor public entry
        await setDoc(doc(db, "contractors", uid), {
          id: uid,
          uid,
          name: user.displayName || "Contractor",
          email: user.email || "",
          phone: user.phoneNumber || "",
          rating: 5.0,
          verified: true,
          profile_type: "verified_contractor",
          created_at: new Date().toISOString(),
        });
      }

      setUserProfile(newProfile);
      return { isNewUser: true, profile: newProfile };
    }
  };

  // 5. Complete Profile Step for Google First-Time Users
  const completeProfile = async (additionalData) => {
    if (!currentUser || !db) return;
    const uid = currentUser.uid;
    const userDocRef = doc(db, "users", uid);

    const updated = {
      ...additionalData,
      needsProfileCompletion: false,
      updated_at: new Date().toISOString(),
    };

    await updateDoc(userDocRef, updated);

    if (userProfile?.role === "contractor") {
      const contractorDocRef = doc(db, "contractors", uid);
      await updateDoc(contractorDocRef, {
        city: additionalData.city || "",
        area: additionalData.area || "",
        experience: Number(additionalData.experience) || 0,
        specialization: additionalData.specialization || "Civil Construction",
        phone: additionalData.phone || "",
        bio: additionalData.bio || "",
      });
    }

    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // 6. Update Contractor Profile
  const updateContractorProfile = async (data) => {
    if (!currentUser || !db) return;
    const uid = currentUser.uid;

    await updateDoc(doc(db, "users", uid), {
      ...data,
      updated_at: new Date().toISOString(),
    });

    await updateDoc(doc(db, "contractors", uid), {
      ...data,
      updated_at: new Date().toISOString(),
    });

    setUserProfile((prev) => ({ ...prev, ...data }));
  };

  // 7. Logout
  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    isConfigured: isFirebaseConfigured,
    signupCustomerWithEmail,
    signupContractorWithEmail,
    loginWithEmail,
    loginWithGoogle,
    completeProfile,
    logout,
    updateContractorProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
