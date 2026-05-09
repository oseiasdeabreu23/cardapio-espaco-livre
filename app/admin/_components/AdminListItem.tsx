'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import type { Profile } from '@/lib/supabase/types';
import {
  updateAdminAction,
  deleteAdminAction,
  setAdminPasswordAction,
  type UsersFormState,
} from '../_actions/users';
import PermissionsCheckboxes from './PermissionsCheckboxes';

const initial: UsersFormState = { error: null, success: null };

type Props = {
  profile: Profile;
  currentUserId: string;
};

export default function AdminListItem({ profile, currentUserId }: Props) {
  const [open, setOpen] = useState(false);
  const isMe = profile.user_id === currentUserId;
  const isOwner = profile.is_owner;
  const canEdit = !isOwner;

  return (
    <li className="py-3">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-bg text-[14px] font-bold text-brand-inkSoft">
          {(profile.display_name ?? profile.email)
            .charAt(0)
            .toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-bold text-brand-ink">
            {profile.display_name && profile.display_name !== profile.email
              ? profile.display_name
              : profile.email}
            {isOwner ? (
              <span className="ml-2 rounded-full bg-brand-red/10 px-2 py-0.5 text-[10.5px] font-bold text-brand-red">
                DONO
              </span>
            ) : !profile.is_active ? (
              <span className="ml-2 rounded-full bg-brand-bg px-2 py-0.5 text-[10.5px] font-bold text-brand-inkSoft">
                Inativo
              </span>
            ) : null}
            {isMe ? (
              <span className="ml-2 rounded-full bg-brand-bg px-2 py-0.5 text-[10.5px] font-bold text-brand-inkSoft">
                Você
              </span>
            ) : null}
          </p>
          {profile.display_name && profile.display_name !== profile.email ? (
            <p className="truncate text-[11.5px] font-medium text-brand-inkSoft">
              {profile.email}
            </p>
          ) : null}
        </div>
        {canEdit ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full bg-brand-bg px-3 py-1 text-[11.5px] font-bold text-brand-ink hover:bg-brand-line"
          >
            {open ? 'Fechar' : 'Editar'}
          </button>
        ) : null}
      </div>

      {open && canEdit ? (
        <div className="mt-3 space-y-4 rounded-2xl border border-brand-line bg-brand-bg p-4">
          <EditPermissionsForm profile={profile} />
          <ChangePasswordForm
            userId={profile.user_id}
            label={isMe ? 'Trocar a sua senha' : 'Trocar senha deste admin'}
          />
          {!isMe ? <DeleteAdminForm profile={profile} /> : null}
        </div>
      ) : null}
    </li>
  );
}

function EditSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-ink px-4 py-2 text-[12.5px] font-bold text-white disabled:opacity-60"
    >
      {pending ? 'Salvando…' : 'Salvar permissões'}
    </button>
  );
}

function EditPermissionsForm({ profile }: { profile: Profile }) {
  const [state, action] = useFormState(updateAdminAction, initial);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="user_id" value={profile.user_id} />

      <label className="block">
        <span className="text-[11.5px] font-bold text-brand-inkSoft">
          Nome
        </span>
        <input
          name="display_name"
          defaultValue={profile.display_name ?? ''}
          className="mt-1 w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-[13.5px] text-brand-ink outline-none focus:border-brand-orange"
        />
      </label>

      <PermissionsCheckboxes defaultSelected={profile.permissions} />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={profile.is_active}
        />
        <span className="text-[12px] font-medium text-brand-ink">
          Conta ativa (pode logar)
        </span>
      </label>

      {state.error ? (
        <p className="text-[12.5px] font-bold text-brand-red">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-[12.5px] font-bold text-brand-green">
          {state.success}
        </p>
      ) : null}

      <EditSubmitButton />
    </form>
  );
}

function PasswordSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-orange px-4 py-2 text-[12.5px] font-bold text-white disabled:opacity-60"
    >
      {pending ? 'Trocando…' : 'Trocar senha'}
    </button>
  );
}

function ChangePasswordForm({
  userId,
  label,
}: {
  userId: string;
  label: string;
}) {
  const [state, action] = useFormState(setAdminPasswordAction, initial);

  return (
    <form action={action} className="space-y-2 border-t border-brand-line pt-4">
      <p className="text-[12.5px] font-bold text-brand-ink">{label}</p>
      <input type="hidden" name="user_id" value={userId} />
      <input
        name="password"
        type="text"
        minLength={8}
        placeholder="Nova senha (mín. 8 caracteres)"
        required
        className="w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-[13.5px] text-brand-ink outline-none focus:border-brand-orange"
      />
      {state.error ? (
        <p className="text-[12.5px] font-bold text-brand-red">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-[12.5px] font-bold text-brand-green">
          {state.success}
        </p>
      ) : null}
      <PasswordSubmitButton />
    </form>
  );
}

function DeleteAdminForm({ profile }: { profile: Profile }) {
  return (
    <form
      action={deleteAdminAction}
      className="border-t border-brand-line pt-4"
      onSubmit={(e) => {
        if (
          !confirm(
            `Apagar o admin "${
              profile.display_name ?? profile.email
            }"? Esta ação não pode ser desfeita.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="user_id" value={profile.user_id} />
      <button
        type="submit"
        className="rounded-full border border-brand-red px-3 py-2 text-[11.5px] font-bold text-brand-red hover:bg-brand-red hover:text-white"
      >
        Apagar este admin
      </button>
    </form>
  );
}
