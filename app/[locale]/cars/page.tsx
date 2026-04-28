import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import CarsContent from "./CarsContent";

export default async function CarsListingPage() {
  const supabase = createClient();
  const t = await getTranslations("Cars");

  const { data: cars, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cars:", error);
  }

  return <CarsContent cars={cars || []} />;
}
