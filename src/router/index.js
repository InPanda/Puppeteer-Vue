/* Layout */
import Layout from "@/layout";
/* eslint-disable */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home/index"),
        meta: { title: "home", icon: "home" }
      },
      {
        path: "bigScreen",
        name: "bigScreen",
        component: () => import("@/views/big-screen/bigScreen"),
        meta: { title: "bigScreen", icon: "bigScreen" }
      }
    ]
  }
  // {
  //   name: "404",
  //   path: "/404",
  //   component: () => import(/*webpackChunkName: "404"*/ "@/views/404")
  // },
  // 404 page must be placed at the end !!!
];

export default routes;
