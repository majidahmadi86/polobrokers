"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import { sellMessage, whatsappUrl } from "@/lib/sell-message";

// "Sell to us" form. Client-side only: nothing is sent, fetched or stored. On a valid submit the
// message is built in the page language and WhatsApp opens in a new tab with it prefilled; the
// seller adds photos in the chat. If the browser blocks the new tab, a visible link takes over.

type Field = "name" | "contact" | "department" | "category" | "description";
const ORDER: Field[] = ["name", "contact", "department", "category", "description"];
const DEPARTMENTS = ["men", "women", "children", "mixed"] as const;
const MIN_DESCRIPTION = 10;

const control =
  "block min-h-[44px] w-full rounded-none border border-line bg-warm px-4 py-[10px] font-body text-base text-ink " +
  "focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green aria-[invalid=true]:border-error";

export function SellForm({ dict }: { dict: Dictionary }) {
  const t = dict.sellForm;
  const [values, setValues] = useState<Record<Field, string>>({ name: "", contact: "", department: "", category: "", description: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const refs = useRef<Partial<Record<Field, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>>>({});

  const validate = (v: Record<Field, string>) => {
    const found: Partial<Record<Field, string>> = {};
    if (!v.name.trim()) found.name = t.errors.required;
    if (!v.contact.trim()) found.contact = t.errors.required;
    if (!v.department) found.department = t.errors.choose;
    if (!v.category) found.category = t.errors.choose;
    const description = v.description.trim();
    if (!description) found.description = t.errors.required;
    else if (description.length < MIN_DESCRIPTION) found.description = t.errors.minLength;
    return found;
  };

  const update = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // After a first attempt, errors follow the input so a fixed field clears at once.
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    const first = ORDER.find((field) => found[field]);
    if (first) {
      setFallbackUrl(null);
      // Cleared first so the same summary is announced again on a repeated attempt.
      setSummary("");
      requestAnimationFrame(() => setSummary(t.errors.summary));
      refs.current[first]?.focus();
      return;
    }
    setSummary("");
    const url = whatsappUrl(
      sellMessage(dict, {
        name: values.name,
        contact: values.contact,
        department: t.departments[values.department as (typeof DEPARTMENTS)[number]],
        category: values.category,
        description: values.description,
      }),
    );
    // Opened from the click handler. A blank tab first, so its opener can be cut before it
    // navigates (window.open with "noopener" returns null and would hide a blocked popup).
    const tab = window.open("", "_blank");
    if (!tab) {
      setFallbackUrl(url);
      return;
    }
    tab.opener = null;
    tab.location.href = url;
    setFallbackUrl(null);
  };

  const fieldProps = (field: Field) => ({
    id: `sell-${field}`,
    name: field,
    required: true,
    value: values[field],
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `sell-${field}-error` : undefined,
  });

  const wrap = (field: Field, label: string, input: ReactNode, wide = false) => (
    <div className={`flex flex-col gap-2 ${wide ? "md:col-span-2" : ""}`}>
      <label htmlFor={`sell-${field}`} className="label text-ink">
        {label}
      </label>
      {input}
      {errors[field] && (
        <p id={`sell-${field}-error`} className="text-[.9rem] text-error">
          {errors[field]}
        </p>
      )}
    </div>
  );

  const select = (field: "department" | "category", options: { value: string; label: string }[]) => (
    <div className="relative">
      <select
        {...fieldProps(field)}
        ref={(el) => {
          refs.current[field] = el;
        }}
        onChange={(e) => update(field, e.target.value)}
        className={`${control} cursor-pointer appearance-none pr-11`}
      >
        <option value="">{t.choose}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg aria-hidden="true" viewBox="0 0 12 8" className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 text-green">
        <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="max-w-[860px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {wrap(
          "name",
          t.name,
          <input
            {...fieldProps("name")}
            ref={(el) => {
              refs.current.name = el;
            }}
            type="text"
            autoComplete="name"
            onChange={(e) => update("name", e.target.value)}
            className={control}
          />,
        )}
        {wrap(
          "contact",
          t.contact,
          <input
            {...fieldProps("contact")}
            ref={(el) => {
              refs.current.contact = el;
            }}
            type="text"
            autoComplete="on"
            onChange={(e) => update("contact", e.target.value)}
            className={control}
          />,
        )}
        {wrap(
          "department",
          t.department,
          select(
            "department",
            DEPARTMENTS.map((key) => ({ value: key, label: t.departments[key] })),
          ),
        )}
        {wrap(
          "category",
          t.category,
          select(
            "category",
            t.categories.map((label) => ({ value: label, label })),
          ),
        )}
        {wrap(
          "description",
          t.description,
          <textarea
            {...fieldProps("description")}
            ref={(el) => {
              refs.current.description = el;
            }}
            rows={5}
            minLength={MIN_DESCRIPTION}
            onChange={(e) => update("description", e.target.value)}
            className={`${control} resize-y`}
          />,
          true,
        )}
      </div>

      <p aria-live="assertive" aria-atomic="true" className="mt-6 min-h-[1px] text-[.95rem] text-error">
        {summary}
      </p>

      <div className="mt-6 flex flex-col items-start gap-4">
        <button type="submit" className="btn btn-gold">
          {t.submit}
        </button>
        <p className="max-w-[620px] text-[.95rem]">{t.note}</p>
        {fallbackUrl && (
          <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {t.fallback}
          </a>
        )}
      </div>
    </form>
  );
}
