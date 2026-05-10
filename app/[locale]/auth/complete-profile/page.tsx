"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Car, User, Phone, Camera, ArrowRight, ArrowLeft, Sparkles, Shield, CheckCircle } from "lucide-react";
import { completeProfile } from "../action";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CompleteProfilePage() {
  const t = useTranslations("Auth");
  const common = useTranslations("Common");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [drivingExperience, setDrivingExperience] = useState("");
  const [age, setAge] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const totalSteps = 3;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit() {
    setLoading(true);
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("role", role);
    formData.append("drivingExperience", drivingExperience);
    formData.append("age", age);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const result = await completeProfile(formData, locale);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  const canProceedStep1 = role !== "";
  const canProceedStep2 = phone.length > 0 && drivingExperience !== "" && age !== "";

  const stepIndicators = [
    { icon: Car, label: t("completeStep1") },
    { icon: User, label: t("completeStep2") },
    { icon: Camera, label: t("completeStep3") },
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 overflow-hidden bg-grid">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] animate-blob-delay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-400/3 rounded-full blur-[160px] animate-pulse-slow" />
      </div>

      {/* Decorative ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full border border-orange-500/5 animate-spin-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
          {/* Shine Effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] -mr-16 -mt-16 rounded-full" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center rounded-2xl shadow-xl shadow-primary/20 mx-auto mb-6">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t("completeProfileTitle")}</h1>
            <p className="text-muted-foreground">{t("completeProfileSubtitle")}</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {stepIndicators.map((s, i) => {
              const StepIcon = s.icon;
              const isActive = step === i + 1;
              const isComplete = step > i + 1;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                        : isComplete
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-white/5 text-muted-foreground border border-white/10"
                    }`}
                  >
                    {isComplete ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={`w-8 h-0.5 rounded transition-all duration-300 ${step > i + 1 ? "bg-green-500/50" : "bg-white/10"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("role")}</label>
                  <div className="flex gap-4">
                    <label className="flex-1 cursor-pointer group">
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={role === "user"}
                        onChange={(e) => setRole(e.target.value)}
                        className="peer sr-only"
                      />
                      <div className={`text-center p-5 rounded-2xl border transition-all ${
                        role === "user"
                          ? "bg-primary/20 border-primary/50 shadow-lg shadow-primary/10"
                          : "border-white/5 bg-secondary/50 hover:border-white/15"
                      }`}>
                        <User className={`w-7 h-7 mx-auto mb-2 ${role === "user" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-semibold block">{t("roleUser")}</span>
                        <span className="text-[10px] text-muted-foreground mt-1 block">{t("roleUserDesc")}</span>
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer group">
                      <input
                        type="radio"
                        name="role"
                        value="owner"
                        checked={role === "owner"}
                        onChange={(e) => setRole(e.target.value)}
                        className="peer sr-only"
                      />
                      <div className={`text-center p-5 rounded-2xl border transition-all ${
                        role === "owner"
                          ? "bg-primary/20 border-primary/50 shadow-lg shadow-primary/10"
                          : "border-white/5 bg-secondary/50 hover:border-white/15"
                      }`}>
                        <Car className={`w-7 h-7 mx-auto mb-2 ${role === "owner" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-semibold block">{t("roleOwner")}</span>
                        <span className="text-[10px] text-muted-foreground mt-1 block">{t("roleOwnerDesc")}</span>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="w-full bg-primary hover:bg-orange-600 text-white font-extrabold py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all text-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {common("next")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("phone")}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="216 XX XXX XXX"
                      className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("drivingExperience")}</label>
                    <div className="relative">
                      <select
                        value={drivingExperience}
                        onChange={(e) => setDrivingExperience(e.target.value)}
                        required
                        className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 px-4 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none appearance-none"
                      >
                        <option value="" disabled>{t("selectExperience")}</option>
                        <option value="<2">{t("expLessThan2")}</option>
                        <option value="2-5">{t("exp2To5")}</option>
                        <option value="5-10">{t("exp5To10")}</option>
                        <option value="10+">{t("expMoreThan10")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("age")}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        min="18"
                        max="100"
                        placeholder="25"
                        className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 px-4 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-5 px-6 rounded-2xl transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="flex-1 bg-primary hover:bg-orange-600 text-white font-extrabold py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all text-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {common("next")}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Avatar Upload */}
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-28 h-28 rounded-full bg-secondary/50 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                  >
                    {avatarPreview ? (
                      <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="text-center transition-transform group-hover:scale-110">
                        <Camera className="w-10 h-10 text-muted-foreground mb-1 mx-auto" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("uploadPhoto")}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-3">{t("uploadProfilePicture")}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{t("photoOptional")}</p>
                </div>

                {/* Summary */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    {t("profileSummary")}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>{t("role")}</span>
                      <span className="text-white font-medium">{role === "owner" ? t("roleOwner") : t("roleUser")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("phone")}</span>
                      <span className="text-white font-medium">{phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("drivingExperience")}</span>
                      <span className="text-white font-medium">{drivingExperience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("age")}</span>
                      <span className="text-white font-medium">{age}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-5 px-6 rounded-2xl transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all text-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? common("loading") : t("completeSetup")}
                    {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
