const translations: Record<string, Record<string, string>> = {
  es: { dashboard:'Panel',products:'Productos',categories:'Categorías',customers:'Clientes',orders:'Pedidos',logout:'Cerrar Sesión',newProduct:'Nuevo Producto',editProduct:'Editar Producto',search:'Buscar...',price:'Precio',stock:'Stock',status:'Estado',lowStock:'Stock Bajo',darkMode:'Modo oscuro',lightMode:'Modo claro',save:'Guardar',cancel:'Cancelar',delete:'Eliminar',backoffice:'Backoffice' },
  en: { dashboard:'Dashboard',products:'Products',categories:'Categories',customers:'Customers',orders:'Orders',logout:'Logout',newProduct:'New Product',editProduct:'Edit Product',search:'Search...',price:'Price',stock:'Stock',status:'Status',lowStock:'Low Stock',darkMode:'Dark mode',lightMode:'Light mode',save:'Save',cancel:'Cancel',delete:'Delete',backoffice:'Backoffice' },
  pt: { dashboard:'Painel',products:'Produtos',categories:'Categorias',customers:'Clientes',orders:'Pedidos',logout:'Sair',newProduct:'Novo Produto',editProduct:'Editar Produto',search:'Buscar...',price:'Preço',stock:'Estoque',status:'Status',lowStock:'Estoque Baixo',darkMode:'Modo escuro',lightMode:'Modo claro',save:'Salvar',cancel:'Cancelar',delete:'Excluir',backoffice:'Backoffice' },
  fr: { dashboard:'Tableau de Bord',products:'Produits',categories:'Catégories',customers:'Clients',orders:'Commandes',logout:'Déconnexion',newProduct:'Nouveau Produit',editProduct:'Modifier',search:'Rechercher...',price:'Prix',stock:'Stock',status:'Statut',lowStock:'Stock Faible',darkMode:'Mode sombre',lightMode:'Mode clair',save:'Enregistrer',cancel:'Annuler',delete:'Supprimer',backoffice:'Backoffice' },
};
let lang = localStorage.getItem('i18nextLng') || 'es';
const i18n = { language: lang, changeLanguage: (l: string) => { lang = l; localStorage.setItem('i18nextLng', l); window.location.reload(); } };
function t(key: string) { return (translations[lang] || translations.es)[key] || key; }
export function useTranslation() { return { t, i18n } as const; }
export function I18nextProvider({ children }: any) { return children; }
export default i18n;
