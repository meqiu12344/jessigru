"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { EventForm, type EventFormState } from "@/components/events/event-form";
import {
  createTimelineEvent,
  isCloudinaryConfigured,
  isFirebaseConfigured,
} from "@/lib/timeline";

const initialFormState: EventFormState = {
  date: "",
  title: "",
  description: "",
  image: "",
};

export default function AddEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<EventFormState>(initialFormState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedFile(file);
    setSubmitError("");

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setFormData((prev) => ({ ...prev, image: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setSubmitError("Dodaj zdjęcie, aby zapisać wydarzenie.");
      return;
    }

    setIsSaving(true);
    setSubmitError("");

    try {
      await createTimelineEvent({
        date: formData.date,
        title: formData.title,
        description: formData.description,
        imageFile: selectedFile,
      });
      setIsSaving(false);
      router.push("/");
    } catch (error) {
      setIsSaving(false);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Nie udało się zapisać wydarzenia. Sprawdź konfigurację Firebase i Cloudinary.",
      );
    }
  };

  return (
    <div className="romance-background min-h-screen">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 md:px-10 md:py-14">
        <section className="glass-panel p-8 md:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-rose-500/80 uppercase">
                Nowe wspomnienie
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-800 md:text-4xl">
                Uwiecznij ten moment
              </h1>
            </div>
            <Link
              href="/"
              className="rounded-xl border border-white/80 bg-white/50 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-white/80"
            >
              Wróć
            </Link>
          </div>

            <EventForm
              formData={formData}
              selectedFile={selectedFile}
              isSaving={isSaving}
              submitError={submitError}
              onInputChange={handleInputChange}
              onImageChange={handleImageChange}
              onSubmit={handleSubmit}
            />

          {!isFirebaseConfigured ? (
            <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-700">
              Brak konfiguracji Firebase — aplikacja nie zapisze danych wydarzenia.
            </p>
          ) : null}

          {!isCloudinaryConfigured ? (
            <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-700">
              Brak konfiguracji Cloudinary — aplikacja nie prześle zdjęcia.
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
