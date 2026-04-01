<template>
  <footer>
    <div class="container">
      <div class="wrapper">
        <div class="about">
          <section>
            <h6>{{ category.title }}</h6>
            <ul v-for="(item, i) in category.items" :key="i">
              <li>
                <NuxtLink :to="item.link">
                  {{ item.name }}
                </NuxtLink>
              </li>
            </ul>
          </section>
          <section>
            <h6>Контакты</h6>
            <p>
              ООО «Премьер-Агро»<br />
              140080, Московская обл., г. Лыткарино,<br />
              территория промзоны Тураево стр. 39Б<br />
              Тел.: 8 (495) 198-07-97<br />
            </p>
            <p>
              Пн-Пт: 08:00 до 18:00 Сб-Вс: выходной. Выписка счетов, документов,
              оплата, консультация и самовывоз в будние дни.
            </p>
          </section>
          <section>
            <h6>{{ about.title }}</h6>
            <p>{{ about.description }}</p>
          </section>
        </div>
        <div class="metrica">
          <p>metrica</p>
        </div>
        <div class="copyright">
          <p>{{ copyright }}</p>
          <p>Разработка сайта - @maxpryadkin</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const category = ref({
  title: 'Продукция',
  items: [
    { name: 'Пестициды', link: '/' },
    { name: 'Удобрение', link: '/' },
    { name: 'Био препараты', link: '/' },
    { name: 'Вспомогательные препараты', link: '/' },
    { name: 'Для почвы', link: '/' },
    { name: 'Ловушки', link: '/' },
  ],
})

const about = ref({
  title: 'О компании',
  description:
    'Мы специализируемся на оптово-розничной продаже и поставке химических средств защиты растений, широкого перечня удобрений, микроэлементов, стимуляторов роста, семян овощных и пропашных культур, препаратов для дезинфекции, субстратов, клеевых ловушек широкого назначения, а также биопрепаратов различного спектра действия.',
})

const copyright = ref(
  '© 2017-2025 г. ООО "Премьер-Агро" Политика конфиденциальности и обработки данных',
)
</script>

<style scoped>
footer {
  background: var(--linear-gradient);
}

.wrapper {
  display: grid;
  grid-template-rows: 1fr;
  gap: var(--spacing-lg);
  padding: var(--spacing-5xl) 0 var(--spacing-s) 0;
}

.about {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16em, 1fr));
  /* grid-template-columns: 1fr; */
  gap: var(--spacing-2xl);
}

p,
li,
a {
  color: var(--p-neutral-50);
}

a:hover {
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  -webkit-text-decoration-thickness: 1px;
}

h6 {
  font-size: var(--text-2xl);
  color: var(--p-neutral-50);
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: var(--spacing-s);
}

.metrica {
  border: 1px solid white;
  padding: 10px 20px;
}

.copyright {
  display: flex;
  justify-content: space-between;
}

.copyright p {
  font-size: var(--text-sm);
}

ul,
ul li {
  list-style: none;
}
</style>
