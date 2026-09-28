"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, X } from "lucide-react";
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

export type SettingColumn = { key: string; label: string; wide?: boolean };

export type SettingField = {
  name: string;
  label: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
  /** One item per line, joined for display and split on save. */
  list?: boolean;
  placeholder?: string;
  /**
   * Turns the field into a repeatable group of rows - board facts, key dates,
   * a meeting record. Several of these blocks are lists of small objects, and
   * one-line-per-item cannot express them without inventing a separator the
   * editor has to remember.
   */
  columns?: SettingColumn[];
};

/**
 * A repeatable list of small objects.
 *
 * The rows are held in component state and written to a hidden input as JSON,
 * so the server action receives one value per field rather than a spray of
 * indexed names it would have to reassemble.
 */
function RowsField({
  id,
  name,
  columns,
  initial,
}: {
  id: string;
  name: string;
  columns: SettingColumn[];
  initial: Record<string, string>[];
}) {
  const blank = () => Object.fromEntries(columns.map((c) => [c.key, ""]));
  const [rows, setRows] = useState<Record<string, string>[]>(
    initial.length ? initial : [blank()],
  );

  const update = (index: number, key: string, value: string) =>
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    );

  const move = (index: number, by: number) =>
    setRows((current) => {
      const next = [...current];
      const target = index + by;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  return (
    <div className="space-y-2.5">
      {/* What actually gets submitted. */}
      <input type="hidden" name={name} value={JSON.stringify(rows)} readOnly />

      {rows.map((row, index) => (
        <div
          key={index}
          className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_auto] sm:items-start"
        >
          <div className="grid gap-2">
            {columns.map((column) => (
              <div key={column.key} className="space-y-1">
                <Label
                  htmlFor={`${id}-${index}-${column.key}`}
                  className="text-xs font-normal text-muted-foreground"
                >
                  {column.label}
                </Label>
                {column.wide ? (
                  <Textarea
                    id={`${id}-${index}-${column.key}`}
                    rows={3}
                    value={row[column.key] ?? ""}
                    onChange={(e) => update(index, column.key, e.target.value)}
                  />
                ) : (
                  <Input
                    id={`${id}-${index}-${column.key}`}
                    value={row[column.key] ?? ""}
                    onChange={(e) => update(index, column.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-1 sm:flex-col">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Move up"
              disabled={index === 0}
              onClick={() => move(index, -1)}
            >
              <ArrowUp className="size-4" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Move down"
              disabled={index === rows.length - 1}
              onClick={() => move(index, 1)}
            >
              <ArrowDown className="size-4" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove this row"
              onClick={() =>
                setRows((c) => (c.length === 1 ? c : c.filter((_, i) => i !== index)))
              }
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setRows((c) => [...c, blank()])}
      >
        <Plus className="size-4" aria-hidden />
        Add row
      </Button>
    </div>
  );
}

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
              {field.columns ? (
                <RowsField
                  id={`${settingKey}-${field.name}`}
                  name={field.name}
                  columns={field.columns}
                  initial={
                    Array.isArray(values[field.name])
                      ? (values[field.name] as Record<string, string>[])
                      : []
                  }
                />
              ) : field.multiline || field.list ? (
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
