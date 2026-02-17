import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Мой магазин</h1>

      {error && (
        <pre style={{ background: '#fee', padding: 12, borderRadius: 8 }}>
          Ошибка: {error.message}
        </pre>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {products?.map((p: any) => (
          <div
            key={p.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 12,
              padding: 16,
              display: 'grid',
              gap: 8,
              maxWidth: 520,
            }}
          >
            {p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image}
                alt={p.title}
                width={320}
                style={{ borderRadius: 12, border: '1px solid #eee' }}
              />
            )}
            <div style={{ fontWeight: 700, fontSize: 18 }}>{p.title}</div>
            <div style={{ opacity: 0.8 }}>{p.description}</div>
            <div style={{ fontWeight: 700 }}>{p.price} ₽</div>
          </div>
        ))}
      </div>
    </main>
  )
}
