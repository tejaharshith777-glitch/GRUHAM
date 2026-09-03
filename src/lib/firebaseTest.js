import { db, auth, isFirebaseConfigured } from "./firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

/**
 * Utility to verify connection status to Firebase Authentication & Firestore Database.
 */
export async function verifyFirebaseConnection() {
  if (!isFirebaseConfigured) {
    return {
      success: false,
      configured: false,
      message: "Firebase API credentials are missing in .env file.",
    };
  }

  try {
    // Attempt a light read/write test to Firestore under a system health check document
    const testDocRef = doc(db, "_healthcheck", "ping");
    await setDoc(testDocRef, {
      timestamp: new Date().toISOString(),
      status: "ok",
    });
    
    const snapshot = await getDoc(testDocRef);
    const data = snapshot.data();
    
    // Clean up test document
    await deleteDoc(testDocRef);

    return {
      success: true,
      configured: true,
      authAvailable: Boolean(auth),
      firestoreAvailable: Boolean(db),
      readWriteVerified: data?.status === "ok",
      message: "Firebase connected successfully and Firestore read/write verified!",
    };
  } catch (error) {
    console.error("[GRUHAM Firebase] Verification failed:", error);
    return {
      success: false,
      configured: true,
      error: error.message || String(error),
      message: `Firebase configured but connection test failed: ${error.message}`,
    };
  }
}
