/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { formatPrice, getProducts } from '@/lib/products'

export default async function Home() {
  const { products, notice } = await getProducts()

  return (
    <main className="market-app">
      <header className="market-topbar panel-surface">
        <div className="brand-plate">Mini-Market</div>
        <div>
          <p className="market-topbar__title">Маркетплейс в Telegram</p>
          <p className="market-topbar__subtitle">
            Витрина товаров с быстрым переходом к карточке
          </p>
        </div>
      </header>

      <section className="market-hero panel-surface">
        <div className="hero-brand-plate">Mini-Market</div>
        <h1 className="market-hero__title">Гарант помощи</h1>
        <p className="market-hero__text">
          Это удобное место, где продавцы и покупатели быстро находят нужные
          товары.
        </p>
        <p className="market-hero__accent">
          Каталог в формате мини-приложения с переходом к подробной карточке
        </p>
        <a href="#catalog" className="market-hero__button interactive-scale">
          Открыть каталог
        </a>
      </section>

      {notice && <p className="market-notice panel-surface">{notice}</p>}

      <section id="catalog" className="catalog-section">
        <div className="catalog-header">
          <h2>Каталог товаров</h2>
          <span>{products.length} позиций</span>
        </div>

        <div className="catalog-grid">
          {products.map((product) => (
            <article className="product-card panel-surface" key={product.id}>
              <Link
                href={`/product/${encodeURIComponent(product.id)}`}
                className="product-card__image-link interactive-scale"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-card__image"
                />
              </Link>

              <p className="product-card__price">{formatPrice(product.price)}</p>
              <h3 className="product-card__title">{product.title}</h3>

              <Link
                href={`/product/${encodeURIComponent(product.id)}`}
                className="product-card__button interactive-scale"
              >
                Перейти к товару
              </Link>
            </article>
          ))}
        </div>
      </section>

      <nav className="market-bottom-nav">
        <span className="market-bottom-nav__item market-bottom-nav__item--active">
          Главная
        </span>
        <span className="market-bottom-nav__item">Каталог</span>
        <span className="market-bottom-nav__item">Контакты</span>
      </nav>
    </main>
  )
}
