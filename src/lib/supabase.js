import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);

if (!supabaseUrl) {
  console.error("VITE_SUPABASE_URL belum diisi");
}

if (!supabaseAnonKey) {
  console.error("VITE_SUPABASE_ANON_KEY belum diisi");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export const getNextId = async (tableName, idColumnName) => {
  const { data, error } = await supabase
    .from(tableName)
    .select(idColumnName)
    .order(idColumnName, { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error(`Error fetching max id for ${tableName}:`, error.message);
    return Math.floor(Math.random() * 100000) + 10000;
  }
  if (!data) {
    return 1;
  }
  return Number(data[idColumnName]) + 1;
};