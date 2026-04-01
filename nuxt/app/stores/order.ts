import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useOrderStore = defineStore("useOrderStore", () => {
    // Данные для ФИО
  const radio = ref("pickup")

  const user = ref({
    name: "",
    email: "",
    phone: "",
    radio: "pickup",
  })

  // Доставки
  const transport = ref({
    company: "",
    terminal: "",
    adress: "",
    passport: "",
    user: "",
  })

  return {
    radio,
    user,
    transport
  }
})
