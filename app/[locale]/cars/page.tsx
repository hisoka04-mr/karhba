import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import CarsContent from "./CarsContent";

export default async function CarsListingPage() {
  const supabase = createClient();
  const t = await getTranslations("Cars");

  const { data: cars, error } = await supabase
    .from("cars")
    .select("*")
    .or("is_hidden.eq.false,is_hidden.is.null")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cars:", error);
  }

  console.log(`[CarsListingPage] Fetched ${cars?.length ?? 0} cars`);

  return <CarsContent cars={cars || []} />;
}
