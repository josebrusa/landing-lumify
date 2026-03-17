import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Register from '../Register.vue'

jest.mock('@phosphor-icons/vue', () => ({
  PhClipboard: { name: 'PhClipboard', template: '<span />' },
  PhChartBar: { name: 'PhChartBar', template: '<span />' },
  PhTarget: { name: 'PhTarget', template: '<span />' },
}))

describe('Register', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders form and heading', () => {
    const wrapper = mount(Register, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[id="register-email"]').exists()).toBe(true)
    expect(wrapper.find('input[id="register-company"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows validation error when submitting with empty email', async () => {
    const wrapper = mount(Register, {
      global: {
        plugins: [createPinia()],
      },
    })
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    const error = wrapper.find('[id="register-email-error"]')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBeTruthy()
  })

  it('shows invalid email error for invalid email format', async () => {
    const wrapper = mount(Register, {
      global: {
        plugins: [createPinia()],
      },
    })
    await wrapper.find('input[id="register-email"]').setValue('not-an-email')
    await wrapper.find('form').trigger('submit.prevent')
    const error = wrapper.find('[id="register-email-error"]')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBeTruthy()
  })

  it('on valid submit hides form and shows success message', async () => {
    const wrapper = mount(Register, {
      global: {
        plugins: [createPinia()],
      },
    })
    await wrapper.find('input[id="register-email"]').setValue('user@example.com')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('form').exists()).toBe(false)
    expect(wrapper.text()).toMatch(/✓|Gracias|Thanks|Gràcies/)
  })
})
