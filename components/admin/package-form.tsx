"use client";

import { useActionState } from "react";
import { createPackageAction, updatePackageAction, type PackageFormState } from "@/lib/actions/admin-packages";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form-field";

type PackageFormRecord = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  durationDays: number;
  priceMinor: number;
  currency: string;
  compareAtPriceMinor: number | null;
  gatewayProvider: string;
  gatewayPriceRef: string | null;
  grantsTelegramAccess: boolean;
  isFeatured: boolean;
  sortOrder: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  features: string[];
};

type PackageFormProps = {
  mode: "create" | "edit";
  activePaymentProvider: string;
  packageRecord?: PackageFormRecord;
};

const initialState: PackageFormState = { ok: false, message: "" };

function minorToMajor(value?: number | null) {
  if (!value) return "";
  return (value / 100).toFixed(2);
}

function fieldError(state: PackageFormState, field: string) {
  const message = state.fieldErrors?.[field]?.[0];
  if (!message) return null;
  return <p className="text-xs font-semibold text-[var(--error)]">{message}</p>;
}

export function PackageForm({ activePaymentProvider, mode, packageRecord }: PackageFormProps) {
  const action = mode === "create" ? createPackageAction : updatePackageAction.bind(null, packageRecord?.id ?? "");
  const [state, formAction, pending] = useActionState(action, initialState);
  const title = mode === "create" ? "Create package" : "Edit package";

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-black">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Manage pricing, duration, checkout provider, visibility, Telegram access, and public package benefits.
          </p>
        </div>
        <ButtonLink href="/admin/packages" variant="secondary">
          Back
        </ButtonLink>
      </div>

      <form action={formAction} className="mt-8 grid gap-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <Field>
            Package name
            <Input defaultValue={packageRecord?.name} name="name" required />
            {fieldError(state, "name")}
          </Field>
          <Field>
            Slug
            <Input defaultValue={packageRecord?.slug} name="slug" placeholder="professional" required />
            {fieldError(state, "slug")}
          </Field>
        </div>

        <Field>
          Summary
          <Input defaultValue={packageRecord?.summary} maxLength={500} name="summary" required />
          {fieldError(state, "summary")}
        </Field>

        <Field>
          Description
          <Textarea defaultValue={packageRecord?.description} name="description" required />
          {fieldError(state, "description")}
        </Field>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Field>
            Price
            <Input defaultValue={minorToMajor(packageRecord?.priceMinor)} min="0" name="priceMajor" required step="0.01" type="number" />
            {fieldError(state, "priceMajor")}
          </Field>
          <Field>
            Compare-at price
            <Input defaultValue={minorToMajor(packageRecord?.compareAtPriceMinor)} min="0" name="compareAtPriceMajor" step="0.01" type="number" />
            {fieldError(state, "compareAtPriceMajor")}
          </Field>
          <Field>
            Currency
            <Input defaultValue={packageRecord?.currency ?? "AED"} maxLength={3} name="currency" required />
            {fieldError(state, "currency")}
          </Field>
          <Field>
            Duration days
            <Input defaultValue={packageRecord?.durationDays ?? 30} min="1" name="durationDays" required type="number" />
            {fieldError(state, "durationDays")}
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Field>
            Status
            <Select defaultValue={packageRecord?.status ?? "DRAFT"} name="status" required>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
            {fieldError(state, "status")}
          </Field>
          <Field>
            Sort order
            <Input defaultValue={packageRecord?.sortOrder ?? 0} min="0" name="sortOrder" required type="number" />
            {fieldError(state, "sortOrder")}
          </Field>
          <Field>
            Gateway provider
            <Select defaultValue={packageRecord?.gatewayProvider ?? activePaymentProvider} name="gatewayProvider" required>
              <option value="ziina">Ziina</option>
              <option value="razorpay">Razorpay</option>
              <option value="mock">Mock</option>
            </Select>
            {fieldError(state, "gatewayProvider")}
          </Field>
          <Field>
            Gateway price ref
            <Input defaultValue={packageRecord?.gatewayPriceRef ?? ""} name="gatewayPriceRef" placeholder="Optional" />
            {fieldError(state, "gatewayPriceRef")}
          </Field>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="line-tile flex items-start gap-3 p-4 text-sm font-semibold text-[var(--muted)]">
            <input defaultChecked={packageRecord?.isFeatured ?? false} className="mt-1" name="isFeatured" type="checkbox" />
            <span>
              <span className="block font-black text-[var(--text)]">Featured package</span>
              Highlight this package in the public program grid.
            </span>
          </label>
          <label className="line-tile flex items-start gap-3 p-4 text-sm font-semibold text-[var(--muted)]">
            <input defaultChecked={packageRecord?.grantsTelegramAccess ?? true} className="mt-1" name="grantsTelegramAccess" type="checkbox" />
            <span>
              <span className="block font-black text-[var(--text)]">Telegram access</span>
              Successful payments create premium Telegram eligibility.
            </span>
          </label>
        </div>

        <Field>
          Features
          <Textarea
            defaultValue={packageRecord?.features.join("\n") ?? ""}
            name="features"
            placeholder="One package benefit per line"
            required
          />
          {fieldError(state, "features")}
        </Field>

        {state.message ? (
          <p aria-live="polite" className={state.ok ? "text-sm text-[var(--success)]" : "text-sm text-[var(--error)]"}>
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button disabled={pending} type="submit">
            {pending ? "Saving..." : "Save Package"}
          </Button>
          <ButtonLink href="/admin/packages" variant="ghost">
            Cancel
          </ButtonLink>
        </div>
      </form>
    </Card>
  );
}
