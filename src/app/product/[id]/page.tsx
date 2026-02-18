/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatPrice, getProductById } from '@/lib/products'

type ProductPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id: rawId } = await params
  const id = decodeURIComponent(rawId)
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <main className="market-app market-app--detail">
      <header className="market-topbar market-topbar--detail panel-surface">
        <div className="brand-plate">Свой собственный маркетплейс</div>
        <div>
          <p className="market-topbar__title">Карточка товара</p>
          <p className="market-topbar__subtitle">Описание и характеристики</p>
        </div>
      </header>

      <Link href="/" className="back-button interactive-scale">
        <span aria-hidden>←</span>
        <span>Вернуться на главную</span>
      </Link>

      <article className="product-detail panel-surface">
        <img
          src={product.image}
          alt={product.title}
          className="product-detail__image"
        />

        <div className="product-detail__content">
          <h1>{product.title}</h1>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
        </div>
      </article>

      <section className="detail-block panel-surface">
        <h2>Описание</h2>
        <p>{product.description}</p>
      </section>

      <section className="detail-block panel-surface">
        <h2>Краткие характеристики</h2>
        <ul className="detail-specs">
          {product.shortSpecs.length > 0 ? (
            product.shortSpecs.map((spec) => <li key={spec}>{spec}</li>)
          ) : (
            <li>Характеристики пока не добавлены.</li>
          )}
        </ul>
      </section>

      <section className="detail-block panel-surface">
        <h2>Ссылка на маркетплейс</h2>
        {product.marketplaceUrl ? (
          <a
            className="marketplace-link interactive-scale"
            href={product.marketplaceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Перейти к товару на маркетплейсе
          </a>
        ) : (
          <p className="detail-note">
            Добавьте в таблицу поле <code>marketplace_url</code>, чтобы
            подключить внешнюю ссылку на этот товар.
          </p>
        )}
      </section>
    </main>
  )
}
