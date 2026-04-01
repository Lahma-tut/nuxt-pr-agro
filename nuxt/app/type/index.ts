// Для категорий
// export interface TProducts {
//   id: number | string
//   slug: string
//   title: string
//   image: string
//   description: string
//   price: string
//   discount: string
// }

// DirectusProduct
export interface TDirectusProduct {
  id: string | number
  slug: string
  title: string
  image: string
  description: string
  content: string
  price: string
  discount: string
  sale: string
  package: string
  package_unit: string
  categories: Array<{ categories_id: TProperty | null }> | null
  ingredient: Array<{ ingredient_id: TProperty | null }> | null
  ranks: Array<{ ranks_id: TProperty | null }> | null
  culture: Array<{ culture_id: TProperty | null }> | null
  harmful: Array<{ harmful_id: TProperty | null }> | null
  manufacturer: Array<{ manufacturer_id: TProperty | null }> | null
}

export interface TProperty {
  title: string
  slug: string
}

// CartProduct
export interface TCartProduct {
  quantity: number
}

// 
export interface TCartProductQuantity {
  id: string | number
  title: string
  description: string
  image: string
  price: string
  pack: string
  pack_unit: string
  quantity: number
}

// Для атрибутов
export interface TAttribute {
  slug: string
  title: string
  description?: string
}

// export interface TAttribute {
//   slug: string
//   title: string
//   description?: string
// }

// Для категорий
export interface TCartProducts {
  id: number | string
  slug: string
  title: string
  image: string
  description: string
  price: string
  discount: string
  culture: TAttributeResponse[]
  harmful: TAttributeResponse[]
  manufacturer: TAttributeResponse[]
}

// Для фильтра
export interface TProducts {
  id: number | string
  slug: string
  title: string
  image: string
  description: string
  price: string
  discount: string
  culture: TAttributeResponse[]
  harmful: TAttributeResponse[]
  manufacturer: TAttributeResponse[]
}

// ЧЕРНОВИКИ
// export interface TProducts {
//   id: number | string
//   slug: string
//   title: string
//   image: string
//   description: string
//   ranks: TAttributeResponse[]
// }

export interface TProductsAttribute {
  id: number | string
  slug: string
  title: string
  image: string
  description: string
  ranks: TAttributeResponse[]
}

export interface TСategory {
  slug: string
  title: string
  description: string
  ranks: []
}

export interface TAttributeResponse {
  slug: string
  title: string
  description: string
}
