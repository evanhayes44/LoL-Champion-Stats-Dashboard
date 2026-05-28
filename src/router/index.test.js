import { describe, expect, it } from 'vitest'
import router from './index'

describe('router', () => {
  it('registers home and champion detail routes', () => {
    const routes = router.getRoutes()
    const homeRoute = routes.find(route => route.name === 'home')
    const championRoute = routes.find(route => route.name === 'champion')

    expect(homeRoute?.path).toBe('/')
    expect(championRoute?.path).toBe('/champion/:id')
  })
})
