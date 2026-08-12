import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../service/supabase";

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (!error && data) {
        setProfile(data);
      } else {
        // Fallback to user metadata if DB record is pending or empty
        setProfile({
          id: currentUser.id,
          email: currentUser.email,
          role: currentUser.user_metadata?.role || "student",
          full_name: currentUser.user_metadata?.full_name || "",
          matric_number: currentUser.user_metadata?.matric_number || "",
        });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setProfile({
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.user_metadata?.role || "student",
        full_name: currentUser.user_metadata?.full_name || "",
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    // get current session
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) {
        fetchProfile(sessionUser).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        if (sessionUser) {
          await fetchProfile(sessionUser);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      if (listener && listener.subscription)
        listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const role = profile?.role || user?.user_metadata?.role || "student";

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
