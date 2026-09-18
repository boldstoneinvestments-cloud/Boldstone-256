import { createContext, useContext, useState } from 'react'

export const CartContext = createContext(null)
export function useCart() { return useContext(CartContext) }

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  const addToCart = (item) => {
    setCart(prev => {
      // Seedling products (arabica/robusta) merge into one combined entry
      const entryId = item.selections ? 'seedlings' : item.id
      const entryName = item.selections ? 'Coffee Seedlings' : item.productName
      const idx = prev.findIndex(c => c.id === entryId)
      if (idx !== -1) {
        const updated = [...prev]
        if (item.selections) {
          const merged = [...(updated[idx].selections || [])]
          item.selections.forEach(s => {
            const vi = merged.findIndex(m => m.variety === s.variety)
            if (vi !== -1) merged[vi] = { ...merged[vi], qty: merged[vi].qty + s.qty }
            else merged.push(s)
          })
          updated[idx] = { ...updated[idx], selections: merged }
        } else {
          updated[idx] = { ...updated[idx], qty: updated[idx].qty + item.qty }
        }
        return updated
      }
      return [...prev, { ...item, id: entryId, productName: entryName }]
    })
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id))
  const clearCart = () => setCart([])
  const totalItems = cart.reduce((s, c) => {
    if (c.selections) return s + c.selections.reduce((a, b) => a + b.qty, 0)
    return s + (c.qty || 0)
  }, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}
