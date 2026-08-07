const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'shop-by-category', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove the static categories array
content = content.replace(/const categories = \[\s*\{ id: 'educational'[\s\S]*?\]\n/, '');

// 2. Add Category interface
content = content.replace(/interface Product \{/, `interface Category {\n  id: string\n  title: string\n  handle: string\n}\n\ninterface Product {`);

// 3. Replace ShopByCategoryContent start
const oldComponentStart = `function ShopByCategoryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryId = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const { addToCart } = useCart()`;

const newComponentStart = `function ShopByCategoryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryId = searchParams.get('category')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/collections')
        const data = await res.json()
        if (data.success && data.data?.collections) {
          const fetchedCategories = data.data.collections.map((edge: any) => ({
            id: edge.node.id,
            title: edge.node.title,
            handle: edge.node.handle
          }))
          setCategories(fetchedCategories)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setCategoriesLoading(false)
      }
    }
    fetchCategories()
  }, [])`;

content = content.replace(oldComponentStart, newComponentStart);

// 4. Replace useEffect 1
const oldUseEffect1 = `  useEffect(() => {
    if (categoryId) {
      const found = categories.find(c => c.id === categoryId)
      if (found) {
        setSelectedCategory(found)
      }
    } else {
      router.push(\`/shop-by-category?category=\${categories[0].id}\`)
    }
  }, [categoryId, router])`;

const newUseEffect1 = `  useEffect(() => {
    if (categories.length === 0) return

    if (categoryId) {
      const found = categories.find(c => c.handle === categoryId || c.id === categoryId)
      if (found) {
        setSelectedCategory(found)
      } else {
        setSelectedCategory(categories[0])
        router.replace(\`/shop-by-category?category=\${categories[0].handle}\`)
      }
    } else {
      setSelectedCategory(categories[0])
      router.replace(\`/shop-by-category?category=\${categories[0].handle}\`)
    }
  }, [categoryId, router, categories])`;

content = content.replace(oldUseEffect1, newUseEffect1);

// 5. Replace useEffect 2
const oldUseEffect2 = `  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const searchQuery = \`tag:\${selectedCategory.id}\`
        const response = await fetch(\`/api/products/search?q=\${encodeURIComponent(searchQuery)}&first=20\`)
        const result = await response.json()
        
        if (result.success && result.data?.products?.edges && result.data.products.edges.length > 0) {
          setProducts(result.data.products.edges.map((edge: any) => edge.node))
        } else {
          const fallbackResponse = await fetch(\`/api/products/search?q=\${encodeURIComponent(selectedCategory.name)}&first=20\`)
          const fallbackResult = await fallbackResponse.json()
          
          if (fallbackResult.success && fallbackResult.data?.products?.edges) {
            setProducts(fallbackResult.data.products.edges.map((edge: any) => edge.node))
          } else {
            setProducts([])
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    if (selectedCategory) {
      fetchProducts()
    }
  }, [selectedCategory])`;

const newUseEffect2 = `  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(\`/api/collections/\${selectedCategory.handle}?first=20\`)
        const result = await response.json()
        
        if (result.success && result.data?.products?.edges) {
          setProducts(result.data.products.edges.map((edge: any) => edge.node))
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    if (selectedCategory) {
      fetchProducts()
    }
  }, [selectedCategory])`;

content = content.replace(oldUseEffect2, newUseEffect2);

// 6. Replace handleCategorySelect
const oldHandleCategorySelect = `  const handleCategorySelect = (category: typeof categories[0]) => {
    setSelectedCategory(category)
    setIsMobileDropdownOpen(false)
    router.push(\`/shop-by-category?category=\${category.id}\`)
  }`;

const newHandleCategorySelect = `  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    setIsMobileDropdownOpen(false)
    router.push(\`/shop-by-category?category=\${category.handle}\`)
  }`;

content = content.replace(oldHandleCategorySelect, newHandleCategorySelect);

// 7. Update UI to use categories and title
content = content.replace(/selectedCategory\.name/g, 'selectedCategory?.title');
content = content.replace(/category\.name/g, 'category.title');
content = content.replace(/selectedCategory === null \? 'Select a category' : selectedCategory\.title/g, 'selectedCategory?.title || "Select a category"');
// We have selectedCategory which can be null now initially, so we need to add conditional rendering
content = content.replace(/\{selectedCategory\?.title\}/g, '{selectedCategory?.title || ""}');

// Need to replace the sidebar rendering
const oldSidebar = `<div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-4 sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-gray-800 font-comic">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className={\`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 \${
                    selectedCategory.id === category.id
                      ? 'bg-[#FF6B35] text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }\`}
                >
                  <span className="text-sm font-medium flex-1">{category.title}</span>
                  {selectedCategory.id === category.id && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>`;

const newSidebar = `<div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-4 sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-gray-800 font-comic">Categories</h3>
            {categoriesLoading ? (
               <div className="space-y-2">
                 {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
               </div>
            ) : (
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className={\`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 \${
                      selectedCategory?.id === category.id
                        ? 'bg-[#FF6B35] text-white shadow-md'
                        : 'hover:bg-gray-100 text-gray-700'
                    }\`}
                  >
                    <span className="text-sm font-medium flex-1">{category.title}</span>
                    {selectedCategory?.id === category.id && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>`;
content = content.replace(oldSidebar, newSidebar);

// Mobile Dropdown
const oldMobileDropdown = `<div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-md border border-gray-200"
          >
            <span className="font-semibold text-gray-800">
              {selectedCategory?.title || ""}
            </span>
            <ChevronDown className={\`w-5 h-5 text-gray-500 transition-transform duration-300 \${isMobileDropdownOpen ? 'rotate-180' : ''}\`} />
          </button>

          <AnimatePresence>
            {isMobileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className={\`w-full text-left px-4 py-3 transition flex items-center gap-3 \${
                      selectedCategory.id === category.id
                        ? 'bg-[#FF6B35] text-white'
                        : 'hover:bg-gray-50 text-gray-700'
                    }\`}
                  >
                    <span className="text-sm font-medium flex-1">{category.title}</span>
                    {selectedCategory.id === category.id && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>`;

const newMobileDropdown = `<div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-md border border-gray-200"
          >
            <span className="font-semibold text-gray-800">
              {selectedCategory?.title || "Loading..."}
            </span>
            <ChevronDown className={\`w-5 h-5 text-gray-500 transition-transform duration-300 \${isMobileDropdownOpen ? 'rotate-180' : ''}\`} />
          </button>

          <AnimatePresence>
            {isMobileDropdownOpen && !categoriesLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className={\`w-full text-left px-4 py-3 transition flex items-center gap-3 \${
                      selectedCategory?.id === category.id
                        ? 'bg-[#FF6B35] text-white'
                        : 'hover:bg-gray-50 text-gray-700'
                    }\`}
                  >
                    <span className="text-sm font-medium flex-1">{category.title}</span>
                    {selectedCategory?.id === category.id && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>`;
content = content.replace(oldMobileDropdown, newMobileDropdown);

fs.writeFileSync(filePath, content);
console.log('File updated successfully.');
