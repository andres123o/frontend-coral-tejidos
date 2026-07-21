import { createClient } from "@supabase/supabase-js";

// persistSession + storage explícitos (ya son el default de supabase-js, pero
// se dejan a propósito): la sesión de /admin se guarda en localStorage y
// sobrevive a recargar la página o cerrar el navegador, hasta que el token
// expire o se haga logout manual.
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storage: window.localStorage,
    autoRefreshToken: true,
  },
});
