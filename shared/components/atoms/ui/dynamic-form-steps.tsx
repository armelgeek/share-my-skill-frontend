'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/atoms/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/shared/components/atoms/ui/form';
import { Input } from '@/shared/components/atoms/ui/input';
import { Textarea } from '@/shared/components/atoms/ui/textarea';
import { Switch } from '@/shared/components/atoms/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/ui/select';
import { Calendar } from '@/shared/components/atoms/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/ui/popover';
import { CalendarIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { RelationField } from './relation-field';
import type { FieldConfig, AdminConfig } from '@/shared/lib/admin/admin-generator';
import { toast } from 'sonner';

interface DynamicFormProps<T = Record<string, unknown>> {
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

export function DynamicFormSteps<
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
}: Omit<DynamicFormProps<T>, 'onSubmit'>) {
  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema),
    defaultValues: (initialData as Record<string, unknown>) || {},
  });

  const [currentStep, setCurrentStep] = useState(0);

  // Réinitialiser le formulaire quand initialData change
  useEffect(() => {
    console.log('DynamicForm initialData changed:', initialData);
    if (initialData) {
      const validation = schema.parse(initialData);
      form.reset(validation);
    }
  }, [initialData, form, schema]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (initialData && typeof (initialData as { id?: string | number }).id !== 'undefined') {
        if (typeof onUpdate === 'function') {
          await onUpdate({ ...data, id: (initialData as { id?: string | number }).id });
          toast.success(`${config.title || 'Élément'} modifié avec succès`);
          onSuccess?.();
        } else {
          throw new Error('Aucune fonction de mutation update fournie.');
        }
      } else {
        if (typeof onCreate === 'function') {
          await onCreate(data);
          toast.success(`${config.title || 'Élément'} créé avec succès`);
          onSuccess?.();
        } else {
          throw new Error('Aucune fonction de mutation create fournie.');
        }
      }
      form.reset();
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Erreur lors de la soumission du formulaire');
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: FieldConfig) => {
    if (!field.display?.showInForm) {
      return null;
    }

    return (
      <FormField
        key={field.key}
        control={form.control}
        name={field.key as keyof Record<string, unknown>}
        render={({ field: fieldProps }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              {renderFieldInput(field, fieldProps)}
            </FormControl>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const renderFieldInput = (fieldConfig: FieldConfig, fieldProps: {
    onChange: (value: unknown) => void;
    onBlur: () => void;
    value: unknown;
    disabled?: boolean;
  }) => {
    switch (fieldConfig.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <Input
            type={fieldConfig.type === 'email' ? 'email' : fieldConfig.type === 'url' ? 'url' : 'text'}
            placeholder={fieldConfig.placeholder}
            value={(fieldProps.value as string) || ''}
            onChange={(e) => fieldProps.onChange(e.target.value)}
            onBlur={fieldProps.onBlur}
            disabled={fieldProps.disabled}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={fieldConfig.placeholder}
            value={(fieldProps.value as number) || ''}
            onChange={(e) => fieldProps.onChange(parseFloat(e.target.value) || 0)}
            onBlur={fieldProps.onBlur}
            disabled={fieldProps.disabled}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={fieldConfig.placeholder}
            value={(fieldProps.value as string) || ''}
            onChange={(e) => fieldProps.onChange(e.target.value)}
            onBlur={fieldProps.onBlur}
            disabled={fieldProps.disabled}
          />
        );

      case 'boolean':
        return (
          <Switch
            checked={(fieldProps.value as boolean) || false}
            onCheckedChange={fieldProps.onChange}
            disabled={fieldProps.disabled}
          />
        );

      case 'select':
        return (
          <Select
            value={(fieldProps.value as string) || ''}
            onValueChange={fieldProps.onChange}
            disabled={fieldProps.disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={fieldConfig.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {fieldConfig.options?.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                return (
                  <SelectItem key={optionValue} value={optionValue}>
                    {optionLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !fieldProps.value && 'text-muted-foreground'
                )}
                disabled={fieldProps.disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fieldProps.value ? format(new Date(fieldProps.value as string), 'PPP') : fieldConfig.placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fieldProps.value ? new Date(fieldProps.value as string) : undefined}
                onSelect={(date) => fieldProps.onChange(date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'list':
        return (
          <TagInput
            value={(fieldProps.value as string) || ''}
            onChange={fieldProps.onChange}
            placeholder={fieldConfig.placeholder}
          />
        );

      case 'relation':
        return (
          <RelationField
            field={fieldConfig}
            value={fieldProps.value as string | string[] | undefined}
            onChange={fieldProps.onChange}
            className={fieldProps.disabled ? 'opacity-50 cursor-not-allowed' : undefined}
          />
        );

      default:
        return (
          <Input
            placeholder={fieldConfig.placeholder}
            value={(fieldProps.value as string) || ''}
            onChange={(e) => fieldProps.onChange(e.target.value)}
            onBlur={fieldProps.onBlur}
            disabled={fieldProps.disabled}
          />
        );
    }
  };

  const getGridCols = () => {
    const layout = config.ui?.form?.layout as string | undefined;
    const fieldCount = config.fields.filter(f => f.display?.showInForm !== false).length;
    if (fieldCount > 6) return 'grid-cols-1 md:grid-cols-2';
    if (layout === 'sections') return '';
    if (layout === 'simple') return 'grid-cols-1';
    if (layout === 'two-cols') return 'grid-cols-1 md:grid-cols-2';
    if (layout === 'horizontal') return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
    if (fieldCount > 4) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1';
  };

  const getStepGridCols = (stepLayout?: 'simple' | 'two-cols' | 'horizontal' | 'sections') => {
    const classes = 'grid gap-4';
    
    switch (stepLayout) {
      case 'simple':
        return `${classes} grid-cols-1`;
      case 'two-cols':
        return `${classes} grid-cols-1 md:grid-cols-2`;
      case 'horizontal':
        return `${classes} grid-cols-1 md:grid-cols-2 xl:grid-cols-3`;
      case 'sections':
        return `${classes} grid-cols-1`;
      default:
        // Par défaut, adaptable selon le nombre de champs
        return `${classes} grid-cols-1 md:grid-cols-2`;
    }
  };

  const renderFormSections = () => {
    // Mode steps
    if (config.ui?.form?.layout === 'steps' && config.ui.form.steps) {
      const currentStepConfig = config.ui.form.steps[currentStep];
      if (!currentStepConfig) return null;

      return (
        <div className="space-y-6">
          {/* Header de l'étape */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{currentStepConfig.title}</h3>
              <div className="text-sm text-muted-foreground">
                Étape {currentStep + 1} sur {config.ui.form.steps.length}
              </div>
            </div>
            {currentStepConfig.description && (
              <p className="text-sm text-muted-foreground">{currentStepConfig.description}</p>
            )}
            
            {/* Indicateur de progression */}
            <div className="flex space-x-2">
              {config.ui.form.steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 flex-1 rounded",
                    index <= currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Champs de l'étape courante */}
          <div className={getStepGridCols(currentStepConfig.layout)}>
            {currentStepConfig.fields.map((fieldKey) => {
              const field = config.fields.find(f => f.key === fieldKey);
              return field ? renderField(field) : null;
            })}
          </div>
        </div>
      );
    }

    // Mode sections
    if (config.ui?.form?.layout === 'sections' && config.ui.form.sections) {
      return config.ui.form.sections.map((section) => (
        <div key={section.title} className="space-y-4">
          <h3 className="text-lg font-medium mb-2">{section.title}</h3>
          <div className={`grid gap-4 ${getGridCols()}`}>
            {section.fields.map((fieldKey) => {
              const field = config.fields.find(f => f.key === fieldKey);
              return field ? renderField(field) : null;
            })}
          </div>
        </div>
      ));
    }
    
    // Par défaut, grid responsive
    return (
      <div className={`grid gap-4 ${getGridCols()}`}>
        {config.fields
          .filter(field => field.display?.showInForm !== false)
          .sort((a, b) => (a.display?.order || 0) - (b.display?.order || 0))
          .map(renderField)}
      </div>
    );
  };

  // Validation des champs de l'étape actuelle
  const validateCurrentStep = async (): Promise<boolean> => {
    if (!config.ui?.form?.steps || currentStep >= config.ui.form.steps.length) {
      return false;
    }

    const currentStepConfig = config.ui.form.steps[currentStep];
    const fieldsToValidate = currentStepConfig.fields;
    
    // Déclencher la validation seulement pour les champs de l'étape actuelle
    const isValid = await form.trigger(fieldsToValidate as (keyof Record<string, unknown>)[]);
    
    // Vérifier aussi que les champs requis de l'étape ont une valeur
    const formValues = form.getValues();
    const requiredFieldsValid = fieldsToValidate.every(fieldKey => {
      const fieldConfig = config.fields.find(f => f.key === fieldKey);
      if (!fieldConfig?.required) return true;
      
      const value = formValues[fieldKey];
      return value !== undefined && value !== null && value !== '';
    });

    return isValid && requiredFieldsValid;
  };

  // Navigation vers l'étape suivante avec validation
  const handleNextStep = async () => {
    const isStepValid = await validateCurrentStep();
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(config.ui!.form!.steps!.length - 1, prev + 1));
    } else {
      toast.error('Veuillez corriger les erreurs avant de continuer.');
    }
  };

  // Navigation vers l'étape précédente
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const renderStepNavigation = () => {
    if (config.ui?.form?.layout !== 'steps' || !config.ui.form.steps) return null;

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === config.ui.form.steps.length - 1;

    return (
      <div className="flex justify-between pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevStep}
          disabled={isFirstStep}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>

        {!isLastStep ? (
          <Button
            type="button"
            onClick={handleNextStep}
          >
            Suivant
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData && typeof (initialData as { id?: string | number }).id !== 'undefined'
              ? 'Modifier'
              : 'Créer'}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn('flex flex-col h-full max-h-[80vh] space-y-0', className)}
        style={{ minHeight: 320 }}
      >
        <div className="flex-1 overflow-auto px-1 pt-2 pb-4">
          {renderFormSections()}

          {/* Affichage global des erreurs de validation */}
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="text-red-600 text-sm mb-2">
              <b>Erreur(s) de validation :</b>
              <ul className="list-disc ml-5">
                {Object.entries(form.formState.errors).map(([key, err]) => {
                  const message = typeof err === 'object' && err && 'message' in err ? (err as { message?: string }).message : undefined;
                  return (
                    <li key={key}>{key} : {message || 'Champ invalide'}</li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation pour le mode steps ou bouton de soumission classique */}
        {config.ui?.form?.layout === 'steps' ? (
          renderStepNavigation()
        ) : (
          <div className="pt-4 border-t">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData && typeof (initialData as { id?: string | number }).id !== 'undefined'
                ? 'Modifier'
                : 'Créer'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

// Composant TagInput pour les champs de type 'list'
function TagInput({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState('');
  const tags = value ? value.split(',').map(tag => tag.trim()).filter(Boolean) : [];

  const handleAdd = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      const newTags = [...tags, input.trim()];
      onChange(newTags.join(', '));
      setInput('');
    }
  };

  const handleRemove = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags.join(', '));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="ml-1 hover:text-destructive"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder || "Ajouter un élément..."}
          className="flex-1"
        />
        <Button type="button" onClick={handleAdd} size="sm">
          Ajouter
        </Button>
      </div>
    </div>
  );
}
