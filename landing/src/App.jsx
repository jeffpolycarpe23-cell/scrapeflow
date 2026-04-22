import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

export default function ScrapeFlowLanding() {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState('fr');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'contacts',
    description: '',
    quantity: '100',
    phone: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const translations = {
   
   
    en: {
      nav_home: 'Home',
      nav_order: 'Order',
      hero_title: 'Get your data in 24h',
      hero_subtitle: 'Lists of qualified contacts, products or websites.\nScraped, verified and ready to use.',
      cta_order: '🚀 Order now',
      pricing_contacts: '👤 Contacts & Leads',
      pricing_contacts_desc: 'Emails, phones, LinkedIn, company names',
      pricing_products: '📦 Products',
      pricing_products_desc: 'Prices, stock, descriptions, images',
      pricing_sites: '🌐 Websites',
      pricing_sites_desc: 'URLs, traffic, DA, contacts',
      unit_contacts: '100 contacts',
      unit_products: '500 products',
      unit_sites: '50 websites',
      feature_verified: 'Verified emails',
      feature_phone: 'Phone numbers',
      feature_linkedin: 'LinkedIn profiles',
      feature_companies: 'Company names',
      feature_location: 'Location',
      feature_prices: 'Updated prices',
      feature_stocks: 'Stock levels',
      feature_descriptions: 'Descriptions',
      feature_images: 'Images',
      feature_reviews: 'Customer reviews',
      feature_urls: 'URLs',
      feature_traffic: 'Monthly traffic',
      feature_da: 'Domain Authority',
      feature_contacts: 'Contacts',
      feature_category: 'Category',
      why_choose: 'Why choose us?',
      fast: 'Fast',
      fast_desc: 'Delivery in 24h',
      reliable: 'Reliable',
      reliable_desc: 'Verified data',
      cheap: 'Affordable',
      cheap_desc: 'Best price on the market',
      format: 'Excel/CSV',
      format_desc: 'Format you want',
      ready: 'Ready to start?',
      ready_desc: 'Click the button below to place your first order',
      form_title: 'Place an order',
      form_name: 'Your name *',
      form_email: 'Email *',
      form_phone: 'Phone',
      form_type: 'Data type *',
      form_quantity: 'Quantity *',
      form_description: 'Order details *',
      form_submit: '✉️ Send my order',
      form_loading: '⏳ Sending...',
      form_success: '✅ Order sent!',
      form_info: 'You will receive an email with payment details',
      error_required: 'Fill in all fields',
      error_failed: 'Error sending order. Try again.',
      success_msg: 'Thank you!\n\nCheck your email for payment details.',
      payment_title: 'Bank Transfer Payment',
      payment_step1: 'Submit your order',
      payment_step1_desc: 'Fill in the form with your details',
      payment_step2: 'Receive payment details',
      payment_step2_desc: 'Email with your IBAN and quote',
      payment_step3: 'Make the transfer',
      payment_step3_desc: 'Pay via your bank',
      payment_step4: 'Receive your data',
      payment_step4_desc: 'Delivery in 24h after payment'
    },
  fr: {
      nav_home: 'Accueil',
      nav_order: 'Commander',
      hero_title: 'Obtenez vos données en 24h',
      hero_subtitle: 'Listes de contacts, produits ou sites web qualifiés.\nScrapées, vérifiées et prêtes à utiliser.',
      cta_order: '🚀 Commander maintenant',
      pricing_contacts: '👤 Contacts & Leads',
      pricing_contacts_desc: 'Emails, téléphones, LinkedIn, noms entreprises',
      pricing_products: '📦 Produits',
      pricing_products_desc: 'Prix, stocks, descriptions, images',
      pricing_sites: '🌐 Sites Web',
      pricing_sites_desc: 'URLs, trafic, DA, contacts',
      unit_contacts: '100 contacts',
      unit_products: '500 produits',
      unit_sites: '50 sites',
      feature_verified: 'Emails vérifiés',
      feature_phone: 'Téléphones',
      feature_linkedin: 'LinkedIn',
      feature_companies: 'Noms entreprises',
      feature_location: 'Localisation',
      feature_prices: 'Prix actualisés',
      feature_stocks: 'Stocks',
      feature_descriptions: 'Descriptions',
      feature_images: 'Images',
      feature_reviews: 'Avis clients',
      feature_urls: 'URLs',
      feature_traffic: 'Trafic mensuel',
      feature_da: 'Domain Authority',
      feature_contacts: 'Contacts',
      feature_category: 'Catégorie',
      why_choose: 'Pourquoi nous choisir ?',
      fast: 'Rapide',
      fast_desc: 'Livraison en 24h',
      reliable: 'Fiable',
      reliable_desc: 'Données vérifiées',
      cheap: 'Pas cher',
      cheap_desc: 'Meilleur tarif du marché',
      format: 'Excel/CSV',
      format_desc: 'Format que vous voulez',
      ready: 'Prêt à commencer ?',
      ready_desc: 'Cliquez sur le bouton ci-dessous pour passer votre première commande',
      form_title: 'Passer une commande',
      form_name: 'Votre nom *',
      form_email: 'Email *',
      form_phone: 'Téléphone',
      form_type: 'Type de données *',
      form_quantity: 'Quantité *',
      form_description: 'Détails de la commande *',
      form_submit: '✉️ Envoyer ma commande',
      form_loading: '⏳ Envoi...',
      form_success: '✅ Commande envoyée !',
      form_info: 'Vous recevrez un email avec les détails de paiement',
      error_required: 'Remplissez tous les champs',
      error_failed: 'Erreur lors de l\'envoi. Réessayez.',
      success_msg: 'Merci !\n\nVérifiez votre email pour les détails de paiement.',
      payment_title: 'Paiement par Virement Bancaire',
      payment_step1: 'Soumettez votre commande',
      payment_step1_desc: 'Remplissez le formulaire avec vos détails',
      payment_step2: 'Recevez les détails de paiement',
      payment_step2_desc: 'Un email avec votre IBAN et devis',
      payment_step3: 'Effectuez le virement',
      payment_step3_desc: 'Payez via votre banque',
      payment_step4: 'Recevez vos données',
      payment_step4_desc: 'Livraison en 24h après paiement'
    },
      es: {
      nav_home: 'Inicio',
      nav_order: 'Pedir',
      hero_title: 'Obtén tus datos en 24h',
      hero_subtitle: 'Listas de contactos, productos o sitios web calificados.\nRaspados, verificados y listos para usar.',
      cta_order: '🚀 Pedir ahora',
      pricing_contacts: '👤 Contactos y Leads',
      pricing_contacts_desc: 'Correos, teléfonos, LinkedIn, nombres de empresas',
      pricing_products: '📦 Productos',
      pricing_products_desc: 'Precios, stock, descripciones, imágenes',
      pricing_sites: '🌐 Sitios Web',
      pricing_sites_desc: 'URLs, tráfico, DA, contactos',
      unit_contacts: '100 contactos',
      unit_products: '500 productos',
      unit_sites: '50 sitios',
      feature_verified: 'Correos verificados',
      feature_phone: 'Números de teléfono',
      feature_linkedin: 'Perfiles LinkedIn',
      feature_companies: 'Nombres de empresas',
      feature_location: 'Ubicación',
      feature_prices: 'Precios actualizados',
      feature_stocks: 'Niveles de stock',
      feature_descriptions: 'Descripciones',
      feature_images: 'Imágenes',
      feature_reviews: 'Reseñas de clientes',
      feature_urls: 'URLs',
      feature_traffic: 'Tráfico mensual',
      feature_da: 'Autoridad de dominio',
      feature_contacts: 'Contactos',
      feature_category: 'Categoría',
      why_choose: '¿Por qué elegir nos?',
      fast: 'Rápido',
      fast_desc: 'Entrega en 24h',
      reliable: 'Confiable',
      reliable_desc: 'Datos verificados',
      cheap: 'Asequible',
      cheap_desc: 'Mejor precio del mercado',
      format: 'Excel/CSV',
      format_desc: 'Formato que desee',
      ready: '¿Listo para comenzar?',
      ready_desc: 'Haga clic en el botón a continuación para realizar su primer pedido',
      form_title: 'Realizar un pedido',
      form_name: 'Su nombre *',
      form_email: 'Correo electrónico *',
      form_phone: 'Teléfono',
      form_type: 'Tipo de datos *',
      form_quantity: 'Cantidad *',
      form_description: 'Detalles del pedido *',
      form_submit: '✉️ Enviar mi pedido',
      form_loading: '⏳ Enviando...',
      form_success: '✅ Pedido enviado!',
      form_info: 'Recibirá un correo con los detalles de pago',
      error_required: 'Rellena todos los campos',
      error_failed: 'Error al enviar pedido. Intenta de nuevo.',
      success_msg: '¡Gracias!\n\nRevisa tu correo para detalles de pago.',
      payment_title: 'Pago por Transferencia Bancaria',
      payment_step1: 'Envía tu pedido',
      payment_step1_desc: 'Rellena el formulario con tus datos',
      payment_step2: 'Recibe detalles de pago',
      payment_step2_desc: 'Correo con tu IBAN y presupuesto',
      payment_step3: 'Realiza la transferencia',
      payment_step3_desc: 'Paga a través de tu banco',
      payment_step4: 'Recibe tus datos',
      payment_step4_desc: 'Entrega en 24h después del pago'
    }
  };

  const t = translations[lang];

  const pricing = [
    {
      type: 'contacts',
      title: t.pricing_contacts,
      desc: t.pricing_contacts_desc,
      price: '100',
      unit: t.unit_contacts,
      features: [t.feature_verified, t.feature_phone, t.feature_linkedin, t.feature_companies, t.feature_location]
    },
    {
      type: 'products',
      title: t.pricing_products,
      desc: t.pricing_products_desc,
      price: '150',
      unit: t.unit_products,
      features: [t.feature_prices, t.feature_stocks, t.feature_descriptions, t.feature_images, t.feature_reviews]
    },
    {
      type: 'sites',
      title: t.pricing_sites,
      desc: t.pricing_sites_desc,
      price: '120',
      unit: t.unit_sites,
      features: [t.feature_urls, t.feature_traffic, t.feature_da, t.feature_contacts, t.feature_category]
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.description) {
      setError(t.error_required);
      setLoading(false);
      return;
    }

    try {
      const formBody = new FormData();
      formBody.append('name', formData.name);
      formBody.append('email', formData.email);
      formBody.append('phone', formData.phone);
      formBody.append('type', formData.type);
      formBody.append('quantity', formData.quantity);
      formBody.append('description', formData.description);
      formBody.append('_captcha', 'false');
      formBody.append('_next', window.location.href);

      const response = await fetch('https://formsubmit.co/ajax/scrapeflowservice@gmail.com', {
        method: 'POST',
        body: formBody
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          alert(t.success_msg);
          setFormData({ name: '', email: '', type: 'contacts', description: '', quantity: '100', phone: '' });
          setSubmitted(false);
          setActiveTab('home');
        }, 2000);
      } else {
        setError(t.error_failed);
      }
    } catch (err) {
      setError(t.error_failed);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#0a0f1a', color: '#e2e8f0', fontFamily: 'system-ui', minHeight: '100vh' }}>
      <div style={{ background: '#070c15', borderBottom: '1px solid #1a2035', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>⚡ ScrapeFlow</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setActiveTab('home')} style={{ padding: '8px 16px', background: activeTab === 'home' ? '#7b61ff' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: 6, fontSize: 14 }}>{t.nav_home}</button>
          <button onClick={() => setActiveTab('order')} style={{ padding: '8px 16px', background: activeTab === 'order' ? '#7b61ff' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: 6, fontSize: 14 }}>{t.nav_order}</button>
          <div style={{ display: 'flex', gap: 6, marginLeft: 16, borderLeft: '1px solid #1a2035', paddingLeft: 16 }}>
            {['fr', 'en', 'es'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '6px 12px', background: lang === l ? '#7b61ff' : '#1a2035', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'home' && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h1 style={{ fontSize: 42, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.02em' }}>
              {t.hero_title}
            </h1>
            <p style={{ fontSize: 18, color: '#888', marginBottom: 24, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {t.hero_subtitle}
            </p>
            <button onClick={() => setActiveTab('order')} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #7b61ff, #00b4d8)', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, borderRadius: 8, cursor: 'pointer' }}>
              {t.cta_order}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 60 }}>
            {pricing.map((plan, i) => (
              <div key={i} style={{ background: '#0d1320', border: '1px solid #1a2035', borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{plan.title}</div>
                <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>{plan.desc}</p>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#7b61ff', marginBottom: 4 }}>{plan.price}€</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{plan.unit}</div>
                </div>
                <ul style={{ listStyle: 'none', marginBottom: 20 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13 }}>
                      <Check size={16} color="#00e5ff" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => { setFormData({...formData, type: plan.type}); setActiveTab('order'); }} style={{ width: '100%', padding: '11px', background: '#1a2035', border: '1px solid #1a2035', color: '#00e5ff', fontSize: 14, fontWeight: 700, borderRadius: 8, cursor: 'pointer' }}>
                  Choisir ce plan →
                </button>
              </div>
            ))}
          </div>

          <div style={{ background: '#0d1320', border: '1px solid #1a2035', borderRadius: 14, padding: 32, marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>{t.payment_title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
              {[
                { num: '1', title: t.payment_step1, desc: t.payment_step1_desc },
                { num: '2', title: t.payment_step2, desc: t.payment_step2_desc },
                { num: '3', title: t.payment_step3, desc: t.payment_step3_desc },
                { num: '4', title: t.payment_step4, desc: t.payment_step4_desc }
              ].map((step, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ width: 50, height: 50, background: '#7b61ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, margin: '0 auto 14px' }}>{step.num}</div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#0d1320', border: '1px solid #1a2035', borderRadius: 14, padding: 32, marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>{t.why_choose}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              {[
                { icon: '⚡', title: t.fast, desc: t.fast_desc },
                { icon: '✅', title: t.reliable, desc: t.reliable_desc },
                { icon: '💰', title: t.cheap, desc: t.cheap_desc },
                { icon: '📊', title: t.format, desc: t.format_desc }
              ].map((f, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '40px', background: 'linear-gradient(135deg, rgba(123,97,255,0.1), rgba(0,229,255,0.1))', borderRadius: 14, border: '1px solid #1a2035' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{t.ready}</h3>
            <p style={{ color: '#888', marginBottom: 20 }}>{t.ready_desc}</p>
            <button onClick={() => setActiveTab('order')} style={{ padding: '14px 32px', background: '#7b61ff', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, borderRadius: 8, cursor: 'pointer' }}>
              {t.cta_order}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'order' && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 30 }}>{t.form_title}</h1>

          {error && (
            <div style={{ background: '#7f1d1d', border: '1px solid #fca5a5', color: '#fecaca', padding: 14, borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6, fontWeight: 600 }}>{t.form_name}</label>
              <input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jean Dupont" style={{ width: '100%', padding: '11px 14px', background: '#070c15', border: '1px solid #1a2035', borderRadius: 8, color: '#fff', fontSize: 14 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6, fontWeight: 600 }}>{t.form_email}</label>
              <input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="votre@email.com" style={{ width: '100%', padding: '11px 14px', background: '#070c15', border: '1px solid #1a2035', borderRadius: 8, color: '#fff', fontSize: 14 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6, fontWeight: 600 }}>{t.form_phone}</label>
              <input type="tel" name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+33612345678" style={{ width: '100%', padding: '11px 14px', background: '#070c15', border: '1px solid #1a2035', borderRadius: 8, color: '#fff', fontSize: 14 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6, fontWeight: 600 }}>{t.form_type}</label>
              <select name="type" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '11px 14px', background: '#070c15', border: '1px solid #1a2035', borderRadius: 8, color: '#fff', fontSize: 14 }}>
                <option value="contacts">{t.pricing_contacts} (100€)</option>
                <option value="products">{t.pricing_products} (150€)</option>
                <option value="sites">{t.pricing_sites} (120€)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6, fontWeight: 600 }}>{t.form_quantity}</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} min="10" placeholder="100" style={{ width: '100%', padding: '11px 14px', background: '#070c15', border: '1px solid #1a2035', borderRadius: 8, color: '#fff', fontSize: 14 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6, fontWeight: 600 }}>{t.form_description}</label>
              <textarea name="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Restaurants bio à Paris / Téléphones en France / Blogs de tech..." rows={4} style={{ width: '100%', padding: '11px 14px', background: '#070c15', border: '1px solid #1a2035', borderRadius: 8, color: '#fff', fontSize: 14, fontFamily: 'system-ui', resize: 'vertical' }} />
            </div>

            <button type="submit" disabled={loading || submitted} style={{ padding: '13px 20px', background: loading || submitted ? '#1a2035' : '#7b61ff', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: 'pointer', opacity: loading || submitted ? 0.6 : 1 }}>
              {loading ? t.form_loading : submitted ? t.form_success : t.form_submit}
            </button>

            <p style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>{t.form_info}</p>
          </form>
        </div>
      )}
    </div>
  );
}
