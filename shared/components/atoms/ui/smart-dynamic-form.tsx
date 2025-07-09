'use client';

import React from 'react';
import { z } from 'zod';
import { DynamicForm } from './dynamic-form';
import { DynamicFormSteps } from './dynamic-form-steps';
import type { AdminConfig } from '@/shared/lib/admin/admin-generator';

interface SmartDynamicFormProps<T = Record<string, unknown>> {
  config: AdminConfig & {
    ui?: {
      form?: {
        layout?: 'simple' | 'sections' | 'two-cols' | 'horizontal' | 'tabs' | 'steps';
        sections?: { title: string; fields: string[] }[];
        steps?: { title: string; description?: string; layout?: 'simple' | 'two-cols' | 'horizontal' | 'sections'; fields: string[] }[];
      };
    };
  };
  schema: z.ZodSchema<T>;
  initialData?: T;
  onSuccess?: () => void;
  isSubmitting?: boolean;
  className?: string;
  onCreate?: (data: Record<string, unknown>) => Promise<void>;
  onUpdate?: (data: Record<string, unknown>) => Promise<void>;
}

export function SmartDynamicForm<
  T extends { id?: string | number } = Record<string, unknown>
>({
  config,
  schema,
  initialData,
  onSuccess,
  isSubmitting = false,
  className,
  onCreate,
  onUpdate,
}: SmartDynamicFormProps<T>) {
  // Si le layout est en mode steps, utiliser le composant DynamicFormSteps
  if (config.ui?.form?.layout === 'steps') {
    return (
      <DynamicFormSteps
        config={config}
        schema={schema}
        initialData={initialData}
        onSuccess={onSuccess}
        isSubmitting={isSubmitting}
        className={className}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    );
  }

  // Sinon, utiliser le composant DynamicForm classique
  return (
    <DynamicForm
      config={config}
      schema={schema}
      initialData={initialData}
      onSuccess={onSuccess}
      isSubmitting={isSubmitting}
      className={className}
      onCreate={onCreate}
      onUpdate={onUpdate}
    />
  );
}
