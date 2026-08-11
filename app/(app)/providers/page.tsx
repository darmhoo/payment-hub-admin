"use client";

import { DataTable } from "@/components/table/app-table";
import React, { useEffect } from "react";
import { columns } from "./columns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useForm, useStore } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import { Loader } from "@/components/ui/loader";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import * as z from "zod";
import { notify } from "@/lib/toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { providerConfigs } from "@/lib/provider-configs";

/**
 * --------------------------------------------------------------------------
 * Schema
 * --------------------------------------------------------------------------
 */

const providerSchema = z.object({
  name: z.string().min(2, "Name is required"),

  category: z.string().min(1, "Category is required"),

  driver: z.string().min(1, "Driver is required"),

  environment: z.string().min(1, "Environment is required"),

  active: z.boolean(),

  is_default: z.boolean(),

  priority: z.number().min(1, "Priority must be at least 1"),

  settings: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),

      value: z.string().min(1, "Value is required"),

      encrypted: z.boolean(),
    }),
  ),
});

/**
 * --------------------------------------------------------------------------
 * Types
 * --------------------------------------------------------------------------
 */

type ProviderSetting = {
  key: string;
  value: string;
  encrypted: boolean;
};

type ProviderFormValues = {
  name: string;
  category: string;
  driver: string;
  environment: string;
  active: boolean;
  is_default: boolean;
  priority: number;
  settings: ProviderSetting[];
};

/**
 * --------------------------------------------------------------------------
 * Options
 * --------------------------------------------------------------------------
 */

const drivers = [
  { label: "Mpesa", value: "mpesa" },
  { label: "Africa's Talking", value: "africastalking" },
  { label: "Smtp", value: "smtp" },
  { label: "Twilio", value: "twilio" },
];

const categories = [
  { label: "Sms", value: "sms" },
  { label: "Email", value: "email" },
  { label: "Payment", value: "payment" },
];

const environments = [
  { label: "Sandbox", value: "sandbox" },
  { label: "Production", value: "production" },
];

/**
 * --------------------------------------------------------------------------
 * Component
 * --------------------------------------------------------------------------
 */

