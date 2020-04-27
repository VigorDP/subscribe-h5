import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Record from "../views/Record.vue";
import RecordSuccess from "../views/RecordSuccess.vue";

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
  },
  {
    path: "/record-success",
    name: "RecordSuccess",
    component: RecordSuccess
  }
];

const router = new VueRouter({
  routes
});

export default router;
