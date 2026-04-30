"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Camera, Loader2, User } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
}

export default function AvatarUpload({ userId, currentAvatarUrl }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl || null);
  const router = useRouter();
  const supabase = createClient();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) {
        throw updateError;
      }

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (profileError) {
        console.error("Failed to update profile table:", profileError);
      }

      setAvatarUrl(publicUrl);
      toast.success("Profile picture updated successfully!");
      router.refresh(); // Refresh to update Navbar
    } catch (error: any) {
      toast.error(error.message || "Error uploading avatar!");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group cursor-pointer w-24 h-24 rounded-3xl overflow-hidden shadow-lg border border-white/10 bg-secondary/50 flex-shrink-0">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          fill
          className="object-cover transition-transform group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
          <User className="w-10 h-10" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
        {uploading ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <Camera className="w-6 h-6 text-white" />
        )}
      </div>

      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
    </div>
  );
}
