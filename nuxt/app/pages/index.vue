<template>
  <div class="home">
    <div class="container">
      <div class="home-wrapper">
        <HomeSlider />
        <div v-if="rankItems" class="catalog-items">
          <CatalogList v-for="rank in rankItems" :key="rank.id" :rank="rank" />
        </div>
        <section class="home-about">
          <div class="home-about__image">
            <img :src="feature" alt="about" />
          </div>
          <div class="home-about__content">
            <h1>Премьер-Агро</h1>
            <p>
              Компания ООО «Премьер-Агро» - специализируется на оптово-розничной
              продаже и поставке химических средств защиты растений, широкого
              перечня удобрений, микроэлементов, стимуляторов роста, семян
              овощных и пропашных культур, препаратов для дезинфекции (воды,
              оборудования, тары, конструкций), субстратов, клеевых ловушек
              широкого назначения, а также биопрепаратов различного спектра
              действия.
            </p>
            <p>
              Мы начали свой путь в 2017 г. и за этот короткий промежуток
              времени смогли сформировать дружный коллектив профессионалов
              своего дела, имеющих агрономическое образование и практический
              опыт работы в сельскохозяйственной отрасли более 10 лет. Мы
              собрали не все, но очень многое, то, что действительно работает и
              пользуется многолетним, устойчивым спросом среди профессионалов
              занятых в сельском хозяйстве.
            </p>
            <p>
              Мы узнаем и прислушиваемся к опыту своих клиентов, совершенствуем
              свои знания, охотно делимся навыками, можем помочь и предоставить
              консультацию, возможно, оградив от ошибок начинающих.
            </p>
            <button class="home-about__btn">Подробнее</button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import feature from './assets/image/feature.jpg'

const route = useRoute()

const { data: rankItems, pending } = await useRanks()

useSeoMeta({
  title: 'Home',
  description: 'This is my amazing site, let me tell you all about it.',
})
</script>

<style scoped>
.home-wrapper {
  display: grid;
  gap: 40px;
}

@media (width < 880px) {
  .home-about {
    display: grid;
    grid-template-rows: 1fr 1fr;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  .home-about__content {
    grid-row: 1 / 2;
  }
}

@media (width > 880px) {
  .home-about {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
}

.home-catalog__title {
  margin-bottom: 2.5rem;
  display: block;
  font-size: var(--text-4xl);
  font-weight: 600;
  color: var(--orange-color);
  text-align: center;
  text-transform: uppercase;
}

.home-about__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-about__content {
  padding: 3rem;
  display: flex;
  gap: var(--spacing-lg);
  flex-direction: column;
  align-items: flex-start;
  background-color: #ffa000;
}

.home-about__btn {
  border: 2px solid white;
  color: white;
  padding: 1rem 3rem;
  border-radius: 2rem;
  display: block;
  cursor: pointer;
  text-transform: uppercase;
}

/* .home-partners__title {
  margin-bottom: 2.5rem;
  display: block;
  font-size: 2.2rem;
  font-weight: 600;
  color: var(--green-color);
  text-align: center;
  text-transform: uppercase;
} */

.home-partners__items {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  justify-items: center;
}

@media (width < 640px) {
  .home-partners__items {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-3xl);
  }
}

@media (width < 375px) {
  .home-partners__items {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-3xl);
  }
}

.home-about__content h1 {
  font-size: var(--text-4xl);
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.home-about__content p {
  color: white;
}

/* 
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
} */

/* a {
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  text-decoration-color: var(--p-neutral-300);
  transition: color 0.3s ease-out;
  -webkit-text-decoration-thickness: 1px;
  -webkit-text-decoration-color: #c9c9c9;
}

a:hover {
  color: var(--color-orange);
} */

.catalog-items {
  display: grid;
  gap: var(--spacing-xl);
}

@media (width >= 520px) {
  .catalog-items {
    grid-template-columns: 1fr 1fr;
  }
}

@media (width >= 1100px) {
  .catalog-items {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
