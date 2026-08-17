/* eslint-disable react/no-children-prop */
"use client";

import { useEffect, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { notify } from "@/lib/toast";
import { providerConfigs } from "@/lib/provider-configs";

import type { Provider } from "@/components/providers/providers-provider";

const editProviderSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(1, "Category is required"),
  driver: z.string().min(1, "Driver is required"),
  environment: z.string().min(1, "Environment is required"),
  active: z.boolean(),
  is_default: z.boolean(),
  priority: z
    .number()
    .min(1, "Priority must be at least 1"),

  settings: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      encrypted: z.boolean(),
    })
  ),
});

type EditProviderValues =
  z.infer<typeof editProviderSchema>;


interface EditProviderDialogProps {
  provider: Provider | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProviderUpdated: () => Promise<void>;
}

/* -------------------------------------------------------------------------- */
/* Options */
/* -------------------------------------------------------------------------- */

const drivers = [
  {
    label: "Mpesa",
    value: "mpesa",
  },
  {
    label: "Africa's Talking",
    value: "africastalking",
  },
  {
    label: "Smtp",
    value: "smtp",
  },
  {
    label: "Twilio",
    value: "twilio",
  },
];

const categories = [
  {
    label: "Sms",
    value: "sms",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Payment",
    value: "payment",
  },
];

const environments = [
  {
    label: "Sandbox",
    value: "sandbox",
  },
  {
    label: "Production",
    value: "production",
  },
];


