type EventFormState = {
  date: string;
  title: string;
  description: string;
  image: string;
};

type EventFormProps = {
  formData: EventFormState;
  selectedFile: File | null;
  isSaving: boolean;
  submitError: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function EventForm({
  formData,
  selectedFile,
  isSaving,
  submitError,
  onInputChange,
  onImageChange,
  onSubmit,
}: EventFormProps) {
  return (
    <form className="event-form-shell mt-8" onSubmit={onSubmit}>
      <label className="field-wrap">
        <span className="field-label">Kiedy się to stało?</span>
        <input
          required
          type="date"
          name="date"
          value={formData.date}
          onChange={onInputChange}
          className="field-input"
        />
      </label>

      <label className="field-wrap">
        <span className="field-label">Jak nazwiesz ten moment?</span>
        <input
          required
          type="text"
          name="title"
          placeholder="Np. Nasza pierwsza podróż, Wieczór w deszczu..."
          value={formData.title}
          onChange={onInputChange}
          className="field-input"
        />
      </label>

      <label className="field-wrap field-wrap-full">
        <span className="field-label">Opowiedz nam historię</span>
        <textarea
          required
          name="description"
          rows={5}
          placeholder="Co czuliśmy? Co zrobiliśmy? Dlaczego to wspomnienie jest dla nas ważne? Niech każdy szczegół żyje w naszej historii..."
          value={formData.description}
          onChange={onInputChange}
          className="field-input field-textarea"
        />
      </label>

      <label className="field-wrap field-wrap-full upload-zone">
        <span className="field-label">Twarz tego wspomnienia</span>
        <input required type="file" accept="image/*" onChange={onImageChange} className="upload-input" />
        <div className="upload-hint">
          <span className="upload-main">Przeciągnij zdjęcie lub kliknij, aby wybrać</span>
          <span className="upload-sub">Zdjęcie to okno do tego magicznego momentu</span>
        </div>
      </label>

      {formData.image ? (
        <div className="field-wrap-full overflow-hidden rounded-3xl border border-white/70 shadow-lg shadow-rose-200/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={formData.image} alt="Podgląd wybranego zdjęcia" className="h-64 w-full object-cover" />
        </div>
      ) : null}

      {selectedFile ? (
        <p className="field-wrap-full text-sm text-zinc-500">Wybrano plik: {selectedFile.name}</p>
      ) : null}

      {submitError ? (
        <p className="field-wrap-full rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
          {submitError}
        </p>
      ) : null}

      <div className="field-wrap-full flex items-center justify-end">
        <button type="submit" disabled={isSaving} className="event-submit-btn">
          {isSaving ? "Uwieczniamy moment..." : "Uwiecznij to wspomnienie"}
        </button>
      </div>
    </form>
  );
}

export type { EventFormState };