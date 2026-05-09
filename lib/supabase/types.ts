export type Category = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  subtitle: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Item = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number | null;
  sizes: number[] | null;
  img_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type Settings = {
  is_open: boolean;
  closed_message: string;
};

export type CategoryWithItems = Category & { items: Item[] };

export const PERMISSIONS = [
  'manage_users',
  'create_categories',
  'delete_categories',
  'edit_item_text',
  'edit_item_prices',
  'upload_images',
  'toggle_open_status',
  'edit_closed_message',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const PERMISSION_LABELS: Record<Permission, string> = {
  manage_users: 'Cadastrar/editar outros admins',
  create_categories: 'Criar e editar categorias',
  delete_categories: 'Apagar categorias',
  edit_item_text: 'Criar, editar nome/descrição e apagar itens',
  edit_item_prices: 'Editar preços e tamanhos',
  upload_images: 'Subir/trocar fotos',
  toggle_open_status: 'Abrir/fechar restaurante',
  edit_closed_message: 'Editar mensagem de fechado',
};

export type Profile = {
  user_id: string;
  email: string;
  display_name: string | null;
  is_owner: boolean;
  is_active: boolean;
  permissions: Permission[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
};
