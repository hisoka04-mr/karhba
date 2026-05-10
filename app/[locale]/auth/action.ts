"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function login(formData: FormData, locale: string) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error, data: signInData } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (signInData?.user) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, driving_experience, age")
      .eq("id", signInData.user.id)
      .single();

    // Only redirect to complete-profile if the query succeeded but data is missing.
    // If the query failed (e.g. RLS error), skip the check and let the user through.
    const meta = signInData.user.user_metadata;
    const profileComplete = profile
      ? (profile.full_name && profile.driving_experience && profile.age)
      : (meta?.full_name && meta?.driving_experience && meta?.age);

    if (!profileError && !profileComplete) {
      redirect(`/${locale}/auth/complete-profile`);
    }
  }

  redirect(`/${locale}/cars`);
}

export async function register(formData: FormData, locale: string) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Redirect to the profile completion page
  redirect(`/${locale}/auth/complete-profile`);
}

export async function completeProfile(formData: FormData, locale: string) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const drivingExperience = formData.get("drivingExperience") as string;
  const age = formData.get("age") as string;
  const avatarFile = formData.get("avatar") as File;

  // Update user metadata
  await supabase.auth.updateUser({
    data: {
      phone,
      is_owner: role === "owner",
      driving_experience: drivingExperience,
      age: age ? parseInt(age, 10) : null,
    },
  });

  // Update profiles table
  const profileUpdate: Record<string, unknown> = {
    phone,
    is_owner: role === "owner",
    driving_experience: drivingExperience,
    age: age ? parseInt(age, 10) : null,
  };

  // Handle avatar upload
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, { upsert: true });

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      profileUpdate.avatar_url = publicUrl;
    }
  }

  await supabase
    .from('profiles')
    .update(profileUpdate)
    .eq('id', user.id);

  redirect(`/${locale}/cars`);
}

export async function signInWithGoogle(locale: string) {
  const supabase = createClient();
  const headersList = headers();
  const origin = headersList.get("origin") || headersList.get("x-forwarded-host") || "";
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const siteUrl = origin.startsWith("http") ? origin : `${protocol}://${origin}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `http://localhost:3000/${locale}/auth/callback?next=/${locale}/auth/complete-profile`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.url) {
    redirect(data.url);
  }

  return { error: "Something went wrong" };
}

export async function logout(locale: string) {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}
