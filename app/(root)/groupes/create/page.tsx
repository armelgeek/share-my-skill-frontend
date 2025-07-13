"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupeSchema, Groupe } from '@/features/groupe/groupe.schema';
import { useMutation } from '@tanstack/react-query';
import { groupeService } from '@/features/groupe/groupe.mock';
import { Input } from '@/shared/components/atoms/ui/input';
import { Button } from '@/shared/components/atoms/ui/button';
import { useRouter } from 'next/navigation';

export default function GroupeCreatePage() {
  const router = useRouter();
  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: (data: Groupe) => groupeService.createItem(data),
  });

  const { register, handleSubmit, reset, formState } = useForm<Groupe>({
    resolver: zodResolver(groupeSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: Groupe) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        router.push('/groupes');
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Créer un groupe</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          {...register('nom')}
          placeholder="Nom du groupe"
          aria-label="Nom du groupe"
          disabled={isPending}
        />
        {formState.errors.nom && (
          <span className="text-xs text-red-500">{formState.errors.nom.message}</span>
        )}
        <Input
          {...register('description')}
          placeholder="Description du groupe"
          aria-label="Description du groupe"
          disabled={isPending}
        />
        {formState.errors.description && (
          <span className="text-xs text-red-500">{formState.errors.description.message}</span>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Création en cours...' : 'Créer le groupe'}
        </Button>
        {isError && <div className="text-red-500 text-sm">Erreur : {error?.message}</div>}
        {isSuccess && <div className="text-green-600 text-sm">Groupe créé avec succès !</div>}
      </form>
    </div>
  );
}
