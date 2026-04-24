create extension if not exists "pgcrypto";

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  code text unique not null check (code in ('O12', 'K10', 'P7')),
  name text not null,
  address text,
  working_hours text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete restrict,
  name text not null,
  slug text unique not null,
  short_description text,
  composition text,
  calories numeric,
  proteins numeric,
  fats numeric,
  carbs numeric,
  weight text,
  volume text,
  image_url text,
  badge text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_location_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  price numeric not null,
  old_price numeric,
  is_available boolean not null default true,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, location_id)
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists locations_updated_at on locations;
create trigger locations_updated_at before update on locations for each row execute function set_updated_at();

drop trigger if exists categories_updated_at on categories;
create trigger categories_updated_at before update on categories for each row execute function set_updated_at();

drop trigger if exists products_updated_at on products;
create trigger products_updated_at before update on products for each row execute function set_updated_at();

drop trigger if exists product_location_prices_updated_at on product_location_prices;
create trigger product_location_prices_updated_at before update on product_location_prices for each row execute function set_updated_at();

insert into locations (code, name, sort_order)
values ('O12', 'Marsianin O12', 1), ('K10', 'Marsianin K10', 2), ('P7', 'Marsianin P7', 3)
on conflict (code) do nothing;
