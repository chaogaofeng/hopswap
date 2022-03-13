import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/home/home.vue";
import Login from "../views/login/login.vue";
import Detaile from "../views/detaile/detaile.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/",
    name: "home",
    meta: {
      requireAuth: true
    },
    component: Home,
  },
  {
    path: "/detaile",
    name: "detaile",
    meta: {
      requireAuth: true
    },
    component: Detaile,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (localStorage.token) {
      if (Object.keys(from.query).length === 0) {
        next();
      } else {
        let redirect = from.query.redirect;
        if (to.path === redirect) {
          next();
        } else {
          next({ path: redirect });
        }
      }
    } else {
      if (to.path === "/login") {
        next();
      } else {
        next({
          path: "/login",
          query: { redirect: to.fullPath },
        });
      }
    }
  } else {
    next();
  }
});

export default router;