export default function Providers() {
  const [providers, setProviders] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);

  const { loading, withLoading } = useLoading();

  /**
   * ------------------------------------------------------------------------
   * Providers
   * ------------------------------------------------------------------------
   */

  async function fetchProviders() {
    const response = await fetch("/api/providers", {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch providers");
    }

    return response.json();
  }

  const reloadProviders = async () => {
    const result = await fetchProviders();

    setProviders(result?.providers?.data?.data ?? []);
  };

  useEffect(() => {
    withLoading(fetchProviders)
      .then((data) => {
        setProviders(data?.providers?.data?.data ?? []);
      })
      .catch((error) => {
        console.error("Error fetching providers:", error);
        notify.error("Failed to load providers");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * ------------------------------------------------------------------------
   * Form
   * ------------------------------------------------------------------------
   */

  const form = useForm({
    defaultValues: {
      name: "",
      category: "",
      driver: "",
      environment: "sandbox",
      active: true,
      is_default: false,
      priority: 1,
      settings: [],
    } satisfies ProviderFormValues as ProviderFormValues,

    validators: {
      onSubmit: providerSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await withLoading(async () => {
          const response = await fetch("/api/providers", {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(value),
          });

          if (!response.ok) {
            throw new Error("Failed to create provider");
          }

          await response.json();

          await reloadProviders();

          notify.success("Provider created successfully");

          form.reset();

          setOpen(false);
        });
      } catch (error) {
        console.error("Error creating provider:", error);

        notify.error("Something occurred");
      }
    },
  });

  /**
   * ------------------------------------------------------------------------
   * Selected driver
   * ------------------------------------------------------------------------
   */

  const selectedDriver = useStore(form.store, (state) => state.values.driver);

  /**
   * Get configuration for selected provider.
   *
   * Example:
   *
   * providerConfigs.africastalking
   * providerConfigs.twilio
   * providerConfigs.mpesa
   * providerConfigs.smtp
   */

  const provider = selectedDriver
    ? providerConfigs[selectedDriver as keyof typeof providerConfigs]
    : undefined;

  /**
   * ------------------------------------------------------------------------
   * Dynamic provider settings
   * ------------------------------------------------------------------------
   *
   * When the driver changes, create the settings array based on
   * providerConfigs.
   *
   * Example:
   *
   * Africa's Talking
   *
   * settings:
   * [
   *   {
   *     key: "api_key",
   *     value: "",
   *     encrypted: true
   *   },
   *   {
   *     key: "username",
   *     value: "",
   *     encrypted: false
   *   }
   * ]
   *
   */

  useEffect(() => {
    if (!provider) {
      form.setFieldValue("settings", []);

      return;
    }

    const settings: ProviderSetting[] = provider.fields.map((fieldConfig) => ({
      key: fieldConfig.name,
      value: "",
      encrypted: fieldConfig.encrypted ?? false,
    }));

    form.setFieldValue("settings", settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDriver]);

  /**
   * ------------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-slate-100 px-8">
      <div>
        <h1 className="mb-4 text-2xl font-bold">Providers</h1>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader text="Fetching providers..." />
        </div>
      ) : (
        <div className="min-h-screen bg-slate-100">
          {/* -------------------------------------------------------------- */}
          {/* Add Provider */}
          {/* -------------------------------------------------------------- */}

          <div className="mb-4 flex justify-end">
            <Dialog
              open={open}
              onOpenChange={(nextOpen) => {
                setOpen(nextOpen);

                if (!nextOpen) {
                  form.reset();
                }
              }}
            >
              <DialogTrigger
                render={<Button variant="outline">Add Provider</Button>}
              />

              <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-2xl">
                <form
                  id="create-provider-form"
                  onSubmit={(e) => {
                    e.preventDefault();

                    e.stopPropagation();

                    form.handleSubmit();
                  }}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <DialogHeader>
                    <DialogTitle>Add Provider</DialogTitle>

                    <DialogDescription>
                      Create a new provider. It will be added to the system.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mb-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1 sm:flex-row">
                    <FieldGroup className="sm:w-1/2 sm:shrink-0">
                      {/* -------------------------------------------------- */}
                      {/* Name */}
                      {/* -------------------------------------------------- */}

                      <form.Field
                        name="name"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>Name</FieldLabel>

                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="Provider Name"
                              />

                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />

                      {/* -------------------------------------------------- */}
                      {/* Category */}
                      {/* -------------------------------------------------- */}

                      <form.Field
                        name="category"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel>Category</FieldLabel>

                              <Select
                                value={field.state.value}
                                onValueChange={(value) =>
                                  field.handleChange(value ?? "")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>

                                <SelectContent>
                                  {categories.map((item) => (
                                    <SelectItem
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />

                      {/* -------------------------------------------------- */}
                      {/* Driver */}
                      {/* -------------------------------------------------- */}

                      <form.Field
                        name="driver"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel>Driver</FieldLabel>

                              <Select
                                value={field.state.value}
                                onValueChange={(value) =>
                                  field.handleChange(value ?? "")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select driver" />
                                </SelectTrigger>

                                <SelectContent>
                                  {drivers.map((item) => (
                                    <SelectItem
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />

                      {/* -------------------------------------------------- */}
                      {/* Environment */}
                      {/* -------------------------------------------------- */}

                      <form.Field
                        name="environment"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel>Environment</FieldLabel>

                              <Select
                                value={field.state.value}
                                onValueChange={(value) =>
                                  field.handleChange(value ?? "")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select environment" />
                                </SelectTrigger>

                                <SelectContent>
                                  {environments.map((item) => (
                                    <SelectItem
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />

                      {/* -------------------------------------------------- */}
                      {/* Priority */}
                      {/* -------------------------------------------------- */}

                      <form.Field
                        name="priority"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Priority
                              </FieldLabel>

                              <Input
                                id={field.name}
                                name={field.name}
                                type="number"
                                min={1}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(
                                    e.target.valueAsNumber || 0,
                                  )
                                }
                                aria-invalid={isInvalid}
                                placeholder="1"
                              />

                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />

                      {/* -------------------------------------------------- */}
                      {/* Active */}
                      {/* -------------------------------------------------- */}

                      <form.Field
                        name="active"
                        children={(field) => (
                          <Field
                            orientation="horizontal"
                            className="flex items-center justify-between"
                          >
                            <FieldLabel htmlFor={field.name}>Active</FieldLabel>

                            <Switch
                              id={field.name}
                              checked={field.state.value}
                              onCheckedChange={(checked) =>
                                field.handleChange(checked)
                              }
                            />
                          </Field>
                        )}
                      />

                      {/* -------------------------------------------------- */}
                      {/* Default */}
                      {/* -------------------------------------------------- */}

                      <form.Field
                        name="is_default"
                        children={(field) => (
                          <Field
                            orientation="horizontal"
                            className="flex items-center justify-between"
                          >
                            <FieldLabel htmlFor={field.name}>
                              Set as default
                            </FieldLabel>

                            <Switch
                              id={field.name}
                              checked={field.state.value}
                              onCheckedChange={(checked) =>
                                field.handleChange(checked)
                              }
                            />
                          </Field>
                        )}
                      />

                      {/* -------------------------------------------------- */}
                      {/* Dynamic Provider Fields */}
                      {/* -------------------------------------------------- */}
                    </FieldGroup>

                    {provider && (
                      <div className="flex min-w-0 w-full flex-col gap-4 sm:w-1/2">
                        <h2 className="text-lg font-semibold">Settings</h2>

                        <p className="text-sm text-muted-foreground">
                          Configure the settings for the {provider.driver}{" "}
                          driver.
                        </p>

                        <FieldGroup>
                          {provider.fields.map((fieldConfig, index) => (
                            <form.Field
                              key={fieldConfig.name}
                              name={
                                `settings[${index}].value` as `settings[${number}].value`
                              }
                            >
                              {(field) => {
                                const isInvalid =
                                  field.state.meta.isTouched &&
                                  !field.state.meta.isValid;

                                return (
                                  <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>
                                      {fieldConfig.label}
                                    </FieldLabel>

                                    <Input
                                      id={field.name}
                                      type={fieldConfig.type}
                                      value={field.state.value ?? ""}
                                      onBlur={field.handleBlur}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                      placeholder={fieldConfig.placeholder}
                                      autoComplete="off"
                                    />

                                    {isInvalid && (
                                      <FieldError
                                        errors={field.state.meta.errors}
                                      />
                                    )}
                                  </Field>
                                );
                              }}
                            </form.Field>
                          ))}
                        </FieldGroup>
                      </div>
                    )}
                  </div>

                  {/* ------------------------------------------------------ */}
                  {/* Footer */}
                  {/* ------------------------------------------------------ */}

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                    >
                      Reset
                    </Button>

                    <form.Subscribe
                      selector={(state) => [state.isSubmitting]}
                      children={([isSubmitting]) => (
                        <Button
                          type="submit"
                          form="create-provider-form"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Submit"}
                        </Button>
                      )}
                    />
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Table */}
          {/* -------------------------------------------------------------- */}

          <DataTable columns={columns} data={providers} />
        </div>
      )}
    </div>
  );
}
