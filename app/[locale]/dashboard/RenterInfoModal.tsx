"use client"

import { X, User, Phone, Target, Shield, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface RenterInfoModalProps {
  renter: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function RenterInfoModal({ renter, isOpen, onClose }: RenterInfoModalProps) {
  const t = useTranslations("Dashboard");

  if (!isOpen || !renter) return null;

  const renterName = renter.full_name || "User";
  const avatarUrl = renter.avatar_url;
  const experience = renter.driving_experience;
  const purpose = renter.renting_purpose;
  const age = renter.age;
  const phone = renter.phone;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-zinc-900/90 border border-white/10 rounded-[2rem] shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header / Cover */}
        <div className="h-32 bg-gradient-to-br from-primary/40 to-primary/5 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative">
              {avatarUrl ? (
                <div className="w-24 h-24 rounded-2xl relative overflow-hidden border-4 border-zinc-900 shadow-xl bg-zinc-800">
                  <Image src={avatarUrl} alt={renterName} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl border-4 border-zinc-900 shadow-xl bg-primary/20 flex items-center justify-center text-primary">
                  <User className="w-12 h-12" />
                </div>
              )}
              {/* Status indicator */}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-4 border-zinc-900 rounded-full"></div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{renterName}</h2>
            <p className="text-sm font-semibold text-primary/80 mt-1 uppercase tracking-widest">Renter Profile</p>
          </div>

          <div className="mt-8 space-y-4">
            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              {age && (
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-white/40">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Age</span>
                  </div>
                  <p className="font-bold text-white text-lg">{age} <span className="text-sm text-white/60 font-medium">years</span></p>
                </div>
              )}
              
              {experience && (
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-white/40">
                    <Shield className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Experience</span>
                  </div>
                  <p className="font-bold text-white text-lg">{experience} <span className="text-sm text-white/60 font-medium">years</span></p>
                </div>
              )}
            </div>

            {phone && (
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group cursor-default hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-0.5">Phone Number</p>
                    <p className="font-bold text-white tracking-wide">{phone}</p>
                  </div>
                </div>
                <a 
                  href={`tel:${phone}`}
                  className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Call
                </a>
              </div>
            )}

            {purpose && (
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-white/40 mb-2">
                  <Target className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Renting Purpose</span>
                </div>
                <p className="font-bold text-white">{purpose}</p>
              </div>
            )}
            
            {(!age && !experience && !phone && !purpose) && (
              <div className="text-center py-6 text-white/40 text-sm">
                No additional profile information available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
