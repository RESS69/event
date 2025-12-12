import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import FilterSelectCompany from "@/components/ui/filter-select-company";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { Building2, Monitor, Wifi } from "lucide-react";
import { TabEventType } from "@/components/ui/tab-event-type";

// const formSchema = z.object({
//   title: z
//     .string()
//     .min(5, "Bug title must be at least 5 characters.")
//     .max(32, "Bug title must be at most 32 characters."),
//   description: z
//     .string()
//     .min(20, "Description must be at least 20 characters.")
//     .max(100, "Description must be at most 100 characters."),
// });

export default function CreateEvent() {
  const form = useForm({
    defaultValues: {
      title: "",
      company: "",
      type: "offline",
    },
    // validators: {
    //   onSubmit: formSchema,
    // },
    onSubmit: async ({ value }) => {
      toast("You submitted the following values:", {
        description: (
          <pre className="bg-black text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      });
    },
  });

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-8 pb-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="create-event-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <form.Field
                    name="title"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Event Name
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Login button not working on mobile"
                            autoComplete="off"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>
                <form.Field name="company">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Company</FieldLabel>
                        <FilterSelectCompany
                          value={field.state.value}
                          onChange={field.handleChange}
                          isInvalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field
                  name="type"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Event Type</FieldLabel>
                        <TabEventType
                          value={field.state.value}
                          onChange={field.handleChange}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </section>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="create-event-form">
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
