import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle,
  FileText,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { Order } from '../types';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    placeOrder,
    currentUser, 
    t, 
    language,
    setActivePage 
  } = useApp();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(currentUser.address || 'Bole Atlas, House #402, Addis Ababa');
  const [paymentProvider, setPaymentProvider] = useState('Chapa / Telebirr');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.licenseType === 'commercial' ? item.artwork.price * 2 : item.artwork.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const hasPhysical = cart.some(item => item.artwork.type !== 'digital');
  const shipping = hasPhysical ? 45 : 0;
  const total = subtotal + shipping;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = placeOrder(paymentProvider, shippingAddress);
    setPlacedOrder(order);
  };

  const handleCloseAll = () => {
    setIsCheckoutModalOpen(false);
    setPlacedOrder(null);
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl border-l border-stone-200 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="font-serif text-xl font-bold text-stone-900">
                {t.cart.title}
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <ShoppingBag className="w-12 h-12 text-stone-300 mb-3" />
                <p className="font-serif text-lg text-stone-800">{t.cart.empty}</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Discover rare Ethiopian canvas masterworks, fine art photographs, and digital assets.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActivePage('art-gallery');
                  }}
                  className="mt-6 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {t.cart.browseGallery}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.licenseType === 'commercial' 
                  ? item.artwork.price * 2 
                  : item.artwork.price;
                const displayTitle = (language === 'am' && item.artwork.titleAm) 
                  ? item.artwork.titleAm 
                  : item.artwork.title;

                return (
                  <div 
                    key={`${item.artwork.id}-${item.licenseType}`}
                    className="flex gap-3 bg-white p-3 rounded-xl border border-stone-200/90 shadow-2xs"
                  >
                    <img 
                      src={item.artwork.imageUrl} 
                      alt={displayTitle}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 object-cover rounded-lg shrink-0 border border-stone-100"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif text-sm font-semibold text-stone-900 line-clamp-1">
                            {displayTitle}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.artwork.id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-xs text-stone-500 block truncate">
                          {item.artwork.artistName}
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          {item.artwork.type === 'digital' 
                            ? (item.licenseType === 'commercial' ? t.cart.commercialLicense : t.cart.personalLicense)
                            : item.artwork.edition || 'Original'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                          <button
                            onClick={() => updateCartQuantity(item.artwork.id, item.quantity - 1)}
                            className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-l-md transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-medium text-stone-800 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.artwork.id, item.quantity + 1)}
                            className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-r-md transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-sm font-bold text-stone-900 tabular-nums">
                          ${(itemPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/80 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-mono text-stone-900 tabular-nums">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.cart.shipping}</span>
                  <span className="font-mono text-stone-900 tabular-nums">
                    {hasPhysical ? `$${shipping}` : t.cart.freeDigital}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>{t.cart.total}</span>
                  <span className="font-mono text-base tabular-nums">${total.toLocaleString()}</span>
                </div>
              </div>

              {/* Demo Notice */}
              <div className="flex items-start gap-2 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-lg text-[11px] text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{t.cart.demoNotice}</span>
              </div>

              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <span>{t.cart.checkoutDemo}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Demo Checkout Modal */}
      {isCheckoutModalOpen && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-xs overflow-y-auto"
          onClick={() => !placedOrder && setIsCheckoutModalOpen(false)}
        >
          <div 
            className="bg-[#FAF8F5] border border-stone-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {placedOrder ? (
              // Order Success Receipt
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  {language === 'am' ? 'ትዕዛዝዎ በተሳካ ሁኔታ ተመዝግቧል!' : 'Demo Order Successfully Placed!'}
                </h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-stone-900">{currentUser.name}</span>. Your order #{placedOrder.id} has been recorded in your user profile history.
                </p>

                <div className="bg-white p-4 rounded-xl border border-stone-200 text-left text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Order Reference:</span>
                    <span className="font-bold text-stone-900">{placedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Status:</span>
                    <span className="text-amber-800 font-bold">{placedOrder.status}</span>
                  </div>
                  {placedOrder.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Tracking Code:</span>
                      <span className="text-stone-800">{placedOrder.trackingNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-stone-100 font-sans text-sm font-bold">
                    <span>Total Demo Amount:</span>
                    <span className="font-mono">${placedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    onClick={() => {
                      handleCloseAll();
                      setActivePage('profile');
                    }}
                    className="flex-1 py-2.5 px-4 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors"
                  >
                    View in Order History
                  </button>
                  <button
                    onClick={handleCloseAll}
                    className="py-2.5 px-4 bg-stone-100 text-stone-800 text-xs font-semibold rounded-xl hover:bg-stone-200 transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : (
              // Checkout Form
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold">
                      {t.cart.demoBadge}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      {language === 'am' ? 'የትዕዛዝ ማጠቃለያ' : 'Complete Art Acquisition'}
                    </h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Recipient Details */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      {language === 'am' ? 'የተቀባይ ስም' : 'Collector Name'}
                    </label>
                    <input
                      type="text"
                      value={currentUser.name}
                      readOnly
                      className="w-full bg-stone-100 border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      {t.profile.address}
                    </label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                      rows={2}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-stone-900"
                      placeholder="Enter delivery street address and city..."
                    />
                  </div>

                  {/* Payment provider simulation */}
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      {language === 'am' ? 'የክፍያ አማራጭ (ሙከራ)' : 'Payment Method (Demo Integration)'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Chapa / Telebirr', 'International Card Demo', 'Bank Wire / Swift', 'PayPal Demo'].map(method => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentProvider(method)}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                            paymentProvider === method
                              ? 'border-stone-900 bg-stone-900 text-white font-medium'
                              : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <span className="block truncate">{method}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="bg-stone-100/80 p-3 rounded-xl border border-stone-200/80 text-xs flex justify-between items-center">
                  <span className="text-stone-600 font-medium">Order Total to Authorize:</span>
                  <span className="font-mono text-base font-bold text-stone-900 tabular-nums">
                    ${total.toLocaleString()} USD
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 leading-tight">
                  By clicking below, you authorize the simulated checkout sequence. In production, this connects to Chapa, Stripe, or Supabase payment webhooks.
                </p>

                <button
                  type="submit"
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>{t.cart.completeOrder} (${total.toLocaleString()})</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
