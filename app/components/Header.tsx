import { Suspense, useState } from 'react'
import { Await, NavLink, useAsyncValue } from 'react-router'
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen'
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated'
import { useAside } from '~/components/Aside'
import { SearchIcon, ShoppingCart, Telescope, User } from 'lucide-react'
import styles from './Header.module.scss'

const MEGA_MENU = {
  title: 'Catalog',
  items: [
    {
      id: 'sub1',
      title: 'Dresses and Gowns',
      url: '/collections/men',
      image:
        'https://cdn.shopify.com/s/files/1/0777/5997/1548/files/8109-Red_Anley_1.webp?v=1755152164',
    },
    {
      id: 'sub2',
      title: 'Everyday',
      url: '/collections/women',
      image:
        'https://cdn.shopify.com/s/files/1/0777/5997/1548/files/pexels-thelazyartist-1488507.jpg?v=1755143047',
    },
    {
      id: 'sub3',
      title: 'Accessories',
      url: '/collections/accessories',
      image:
        'https://cdn.shopify.com/s/files/1/0777/5997/1548/files/Untitled-3-min.png?v=1755348925',
    },
  ],
}
function MegaMenu() {
  const [hovered, setHovered] = useState<string | null>(null)

  const activeItem =
    MEGA_MENU.items.find((i) => i.id === hovered) || MEGA_MENU.items[0]

  return (
    <div className={styles.megaMenu}>
      <div className={styles.megaMenuContent}>
        <ul className={styles.submenu}>
          {MEGA_MENU.items.map((sub) => (
            <li
              key={sub.id}
              onMouseEnter={() => setHovered(sub.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <NavLink to={sub.url}>{sub.title}</NavLink>
            </li>
          ))}
        </ul>
        <div className={styles.preview}>
          {activeItem?.image && (
            <img src={activeItem.image} alt={activeItem.title} width={300} />
          )}
        </div>
      </div>
    </div>
  )
}

interface HeaderProps {
  header: HeaderQuery
  cart: Promise<CartApiQueryFragment | null>
  isLoggedIn: Promise<boolean>
  publicStoreDomain: string
}

type Viewport = 'desktop' | 'mobile'

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const { shop, menu } = header

  const image = shop.brand?.logo?.image
  return (
    <header className={styles.header}>
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        {image ? (
          // <Image data={image} width={80} sizes="" />
          <div className={styles.Logo}>
            <Telescope size={80} strokeWidth={1} />
            <strong>MCB</strong>
          </div>
        ) : (
          <strong>MCB</strong>
        )}
      </NavLink>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  )
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu']
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url']
  viewport: Viewport
  publicStoreDomain: HeaderProps['publicStoreDomain']
}) {
  const className = `header-menu-${viewport}`
  const { close } = useAside()
  console.log(menu)
  return (
    <nav className={styles[className]} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url

        if (item.title.toLowerCase() === 'catalog') {
          return (
            <div
              className={`${styles.headerMenuItem} ${styles.hasMegaMenu}`}
              key={item.id}
            >
              <NavLink
                className={styles.link}
                end
                to={url}
                prefetch="intent"
                style={activeLinkStyle}
              >
                {item.title.toUpperCase()}
              </NavLink>
              <MegaMenu />
            </div>
          )
        }

        return (
          <div className={styles.headerMenuItem}>
            <NavLink
              className={styles.link}
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              {item.title.toUpperCase()}
            </NavLink>
          </div>
        )
      })}
    </nav>
  )
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className={styles.headerCtas} role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : <User size={24} />)}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  )
}

function HeaderMenuMobileToggle() {
  const { open } = useAside()
  return (
    <button
      className={`${styles.menuMobileToggle} reset`}
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  )
}

function SearchToggle() {
  const { open } = useAside()
  return (
    <button className={styles.reset} onClick={() => open('search')}>
      <SearchIcon size={24} />
    </button>
  )
}

function CartBadge({ count }: { count: number | null }) {
  const { open } = useAside()
  const { publish, shop, cart, prevCart } = useAnalytics()

  return (
    <a
      className={styles.cartBadge}
      href="/cart"
      onClick={(e) => {
        e.preventDefault()
        open('cart')
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload)
      }}
    >
      <ShoppingCart size={24} />
      {count === null ? <span>&nbsp;</span> : count}
    </a>
  )
}

function CartToggle({ cart }: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  )
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null
  const cart = useOptimisticCart(originalCart)
  return <CartBadge count={cart?.totalQuantity ?? 0} />
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean
  isPending: boolean
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'white' : 'white',
  }
}