export default function EditProviderDialog({
  provider,
  open,
  onOpenChange,
  onProviderUpdated,
}: EditProviderDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Form */
  /* ------------------------------------------------------------------------ */

  const form = useForm<EditProviderValues>({
    defaultValues: {
      name: "",
      category: "",
      driver: "",
      environment: "sandbox",
      active: true,
      is_default: false,
      priority: 1,
      settings: [],
    },

    validators: {
      onSubmit: editProviderSchema,
    },

    onSubmit: async ({ value }) => {
      if (!provider) {
        notify.error("No provider selected");
        return;
      }

      try {
        setSubmitting(true);

        const body = {
          name: value.name,
          category: value.category,
          driver: value.driver,
          environment: value.environment,
          active: value.active,
          is_default: value.is_default,
          priority: value.priority,
          settings: value.settings,
        };

        console.log("Submitting provider:", body);

        const response = await fetch(
          `/api/providers/${provider.ID}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        const data = await response
          .json()
          .catch(() => null);

        console.log("Update provider:", {
          status: response.status,
          body,
          data,
        });

        if (!response.ok) {
          throw new Error(
            data?.error ??
              data?.message ??
              "Failed to update provider"
          );
        }

        await onProviderUpdated();

        notify.success(
          "Provider updated successfully"
        );

        form.reset();

        onOpenChange(false);
      } catch (error) {
        console.error(
          "Error updating provider:",
          error
        );

        notify.error(
          error instanceof Error
            ? error.message
            : "Failed to update provider"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* ------------------------------------------------------------------------ */
  /* Selected driver */
  /* ------------------------------------------------------------------------ */

  const selectedDriver = useStore(
    form.store,
    (state) => state.values.driver
  );

  const providerConfig = selectedDriver
    ? providerConfigs[
        selectedDriver as keyof typeof providerConfigs
      ]
    : undefined;

  /* ------------------------------------------------------------------------ */
  /* Load provider values into the form */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!provider || !open) {
      return;
    }

    const values: EditProviderValues = {
      name: provider.Name ?? "",
      category: provider.Category ?? "",
      driver: provider.Driver ?? "",
      environment:
        provider.Environment ?? "sandbox",
      active: provider.Active ?? true,
      is_default:
        provider.IsDefault ?? false,
      priority:
        Number(provider.Priority) || 1,

      settings:
        provider.Settings?.map((setting) => ({
          key: setting.Key,
          value: setting.Value ?? "",
          encrypted:
            setting.Encrypted ?? false,
        })) ?? [],
    };

    /*
     * This makes the existing provider values become
     * the form's current values.
     *
     * Therefore clicking "Save Changes" without changing
     * anything still submits these values.
     */
    form.reset(values);
  }, [provider, open, form]);

  /* ------------------------------------------------------------------------ */
  /* Handle driver changes */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !open ||
      !provider ||
      !selectedDriver ||
      !providerConfig
    ) {
      return;
    }

    /*
     * If this is the same driver that came from the API,
     * preserve the existing settings.
     */
    if (selectedDriver === provider.Driver) {
      return;
    }

    /*
     * If the user actually changes the driver,
     * create the settings required by the new driver.
     */
    const settings: EditProviderValues["settings"] =
      providerConfig.fields.map(
        (fieldConfig) => ({
          key: fieldConfig.name,
          value: "",
          encrypted:
            fieldConfig.encrypted ?? false,
        })
      );

    form.setFieldValue(
      "settings",
      settings
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDriver, open]);

  /* ------------------------------------------------------------------------ */
  /* Dialog state */
  /* ------------------------------------------------------------------------ */

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset();
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------------ */

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit Provider
          </DialogTitle>

          <DialogDescription>
            Update the provider configuration.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-provider-form"
          onSubmit={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            await form.handleSubmit();
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="mb-4 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-1 sm:flex-row">
            {/* ============================================================ */}
            {/* General information */}
            {/* ============================================================ */}

            <FieldGroup className="sm:w-1/2 sm:shrink-0">
              {/* Name */}

              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                    >
                      <FieldLabel
                        htmlFor={field.name}
                      >
                        Name
                      </FieldLabel>

                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(
                            event.target.value
                          )
                        }
                        placeholder="Provider name"
                        aria-invalid={isInvalid}
                      />

                      {isInvalid && (
                        <FieldError
                          errors={
                            field.state.meta.errors
                          }
                        />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Category */}

              <form.Field
                name="category"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                    >
                      <FieldLabel>
                        Category
                      </FieldLabel>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(
                            value ?? ""
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>

                        <SelectContent>
                          {categories.map(
                            (item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      {isInvalid && (
                        <FieldError
                          errors={
                            field.state.meta.errors
                          }
                        />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Driver */}

              <form.Field
                name="driver"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                    >
                      <FieldLabel>
                        Driver
                      </FieldLabel>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(
                            value ?? ""
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>

                        <SelectContent>
                          {drivers.map(
                            (item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      {isInvalid && (
                        <FieldError
                          errors={
                            field.state.meta.errors
                          }
                        />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Environment */}

              <form.Field
                name="environment"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                    >
                      <FieldLabel>
                        Environment
                      </FieldLabel>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(
                            value ?? ""
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select environment" />
                        </SelectTrigger>

                        <SelectContent>
                          {environments.map(
                            (item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      {isInvalid && (
                        <FieldError
                          errors={
                            field.state.meta.errors
                          }
                        />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Priority */}

              <form.Field
                name="priority"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                    >
                      <FieldLabel
                        htmlFor={field.name}
                      >
                        Priority
                      </FieldLabel>

                      <Input
                        id={field.name}
                        type="number"
                        min={1}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(
                            event.target
                              .valueAsNumber || 0
                          )
                        }
                      />

                      {isInvalid && (
                        <FieldError
                          errors={
                            field.state.meta.errors
                          }
                        />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Active */}

              <form.Field
                name="active"
                children={(field) => (
                  <Field
                    orientation="horizontal"
                    className="flex items-center justify-between"
                  >
                    <FieldLabel>
                      Active
                    </FieldLabel>

                    <Switch
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(
                          checked
                        )
                      }
                    />
                  </Field>
                )}
              />

              {/* Default */}

              <form.Field
                name="is_default"
                children={(field) => (
                  <Field
                    orientation="horizontal"
                    className="flex items-center justify-between"
                  >
                    <FieldLabel>
                      Set as default
                    </FieldLabel>

                    <Switch
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(
                          checked
                        )
                      }
                    />
                  </Field>
                )}
              />
            </FieldGroup>

            {/* ============================================================ */}
            {/* Dynamic settings */}
            {/* ============================================================ */}

            {providerConfig && (
              <div className="flex w-full min-w-0 flex-col gap-4 sm:w-1/2">
                <div>
                  <h2 className="text-lg font-semibold">
                    Settings
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Configure settings for the{" "}
                    {providerConfig.driver} driver.
                  </p>
                </div>

                <FieldGroup>
                  {providerConfig.fields.map(
                    (
                      fieldConfig,
                      index
                    ) => (
                      <form.Field
                        key={fieldConfig.name}
                        name={
                          `settings[${index}].value` as `settings[${number}].value`
                        }
                      >
                        {(field) => {
                          const isInvalid =
                            field.state.meta
                              .isTouched &&
                            !field.state.meta
                              .isValid;

                          return (
                            <Field
                              data-invalid={
                                isInvalid
                              }
                            >
                              <FieldLabel
                                htmlFor={
                                  field.name
                                }
                              >
                                {
                                  fieldConfig.label
                                }
                              </FieldLabel>

                              <Input
                                id={field.name}
                                type={
                                  fieldConfig.type
                                }
                                value={
                                  field.state
                                    .value ?? ""
                                }
                                onBlur={
                                  field.handleBlur
                                }
                                onChange={(
                                  event
                                ) =>
                                  field.handleChange(
                                    event.target
                                      .value
                                  )
                                }
                                placeholder={
                                  fieldConfig.placeholder
                                }
                                autoComplete="off"
                              />

                              {isInvalid && (
                                <FieldError
                                  errors={
                                    field.state
                                      .meta
                                      .errors
                                  }
                                />
                              )}
                            </Field>
                          );
                        }}
                      </form.Field>
                    )
                  )}
                </FieldGroup>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* Footer */}
          {/* ============================================================ */}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="edit-provider-form"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}