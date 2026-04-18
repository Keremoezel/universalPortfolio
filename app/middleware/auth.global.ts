// Global middleware: protect /admin routes and redirect root
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  const isAdminRoute = to.path.startsWith('/admin')
  const isAuthPage   = to.path === '/login' || to.path === '/signup'

  // Redirect unauthenticated users away from admin
  if (isAdminRoute && !user.value) {
    return navigateTo('/login')
  }

  // Redirect authenticated users away from login/signup
  if (isAuthPage && user.value) {
    return navigateTo('/admin')
  }
})
