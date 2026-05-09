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
