import { Refine, AuthBindings, Authenticated } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  notificationProvider, ErrorComponent,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings from "@refinedev/react-router-v6";
import {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
// import { AntdInferencer } from '@refinedev/inferencer/antd';
// import { ConfigProvider } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { ColorModeContextProvider } from "./contexts/color-mode";

import Login from "./pages/login"

import BlogPostList from "./blog-posts"
import BlogPostCreate from "./blog-posts/create/index"
import BlogPostShow from "./blog-posts/show/[id]"
import BlogPostEdit from "./blog-posts/edit/[id]"

import CategoryList from "./categories/index"
import CategoryShow from "./categories/show/[id]"

import UserList from "./users/index"
import UserCreate from "./users/create"
import UserShow from "./users/show"
import UserEdit from "./users/edit"

import CourseList from "./courses/index"
import CourseCreate from "./courses/create"
import CourseShow from "./courses/show"
import CourseEdit from "./courses/edit"

// import { InferField } from "@refinedev/inferencer/antd";

import ThemedLayout from "components/themedLayout/index";
import ShopThemedLayout from "pages/shop/index";
import ShopContent from "pages/shop/shop";

// dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
//   if (field.key === "size") {
//     return false;
//   }
//     return field;
//  }

const App: React.FC = () => {

  // const coursesTransformer = (field: InferField) => {
  //   console.log(field.key);
  //   return field;
  // }

  const { isLoading, user, logout, getIdTokenClaims } = useAuth0();
  //isAuthenticated

  if (isLoading) {
    return <span>loading...</span>;
  }

  const authProvider: AuthBindings = {
    login: async () => ({ success: true }),
    logout: async () => {
      logout({ logoutParams: { returnTo: window.location.origin } });
      return {
        success: true,
      };
    },
    onError: async (error) => {
      console.error("onError", error);
      return { error };
    },
    check: async () => {
      try {
        const token = await getIdTokenClaims();
        if (token) {
          axios.defaults.headers.common = {
            Authorization: `Bearer ${token.__raw}`,
          };
          console.log("authenticated")
          return {
            authenticated: true,
            redirectTo: "/courses",
          };
        } else {
          return {
            authenticated: false,
            error: {
              message: "Check failed",
              name: "Token not found",
            },
            redirectTo: "/login",
            logout: true,
          };
        }
      } catch (error: any) {
        return {
          authenticated: false,
          error: new Error(error),
          redirectTo: "/login",
          logout: true,
        };
      }
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      if (user) {
        return {
          ...user,
          avatar: user.picture,
        };
      }
      return null;
    },
  };

  getIdTokenClaims().then((token) => {
    if (token) {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${token.__raw}`,
      };
    }
  });

  const DATA_URI = (process.env.NODE_ENV === 'production') ? process.env.REACT_APP_PRODUCTION_URI : process.env.REACT_APP_DEV_URI;

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <Refine
            routerProvider={routerBindings}
            authProvider={authProvider}
            dataProvider={DATA_URI ? {
              default: dataProvider(DATA_URI),
              dummy: dataProvider("https://api.fake-rest.refine.dev"),
            } : {
              default: dataProvider("https://api.fake-rest.refine.dev"),
              dummy: dataProvider("https://api.fake-rest.refine.dev"),
            }}
            notificationProvider={notificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
            resources={[
              {
                name: 'courses',
                list: '/dashboard/courses',
                show: '/dashboard/courses/show/:id',
                create: '/dashboard/courses/create',
                edit: '/dashboard/courses/edit/:id',
                meta: {
                  canDelete: true,
                  dataProviderName: "default",
                },
              },
              {
                name: 'users',
                list: '/dashboard/users',
                show: '/dashboard/users/show/:id',
                create: '/dashboard/users/create',
                edit: '/dashboard/users/edit/:id',
                meta: {
                  canDelete: true,
                  dataProviderName: "default",
                },
              },
              {
                name: 'blog_posts',
                list: '/dashboard/blog-posts',
                show: '/dashboard/blog-posts/show/:id',
                create: '/dashboard/blog-posts/create',
                edit: '/dashboard/blog-posts/edit/:id',
                meta: {
                  canDelete: true,
                  dataProviderName: "dummy",
                },
              },
              {
                name: 'categories',
                list: '/dashboard/categories',
                show: '/dashboard/categories/show/:id',
                meta: {
                  dataProviderName: "dummy",
                },
              },
            ]}
          >
            <Routes>
              <Route path="/"
                element={
                  <ShopThemedLayout>
                    <Outlet />
                  </ShopThemedLayout>
                }
              >
                <Route path="/" element={<ShopContent />} />
              </Route>
            </Routes>

            <Routes>
              <Route path="/dashboard"
                element={
                  <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayout>
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route index element={<NavigateToResource />} />

                <Route path="/dashboard/courses">
                  <Route index element={<CourseList />} />
                  <Route
                    path="create"
                    element={<CourseCreate />}
                  />
                  <Route
                    path="edit/:id"
                    element={<CourseEdit />}
                  />
                  <Route
                    path="show/:id"
                    element={<CourseShow />}
                  />
                </Route>

                <Route path="/dashboard/users">
                  <Route index element={<UserList />} />
                  <Route
                    path="create"
                    element={<UserCreate />}
                  />
                  <Route
                    path="edit/:id"
                    element={<UserEdit />}
                  />
                  <Route
                    path="show/:id"
                    element={<UserShow />}
                  />
                </Route>

                <Route path="/dashboard/blog-posts">
                  <Route index element={<BlogPostList />} />
                  <Route
                    path="show/:id"
                    element={<BlogPostShow />}
                  />
                  <Route path="create" element={<BlogPostCreate />} />
                  <Route
                    path="edit/:id"
                    element={<BlogPostEdit />}
                  />
                </Route>
                <Route path="/dashboard/categories">
                  <Route index element={<CategoryList />} />
                  <Route
                    path="show/:id"
                    element={<CategoryShow />}
                  />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated fallback={<Outlet />}>
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<Login />} />
              </Route>



              <Route
                element={
                  <Authenticated>
                    <ThemedLayout>
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
          </Refine>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;








