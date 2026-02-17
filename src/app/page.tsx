/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { formatPrice, getProducts } from '@/lib/products'

export default async function Home() {
  const { products, notice } = await getProducts()

  return (
    <main className="market-app">
      <header className="market-topbar">
        <div className="market-topbar__logo">+</div>
        <div>
          <p className="market-topbar__title">Neon Flow Market</p>
          <p className="market-topbar__subtitle">Мини-приложение для Telegram</p>
        </div>
      </header>

      <section className="market-hero">
        <div className="market-hero__icon">+</div>
        <h1 className="market-hero__title">Гарант покупок</h1>
        <p className="market-hero__text">
          Это удобное место, где клиенты быстро находят нужные товары и
          переходят к подробной карточке.
        </p>
        <p className="market-hero__accent">
          Быстрый выбор, безопасный переход и компактная витрина внутри Telegram
        </p>
        <a href="#catalog" className="market-hero__button">
          Открыть каталог
        </a>
      </section>

      {notice && <p className="market-notice">{notice}</p>}

      <section id="catalog" className="catalog-section">
        <div className="catalog-header">
          <h2>Каталог товаров</h2>
          <span>{products.length} позиций</span>
        </div>

        <div className="catalog-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <Link
                href={`/product/${encodeURIComponent(product.id)}`}
                className="product-card__image-link"
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
                className="product-card__button"
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
