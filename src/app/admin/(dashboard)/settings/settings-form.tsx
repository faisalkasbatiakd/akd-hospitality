"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { type SettingKey, saveSetting } from "./actions";

export type SettingField = {
  name: string;
  label: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
  /** One item per line, joined for display and split on save. */
  list?: boolean;
  placeholder?: string;
};

export function SettingsForm({
  settingKey,
  title,
  description,
  fields,
  values,
}: {
  settingKey: SettingKey;
  title: string;
  description: string;
  fields: SettingField[];
  values: Record<string, unknown>;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  const initial = (field: SettingField) => {
    const value = values[field.name];
    if (Array.isArray(value)) return value.join("\n");
    return value == null ? "" : String(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            setBusy(true);
            const result = await saveSetting(settingKey, formData);
            setBusy(false);
            if (result.ok) {
              toast.success("Saved");
              startTransition(() => router.refresh());
            } else {
              toast.error(result.error);
            }
          }}
          className="space-y-4"
        >
          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={`${settingKey}-${field.name}`}>
                {field.label}
              </Label>
              {field.multiline || field.list ? (
                <Textarea
                  id={`${settingKey}-${field.name}`}
                  name={field.name}
                  rows={field.rows ?? (field.list ? 3 : 4)}
                  placeholder={field.placeholder}
                  defaultValue={initial(field)}
                />
              ) : (
                <Input
                  id={`${settingKey}-${field.name}`}
                  name={field.name}
                  placeholder={field.placeholder}
                  defaultValue={initial(field)}
                />
              )}
              {field.hint ? (
                <p className="text-xs text-muted-foreground">{field.hint}</p>
              ) : null}
            </div>
          ))}

          <Button type="submit" disabled={busy}>
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Save className="size-4" aria-hidden />
            )}
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
