import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://icabuvjbzdfcfbeujrkn.supabase.co";
const supabaseKey = "sb_publishable_21hicqB_Y9xnxONFksghcA_E1TPNgWl";
export const supabase = createClient(supabaseUrl, supabaseKey);
