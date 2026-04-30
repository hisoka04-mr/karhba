"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData, locale: string) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(`/${locale}/cars`);
}

export async function register(formData: FormData, locale: string) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;

  const drivingExperience = formData.get("drivingExperience") as string;
  const rentingPurpose = formData.get("rentingPurpose") as string;
  const avatarFile = formData.get("avatar") as File;

  let avatarUrl = null;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        is_owner: role === "owner",
        driving_experience: drivingExperience,
        renting_purpose: rentingPurpose,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Handle avatar upload if user created
  if (data.user && avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${data.user.id}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update metadata with avatar URL
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      // Update profiles table
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', data.user.id);
    }
  }

  redirect(`/${locale}/cars`);
}

export async function logout(locale: string) {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}
