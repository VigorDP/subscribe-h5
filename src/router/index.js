import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Record from "../views/Record.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/record",
    name: "Record",
    component: Record
  }
];

const router = new VueRouter({
  routes
});

export default router;
