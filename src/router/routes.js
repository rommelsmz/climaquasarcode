const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      {
        path: "/about",
        name: "about",
        component: () => import("pages/About.vue")
      },
      {
        path:"/otro",
        name:"otro",
        component:  () => import("pages/Otro.vue")

      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
