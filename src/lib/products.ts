import { supabase } from '@/lib/supabase'

export type Product = {
  id: string
  title: string
  description: string
  price: number
  image: string
  shortSpecs: string[]
  marketplaceUrl?: string
}

type ProductRow = Record<string, unknown>

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    title: 'Нони сок натуральный 500 мл',
    description:
      'Насыщенный фруктовый напиток с приятным вкусом. Подходит для ежедневного рациона.',
    price: 1290,
    image:
      'https://images.unsplash.com/photo-1600275669283-4bf2bb8a990c?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['Объём: 500 мл', 'Тип: сокосодержащий', 'Хранение: +2…+25°C'],
    marketplaceUrl: 'https://www.wildberries.ru/',
  },
  {
    id: 'demo-2',
    title: 'Экстракт черники для зрения',
    description:
      'Концентрированный комплекс с экстрактом черники для поддержки зрения и общего тонуса.',
    price: 690,
    image:
      'https://images.unsplash.com/photo-1596591606876-bbf91f5f96f9?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['Форма: капсулы', 'Количество: 60 шт', 'Назначение: поддержка зрения'],
    marketplaceUrl: 'https://www.ozon.ru/',
  },
  {
    id: 'demo-3',
    title: 'Taxifolin premium 100 мг',
    description:
      'Пищевая добавка с таксифолином в удобной фасовке. Поддержка антиоксидантного баланса.',
    price: 1590,
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['Дозировка: 100 мг', 'Количество: 30 порций', 'Форма: капсулы'],
  },
  {
    id: 'demo-4',
    title: 'Витаминный комплекс Carotene',
    description:
      'Сбалансированный витаминный комплекс с акцентом на каротиноиды и мягкую поддержку иммунитета.',
    price: 840,
    image:
      'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['Количество: 100 капсул', 'Курс: 1 месяц', 'Для взрослых'],
  },
  {
    id: 'demo-5',
    title: 'Умная бутылка для воды 650 мл',
    description:
      'Лёгкая спортивная бутылка с герметичной крышкой. Подходит для дома, офиса и прогулок.',
    price: 990,
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['Материал: BPA free', 'Объём: 650 мл', 'Вес: 220 г'],
  },
  {
    id: 'demo-6',
    title: 'Беспроводные наушники NeoSound',
    description:
      'Компактные TWS-наушники с насыщенным звуком и удобной посадкой для ежедневного использования.',
    price: 2590,
    image:
      'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['Время работы: до 24 ч', 'Bluetooth 5.3', 'Шумоподавление: пассивное'],
  },
]

function getFirstString(
  row: ProductRow,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return undefined
}

function getPrice(row: ProductRow): number {
  const rawPrice = row.price ?? row.cost ?? row.amount ?? row.final_price

  if (typeof rawPrice === 'number' && Number.isFinite(rawPrice)) {
    return Math.round(rawPrice)
  }

  if (typeof rawPrice === 'string') {
    const normalized = rawPrice.replace(',', '.').replace(/[^\d.]/g, '')
    const parsed = Number.parseFloat(normalized)
    if (Number.isFinite(parsed)) {
      return Math.round(parsed)
    }
  }

  return 0
}

function parseSpecs(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5)
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, val]) => `${key}: ${String(val)}`)
      .slice(0, 5)
  }

  if (typeof value === 'string') {
    return value
      .split(/\n|,|;/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5)
  }

  return []
}

function normalizeUrl(url: string | undefined): string | undefined {
  if (!url) return undefined

  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString()
    }
    return undefined
  } catch {
    return undefined
  }
}

function mapRowToProduct(row: ProductRow, index: number): Product {
  const idRaw = row.id ?? row.product_id ?? row.slug ?? `product-${index + 1}`
  const id = String(idRaw)
  const title = getFirstString(row, ['title', 'name']) ?? `Товар ${index + 1}`
  const description =
    getFirstString(row, ['description', 'details', 'short_description']) ??
    'Описание товара пока не заполнено.'
  const image =
    getFirstString(row, ['image', 'image_url', 'photo', 'photo_url']) ??
    FALLBACK_PRODUCTS[index % FALLBACK_PRODUCTS.length].image

  const specsFromRow = parseSpecs(
    row.short_specs ?? row.specs ?? row.characteristics ?? row.features,
  )
  const specs =
    specsFromRow.length > 0
      ? specsFromRow
      : [
          getFirstString(row, ['brand']) && `Бренд: ${row.brand as string}`,
          getFirstString(row, ['category']) &&
            `Категория: ${row.category as string}`,
        ].filter((item): item is string => Boolean(item))

  const marketplaceUrl = normalizeUrl(
    getFirstString(row, [
      'marketplace_url',
      'marketplaceUrl',
      'product_url',
      'external_url',
      'url',
    ]),
  )

  return {
    id,
    title,
    description,
    price: getPrice(row),
    image,
    shortSpecs: specs,
    marketplaceUrl,
  }
}

export async function getProducts(): Promise<{
  products: Product[]
  notice?: string
}> {
  if (!supabase) {
    return {
      products: FALLBACK_PRODUCTS,
      notice:
        'SUPABASE не настроен, поэтому показываются демонстрационные товары.',
    }
  }

  const { data, error } = await supabase.from('products').select('*')

  if (error) {
    return {
      products: FALLBACK_PRODUCTS,
      notice: `Не удалось загрузить товары из БД: ${error.message}`,
    }
  }

  if (!data || data.length === 0) {
    return {
      products: FALLBACK_PRODUCTS,
      notice:
        'Таблица products пуста, поэтому показываются демонстрационные товары.',
    }
  }

  return {
    products: data.map((row, index) => mapRowToProduct(row, index)),
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const fallbackProduct =
    FALLBACK_PRODUCTS.find((product) => product.id === id) ?? null

  if (!supabase) {
    return fallbackProduct
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) {
    return fallbackProduct
  }

  return mapRowToProduct(data, 0)
}

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(price)} ₽`
}
