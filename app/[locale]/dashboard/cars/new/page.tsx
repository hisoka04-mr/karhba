"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Upload, DollarSign, MapPin, Info, EyeOff, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function UploadCarPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      let photoUrl = "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800"; // default

      // Upload photo if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cars')
          .upload(filePath, selectedFile);

        if (uploadError) {
          throw new Error(t("photoUploadFailed").replace('{error}', uploadError.message));
        }

        const { data: { publicUrl } } = supabase.storage
          .from('cars')
          .getPublicUrl(filePath);
          
        photoUrl = publicUrl;
      }

      const carData = {
        owner_id: user.id,
        brand: formData.get("brand"),
        model: formData.get("model"),
        year: parseInt(formData.get("year") as string),
        category: formData.get("category") || "economy",
        city: formData.get("city"),
        address: formData.get("address"),
        hide_address: formData.get("hide_address") === "on",
        price_per_day: parseFloat(formData.get("price") as string),
        fuel_type: formData.get("fuel_type") || "essence",
        transmission: formData.get("transmission") || "manual",
        seats: parseInt(formData.get("seats") as string) || 5,
        description: formData.get("description"),
        photos: [photoUrl],
        features: []
      };

      const { error } = await supabase.from("cars").insert([carData]);

      if (error) throw error;

      toast.success(t("carUploadedSuccess"));
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t("carUploadFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Upload className="w-8 h-8 text-primary" />
          {t("listYourCar")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("fillDetails")}</p>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" /> {t("carPhoto")}
            </label>
            <div className="flex items-center gap-6">
              <div 
                className="w-32 h-32 rounded-2xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Car preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                    <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">{t("upload")}</span>
                  </>
                )}
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoChange}
                />
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                {t("uploadPhotoDesc")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" /> {t("brand")}
              </label>
              <input required name="brand" type="text" placeholder={t("egBrand")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-white/30 transition-all" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" /> {t("model")}
              </label>
              <input required name="model" type="text" placeholder={t("egModel")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-white/30 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" /> {t("pricePerDay")}
              </label>
              <input required name="price" type="number" min="10" placeholder={t("egPrice")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-white/30 transition-all" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> {t("city")}
              </label>
              <input required name="city" type="text" placeholder={t("egCity")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-white/30 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> {t("exactAddress")}
            </label>
            <input required name="address" type="text" placeholder={t("egAddress")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-white/30 transition-all" />
            
            <label className="flex items-center gap-3 mt-3 cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" name="hide_address" className="peer sr-only" />
                <div className="w-6 h-6 rounded-md bg-white/5 border border-white/20 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                  <EyeOff className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{t("hideAddress")}</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> {t("seats")}
              </label>
              <input required name="seats" type="number" min="2" max="15" defaultValue="5" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">{t("year")}</label>
              <input required name="year" type="number" min="2000" max={new Date().getFullYear()} placeholder="2021" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">{t("transmission")}</label>
              <select name="transmission" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all [&>option]:bg-zinc-900">
                <option value="manual">{t("manual")}</option>
                <option value="automatic">{t("automatic")}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">{t("fuelType")}</label>
              <select name="fuel_type" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all [&>option]:bg-zinc-900">
                <option value="essence">{t("essence")}</option>
                <option value="diesel">{t("diesel")}</option>
                <option value="hybrid">{t("hybrid")}</option>
                <option value="electric">{t("electric")}</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" /> {t("description")}
            </label>
            <textarea required name="description" rows={4} placeholder={t("describeCar")} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-white/30 transition-all resize-none"></textarea>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-base font-bold text-white bg-primary rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("publishing") : t("publishListing")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
