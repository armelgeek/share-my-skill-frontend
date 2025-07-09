'use client';

import React, { useEffect } from 'react';
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
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { RelationField } from './relation-field';
import type { FieldConfig, AdminConfig } from '@/shared/lib/admin/admin-generator';
import { toast } from 'sonner';
import { Icons } from '@/shared/components/atoms/ui/icons';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

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

export function DynamicForm<
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
          onSuccess?.(); // Ferme le sheet si le parent le gère
        } else {
          throw new Error('Aucune fonction de mutation update fournie.');
        }
      } else {
        if (typeof onCreate === 'function') {
          await onCreate(data);
          toast.success(`${config.title || 'Élément'} créé avec succès`);
          onSuccess?.(); // Ferme le sheet si le parent le gère
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
    //console.log('Rendering field:', field.key, 'showInForm:', field.display?.showInForm);
    
    if (!field.display?.showInForm) {
     // console.log('Field', field.key, 'hidden from form');
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
          />
        );

      case 'select': {
        // Gestion widget radio/tag
        const widget = fieldConfig.display?.widget;
        if (widget === 'radio') {
          return (
            <div className="flex flex-col gap-2">
              {fieldConfig.options?.map((option) => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                return (
                  <label key={value} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={fieldConfig.key}
                      value={value}
                      checked={fieldProps.value === value}
                      onChange={() => fieldProps.onChange(value)}
                      className="form-radio text-primary focus:ring-primary"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          );
        }
        if (widget === 'tag') {
          return (
            <div className="flex flex-wrap gap-2">
              {fieldConfig.options?.map((option) => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                const selected = fieldProps.value === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => fieldProps.onChange(value)}
                    className={cn(
                      'px-3 py-1 rounded-full border text-sm',
                      selected
                        ? 'bg-primary text-white border-primary'
                        : 'bg-muted text-muted-foreground border-muted'
                    )}
                    aria-pressed={selected}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          );
        }
        // fallback: select natif
        return (
          <Select
            onValueChange={fieldProps.onChange}
            value={(fieldProps.value as string) || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder={fieldConfig.placeholder || `Sélectionner ${fieldConfig.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {fieldConfig.options?.map((option) => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );
      }

      case 'date':
        let dateValue: Date | undefined;
        
        // Conversion sécurisée de la valeur en Date
        if (fieldProps.value instanceof Date) {
          dateValue = fieldProps.value;
        } else if (fieldProps.value && typeof fieldProps.value === 'string') {
          try {
            dateValue = new Date(fieldProps.value);
            // Vérifier si la date est valide
            if (isNaN(dateValue.getTime())) {
              dateValue = undefined;
            }
          } catch {
            dateValue = undefined;
          }
        } else if (fieldProps.value && typeof fieldProps.value === 'number') {
          try {
            dateValue = new Date(fieldProps.value);
            if (isNaN(dateValue.getTime())) {
              dateValue = undefined;
            }
          } catch {
            dateValue = undefined;
          }
        }
        
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dateValue && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? (
                  format(dateValue, 'PPP')
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => fieldProps.onChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'image':
      case 'file': {
        return (
          <FileInputControl
            value={fieldProps.value}
            onChange={fieldProps.onChange}
            accept={fieldConfig.type === 'image' ? 'image/*' : '*'}
          />
        );
      }

      case 'rich-text':
        return (
          <Textarea
            placeholder={fieldConfig.placeholder}
            className="min-h-[120px]"
            value={(fieldProps.value as string) || ''}
            onChange={(e) => fieldProps.onChange(e.target.value)}
            onBlur={fieldProps.onBlur}
            disabled={fieldProps.disabled}
          />
        );

      case 'relation':
        return (
          <RelationField
            field={fieldConfig}
            value={fieldProps.value as string | string[] | undefined}
            onChange={fieldProps.onChange}
          />
        );

      case 'list': {
        // Champ input tag dynamique pour array de string
        return <InputTagArray value={fieldProps.value as string[] || []} onChange={fieldProps.onChange} />;
      }

      case 'time': {
        let timeValue = '';
        if (typeof fieldProps.value === 'number') {
          // Si c'est un timestamp, convertir en HH:mm
          try {
            const date = new Date(fieldProps.value);
            if (!isNaN(date.getTime())) {
              timeValue = date.toTimeString().slice(0,5); // HH:mm
            }
          } catch {}
        } else if (typeof fieldProps.value === 'string') {
          // Si string déjà au format HH:mm
          timeValue = fieldProps.value;
        }
        return (
          <div className="relative w-full group bg-muted/60 rounded-md border border-input focus-within:ring-2 focus-within:ring-primary/70 shadow-sm h-10 flex items-center px-0">
           
            <TimePicker
              value={timeValue}
              onChange={val => fieldProps.onChange(val || '')}
              disableClock
              clearIcon={null}
              format="HH:mm"
              className="w-full pl-10 !border-0 !bg-transparent !px-3 !py-2 !text-sm !focus:outline-none !text-foreground !h-10"
              clockIcon={null}
              amPmAriaLabel={undefined}
            />
          </div>
        );
      }

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

  const renderFormSections = () => {
    if (config.ui?.form?.layout === 'sections' && config.ui.form.sections) {
      return config.ui.form.sections.map((section) => (
        <div key={section.title} className="space-y-4">
          <h3 className="text-lg font-medium mb-2">{section.title}</h3>
          <div className={`grid gap-4 ${getGridCols()}`}> {/* section grid */}
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
        <div className="sticky bottom-0 left-0 w-full bg-white border-t z-10 flex justify-end space-x-2 px-4 py-3">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData && typeof (initialData as { id?: string | number }).id !== 'undefined' ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Ajout d'un composant contrôlé pour le champ file/image
function FileInputControl({ value, onChange, accept }: { value: unknown; onChange: (file: File | undefined) => void; accept?: string }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (fileInputRef.current && !value) {
      fileInputRef.current.value = '';
    }
  }, [value]);
  return (
    <div className="space-y-2">
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onChange(file);
          } else {
            onChange(undefined);
          }
        }}
      />
      {value instanceof File && (
        <p className="text-sm text-muted-foreground">
          Fichier sélectionné: {value.name}
        </p>
      )}
      {typeof value === 'string' && value && (
        <p className="text-sm text-muted-foreground">
          Fichier sélectionné: {value}
        </p>
      )}
    </div>
  );
}

function InputTagArray({ value, onChange }: { value: string[] | string; onChange: (val: string) => void }) {
  const safeValue = Array.isArray(value)
    ? value
    : typeof value === 'string' && value.trim().length > 0
      ? value.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
  const [input, setInput] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !safeValue.includes(trimmed)) {
      const newList = [...safeValue, trimmed];
      onChange(newList.join(','));
      setInput('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };
  const handleRemove = (tag: string) => {
    const newList = safeValue.filter((t) => t !== tag);
    onChange(newList.join(','));
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      {safeValue.map((tag, index) => (
        <span key={tag + '-' + index} className="inline-flex items-center bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium border border-primary/20">
          <span className="mr-1">{tag}</span>
          <button
            type="button"
            aria-label={`Supprimer ${tag}`}
            className="ml-1 text-primary-foreground bg-primary/30 hover:bg-primary/60 rounded-full w-4 h-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => handleRemove(tag)}
            tabIndex={0}
          >
            <Icons.close className="w-2 h-2" aria-hidden />
          </button>
        </span>
      ))}
      <Input
        ref={inputRef}
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
          }
        }}
        placeholder="Ajouter un tag..."
        aria-label="Ajouter un tag"
        className="w-auto min-w-[50px] flex-1 h-7 px-2 py-1 text-xs rounded-md border border-primary/30 focus:border-primary/60"
        style={{ maxWidth: 120 }}
      />
      {safeValue.length === 0 && (
        <div className="text-xs text-muted-foreground mt-1">Aucun tag ajouté</div>
      )}
    </div>
  );
}
