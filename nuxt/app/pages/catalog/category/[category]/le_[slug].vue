<template>
    <div class="category">
        <div class="container">
            <article>
                <Heading
                    breadcrumbs="Каталог"
                    link="/catalog"
                    :title="category?.title"
                    :quantity="products?.length"
                />
                <div class="category-wrapper">
                    <aside>
                        <div class="mobile">
                            <Button
                                @click="open = !open"
                                label="Фильтер"
                                severity="warn"
                                variant="outlined"
                                :icon="
                                    open
                                        ? 'pi pi-angle-down'
                                        : 'pi pi-angle-right'
                                "
                                iconPos="right"
                            />
                            <!-- <div v-if="open">
                <Filter />
                <h3>Фильтер</h3>
              </div> -->
                        </div>

                        <div class="desktop">
                            <Filter />
                            <h3>Фильтер</h3>
                        </div>
                    </aside>
                    <section>
                        <div
                            v-if="category?.description"
                            v-html="category?.description"
                            class="category-content"
                        ></div>
                        <Transition mode="out-in">
                            <Message v-if="pending" severity="success">
                                Загрузка...
                            </Message>
                            <Message v-else-if="error" severity="error">{{
                                error.message
                            }}</Message>
                            <Message
                                v-else-if="
                                    !pending && !error && !products.length
                                "
                                severity="info"
                            >
                                Товары не найдены!
                            </Message>

                            <div
                                v-else-if="!pending && products?.length"
                                class="products-list"
                            >
                                <ProductList
                                    v-for="product in products"
                                    :key="product.id"
                                    :slug="product.slug"
                                    :image="product.image"
                                    :title="product.title"
                                    :description="product.description"
                                    :price="product.price"
                                    :discount="product.discount"
                                />
                            </div>
                        </Transition>
                    </section>
                </div>
            </article>
        </div>
    </div>
</template>

<script setup lang="ts">
// const { slug } = useRoute().params

const route = useRoute()
const open = ref(false)

const filters = computed(() => {
    const query = {}
    if (route.query.manufacturer)
        query.manufacturer = { _eq: route.query.manufacturer }
    if (route.query.culture) query.culture = { _eq: route.query.culture }
    if (route.query.harmful) query.harmful = { _eq: route.query.harmful }

    return query
})

// Directus
const { getItems } = useDirectusItems()

const { pending, error, status } = await useAsyncData(
    `categories-${slug}`,
    async () => {
        const [categoriesData, productsData] = await Promise.all([
            getItems({
                collection: 'categories',
                params: {
                    filter: { slug: { _eq: slug } },
                    fields: ['slug', 'title', 'description'],
                },
            }),

            getItems({
                collection: 'products',
                params: {
                    filter: {
                        categories: { categories_id: { slug: { _eq: slug } } },
                    },
                    fields: [
                        'id',
                        'slug',
                        'title',
                        'image',
                        'description',
                        'price',
                        'discount',
                        'culture.culture_id.title',
                        'culture.culture_id.slug',
                        'harmful.harmful_id.title',
                        'harmful.harmful_id.slug',
                        'manufacturer.manufacturer_id.title',
                        'manufacturer.manufacturer_id.slug',
                    ],
                },
            }),
        ])

        return {
            categoriesData,
            productsData,
        }
    },
)

useSeoMeta({
    title: 'Категория - Премьер-Агро',
})
</script>

<style scoped>
.category-wrapper {
    display: grid;
    gap: var(--spacing-m);
}

.mobile button {
    width: 100%;
}

.category-content {
    margin-bottom: var(--spacing-lg);
}

@media (width <= 768px) {
    .desktop {
        display: none;
    }

    .mobile {
        display: block;
        display: grid;
        gap: var(--spacing-m);
    }
}

@media (width >= 768px) {
    .category-wrapper {
        grid-template-columns: 254px 1fr;
    }

    .desktop {
        display: block;
    }

    .mobile {
        display: none;
    }
}
</style>
